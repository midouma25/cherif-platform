require('dotenv').config(); // 👈 يجب أن يكون في السطر الأول
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
// استدعاء الرابط السري من ملف .env
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

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = mongoose.model('User', userSchema);
const JWT_SECRET = process.env.JWT_SECRET;

// ==========================================
// 3. مسار تسجيل الدخول / إنشاء الحساب عبر الخزنة
// ==========================================
app.post('/api/auth/vault-signup', async (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) return res.status(400).json({ error: 'الرجاء إدخال الاسم والبريد.' });

    try {
        let user = await User.findOne({ email });
        let isNewUser = false;

        if (!user) {
            const generatedPassword = Math.random().toString(36).slice(-8); 
            user = new User({ name, email, password: generatedPassword, role: 'user' });
            await user.save();
            isNewUser = true;
            console.log(`✨ مستخدم جديد: ${email} | الباسورد: ${generatedPassword}`);
        }

        const token = jwt.sign({ id: user._id, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '7d' });

        res.json({ 
            success: true, 
            token, 
            user: { id: user._id, name: user.name, role: user.role, email: user.email },
            isNewUser,
            message: 'تم فتح الخزنة بنجاح!'
        });

    } catch (error) {
        console.error('❌ خطأ في المصادقة:', error);
        res.status(500).json({ error: 'خطأ في السيرفر.' });
    }
});


// ==========================================
// 🛡️ حارس الأمان (Middleware) للتحقق من الصلاحيات
// ==========================================
const verifyAdmin = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: 'غير مصرح لك بالدخول' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.role !== 'admin') {
            return res.status(403).json({ error: 'هذا المسار مخصص للمدير العام فقط' });
        }
        req.user = decoded; // تمرير بيانات المدير للمسار
        next();
    } catch (err) {
        res.status(401).json({ error: 'توكن غير صالح' });
    }
};

// ==========================================
// 👑 مسارات المدير العام (Admin APIs)
// ==========================================

// 1. جلب جميع المستخدمين
app.get('/api/admin/users', verifyAdmin, async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ created_at: -1 });
        res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({ error: 'فشل في جلب المستخدمين' });
    }
});

// 2. ترقية/تعديل صلاحية مستخدم (طالب <-> أستاذ <-> أدمن)
app.put('/api/admin/users/:id/role', verifyAdmin, async (req, res) => {
    try {
        const { newRole } = req.body;
        const user = await User.findByIdAndUpdate(req.params.id, { role: newRole }, { new: true });
        res.json({ success: true, message: `تم تغيير صلاحية ${user.name} إلى ${newRole}` });
    } catch (error) {
        res.status(500).json({ error: 'فشل في تعديل الصلاحية' });
    }
});

// 💡 (مسار سري ومؤقت) - قم بزيارته مرة واحدة لترقية حسابك الشخصي إلى مدير
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
// تشغيل السيرفر على المنفذ 5001
// ==========================================
const PORT = 5001;
app.listen(PORT, () => {
    console.log(`🚀 سيرفر Cherif Platform يعمل بقوة على المنفذ http://localhost:${PORT}`);
});