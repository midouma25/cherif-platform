require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const app = express();
app.use(cors());
// السماح باستقبال حزم بيانات ضخمة (كورسات وشهادات كاملة)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ==========================================
// 1. الاتصال بقاعدة البيانات (MongoDB Atlas ☁️)
// ==========================================
const ATLAS_URI = process.env.MONGO_URI;

mongoose.connect(ATLAS_URI)
    .then(() => console.log('✅ تم الاتصال بقاعدة بيانات Cherif Platform (أطلس السحابية ☁️)'))
    .catch(err => console.error('❌ خطأ في الاتصال بقاعدة أطلس:', err));

// ==========================================
// 🧹 دوال التطهير الذكية (لمنع CastError وتكرار العناوين)
// ==========================================

// أ) تنظيف تكرار "الكراش كورس 1: كراش كورس 1:" من عنوان الكورس
const cleanCourseTitlePrefix = (rawTitle = '') => {
    if (!rawTitle || typeof rawTitle !== 'string') return 'كورس تدريبي';
    return rawTitle
        .replace(/^((?:الكراش كورس|كراش كورس|الكورس|المرحلة)\s*\d+(?:\s*\([^)]*\))?)\s*:\s*(?:الكراش كورس|كراش كورس|الكورس|المرحلة)\s*\d+\s*:\s*/i, '$1: ')
        .replace(/^((?:الكراش كورس|كراش كورس|الكورس)\s*\d+)\s*:\s*(?:الكراش كورس|كراش كورس|الكورس)\s*\d+\s*[-:]?\s*/i, '$1: ')
        .trim();
};

