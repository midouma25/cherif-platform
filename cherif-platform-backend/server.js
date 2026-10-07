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


// ==========================================
// تشغيل السيرفر
// ==========================================
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`🚀 سيرفر Cherif Platform يعمل بقوة على المنفذ http://localhost:${PORT}`);
});