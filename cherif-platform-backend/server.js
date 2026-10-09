require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');


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
    created_at: { type: Date, default: Date.now },
    exp: { type: Number, default: 0 },
    rank: { type: String, default: 'E-Rank' },
    quiz: [{
        question: String,
        options: [String], // مصفوفة الخيارات (عادة 4 خيارات)
        correctAnswerIndex: Number // رقم الخيار الصحيح (0, 1, 2, أو 3)
    }],
    section: { type: String, default: 'الوحدة 1: الأساسيات' }
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


// تحديث بيانات درس موجود
app.put('/api/lessons/:lessonId', async (req, res) => {
    try {
        const updatedLesson = await Lesson.findByIdAndUpdate(req.params.lessonId, req.body, { new: true });
        res.json({ success: true, lesson: updatedLesson });
    } catch (error) {
        res.status(500).json({ error: 'فشل في تحديث الدرس' });
    }
});


// ==========================================
// 7. نموذج الاشتراكات وتتبع التقدم (Enrollment Schema)
// ==========================================
const enrollmentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
    // 🆕 نظام الشهادات والتوثيق
    certificate: {
        isIssued: { type: Boolean, default: false },
        certificateId: { type: String, sparse: true }, // رقم تسلسلي فريد
        issuedAt: { type: Date }
    }
});


const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

// ==========================================
// 🎮 مسارات نظام التقدم (Gamification APIs)
// ==========================================

// أ) جلب تقدم الطالب الحالي في الكورس
app.get('/api/courses/:courseId/progress', async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.json({ success: true, completedLessons: [] }); // زائر غير مسجل

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const enrollment = await Enrollment.findOne({ userId: decoded.id, courseId: req.params.courseId });
        res.json({ success: true, completedLessons: enrollment ? enrollment.completedLessons : [] });
    } catch (error) {
        res.status(500).json({ error: 'خطأ في جلب التقدم' });
    }
});

// ب) زر "أنهيت الدرس" (حفظ تقدم الطالب)
app.post('/api/courses/:courseId/complete-lesson', async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: 'يجب تسجيل الدخول لحفظ تقدمك!' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.id;
        const { lessonId } = req.body;

        // البحث عن اشتراك الطالب، وإن لم يوجد ننشئ له ملف اشتراك جديد
        let enrollment = await Enrollment.findOne({ userId, courseId: req.params.courseId });
        
        if (!enrollment) {
            enrollment = new Enrollment({ userId, courseId: req.params.courseId, completedLessons: [] });
        }

        // إذا لم يكن الدرس في قائمة المكتملة، أضفه!
        if (!enrollment.completedLessons.includes(lessonId)) {
            enrollment.completedLessons.push(lessonId);
            await enrollment.save();
        }

        res.json({ success: true, completedLessons: enrollment.completedLessons });
    } catch (error) {
        console.error('❌ خطأ في حفظ التقدم:', error);
        res.status(500).json({ error: 'خطأ في السيرفر' });
    }
});

// ==========================================
// 🎓 مسارات مكتبة الطالب (Student Hub)
// ==========================================
app.get('/api/user/my-learning', async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: 'يجب تسجيل الدخول' });

try {
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // 🆕 جلب بيانات اللاعب (الطالب)
        const userStats = await User.findById(decoded.id).select('exp rank name');

        const enrollments = await Enrollment.find({ userId: decoded.id }).populate('courseId');
        const learningData = await Promise.all(enrollments.map(async (enr) => {
            // ... (نفس كود حساب تقدم الكورسات الموجود لديك)
            if (!enr.courseId) return null;
            const totalLessons = await Lesson.countDocuments({ courseId: enr.courseId._id });
            return {
                enrollmentId: enr._id,
                course: enr.courseId,
                progress: totalLessons > 0 ? Math.round((enr.completedLessons.length / totalLessons) * 100) : 0,
                completedCount: enr.completedLessons.length,
                totalLessons
            };
        }));

        // 🆕 إرسال بيانات اللاعب مع بيانات الكورسات
        res.json({ success: true, learning: learningData.filter(item => item !== null), userStats });
    } catch (error) {
        res.status(500).json({ error: 'خطأ في السيرفر' });
    }
});