// ب) تحويل أي قيمة (سواء كانت نصاً، أو مصفوفة متداخلة [['...']]، أو كائناً) إلى نص صافي
const toCleanFlatString = (val) => {
    if (val === null || val === undefined) return '';
    if (typeof val === 'string') {
        const trimmed = val.trim();
        // إذا كان النص عبارة عن مصفوفة JSON متداخلة كنص مثل "[ [ '/ˈtʃiːp.ər/' ] ]"
        if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
            try {
                const parsed = JSON.parse(trimmed.replace(/'/g, '"'));
                if (Array.isArray(parsed)) {
                    return parsed.flat(Infinity).map(item => String(item).trim()).filter(Boolean).join(' | ');
                }
            } catch (e) {}
        }
        return trimmed;
    }
    if (Array.isArray(val)) {
        return val.flat(Infinity).map(toCleanFlatString).filter(Boolean).join(' | ');
    }
    if (typeof val === 'object') {
        return String(val.text || val.option || val.value || val.label || JSON.stringify(val));
    }
    return String(val);
};

// ج) تطبيع مصفوفة الخيارات (options) لتكون دائماً [String] مسطحة ونظيفة 100%
const normalizeQuizOptions = (rawOptions) => {
    if (!rawOptions) return ['الخيار 1', 'الخيار 2', 'الخيار 3', 'الخيار 4'];

    let workingArray = rawOptions;

    // إذا جاءت الخيارات كنص JSON مضغوط مثل "[ [ '/ˈtʃiːp.ər/' ], [ '/tʃɪpər/' ] ]"
    if (typeof workingArray === 'string') {
        const trimmed = workingArray.trim();
        if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
            try {
                workingArray = JSON.parse(trimmed.replace(/'/g, '"'));
            } catch (e) {
                return [trimmed];
            }
        } else {
            return [trimmed];
        }
    }

    if (!Array.isArray(workingArray)) {
        return ['الخيار 1', 'الخيار 2', 'الخيار 3', 'الخيار 4'];
    }

    // إذا كان العنصر الأول بحد ذاته مصفوفة تحتوي على جميع الخيارات الأربع: [ [ ['a'], ['b'], ['c'], ['d'] ] ]
    if (workingArray.length === 1 && Array.isArray(workingArray[0]) && workingArray[0].length >= 2) {
        workingArray = workingArray[0];
    }

    // إذا كان العنصر الأول نصاً يحتوي على المصفوفة كاملة: [ "[ [ '/ˈtʃiːp.ər/' ], [ '/tʃɪpər/' ] ]" ]
    if (workingArray.length === 1 && typeof workingArray[0] === 'string' && workingArray[0].trim().startsWith('[')) {
        try {
            const parsedInner = JSON.parse(workingArray[0].trim().replace(/'/g, '"'));
            if (Array.isArray(parsedInner) && parsedInner.length >= 2) {
                workingArray = parsedInner;
            }
        } catch (e) {}
    }

    const flattened = workingArray.map(item => {
        if (Array.isArray(item)) {
            return item.flat(Infinity).map(x => String(x).trim()).filter(Boolean).join(' ');
        }
        return toCleanFlatString(item);
    }).filter(Boolean);

    return flattened.length > 0 ? flattened : ['الخيار 1', 'الخيار 2', 'الخيار 3', 'الخيار 4'];
};

// د) تطهير كائن الدرس بالكامل قبل حفظه في MongoDB
const sanitizeLessonData = (lesson = {}, courseId, sectionName = 'الوحدة 1: الأساسيات', lessonOrder = 1) => {
    // 1. تطهير bossQuiz
    const cleanBossQuiz = Array.isArray(lesson.bossQuiz)
        ? lesson.bossQuiz.map((q) => ({
            questionType: q?.questionType === 'code' ? 'code' : 'theory',
            question: toCleanFlatString(q?.question || 'سؤال تطبيقي'),
            options: normalizeQuizOptions(q?.options),
            correctAnswerIndex: Number.isFinite(Number(q?.correctAnswerIndex)) ? Number(q.correctAnswerIndex) : 0,
            explanation: toCleanFlatString(q?.explanation || '')
        }))
        : [];

    // 2. تطهير dailyQuest
    const hasDailyQuest = lesson.dailyQuest && (lesson.dailyQuest.question || lesson.dailyQuest.options?.length);
    const cleanDailyQuest = hasDailyQuest
        ? {
            question: toCleanFlatString(lesson.dailyQuest.question),
            options: normalizeQuizOptions(lesson.dailyQuest.options),
            correctAnswerIndex: Number.isFinite(Number(lesson.dailyQuest.correctAnswerIndex))
                ? Number(lesson.dailyQuest.correctAnswerIndex)
                : 0,
            explanation: toCleanFlatString(lesson.dailyQuest.explanation || ''),
            isMandatory: Boolean(lesson.dailyQuest.isMandatory),
            bonusExp: Number(lesson.dailyQuest.bonusExp) || 50
        }
        : null;

    // 3. تطهير codingPractice (أو unitCodingChallenge)
    const rawPractice = lesson.codingPractice || lesson.unitCodingChallenge;
    const hasPractice = rawPractice && (rawPractice.taskQuestion || rawPractice.solutionCode);
    const cleanCodingPractice = hasPractice
        ? {
            hasPractice: true,
            taskQuestion: toCleanFlatString(rawPractice.taskQuestion),
            starterCode: toCleanFlatString(rawPractice.starterCode || ''),
            hints: Array.isArray(rawPractice.hints)
                ? rawPractice.hints.map(toCleanFlatString).filter(Boolean)
                : [],
            solutionCode: toCleanFlatString(rawPractice.solutionCode || '')
        }
        : null;

    return {
        courseId,
        title: toCleanFlatString(lesson.title || `الدرس ${lessonOrder}`),
        description: toCleanFlatString(lesson.description || 'تم إنشاؤه تلقائياً عبر AutoFactory'),
        type: toCleanFlatString(lesson.type || 'video'),
        lessonCategory: toCleanFlatString(lesson.lessonCategory || 'standard'),
        content: toCleanFlatString(lesson.content || ''),
        codeSnippet: toCleanFlatString(lesson.codeSnippet || ''),
        codeExplanation: toCleanFlatString(lesson.codeExplanation || ''),
        videoUrl: toCleanFlatString(lesson.videoUrl || ''),
        order: lessonOrder,
        isFreePreview: Boolean(lesson.isFreePreview),
        section: toCleanFlatString(sectionName || lesson.section || 'الوحدة 1: الأساسيات'),
        codingPractice: cleanCodingPractice,
        dailyQuest: cleanDailyQuest,
        bossQuiz: cleanBossQuiz
    };
};

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
    rank: { type: String, default: 'E-Rank' }
});
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);
const JWT_SECRET = process.env.JWT_SECRET;

// ==========================================
// 3. مسارات المصادقة (Auth Routes)
// ==========================================

app.post('/api/auth/check-email', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        res.json({ exists: !!user, name: user ? user.name : null });
    } catch (error) {
        res.status(500).json({ error: 'خطأ في السيرفر' });
    }
});

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
        if (user) res.json({ success: true, message: 'مبروك! أصبحت المدير العام الآن. قم بتسجيل الدخول من جديد.' });
        else res.json({ error: 'لم يتم العثور على الإيميل' });
    } catch (error) { res.status(500).send('Error'); }
});

