import React, { useState, useEffect, createContext, useContext } from 'react';
import { Crown, Users, User, Star, ChevronLeft, Phone, PlayCircle, ShieldCheck, Video, MonitorPlay, MessageCircle, MapPin, ClipboardList, Link as LinkIcon, Lock, Unlock, EyeOff, Briefcase, FileText, X, Mail, Smartphone, LogIn, Loader2, LogOut, Play, Calendar, Clock, Bell, BookOpen, CheckCircle, ArrowRight, Check } from 'lucide-react';

/// ==========================================
/// 1. MOCK DATA LAYER (הכנה ל-Database)
/// ==========================================
const MOCK_DB = {
  users: [{ id: '1', email: 'test@betheway.co.il', fullName: 'ישראל ישראלי' }],
  products: [
    {
      id: 'p1', title: 'תוכנית ליווי קבוצתית', subtitle: 'הכוח של הלהקה',
      description: 'תוכנית הדגל שלנו הבנויה מ-4 שכבות עבודה עוצמתיות: כנסי זום, קורס דיגיטלי, ליווי אישי צמוד, ומעטפת פולואפים ליצירת תוצאות מובטחות בשטח.',
      price: 'החל מ-₪2,400',
      features: ['4 כנסי זום חווייתיים', '3 פרקי קורס דיגיטלי', '4 מפגשי ליווי אישי בשטח', 'פולואפים (טלפון/וואטסאפ)']
    },
    {
      id: 'p2', title: 'תהליך ליווי פרטני', subtitle: 'יחס אישי וממוקד',
      description: 'ליווי אישי של אחד על אחד במתכונת VIP. התהליך משלב קורס דיגיטלי מקיף יחד עם סדרת מפגשי אימון פרטניים.',
      price: 'בהתאמה אישית',
      features: ['קורס דיגיטלי מקיף', '6 מפגשי אימון פרטניים', 'עבודה ע"פ פרוטוקול מובנה', 'סנכרון מלא לתכני הקורס']
    }
  ],
  course: { id: 'c1', title: 'שלב איזון: יסודות המנהיגות השקטה', totalLessons: 5 },
  lessons: [
    { id: 'l1', number: '01', title: 'מבוא - שפת הגוף של הכלב', duration: '12:00' },
    { id: 'l2', number: '02', title: 'פקודת "אלי" - קריאה אמינה', duration: '18:30' },
    { id: 'l3', number: '03', title: 'הליכה נכונה בטיול ללא משיכות', duration: '22:15' },
    { id: 'l4', number: '04', title: 'מניעת קפיצות על אורחים בבית', duration: '15:40' },
    { id: 'l5', number: '05', title: 'סיכום השלב ושיעורי בית למפגש הבא', duration: '08:20' }
  ],
  userProgress: { completedLessonIds: ['l1'] } // סימולציה של התקדמות המשתמש
};

/// ==========================================
/// 2. SERVICES LAYER (הכנה ל-Supabase API)
/// ==========================================
const api = {
  // Auth Services
  signIn: async (email, password) => {
    return new Promise(resolve => setTimeout(() => resolve({ user: MOCK_DB.users[0] }), 1000));
  },
  signUp: async (userData) => {
    return new Promise(resolve => setTimeout(() => resolve({ user: { id: '2', ...userData } }), 1000));
  },
  signInWithGoogle: async () => {
    return new Promise(resolve => setTimeout(() => resolve({ user: { id: '3', fullName: 'משתמש גוגל', email: 'google@test.com' } }), 1000));
  },
  // Data Services
  getProducts: async () => new Promise(resolve => setTimeout(() => resolve(MOCK_DB.products), 500)),
  getCourseData: async () => new Promise(resolve => setTimeout(() => resolve(MOCK_DB.course), 500)),
  getLessons: async () => new Promise(resolve => setTimeout(() => resolve(MOCK_DB.lessons), 500)),
  getUserProgress: async () => new Promise(resolve => setTimeout(() => resolve(MOCK_DB.userProgress), 500)),
  markLessonCompleted: async (lessonId) => {
    return new Promise(resolve => setTimeout(() => {
      if (!MOCK_DB.userProgress.completedLessonIds.includes(lessonId)) {
        MOCK_DB.userProgress.completedLessonIds.push(lessonId);
      }
      resolve(MOCK_DB.userProgress);
    }, 500));
  }
};

/// ==========================================
/// 3. CONTEXTS (State Management & Routing)
/// ==========================================
const AuthContext = createContext();
const RouterContext = createContext();

