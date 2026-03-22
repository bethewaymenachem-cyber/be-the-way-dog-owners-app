import React, { useState, useEffect, createContext, useContext } from 'react';
import { Crown, Users, User, Star, ChevronLeft, Phone, PlayCircle, ShieldCheck, Video, MonitorPlay, MessageCircle, MapPin, ClipboardList, Link as LinkIcon, Lock, Unlock, EyeOff, Briefcase, FileText, X, Mail, Smartphone, LogIn, Loader2, LogOut, Play, Calendar, Clock, Bell, BookOpen, CheckCircle, ArrowRight, Check } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://yrlkfgjguhvxcenigwob.supabase.co';
const SUPABASE_KEY = 'sb_publishable_vaq0deuZkoIoGk7jCZ5T5w__s7A-f9A-5989182245';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
/// ==========================================
/// 1. MOCK DATA LAYER (הכנה ל-Database)
/// ==========================================
const MOCK_DB = {
  users: [{ id: '1', email: 'test@betheway.co.il', fullName: 'ישראל ישראלי' }],
  course: { id: 'c1', title: 'שלב איזון: יסודות המנהיגות השקטה', totalLessons: 5 },
  lessons: [
    { id: 'l1', number: '01', title: 'מבוא - שפת הגוף של הכלב', duration: '12:00' },
    { id: 'l2', number: '02', title: 'פקודת "אלי" - קריאה אמינה', duration: '18:30' },
    { id: 'l3', number: '03', title: 'הליכה נכונה בטיול ללא משיכות', duration: '22:15' },
    { id: 'l4', number: '04', title: 'מניעת קפיצות על אורחים בבית', duration: '15:40' },
    { id: 'l5', number: '05', title: 'סיכום השלב ושיעורי בית למפגש הבא', duration: '08:20' }
  ],
  userProgress: { completedLessonIds: ['l1'] } 
};

/// ==========================================
/// 2. SERVICES LAYER (הכנה ל-Supabase API)
/// ==========================================
const api = {
  signIn: async (email, password) => new Promise(resolve => setTimeout(() => resolve({ user: MOCK_DB.users[0] }), 1000)),
  signUp: async (userData) => new Promise(resolve => setTimeout(() => resolve({ user: { id: '2', ...userData } }), 1000)),
  signInWithGoogle: async () => new Promise(resolve => setTimeout(() => resolve({ user: { id: '3', fullName: 'משתמש גוגל', email: 'google@test.com' } }), 1000)),
  getCourseData: async () => new Promise(resolve => setTimeout(() => resolve(MOCK_DB.course), 500)),
  getLessons: async () => new Promise(resolve => setTimeout(() => resolve(MOCK_DB.lessons), 500)),
  getUserProgress: async () => new Promise(resolve => setTimeout(() => resolve(MOCK_DB.userProgress), 500)),
  markLessonCompleted: async (lessonId) => new Promise(resolve => setTimeout(() => {
    if (!MOCK_DB.userProgress.completedLessonIds.includes(lessonId)) MOCK_DB.userProgress.completedLessonIds.push(lessonId);
    resolve(MOCK_DB.userProgress);
  }, 500))
};

/// ==========================================
/// 3. CONTEXTS (State Management & Routing)
/// ==========================================
const AuthContext = createContext();
const RouterContext = createContext();

const AppProviders = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [isManagerMode, setIsManagerMode] = useState(false);
  
  const [route, setRoute] = useState({ path: '/', params: {} });
  const navigate = (path, params = {}) => {
    setRoute({ path, params });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const login = async (email, password) => {
    setAuthLoading(true);
    const { user } = await api.signIn(email, password);
    setUser(user);
    setAuthLoading(false);
    navigate('/dashboard');
  };

  const register = async (data) => {
    setAuthLoading(true);
    const { user } = await api.signUp(data);
    setUser(user);
    setAuthLoading(false);
    navigate('/dashboard');
  };

  const socialLogin = async () => {
    setAuthLoading(true);
    const { user } = await api.signInWithGoogle();
    setUser(user);
    setAuthLoading(false);
    navigate('/dashboard');
  };

  const logout = () => {
    setUser(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, authLoading, login, register, logout, socialLogin, isManagerMode, setIsManagerMode }}>
      <RouterContext.Provider value={{ route, navigate }}>
        {children}
      </RouterContext.Provider>
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);
const useRouter = () => useContext(RouterContext);