// ==========================================
// 5. نموذج الكورسات (Course Schema)
// ==========================================
const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    difficulty: { type: String, default: '' },
    estimatedHours: { type: Number, default: 18 },
    price: { type: Number, default: 0 },
    thumbnail: { type: String, default: '' },
    certificateMeta: { type: mongoose.Schema.Types.Mixed, default: {} },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isPublished: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now }
});

const Course = mongoose.model('Course', courseSchema);

// ==========================================
// 🛡️ حارس الأمان الخاص بالأساتذة
// ==========================================
const verifyInstructor = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: 'غير مصرح لك بالدخول' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
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

app.post('/api/courses', verifyInstructor, async (req, res) => {
    try {
        const { title, description, price, thumbnail, difficulty, estimatedHours, certificateMeta } = req.body;

        const newCourse = new Course({
            title: cleanCourseTitlePrefix(title),
            description,
            price,
            thumbnail,
            difficulty: difficulty || '',
            estimatedHours: Number(estimatedHours) || 18,
            certificateMeta: certificateMeta || {},
            instructor: req.user.id
        });

        await newCourse.save();
        res.json({ success: true, course: newCourse, message: 'تم إنشاء الكورس بنجاح!' });
    } catch (error) {
        res.status(500).json({ error: 'فشل في إنشاء الكورس' });
    }
});

app.get('/api/courses/my-courses', verifyInstructor, async (req, res) => {
    try {
        const courses = await Course.find({ instructor: req.user.id }).sort({ created_at: -1 });
        res.json({ success: true, courses });
    } catch (error) {
        res.status(500).json({ error: 'فشل في جلب الكورسات' });
    }
});

app.put('/api/courses/:id', verifyInstructor, async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ error: 'الكورس غير موجود' });

        if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'غير مصرح لك بتعديل هذا الكورس' });
        }

        const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ success: true, course: updatedCourse, message: 'تم التعديل بنجاح' });
    } catch (error) {
        res.status(500).json({ error: 'فشل في تعديل الكورس' });
    }
});

app.delete('/api/courses/:id', verifyInstructor, async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ error: 'الكورس غير موجود' });

        if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'غير مصرح لك بحذف هذا الكورس' });
        }

        await Lesson.deleteMany({ courseId: req.params.id });
        await Course.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'تم حذف الكورس وجميع دروسه بنجاح' });
    } catch (error) {
        res.status(500).json({ error: 'فشل في حذف الكورس' });
    }
});

// ==========================================
// 🌍 مسارات الأكاديمية العامة (Public APIs)
// ==========================================