const AppProviders = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  
  // Custom Router State
  const [route, setRoute] = useState({ path: '/', params: {} });
  const navigate = (path, params = {}) => {
    setRoute({ path, params });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auth Functions
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
    <AuthContext.Provider value={{ user, authLoading, login, register, logout, socialLogin }}>
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

// --- Protected Route Wrapper ---
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

// --- Header / Navbar ---
const Header = ({ onOpenAuth }) => {
  const { user, logout } = useAuth();
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
              <button className="hidden md:flex items-center gap-2 bg-transparent border border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-slate-900 transition-all duration-300 px-6 py-2 rounded-full font-medium">
                <Phone className="w-4 h-4" />
                <span>תיאום פגישת ייעוץ</span>
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

// --- Auth Modal ---
const AuthModal = ({ onClose }) => {
  const { login, register, socialLogin, authLoading } = useAuth();
  const [mode, setMode] = useState('login');
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

/// ==========================================
/// 5. PAGES
/// ==========================================

// --- Landing Page (Public) ---
const LandingPage = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.getProducts().then(setProducts);
  }, []);

  return (
    <>
      <Header onOpenAuth={() => setIsAuthOpen(true)} />
      <header className="relative py-24 px-4 text-center">
        <h2 className="text-5xl md:text-7xl font-extrabold text-white mb-4">הדרך <span className="text-transparent bg-clip-text bg-gradient-to-l from-amber-300 to-amber-600">הנכונה</span> לכלב המושלם</h2>
        <h3 className="text-2xl font-bold text-amber-400 mb-8">זה לא קסם, זו שיטה שעובדת</h3>
      </header>
      
      <section className="py-16 px-4 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {products.map(p => (
          <div key={p.id} className="bg-slate-900 border border-white/10 rounded-3xl p-8 flex flex-col">
            <h4 className="text-2xl font-bold text-white mb-2">{p.title}</h4>
            <p className="text-amber-400 text-sm mb-4">{p.subtitle}</p>
            <p className="text-slate-400 mb-8 flex-grow">{p.description}</p>
            <button onClick={() => setIsAuthOpen(true)} className="w-full bg-gradient-to-r from-amber-400 to-amber-600 text-slate-900 font-bold py-4 rounded-xl">
              התחל עכשיו
            </button>
          </div>
        ))}
      </section>
      {isAuthOpen && <AuthModal onClose={() => setIsAuthOpen(false)} />}
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
    Promise.all([api.getCourseData(), api.getUserProgress()]).then(([course, prog]) => {
      setProgressData({ course, completed: prog.completedLessonIds.length });
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-20 flex justify-center"><Loader2 className="w-10 h-10 animate-spin text-amber-500" /></div>;

  const progressPercent = Math.round((progressData.completed / progressData.course.totalLessons) * 100);

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
              <div className="bg-gradient-to-l from-amber-600 to-amber-400 h-2.5 rounded-full transition-all duration-1000" style={{ width: `${progressPercent}%` }}></div>
            </div>
            <p className="text-xs text-slate-500">השלמת {progressData.completed} מתוך {progressData.course.totalLessons} שיעורים</p>
          </div>

          <button onClick={() => navigate('/course', { id: progressData.course.id })} className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-600 text-slate-900 font-bold py-3 px-8 rounded-xl">
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
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getLessons(), api.getUserProgress()]).then(([les, prog]) => {
      setLessons(les);
      setProgress(prog.completedLessonIds);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-20 flex justify-center"><Loader2 className="w-10 h-10 animate-spin text-amber-500" /></div>;

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8 animate-in fade-in duration-500">
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-slate-400 hover:text-amber-400 mb-8"><ArrowRight className="w-4 h-4" /> חזרה לדאשבורד</button>
        <h2 className="text-3xl font-bold text-white mb-8">רשימת שיעורים</h2>
        
        <div className="space-y-4">
          {lessons.map((lesson, idx) => {
            const isCompleted = progress.includes(lesson.id);
            const isOpen = isCompleted || idx === 0 || progress.includes(lessons[idx - 1].id);
            const statusStr = isCompleted ? 'completed' : isOpen ? 'open' : 'locked';

            return (
              <div key={lesson.id} className={`flex items-center p-5 rounded-2xl border ${statusStr === 'open' ? 'bg-slate-800 border-amber-500/30' : 'bg-slate-900 border-white/5'}`}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ml-5 bg-slate-800"><span className="font-bold text-white">{lesson.number}</span></div>
                <div className="flex-grow">
                  <h4 className={`text-lg font-bold ${statusStr === 'locked' ? 'text-slate-500' : 'text-white'}`}>{lesson.title}</h4>
                </div>
                <div>
                  {statusStr === 'completed' && <div className="text-green-400 px-4 py-2 bg-green-500/10 rounded-full flex gap-2"><Check className="w-4 h-4"/> הושלם</div>}
                  {statusStr === 'open' && <button onClick={() => navigate('/lesson', { id: lesson.id })} className="bg-amber-500 text-slate-900 font-bold py-2 px-6 rounded-xl flex gap-2"><Play className="w-4 h-4 fill-slate-900"/> התחל שיעור</button>}
                  {statusStr === 'locked' && <div className="text-slate-500 px-4 py-2 bg-slate-800 rounded-full flex gap-2"><Lock className="w-4 h-4"/> נעול</div>}
                </div>
              </div>
            );
          })}
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

  useEffect(() => {
    api.getLessons().then(lessons => {
      setLesson(lessons.find(l => l.id === route.params.id) || lessons[0]);
      setLoading(false);
    });
  }, [route.params.id]);

  const handleComplete = async () => {
    setCompleting(true);
    await api.markLessonCompleted(lesson.id);
    setCompleting(false);
    navigate('/course'); // חוזר לרשימה אחרי שסומן
  };

  if (loading) return <div className="p-20 flex justify-center"><Loader2 className="w-10 h-10 animate-spin text-amber-500" /></div>;

  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-8 animate-in fade-in duration-500">
        <button onClick={() => navigate('/course')} className="flex items-center gap-2 text-slate-400 hover:text-amber-400 mb-6"><ArrowRight className="w-4 h-4" /> חזרה לשיעורים</button>
        
        <div className="bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <div className="w-full aspect-video bg-slate-950 flex items-center justify-center">
            <PlayCircle className="w-20 h-20 text-amber-500 opacity-50" />
          </div>
          <div className="p-8">
            <h2 className="text-3xl font-bold text-white mb-6">שיעור {lesson.number}: {lesson.title}</h2>
            <p className="text-slate-400 mb-8">תוכן השיעור יופיע כאן... 🐶</p>
            
            <button onClick={handleComplete} disabled={completing} className="bg-green-500/10 hover:bg-green-500 text-green-400 hover:text-white font-bold py-3 px-8 rounded-xl border border-green-500/20 flex items-center gap-2 transition-colors">
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

  // Simple Switch Based Router
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