// جلب حالة اشتراك الطالب في كورس معين (هل يمتلك الكورس؟)
app.get('/api/courses/:courseId/check-enrollment', async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.json({ isEnrolled: false });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const enrollment = await Enrollment.findOne({ userId: decoded.id, courseId: req.params.courseId });
        res.json({ isEnrolled: !!enrollment });
    } catch (error) {
        res.json({ isEnrolled: false });
    }
});

// تسجيل الطالب في الكورس (شراء / اشتراك مجاني)
app.post('/api/courses/:courseId/enroll', async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: 'يجب تسجيل الدخول أولاً' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.id;

        // التأكد مما إذا كان مسجلاً بالفعل
        const existingEnrollment = await Enrollment.findOne({ userId, courseId: req.params.courseId });
        if (existingEnrollment) {
            return res.json({ success: true, message: 'أنت مسجل بالفعل في هذا الكورس' });
        }

        // إنشاء اشتراك جديد
        const newEnrollment = new Enrollment({
            userId,
            courseId: req.params.courseId,
            completedLessons: []
        });

        await newEnrollment.save();
        res.json({ success: true, message: 'تم الاشتراك بنجاح!' });
    } catch (error) {
        console.error('❌ خطأ في الاشتراك:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء الاشتراك' });
    }
});

// ب) زر "أنهيت الدرس" (حفظ تقدم الطالب وزيادة الـ EXP)
app.post('/api/courses/:courseId/complete-lesson', async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: 'يجب تسجيل الدخول' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.id;
        const { lessonId } = req.body;

        let enrollment = await Enrollment.findOne({ userId, courseId: req.params.courseId });
        if (!enrollment) {
            enrollment = new Enrollment({ userId, courseId: req.params.courseId, completedLessons: [] });
        }

        let expGained = false; // للتأكد أن الطالب لن يأخذ نقاط على درس أنهاه سابقاً
        let newRank = '';

        if (!enrollment.completedLessons.includes(lessonId)) {
            enrollment.completedLessons.push(lessonId);
            await enrollment.save();
            expGained = true;

// 🆕 إضافة 50 EXP للمستخدم وتحديث رتبته (Solo Leveling / Monarch Logic)
            const user = await User.findById(userId);
            if (user) {
                user.exp += 50;
                
                // التدرج الجديد المرعب
                if (user.exp >= 50000) user.rank = 'Monarch';
                else if (user.exp >= 15000) user.rank = 'National Level';
                else if (user.exp >= 5000) user.rank = 'S-Rank';
                else if (user.exp >= 2000) user.rank = 'A-Rank';
                else if (user.exp >= 1000) user.rank = 'B-Rank';
                else if (user.exp >= 500) user.rank = 'C-Rank';
                else if (user.exp >= 200) user.rank = 'D-Rank';
                else user.rank = 'E-Rank';
                
                newRank = user.rank;
                await user.save();
            }
        }

        res.json({ success: true, completedLessons: enrollment.completedLessons, expGained, newRank });
    } catch (error) {
        res.status(500).json({ error: 'خطأ في السيرفر' });
    }
});



// ==========================================
// 📊 مسارات لوحة تحكم الأستاذ (Instructor Dashboard)
// ==========================================
app.get('/api/instructor/stats', verifyInstructor, async (req, res) => {
    try {
        const instructorId = req.user.id;

        // 1. جلب كل الكورسات الخاصة بك
        const myCourses = await Course.find({ instructor: instructorId });
        const courseIds = myCourses.map(c => c._id);

        // 2. جلب كل الاشتراكات المرتبطة بكورساتك
        const enrollments = await Enrollment.find({ courseId: { $in: courseIds } });

        // 3. تحليل البيانات
        const totalCourses = myCourses.length;
        const totalStudents = enrollments.length; // عدد الاشتراكات الإجمالي
        
        // 4. حساب الأرباح (عدد المشتركين × سعر الكورس)
        let totalRevenue = 0;
        myCourses.forEach(course => {
            const courseEnrollmentsCount = enrollments.filter(e => e.courseId.toString() === course._id.toString()).length;
            totalRevenue += courseEnrollmentsCount * course.price;
        });

        res.json({ success: true, stats: { totalCourses, totalStudents, totalRevenue } });
    } catch (error) {
        console.error('❌ خطأ في جلب الإحصائيات:', error);
        res.status(500).json({ error: 'فشل في جلب الإحصائيات' });
    }
});


