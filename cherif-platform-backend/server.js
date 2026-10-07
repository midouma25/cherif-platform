require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.json());
app.use(cors());

// ==========================================
// 1. الاتصال بقاعدة البيانات (MongoDB Atlas ☁️)
// ==========================================
const ATLAS_URI = process.env.MONGO_URI;

mongoose.connect(ATLAS_URI)
.then(() => console.log('✅ تم الاتصال بقاعدة بيانات Cherif Platform (أطلس السحابية ☁️)'))
.catch(err => console.error('❌ خطأ في الاتصال بقاعدة أطلس:', err));

// ==========================================
// 2. نموذج المستخدم (User Model)
// ==========================================
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'instructor', 'admin'], default: 'user' },
    created_at: { type: Date, default: Date.now }
});

userSchema.pre('save', async function() {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);
const JWT_SECRET = process.env.JWT_SECRET;

// ==========================================
// 3. مسارات المصادقة (Auth Routes)
// ==========================================

// أ) فحص هل الإيميل مسجل مسبقاً؟
app.post('/api/auth/check-email', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        res.json({ exists: !!user, name: user ? user.name : null });
    } catch (error) {
        res.status(500).json({ error: 'خطأ في السيرفر' });
    }
});

// ب) تسجيل مستخدم جديد عبر الخزنة (بكلمة المرور التي كتبها)
app.post('/api/auth/vault-signup', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'الرجاء إدخال الاسم، البريد، وكلمة المرور.' });
    }

    try {
        let user = await User.findOne({ email });
        
        if (user) {
            return res.status(400).json({ error: 'هذا البريد مسجل بالفعل، يرجى تسجيل الدخول.' });
        }

        user = new User({ name, email, password, role: 'user' });
        await user.save();

        const token = jwt.sign({ id: user._id, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '7d' });

        res.json({ 
            success: true, 
            token, 
            user: { id: user._id, name: user.name, role: user.role, email: user.email },
            message: 'تم إنشاء الحساب بنجاح!'
        });

    } catch (error) {
        console.error('❌ خطأ في التسجيل:', error);
        res.status(500).json({ error: 'خطأ في السيرفر.' });
    }
});

// ج) تسجيل الدخول الرسمي
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'الرجاء إدخال البريد وكلمة المرور' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'هذا الحساب غير موجود' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'كلمة المرور غير صحيحة' });

        const token = jwt.sign(
            { id: user._id, role: user.role, name: user.name }, 
            JWT_SECRET, 
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            token,
            user: { id: user._id, name: user.name, role: user.role, email: user.email },
            message: 'تم تسجيل الدخول بنجاح'
        });

    } catch (error) {
        console.error('❌ خطأ في تسجيل الدخول:', error);
        res.status(500).json({ error: 'خطأ في السيرفر' });
    }
});

// ==========================================
// 4. حارس الأمان (Middleware) والمسارات الإدارية (Admin APIs)
// ==========================================
const verifyAdmin = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: 'غير مصرح لك بالدخول' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.role !== 'admin') {
            return res.status(403).json({ error: 'هذا المسار مخصص للمدير العام فقط' });
        }
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: 'توكن غير صالح' });
    }
};

app.get('/api/admin/users', verifyAdmin, async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ created_at: -1 });
        res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({ error: 'فشل في جلب المستخدمين' });
    }
});

app.put('/api/admin/users/:id/role', verifyAdmin, async (req, res) => {
    try {
        const { newRole } = req.body;
        const user = await User.findByIdAndUpdate(req.params.id, { role: newRole }, { new: true });
        res.json({ success: true, message: `تم تغيير صلاحية ${user.name} إلى ${newRole}` });
    } catch (error) {
        res.status(500).json({ error: 'فشل في تعديل الصلاحية' });
    }
});

app.get('/api/make-me-admin/:email', async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            { email: req.params.email }, 
            { role: 'admin' }, 
            { new: true }
        );
        if(user) res.json({ success: true, message: 'مبروك! أصبحت المدير العام الآن. قم بتسجيل الدخول من جديد.' });
        else res.json({ error: 'لم يتم العثور على الإيميل' });
    } catch (error) { res.status(500).send('Error'); }
});

// ==========================================
// 5. نموذج الكورسات (Course Schema)
// ==========================================
const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, default: 0 }, // 0 تعني مجاني
    thumbnail: { type: String, default: '' }, // صورة الغلاف
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isPublished: { type: Boolean, default: false }, // هل هو متاح للطلاب أم مسودة؟
    created_at: { type: Date, default: Date.now }
});

const Course = mongoose.model('Course', courseSchema);

// ==========================================
// 🛡️ حارس الأمان الخاص بالأساتذة (يسمح للأستاذ والمدير)
// ==========================================
const verifyInstructor = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: 'غير مصرح لك بالدخول' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        // نسمح بالدخول إذا كان أستاذاً أو مديراً عاماً
        if (decoded.role !== 'instructor' && decoded.role !== 'admin') {
            return res.status(403).json({ error: 'هذا المسار مخصص للأساتذة فقط' });
        }
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: 'توكن غير صالح' });
    }
};

// ==========================================
// 🎙️ مسارات استوديو الأستاذ (Instructor APIs)
// ==========================================