app.get('/api/courses/public', async (req, res) => {
    try {
        const courses = await Course.find().sort({ created_at: -1 });
        res.json({ success: true, courses });
    } catch (error) {
        res.status(500).json({ error: 'فشل في جلب قائمة الكورسات' });
    }
});

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
    type: { type: String, default: 'video' },
    lessonCategory: { type: String, default: 'standard' },
    content: { type: String, default: '' },
    videoUrl: { type: String, default: '' },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    isFreePreview: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    section: { type: String, default: 'الوحدة 1: الأساسيات' },
    codeSnippet: { type: String, default: '' },
    codeExplanation: { type: String, default: '' },

    codingPractice: {
        hasPractice: { type: Boolean, default: false },
        taskQuestion: { type: String, default: '' },
        starterCode: { type: String, default: '' },
        hints: [{ type: String }],
        solutionCode: { type: String, default: '' }
    },

    dailyQuest: {
        question: String,
        options: [String],
        correctAnswerIndex: Number,
        explanation: String,
        isMandatory: { type: Boolean, default: false },
        bonusExp: { type: Number, default: 50 }
    },

    bossQuiz: [{
        questionType: { type: String, default: 'theory' },
        question: String,
        options: [String],
        correctAnswerIndex: Number,
        explanation: String
    }],

    created_at: { type: Date, default: Date.now }
});

const Lesson = mongoose.model('Lesson', lessonSchema);

// ==========================================
// 📚 مسارات الدروس (Lesson APIs)
// ==========================================

app.get('/api/courses/:courseId/lessons', async (req, res) => {
    try {
        const lessons = await Lesson.find({ courseId: req.params.courseId }).sort({ order: 1 });

        const safeLessons = lessons.map(lesson => ({
            _id: lesson._id,
            title: lesson.title,
            description: lesson.description,
            type: lesson.type || 'video',
            lessonCategory: lesson.lessonCategory || 'standard',
            content: lesson.content,
            isFreePreview: lesson.isFreePreview,
            order: lesson.order,
            section: lesson.section || 'الوحدة 1: الأساسيات',
            videoUrl: lesson.isFreePreview ? lesson.videoUrl : null,
            codeSnippet: lesson.codeSnippet || "",
            codeExplanation: lesson.codeExplanation || "",
            dailyQuest: lesson.dailyQuest || null,
            codingPractice: lesson.codingPractice || null,
            bossQuiz: (lesson.bossQuiz && lesson.bossQuiz.length > 0) ? lesson.bossQuiz : []
        }));

        res.json({ success: true, lessons: safeLessons });
    } catch (error) {
        console.error('❌ خطأ في جلب الدروس:', error);
        res.status(500).json({ error: 'فشل في جلب الدروس' });
    }
});

app.post('/api/courses/:courseId/lessons', verifyInstructor, async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId);
        if (!course) return res.status(404).json({ error: 'الكورس غير موجود' });

        if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'غير مصرح لك' });
        }

        const existingCount = await Lesson.countDocuments({ courseId: course._id });
        const cleanPayload = sanitizeLessonData(
            req.body,
            course._id,
            req.body.section || 'الوحدة 1: الأساسيات',
            req.body.order || (existingCount + 1)
        );

        const newLesson = new Lesson(cleanPayload);
        await newLesson.save();

        res.json({ success: true, lesson: newLesson, message: 'تمت إضافة الدرس بنجاح' });
    } catch (error) {
        console.error('❌ خطأ في إضافة الدرس:', error);
        res.status(500).json({ error: 'فشل في إضافة الدرس' });
    }
});

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
    certificate: {
        isIssued: { type: Boolean, default: false },
        certificateId: { type: String, sparse: true },
        issuedAt: { type: Date }
    }
});

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

// ==========================================
// 🎮 مسارات نظام التقدم والـ EXP (Gamification APIs)
// ==========================================