/// ==========================================
/// 4. COMPONENTS (UI Building Blocks)
/// ==========================================

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white">
        <Lock className="w-12 h-12 text-rose-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">גישה חסומה</h2>
        <p className="text-slate-400 mb-6">עליך להתחבר למערכת כדי לצפות בתוכן זה.</p>
      </div>
    );
  }
  return children;
};

const Header = ({ onOpenAuth }) => {
  const { user, logout, isManagerMode, setIsManagerMode } = useAuth();
  const { route, navigate } = useRouter();
  const isInternal = route.path !== '/';

  return (
    <nav className="border-b border-white/10 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50 shrink-0">
      <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(user ? '/dashboard' : '/')}>
          <div className="w-12 h-12 bg-gradient-to-br from-amber-300 to-amber-600 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(251,191,36,0.3)]">
            <Crown className="text-slate-900 w-7 h-7" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold tracking-wide text-white">Be the Way</h1>
            <p className="text-[10px] text-amber-400 tracking-widest uppercase">{isInternal ? 'אזור אישי' : 'אקדמיה לכלבנות'}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {!user ? (
            <>
              <button onClick={onOpenAuth} className="flex items-center gap-2 text-slate-300 hover:text-amber-400 transition-colors font-medium px-2">
                <LogIn className="w-5 h-5" />
                <span className="hidden sm:inline">התחברות</span>
              </button>
              <button 
                onClick={() => setIsManagerMode(!isManagerMode)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${isManagerMode ? 'bg-rose-500/20 text-rose-400 border border-rose-500/50' : 'bg-slate-800 text-slate-400 border border-white/5 hover:bg-slate-700'}`}
              >
                {isManagerMode ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                <span className="hidden sm:inline">{isManagerMode ? 'מצב מנהל פעיל' : 'כניסת צוות'}</span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center border border-white/10">
                  <User className="w-5 h-5 text-slate-400" />
                </div>
                <span className="font-medium text-white hidden sm:block">{user.fullName}</span>
              </div>
              <div className="w-px h-6 bg-white/10"></div>
              <button onClick={logout} className="flex items-center gap-2 text-slate-400 hover:text-rose-400 transition-colors font-medium">
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">התנתקות</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

const AuthModal = ({ onClose, defaultMode = 'login' }) => {
  const { login, register, socialLogin, authLoading } = useAuth();
  const [mode, setMode] = useState(defaultMode);
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'login') login(form.email, form.password);
    else register(form);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 left-4 text-slate-400 hover:text-white"><X className="w-6 h-6" /></button>
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-amber-400/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6 text-amber-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">{mode === 'login' ? 'ברוכים השבים!' : 'יצירת משתמש חדש'}</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-right">
          {mode === 'register' && (
            <>
              <input type="text" placeholder="שם מלא" className="w-full bg-slate-800 border border-white/10 rounded-xl py-3 px-4 text-white" required onChange={e => setForm({...form, fullName: e.target.value})} />
              <input type="tel" placeholder="מספר טלפון" dir="ltr" className="w-full bg-slate-800 border border-white/10 rounded-xl py-3 px-4 text-white text-right" required onChange={e => setForm({...form, phone: e.target.value})} />
            </>
          )}
          <input type="email" placeholder="כתובת אימייל" dir="ltr" className="w-full bg-slate-800 border border-white/10 rounded-xl py-3 px-4 text-white text-right" required onChange={e => setForm({...form, email: e.target.value})} />
          <input type="password" placeholder="סיסמה" dir="ltr" className="w-full bg-slate-800 border border-white/10 rounded-xl py-3 px-4 text-white text-right" required minLength="6" onChange={e => setForm({...form, password: e.target.value})} />
          
          <button type="submit" disabled={authLoading} className="w-full bg-gradient-to-r from-amber-400 to-amber-600 text-slate-900 font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-4">
            {authLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>{mode === 'login' ? 'התחברות' : 'הרשמה'}</span>}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-white/10 text-center">
          <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="text-amber-400 font-medium hover:underline text-sm">
            {mode === 'login' ? 'אין חשבון? צרו חדש' : 'כבר רשומים? התחברו כאן'}
          </button>
        </div>
        
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button onClick={socialLogin} type="button" className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white py-2.5 rounded-xl text-sm font-medium">Google</button>
          <button onClick={socialLogin} type="button" className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white py-2.5 rounded-xl text-sm font-medium">Apple</button>
        </div>
      </div>
    </div>
  );
};

const WhatsAppIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>
);

/// ==========================================
/// 5. PAGES
/// ==========================================

const LandingPage = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authDefaultMode, setAuthDefaultMode] = useState('login');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [internalInfoProduct, setInternalInfoProduct] = useState(null);
  const [showWaToast, setShowWaToast] = useState(false);
  const { isManagerMode } = useAuth();

  // Marketing Data (UI Rich Data)
  const products = [
    {
      id: 1,
      title: 'תוכנית ליווי קבוצתית',
      subtitle: 'הכוח של הלהקה',
      description: 'תוכנית מקיפה המשלבת קורס דיגיטלי עשיר, מפגשי זום קבוצתיים, וליווי אישי של מאמן צמוד להצלחה מקסימלית.',
      icon: <Users className="w-10 h-10 text-amber-400" />,
      features: ['4 כנסי זום חווייתיים', '3 פרקי קורס דיגיטלי', '4 מפגשי ליווי אישי בשטח', 'פולואפים (טלפון/וואטסאפ)'],
      extendedDetails: [
        { icon: <MonitorPlay className="w-5 h-5 text-amber-500" />, title: '4 מפגשי זום (כנסים)', desc: 'כנס איזון, מנהיגות, חוויה ומפגש סיכום. כל מפגש בנוי כ"כנס" חווייתי עם אינטראקציה, תוכן מרתק והובלה.' },
        { icon: <Video className="w-5 h-5 text-amber-500" />, title: 'קורס דיגיטלי מקביל', desc: '3 פרקים מרכזיים (איזון, מנהיגות, חוויה). הפרקים נלמדים בין הכנסים ומהווים את חלק ההעמקה והיישום.' },
        { icon: <User className="w-5 h-5 text-amber-500" />, title: '4 מפגשי ליווי אישי', desc: 'מפגשי אחד על אחד עם מאמן להתאמה אישית לכלב שלכם. זה החלק שמחבר בין התוכן לבין החיים עצמם.' },
        { icon: <Phone className="w-5 h-5 text-amber-500" />, title: 'פולואפים וליווי שוטף', desc: 'שיחות קצרות (10-15 דק\') או וואטסאפ בין השלבים כדי לבדוק יישום, לדייק, לזהות קושי ולשמור על מחויבות.' }
      ],
      internalDetails: [
        { icon: <Briefcase className="w-5 h-5 text-rose-500" />, title: 'תשלום למאמן (דרך האקדמיה)', desc: 'האקדמיה מוכרת את העסקה ומשלמת למאמנ/ת שכר של 150₪ לכל שיעור בפועל מתוך המפגשים הכלולים.' },
        { icon: <FileText className="w-5 h-5 text-rose-500" />, title: 'המשך טיפול (אקסטרה מפגשים)', desc: 'לקוח שרוצה עוד מפגשים סוגר מול המאמן ישירות או מול האקדמיה - המאמן מעביר עמלה של 200₪ לכל מפגש נוסף.' },
        { icon: <Users className="w-5 h-5 text-rose-500" />, title: 'לקוח המגיע דרך המאמן', desc: 'המאמן רוכש את הקורס בהנחה וגובה מחיר מלא מהלקוח, או שולח אלינו לרכישה ומקבל עמלה.' },
        { icon: <ShieldCheck className="w-5 h-5 text-rose-500" />, title: 'עבודה ע"פ פרוטוקול', desc: 'כל עוד עובדים ע"פ הפרוטוקול ובצמוד לקורס, משולמת עמלה לאקדמיה על טיפולי המשך (מבוסס על אמון).' }
      ],
      price: 'החל מ-₪2,400'
    },
    {
      id: 2,
      title: 'תהליך ליווי פרטני',
      subtitle: 'יחס אישי וממוקד',
      description: 'ליווי אישי של אחד על אחד במתכונת VIP. התהליך משלב קורס דיגיטלי מקיף יחד עם סדרת מפגשי אימון פרטניים.',
      icon: <User className="w-10 h-10 text-amber-400" />,
      features: ['קורס דיגיטלי מקיף', '6 מפגשי אימון פרטניים', 'עבודה ע"פ פרוטוקול מובנה', 'סנכרון מלא לתכני הקורס'],
      extendedDetails: [
        { icon: <Video className="w-5 h-5 text-amber-500" />, title: 'קורס דיגיטלי', desc: 'גישה מלאה לקורס הדיגיטלי המקיף שלנו, המהווה את הבסיס התיאורטי והמעשי לתהליך.' },
        { icon: <User className="w-5 h-5 text-amber-500" />, title: '6 מפגשי אימון', desc: '6 מפגשי אימון אישיים (אחד על אחד) לתרגול מעשי, דיוק ויישום החומר בשטח.' },
        { icon: <ClipboardList className="w-5 h-5 text-amber-500" />, title: 'פרוטוקול עבודה מובנה', desc: 'התהליך כולו מתנהל על פי פרוטוקול מקצועי, מסודר ומוכח להשגת תוצאות מקסימליות.' },
        { icon: <LinkIcon className="w-5 h-5 text-amber-500" />, title: 'סנכרון לתכני הקורס', desc: 'כל מפגש פרטני נבנה ועובד בצמוד ובסנכרון מושלם לפרקים ולשלבים בקורס הדיגיטלי.' }
      ],
      internalDetails: [
        { icon: <Briefcase className="w-5 h-5 text-rose-500" />, title: 'תשלום למאמן (דרך האקדמיה)', desc: 'האקדמיה מוכרת את העסקה ומשלמת למאמנ/ת שכר של 150₪ לכל שיעור בפועל מתוך ה-6 הכלולים.' },
        { icon: <FileText className="w-5 h-5 text-rose-500" />, title: 'המשך טיפול (אקסטרה מפגשים)', desc: 'לקוח שרוצה עוד מפגשים סוגר מול המאמן ישירות או מול האקדמיה - המאמן מעביר עמלה של 200₪ לכל מפגש נוסף.' },
        { icon: <Users className="w-5 h-5 text-rose-500" />, title: 'לקוח המגיע דרך המאמן', desc: 'המאמן רוכש את הקורס בהנחה וגובה מחיר מלא מהלקוח, או שולח אלינו לרכישה ומקבל עמלה.' },
        { icon: <ShieldCheck className="w-5 h-5 text-rose-500" />, title: 'עבודה ע"פ פרוטוקול', desc: 'כל עוד עובדים ע"פ הפרוטוקול ובצמוד לקורס, משולמת עמלה לאקדמיה על טיפולי המשך (מבוסס על אמון).' }
      ],
      price: 'בהתאמה אישית'
    }
  ];

  const handleStartNowClick = () => {
    setSelectedProduct(null);
    setAuthDefaultMode('register');
    setIsAuthOpen(true);
  };

  return (
    <>
      <Header onOpenAuth={() => { setAuthDefaultMode('login'); setIsAuthOpen(true); }} />
      
      {/* Hero Section */}
      <header className="relative py-24 px-4 overflow-hidden text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.1),transparent_50%)]"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-sm font-medium">סטנדרט חדש של אילוף בישראל</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-extrabold text-white mb-4 leading-tight">
            הדרך <span className="text-transparent bg-clip-text bg-gradient-to-l from-amber-300 to-amber-600">הנכונה</span> <br/>
            לכלב המושלם
          </h2>
          <h3 className="text-2xl md:text-3xl font-bold text-amber-400 mb-8 tracking-wide">
            זה לא קסם, זו שיטה שעובדת
          </h3>
          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            ברוכים הבאים לאקדמיה לכלבנות. בחרנו בקפידה את מסלולי ההכשרה שלנו כדי להבטיח תוצאות מקסימליות, תוך שילוב טכנולוגיה, למידה דיגיטלית ועבודה מעשית בשטח.
          </p>
        </div>
      </header>

      {/* Products Section */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <div className="h-px bg-gradient-to-l from-amber-400/50 to-transparent flex-1"></div>
          <h3 className="text-3xl font-bold text-white text-center">המסלולים שלנו</h3>
          <div className="h-px bg-gradient-to-r from-amber-400/50 to-transparent flex-1"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {products.map((product) => (
            <div key={product.id} className="group relative bg-slate-900 border border-white/10 rounded-3xl p-8 hover:border-amber-400/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(251,191,36,0.1)] flex flex-col">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/5 rounded-full blur-3xl group-hover:bg-amber-400/10 transition-colors"></div>
              
              <div className="mb-6 relative">{product.icon}</div>
              <h4 className="text-2xl font-bold text-white mb-2">{product.title}</h4>
              <p className="text-amber-400 text-sm font-medium mb-4">{product.subtitle}</p>
              <p className="text-slate-400 mb-8 line-clamp-3 flex-grow">{product.description}</p>

              <div className="space-y-3 mb-8">
                {product.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                    <ShieldCheck className="w-5 h-5 text-amber-500 shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-6 border-t border-white/5">
                <div className="text-lg font-bold text-white mb-4">{product.price}</div>
                <div className="space-y-3">
                  <button onClick={() => setSelectedProduct(product)} className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-amber-500 hover:text-slate-900 text-white py-3 rounded-xl transition-all duration-300 font-medium">
                    <span>פרטים נוספים</span>
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  
                  {isManagerMode && product.internalDetails && (
                    <button onClick={() => setInternalInfoProduct(product)} className="w-full flex items-center justify-center gap-2 bg-rose-500/10 hover:bg-rose-500 hover:text-white text-rose-400 border border-rose-500/30 py-3 rounded-xl transition-all duration-300 font-medium">
                      <EyeOff className="w-4 h-4" />
                      <span>מידע פיננסי לצוות</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-amber-400/30 rounded-3xl p-8 max-w-2xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setSelectedProduct(null)} className="absolute top-4 left-4 text-slate-400 hover:text-white"><X className="w-6 h-6" /></button>
            <div className="flex justify-center mb-6">{selectedProduct.icon}</div>
            <h3 className="text-3xl font-bold text-white text-center mb-2">{selectedProduct.title}</h3>
            <p className="text-center text-slate-400 mb-8 max-w-lg mx-auto">{selectedProduct.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {selectedProduct.extendedDetails.map((detail, idx) => (
                <div key={idx} className="bg-white/5 p-4 rounded-xl border border-white/10 hover:border-amber-400/30 transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    {detail.icon}
                    <h5 className="text-white font-bold">{detail.title}</h5>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">{detail.desc}</p>
                </div>
              ))}
            </div>

            <button onClick={handleStartNowClick} className="w-full bg-gradient-to-r from-amber-400 to-amber-600 text-slate-900 font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:shadow-[0_0_30px_rgba(251,191,36,0.5)] transition-all">
              התחל עכשיו - {selectedProduct.price}
            </button>
          </div>
        </div>
      )}

      {/* Internal/Manager Info Modal */}
      {internalInfoProduct && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="bg-slate-900 border-2 border-rose-500/50 rounded-3xl p-8 max-w-2xl w-full shadow-[0_0_40px_rgba(244,63,94,0.15)] relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setInternalInfoProduct(null)} className="absolute top-4 left-4 text-slate-400 hover:text-white"><X className="w-6 h-6" /></button>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-rose-500/20 rounded-full flex items-center justify-center"><Lock className="w-8 h-8 text-rose-500" /></div>
            </div>
            <h3 className="text-3xl font-bold text-white text-center mb-2">מידע פנימי לאקדמיה</h3>
            <p className="text-center text-rose-400 mb-8 max-w-lg mx-auto font-medium">מודל תמחור ועבודה מול מאמנים - {internalInfoProduct.title}</p>
            
            <div className="space-y-4 mb-8">
              {internalInfoProduct.internalDetails.map((detail, idx) => (
                <div key={idx} className="bg-rose-950/30 p-5 rounded-xl border border-rose-500/20">
                  <div className="flex items-center gap-3 mb-2">{detail.icon}<h5 className="text-white font-bold text-lg">{detail.title}</h5></div>
                  <p className="text-sm text-slate-300 leading-relaxed pr-8">{detail.desc}</p>
                </div>
              ))}
            </div>
            <button onClick={() => setInternalInfoProduct(null)} className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-4 rounded-xl">סגור חלונית סודית</button>
          </div>
        </div>
      )}

      {/* WhatsApp Toast & Floating Button */}
      {showWaToast && (
        <div className="fixed bottom-24 left-6 z-50 bg-slate-800 text-white px-4 py-3 rounded-xl border border-green-500/30 shadow-2xl flex items-center gap-3 animate-pulse">
          <MessageCircle className="w-5 h-5 text-green-400" />
          <div className="text-sm">
            <p className="font-bold text-green-400">הקליק עבד!</p>
            <p className="text-slate-300">באתר האמיתי זה יפתח מיד את הוואטסאפ.</p>
          </div>
        </div>
      )}
      <a 
        href="https://wa.me/972555517516" target="_blank" rel="noopener noreferrer"
        onClick={(e) => { setShowWaToast(true); setTimeout(() => setShowWaToast(false), 4000); }}
        className="fixed bottom-6 left-6 z-50 flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-400 text-white rounded-full shadow-[0_0_20px_rgba(34,197,94,0.4)]"
      >
        <WhatsAppIcon className="w-8 h-8" />
      </a>

      <footer className="border-t border-white/5 mt-20 py-8 text-center text-slate-500 text-sm">
        <p>© 2026 Be the Way - אקדמיה לכלבנות. כל הזכויות שמורות.</p>
      </footer>

      {isAuthOpen && <AuthModal onClose={() => setIsAuthOpen(false)} defaultMode={authDefaultMode} />}
    </>
  );
};

// --- Dashboard (Protected) ---
const DashboardPage = () => {
  const { user } = useAuth();
  const { navigate } = useRouter();
  const [loading, setLoading] = useState(true);
  const [progressData, setProgressData] = useState(null);

  useEffect(() => {
    async function fetchDashboardData() {
      const { data } = await supabase.from('lessons').select('*');
      setProgressData({ 
        course: { title: 'האקדמיה לבעלי כלבים', totalLessons: data?.length || 0 }, 
        completed: 0 
      });
      setLoading(false);
    }
    fetchDashboardData();
  }, []);

  if (loading) return <div className="p-20 flex justify-center"><Loader2 className="w-10 h-10 animate-spin text-amber-500" /></div>;
  const progressPercent = progressData.course.totalLessons ? Math.round((progressData.completed / progressData.course.totalLessons) * 100) : 0;

  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8 animate-in fade-in duration-500">
        <h2 className="text-3xl font-bold text-white mb-10">שלום, {user.fullName} 👋</h2>
        <div className="bg-slate-900 border border-white/10 rounded-3xl p-8">
          <h3 className="text-2xl font-bold text-white mb-6">הקורס שלי</h3>
          <h4 className="text-xl text-white mb-2">{progressData.course.title}</h4>
          <div className="mb-6">
            <div className="w-full bg-slate-800 rounded-full h-2.5 mb-2 overflow-hidden">
              <div className="bg-gradient-to-l from-amber-600 to-amber-400 h-2.5 rounded-full" style={{ width: `${progressPercent}%` }}></div>
            </div>
            <p className="text-xs text-slate-500">השלמת {progressData.completed} מתוך {progressData.course.totalLessons} שיעורים</p>
          </div>
          <button onClick={() => navigate('/course')} className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-600 text-slate-900 font-bold py-3 px-8 rounded-xl">
            <Play className="w-5 h-5 fill-slate-900" /> המשך ללמוד
          </button>
        </div>
      </main>
    </>
  );
};
// --- Course Page (Protected) ---
const CoursePage = () => {
  const { navigate } = useRouter();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLessons() {
      try {
        const { data, error } = await supabase
          .from('lessons')
          .select('*')
          .order('lesson_number', { ascending: true });
        
        if (error) {
          console.error("Supabase Error:", error.message);
          setLessons([]);
        } else {
          setLessons(data || []);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLessons();
  }, []);

  if (loading) return <div className="p-20 flex justify-center"><Loader2 className="w-10 h-10 animate-spin text-amber-500" /></div>;

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8 animate-in fade-in duration-500 text-right">
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-slate-400 hover:text-amber-400 mb-8">
          <ArrowRight className="w-4 h-4" /> חזרה לדאשבורד
        </button>
        <h2 className="text-3xl font-bold text-white mb-8">רשימת שיעורים</h2>
        <div className="space-y-4">
          {lessons && lessons.length > 0 ? (
            lessons.map((lesson, idx) => (
              <div key={lesson.id} className="flex items-center p-5 rounded-2xl border bg-slate-900 border-white/5 hover:border-amber-500/30 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ml-5 bg-slate-800">
                  <span className="font-bold text-white">{lesson.lesson_number || (idx + 1)}</span>
                </div>
                <div className="flex-grow">
                  <h4 className="text-lg font-bold text-white">{lesson.title}</h4>
                </div>
                <div>
                  <button 
                    onClick={() => navigate('/lesson', { id: lesson.id })} 
                    className="bg-amber-500 text-slate-900 font-bold py-2 px-6 rounded-xl flex gap-2 items-center hover:scale-105 transition-transform"
                  >
                    <Play className="w-4 h-4 fill-slate-900"/> 
                    <span>התחל שיעור</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
             <div className="text-center py-20 bg-slate-900/50 rounded-3xl border border-dashed border-white/10">
              <p className="text-slate-500">עדיין לא הועלו שיעורים... או שיש בעיית התחברות. 🐶</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
};
// --- Lesson Page (Protected) ---
const LessonPage = () => {
  const { route, navigate } = useRouter();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);

  // משיכת הנתונים האמיתית מסופבאייס
  useEffect(() => {
    async function getLesson() {
      const { data } = await supabase.from('lessons').select('*').eq('id', route.params.id).single();
      setLesson(data);
      setLoading(false);
    }
    getLesson();
  }, [route.params.id]);

  const handleComplete = async () => {
    setCompleting(true);
    await api.markLessonCompleted(lesson?.id);
    setCompleting(false);
    navigate('/course'); 
  };

  if (loading) return <div className="p-20 flex justify-center"><Loader2 className="w-10 h-10 animate-spin text-amber-500" /></div>;
  if (!lesson) return null;

  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-8 animate-in fade-in duration-500 text-right">
        <button onClick={() => navigate('/course')} className="flex items-center gap-2 text-slate-400 hover:text-amber-400 mb-6"><ArrowRight className="w-4 h-4" /> חזרה לשיעורים</button>
        <div className="bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          
          {/* הנגן של באני נט */}
          <div className="aspect-video bg-black flex items-center justify-center">
            {lesson.video_url?.includes('http') ? (
              <iframe src={lesson.video_url} className="w-full h-full" allowFullScreen frameBorder="0"></iframe>
            ) : (
              <div className="text-center text-slate-500"><PlayCircle size={80} className="mb-4 opacity-20 mx-auto" /><p>הווידאו בטעינה או שטרם הועלה...</p></div>
            )}
          </div>

          <div className="p-8">
            <h2 className="text-3xl font-bold text-white mb-6">שיעור {lesson.lesson_number || lesson.number}: {lesson.title}</h2>
            <p className="text-slate-400 mb-8">צפייה מהנה באקדמיה! 🐶</p>
            <button onClick={handleComplete} disabled={completing} className="bg-green-500/10 hover:bg-green-500 text-green-400 hover:text-white font-bold py-3 px-8 rounded-xl border border-green-500/20 flex items-center gap-2">
              {completing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
              סמן כהושלם והמשך
            </button>
          </div>
        </div>
      </main>
    </>
  );
};

/// ==========================================
/// 6. MAIN APP (Router Setup)
/// ==========================================
const AppRouter = () => {
  const { route } = useRouter();
  switch (route.path) {
    case '/': return <LandingPage />;
    case '/dashboard': return <ProtectedRoute><DashboardPage /></ProtectedRoute>;
    case '/course': return <ProtectedRoute><CoursePage /></ProtectedRoute>;
    case '/lesson': return <ProtectedRoute><LessonPage /></ProtectedRoute>;
    default: return <LandingPage />;
  }
};

export default function App() {
  return (
    <div dir="rtl" className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-amber-500 selection:text-slate-900">
      <AppProviders>
        <AppRouter />
      </AppProviders>
    </div>
  );
}