// أ) إنشاء كورس جديد
app.post('/api/courses', verifyInstructor, async (req, res) => {
    try {
        const { title, description, price, thumbnail } = req.body;
        
        const newCourse = new Course({
            title,
            description,
            price,
            thumbnail,
            instructor: req.user.id // نأخذ الـ ID من التوكن تلقائياً
        });

        await newCourse.save();
        res.json({ success: true, course: newCourse, message: 'تم إنشاء الكورس بنجاح!' });
    } catch (error) {
        res.status(500).json({ error: 'فشل في إنشاء الكورس' });
    }
});

// ب) جلب الكورسات الخاصة بهذا الأستاذ فقط
app.get('/api/courses/my-courses', verifyInstructor, async (req, res) => {
    try {
        const courses = await Course.find({ instructor: req.user.id }).sort({ created_at: -1 });
        res.json({ success: true, courses });
    } catch (error) {
        res.status(500).json({ error: 'فشل في جلب الكورسات' });
    }
});

// ج) تعديل كورس موجود
app.put('/api/courses/:id', verifyInstructor, async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ error: 'الكورس غير موجود' });
        
        // الأمان: التأكد أن من يعدل الكورس هو صاحبه (أو المدير)
        if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'غير مصرح لك بتعديل هذا الكورس' });
        }

        const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ success: true, course: updatedCourse, message: 'تم التعديل بنجاح' });
    } catch (error) {
        res.status(500).json({ error: 'فشل في تعديل الكورس' });
    }
});

// د) حذف كورس
app.delete('/api/courses/:id', verifyInstructor, async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ error: 'الكورس غير موجود' });

        if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'غير مصرح لك بحذف هذا الكورس' });
        }

        await Course.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'تم حذف الكورس بنجاح' });
    } catch (error) {
        res.status(500).json({ error: 'فشل في حذف الكورس' });
    }
});


// ==========================================
// 🌍 مسارات الأكاديمية العامة (Public APIs)
// ==========================================

// جلب كل الكورسات (للجمهور والزوار)
app.get('/api/courses/public', async (req, res) => {
    try {
        // نجلب كل الكورسات ونرتبها من الأحدث للأقدم
        const courses = await Course.find().sort({ created_at: -1 });
        res.json({ success: true, courses });
    } catch (error) {
        res.status(500).json({ error: 'فشل في جلب قائمة الكورسات' });
    }
});


// جلب كورس واحد بالتفصيل (للجمهور)
app.get('/api/courses/public/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ error: 'الكورس غير موجود' });
        res.json({ success: true, course });
    } catch (error) {
        res.status(500).json({ error: 'فشل في جلب تفاصيل الكورس' });
    }
});


// ==========================================
// 6. نموذج الدروس (Lesson Schema)
// ==========================================
const lessonSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String }, 
    content: { type: String, default: '' }, // محتوى الـ Markdown
    videoUrl: { type: String, default: '' }, 
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    isFreePreview: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    created_at: { type: Date, default: Date.now }
});

// تعريف النموذج (يجب أن يكون هنا قبل المسارات)
const Lesson = mongoose.model('Lesson', lessonSchema);


// ==========================================
// 📚 مسارات الدروس (Lesson APIs)
// ==========================================

// أ) جلب الدروس (مسار عام)
app.get('/api/courses/:courseId/lessons', async (req, res) => {
    try {
        const lessons = await Lesson.find({ courseId: req.params.courseId }).sort({ order: 1 });
        
        const safeLessons = lessons.map(lesson => ({
            _id: lesson._id,
            title: lesson.title,
            description: lesson.description,
            content: lesson.content,
            isFreePreview: lesson.isFreePreview,
            order: lesson.order,
            videoUrl: lesson.isFreePreview ? lesson.videoUrl : null 
        }));

        res.json({ success: true, lessons: safeLessons });
    } catch (error) {
        console.error('❌ خطأ في جلب الدروس:', error); // سيطبع الخطأ الحقيقي في التيرمينال
        res.status(500).json({ error: 'فشل في جلب الدروس' });
    }
});

// ب) إضافة درس جديد (مسار محمي للأستاذ)
app.post('/api/courses/:courseId/lessons', verifyInstructor, async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId);
        if (!course) return res.status(404).json({ error: 'الكورس غير موجود' });
        
        if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'غير مصرح لك' });
        }

        const newLesson = new Lesson({
            title: req.body.title,
            description: req.body.description,
            content: req.body.content,
            videoUrl: req.body.videoUrl, 
            order: req.body.order,
            isFreePreview: req.body.isFreePreview,
            courseId: req.params.courseId // تم تصحيح حرف P ليكون صغيراً
        });

        await newLesson.save();
        res.json({ success: true, lesson: newLesson, message: 'تمت إضافة الدرس بنجاح' });
    } catch (error) {
        console.error('❌ خطأ في إضافة الدرس:', error);
        res.status(500).json({ error: 'فشل في إضافة الدرس' });
    }
});




// ==========================================
// تشغيل السيرفر
// ==========================================
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`🚀 سيرفر Cherif Platform يعمل بقوة على المنفذ http://localhost:${PORT}`);
});