app.get('/api/courses/:courseId/progress', async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.json({ success: true, completedLessons: [] });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const enrollment = await Enrollment.findOne({ userId: decoded.id, courseId: req.params.courseId });
        res.json({ success: true, completedLessons: enrollment ? enrollment.completedLessons : [] });
    } catch (error) {
        res.status(500).json({ error: 'خطأ في جلب التقدم' });
    }
});

// مسار موحد لإنهاء الدرس + إضافة 50 EXP + ترقية الرتبة
app.post('/api/courses/:courseId/complete-lesson', async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: 'يجب تسجيل الدخول لحفظ تقدمك!' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.id;
        const { lessonId } = req.body;

        let enrollment = await Enrollment.findOne({ userId, courseId: req.params.courseId });
        if (!enrollment) {
            enrollment = new Enrollment({ userId, courseId: req.params.courseId, completedLessons: [] });
        }

        let expGained = false;
        let newRank = '';

        if (!enrollment.completedLessons.includes(lessonId)) {
            enrollment.completedLessons.push(lessonId);
            await enrollment.save();
            expGained = true;

            const user = await User.findById(userId);
            if (user) {
                user.exp += 50;

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
        const userStats = await User.findById(decoded.id).select('exp rank name');

        const enrollments = await Enrollment.find({ userId: decoded.id }).populate('courseId');
        const learningData = await Promise.all(enrollments.map(async (enr) => {
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

        res.json({ success: true, learning: learningData.filter(item => item !== null), userStats });
    } catch (error) {
        res.status(500).json({ error: 'خطأ في السيرفر' });
    }
});

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

app.post('/api/courses/:courseId/enroll', async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: 'يجب تسجيل الدخول أولاً' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.id;

        const existingEnrollment = await Enrollment.findOne({ userId, courseId: req.params.courseId });
        if (existingEnrollment) {
            return res.json({ success: true, message: 'أنت مسجل بالفعل في هذا الكورس' });
        }

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

// ==========================================
// 📊 مسارات لوحة تحكم الأستاذ (Instructor Dashboard)
// ==========================================
app.get('/api/instructor/stats', verifyInstructor, async (req, res) => {
    try {
        const instructorId = req.user.id;
        const myCourses = await Course.find({ instructor: instructorId });
        const courseIds = myCourses.map(c => c._id);
        const enrollments = await Enrollment.find({ courseId: { $in: courseIds } });

        const totalCourses = myCourses.length;
        const totalStudents = enrollments.length;

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
        const topPlayers = await User.find({})
            .sort({ exp: -1 })
            .limit(50)
            .select('name exp rank');

        res.json({ success: true, leaderboard: topPlayers });
    } catch (error) {
        console.error('❌ خطأ في جلب لوحة الصدارة:', error);
        res.status(500).json({ error: 'فشل في تحميل بيانات النقابة' });
    }
});

// ==========================================
// 📜 مسارات وثائق الإثبات (Certificates)
// ==========================================
const handleIssueCertificate = async (req, res) => {
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

        if (!enrollment.certificate.isIssued) {
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
};

app.post('/api/courses/:courseId/issue-certificate', handleIssueCertificate);
app.post('/api/certificates/issue/:courseId', handleIssueCertificate);

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

        user.role = 'instructor';
        await user.save();

        res.json({ success: true, message: 'تمت ترقيتك إلى رتبة صانع محتوى بنجاح!', newRole: user.role });
    } catch (error) {
        console.error('❌ خطأ في الترقية:', error);
        res.status(500).json({ error: 'حدث خطأ في النظام' });
    }
});

// ==========================================
// 🚀 جسر الاستقبال التلقائي المحصن من (AutoFactory)
// يدعم التطهير التلقائي للمصفوفات المتداخلة + منع تكرار الكورسات عند إعادة الرفع!
// ==========================================
app.post('/api/courses/auto-import', async (req, res) => {
    const {
        courseTitle,
        courseDescription,
        difficulty,
        estimatedHours,
        certificateMeta,
        blueprint
    } = req.body;

    if (!courseTitle || !blueprint) {
        return res.status(400).json({ error: 'بيانات الكورس غير مكتملة!' });
    }

    try {
        const cleanedTitle = cleanCourseTitlePrefix(courseTitle);
        console.log(`\n📥 [استقبال آلي] جاري رفع/تحديث كورس: ${cleanedTitle}`);

        const systemInstructor = await User.findOne({ role: { $in: ['instructor', 'admin'] } });
        if (!systemInstructor) {
            return res.status(500).json({ error: 'لا يوجد حساب أستاذ في النظام لربط الكورس به!' });
        }

        console.log(`   🔗 سيتم ربط الكورس الآلي بالأستاذ: ${systemInstructor.name}`);

        // 🛡️ فحص ذكي لمنع تكرار الكورسات إذا تم رفع نفس الشهادة مرة ثانية:
        // نبحث عن الكورس سواء بعنوانه النظيف أو عنوانه القديم المكرر
        let targetCourse = await Course.findOne({
            $or: [
                { title: cleanedTitle },
                { title: courseTitle }
            ]
        });

        const parsedHours = parseInt(String(estimatedHours || '18').match(/\d+/)?.[0] || '18', 10);

        if (targetCourse) {
            targetCourse.title = cleanedTitle;
            targetCourse.description = courseDescription || targetCourse.description;
            targetCourse.difficulty = difficulty || targetCourse.difficulty || '';
            targetCourse.estimatedHours = parsedHours;
            targetCourse.certificateMeta = certificateMeta || targetCourse.certificateMeta || {};
            await targetCourse.save();

            // مسح الدروس الجزئية القديمة لإعادة كتابتها بشكل نظيف وكامل
            await Lesson.deleteMany({ courseId: targetCourse._id });
            console.log(`   🔄 تم العثور على الكورس مسبقاً وتحديث هيكله (ID: ${targetCourse._id}) بدون تكرار!`);
        } else {
            targetCourse = new Course({
                title: cleanedTitle,
                description: courseDescription || cleanedTitle,
                difficulty: difficulty || '',
                estimatedHours: parsedHours,
                price: 0,
                thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800",
                certificateMeta: certificateMeta || {},
                instructor: systemInstructor._id,
                isPublished: true
            });
            await targetCourse.save();
            console.log(`   ✅ تم إنشاء الهيكل الأساسي الجديد (ID: ${targetCourse._id})`);
        }

        // 2. تطهير ومعالجة وحفظ جميع الدروس
        let lessonOrder = 1;
        const lessonsToInsert = [];

        for (const section of (Array.isArray(blueprint) ? blueprint : [])) {
            const secName = section?.sectionName || 'الوحدة 1: الأساسيات';
            const rawLessons = Array.isArray(section?.lessons) ? section.lessons : [];

            for (const lesson of rawLessons) {
                if (lesson && (lesson.isForged || lesson.content || lesson.bossQuiz?.length)) {
                    const sanitized = sanitizeLessonData(lesson, targetCourse._id, secName, lessonOrder++);
                    lessonsToInsert.push(sanitized);
                }
            }
        }

        if (lessonsToInsert.length > 0) {
            await Lesson.insertMany(lessonsToInsert);
        }

        console.log(`🎉 [نجاح] اكتمل رفع الكورس (${lessonsToInsert.length} درساً وتحدياً) بالكامل إلى قاعدة البيانات!`);
        res.json({
            success: true,
            courseId: targetCourse._id,
            lessonsCount: lessonsToInsert.length,
            message: "تمت المزامنة بنجاح!"
        });

    } catch (error) {
        console.error('❌ خطأ في استيراد الكورس:', error);
        res.status(500).json({ error: 'حدث خطأ داخلي أثناء استيراد الكورس: ' + error.message });
    }
});

// ==========================================
// تشغيل السيرفر
// ==========================================
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`🚀 سيرفر Cherif Platform يعمل بقوة على المنفذ http://localhost:${PORT}`);
});