// ==========================================
// 🏆 مسارات نقابة الصيادين (Leaderboard / Rankings)
// ==========================================
app.get('/api/leaderboard', async (req, res) => {
    try {
        // جلب أفضل 50 لاعباً مرتبين تنازلياً حسب نقاط الخبرة
        const topPlayers = await User.find({})
            .sort({ exp: -1 })
            .limit(50)
            .select('name exp rank'); // نجلب البيانات الآمنة فقط

        res.json({ success: true, leaderboard: topPlayers });
    } catch (error) {
        console.error('❌ خطأ في جلب لوحة الصدارة:', error);
        res.status(500).json({ error: 'فشل في تحميل بيانات النقابة' });
    }
});


// ==========================================
// 📜 مسارات وثائق الإثبات (Certificates)
// ==========================================

// 1. إصدار الشهادة للطالب (فقط إذا أكمل 100%)
app.post('/api/courses/:courseId/issue-certificate', async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: 'غير مصرح' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const enrollment = await Enrollment.findOne({ userId: decoded.id, courseId: req.params.courseId });
        
        if (!enrollment) return res.status(404).json({ error: 'لم يتم العثور على الاشتراك' });

        const totalLessons = await Lesson.countDocuments({ courseId: req.params.courseId });
        const progress = totalLessons > 0 ? (enrollment.completedLessons.length / totalLessons) * 100 : 0;

        if (progress < 100) {
            return res.status(400).json({ error: 'يجب إنهاء الكورس بالكامل لاستلام الشهادة' });
        }

        // إذا لم تكن مصدرة من قبل، قم بتوليدها
        if (!enrollment.certificate.isIssued) {
            // توليد رقم تسلسلي فخم مثل: CERT-A1B2C3D4
            const uniqueId = 'CERT-' + crypto.randomBytes(4).toString('hex').toUpperCase();
            
            enrollment.certificate = {
                isIssued: true,
                certificateId: uniqueId,
                issuedAt: new Date()
            };
            await enrollment.save();
        }

        res.json({ success: true, certificateId: enrollment.certificate.certificateId });
    } catch (error) {
        console.error('❌ خطأ في إصدار الشهادة:', error);
        res.status(500).json({ error: 'خطأ في السيرفر' });
    }
});

// 2. التحقق من الشهادة (مسار عام للشركات وأصحاب العمل)
app.get('/api/certificates/verify/:certId', async (req, res) => {
    try {
        const enrollment = await Enrollment.findOne({ 'certificate.certificateId': req.params.certId })
            .populate('userId', 'name')
            .populate('courseId', 'title thumbnail');

        if (!enrollment || !enrollment.certificate.isIssued) {
            return res.json({ isValid: false });
        }

        res.json({
            isValid: true,
            studentName: enrollment.userId.name,
            courseTitle: enrollment.courseId.title,
            issueDate: enrollment.certificate.issuedAt,
            certificateId: enrollment.certificate.certificateId
        });
    } catch (error) {
        res.status(500).json({ error: 'خطأ في التحقق' });
    }
});

// ==========================================
// 🛡️ مسارات ترقية اللاعبين (Role Upgrades)
// ==========================================
app.post('/api/user/become-instructor', async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: 'يجب تسجيل الدخول' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) return res.status(404).json({ error: 'المستخدم غير موجود' });

        // ترقية اللاعب إلى صانع محتوى (أستاذ)
        user.role = 'instructor';
        await user.save();

        res.json({ success: true, message: 'تمت ترقيتك إلى رتبة صانع محتوى بنجاح!', newRole: user.role });
    } catch (error) {
        console.error('❌ خطأ في الترقية:', error);
        res.status(500).json({ error: 'حدث خطأ في النظام' });
    }
});



// ==========================================
// تشغيل السيرفر
// ==========================================
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`🚀 سيرفر Cherif Platform يعمل بقوة على المنفذ http://localhost:${PORT}`);
});