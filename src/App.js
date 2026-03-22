/* eslint-disable */
import React, { useState, useEffect, createContext, useContext } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Crown, Users, User, Star, ChevronLeft, Phone, PlayCircle, ShieldCheck, Video, MonitorPlay, MessageCircle, MapPin, ClipboardList, Link as LinkIcon, Lock, Unlock, EyeOff, Briefcase, FileText, X, Mail, Smartphone, LogIn, Loader2, LogOut, Play, Calendar, Clock, Bell, BookOpen, CheckCircle, ArrowRight, Check, Dog } from 'lucide-react';

// --- חיבור אמיתי לסופבאייס ---
const SUPABASE_URL = 'https://yrlkfgjguhvxcenigwob.supabase.co';
const SUPABASE_KEY = 'sb_publishable_vaq0deuZkoIoGk7jCZ5T5w__s7A-f9A-5989182245';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

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
    setUser({ id: '1', fullName: 'משה בן שבו', email });
    setAuthLoading(false);
    navigate('/dashboard');
  };

  const logout = () => { setUser(null); navigate('/'); };

  return (
    <AuthContext.Provider value={{ user, authLoading, login, logout, isManagerMode, setIsManagerMode }}>
      <RouterContext.Provider value={{ route, navigate }}>{children}</RouterContext.Provider>
    </AuthContext.Provider>
  );
};

const Header = ({ onOpenAuth }) => {
  const { user, logout, isManagerMode, setIsManagerMode } = useContext(AuthContext);
  const { route, navigate } = useContext(RouterContext);
  return (
    <nav className="border-b border-white/10 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50 p-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between text-right">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center shadow-lg"><Dog className="text-slate-900" /></div>
          <div>
            <h1 className="text-xl font-bold text-white">Be The Way Academy</h1>
            <p className="text-[10px] text-amber-500 font-bold tracking-widest uppercase">אקדמיית בעלי הכלבים</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {!user ? <button onClick={onOpenAuth} className="text-amber-500 font-bold border border-amber-500 px-6 py-2 rounded-full hover:bg-amber-500 hover:text-slate-900 transition-all">התחברות</button> :
          <button onClick={logout} className="text-slate-400 hover:text-white flex items-center gap-2"><LogOut size={18} /> התנתקות</button>}
        </div>
      </div>
    </nav>
  );
};

const LandingPage = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const { login } = useContext(AuthContext);
  const products = [
    { id: 1, title: 'תוכנית ליווי קבוצתית', subtitle: 'הכוח של הלהקה', icon: <Users className="w-10 h-10 text-amber-400" />, features: ['4 כנסי זום', 'קורס דיגיטלי', '4 מפגשי ליווי אישי'], price: '₪2,400' },
    { id: 2, title: 'ליווי VIP פרטני', subtitle: 'יחס אישי וממוקד', icon: <User className="w-10 h-10 text-amber-400" />, features: ['6 מפגשי אימון', 'קורס דיגיטלי מלא', 'פרוטוקול עבודה'], price: 'בהתאמה אישית' }
  ];

  return (
    <div className="min-h-screen">
      <Header onOpenAuth={() => setIsAuthOpen(true)} />
      <div className="text-center py-24 px-4">
        <h2 className="text-6xl md:text-8xl font-extrabold text-white mb-6">הדרך <span className="text-amber-500">הנכונה</span> לכלב המושלם</h2>
        <button onClick={() => setIsAuthOpen(true)} className="bg-amber-500 text-slate-950 font-bold px-12 py-5 rounded-2xl text-2xl shadow-xl hover:scale-105 transition-transform">כניסה לאקדמיה 🚀</button>
      </div>
      <section className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-4 pb-20">
        {products.map(p => (
          <div key={p.id} className="bg-slate-900 border border-white/10 p-8 rounded-[2.5rem] flex flex-col hover:border-amber-500/50 transition-colors">
            <div className="mb-6">{p.icon}</div>
            <h4 className="text-2xl font-bold text-white mb-2">{p.title}</h4>
            <p className="text-amber-400 text-sm mb-6">{p.subtitle}</p>
            <div className="space-y-3 mb-8 flex-grow">
              {p.features.map((f, i) => <div key={i} className="flex gap-2 text-slate-400"><CheckCircle className="text-amber-500 w-5 h-5" /> {f}</div>)}
            </div>
            <button onClick={() => setIsAuthOpen(true)} className="w-full bg-white/5 text-white font-bold py-4 rounded-xl hover:bg-amber-500 hover:text-slate-900 transition-all">התחל עכשיו - {p.price}</button>
          </div>
        ))}
      </section>
      {isAuthOpen && <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[100] backdrop-blur-md">
        <div className="bg-slate-900 p-10 rounded-3xl w-full max-w-md border border-white/10 text-center text-right">
          <h3 className="text-3xl text-white font-bold mb-8">ברוכים הבאים לאקדמיה</h3>
          <button onClick={login} className="w-full bg-amber-500 py-4 rounded-xl font-bold text-slate-900 text-lg hover:bg-amber-400 transition-colors">כניסה מהירה למערכת</button>
          <button onClick={() => setIsAuthOpen(false)} className="mt-4 text-slate-500 hover:text-white">סגור</button>
        </div>
      </div>}
    </div>
  );
};

const DashboardPage = () => {
  const { user } = useContext(AuthContext);
  const { navigate } = useContext(RouterContext);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLessons() {
      const { data } = await supabase.from('lessons').select('*').order('lesson_number');
      setLessons(data || []);
      setLoading(false);
    }
    fetchLessons();
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-4xl mx-auto p-8 text-right">
        <h2 className="text-4xl text-white font-bold mb-10">שלום, {user.fullName} 👋</h2>
        <div className="space-y-4 text-right">
          {loading ? <div className="flex justify-center py-20"><Loader2 className="animate-spin text-amber-500" size={40} /></div> : 
           lessons.map(l => (
            <div key={l.id} className="bg-slate-900 border border-white/10 p-8 rounded-[2rem] flex flex-col sm:flex-row justify-between items-center shadow-lg hover:border-amber-500/50 transition-all">
              <div className="flex items-center gap-6 mb-4 sm:mb-0">
                <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center font-bold text-xl">{l.lesson_number}</div>
                <h3 className="text-2xl text-white font-bold">{l.title}</h3>
              </div>
              <button onClick={() => navigate('/lesson', { id: l.id })} className="bg-amber-500 text-slate-900 px-8 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-amber-400 transition-colors"><Play size={18} fill="currentColor" /> צפה בשיעור</button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

const LessonPage = () => {
  const { route, navigate } = useContext(RouterContext);
  const [lesson, setLesson] = useState(null);

  useEffect(() => {
    async function getLesson() {
      const { data } = await supabase.from('lessons').select('*').eq('id', route.params.id).single();
      setLesson(data);
    }
    getLesson();
  }, [route.params.id]);

  if (!lesson) return null;

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-5xl mx-auto p-8 text-right">
        <button onClick={() => navigate('/dashboard')} className="text-slate-400 mb-8 flex items-center gap-2 hover:text-white transition-colors text-lg inline-flex"> <ArrowRight size={20} /> חזרה לדאשבורד</button>
        <div className="bg-slate-900 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl">
          <div className="aspect-video bg-black flex items-center justify-center">
            {lesson.video_url?.includes('http') ? (
              <iframe src={lesson.video_url} className="w-full h-full" allowFullScreen border="0"></iframe>
            ) : <div className="text-center text-slate-500"><PlayCircle size={80} className="mb-4 opacity-20 mx-auto" /><p>הווידאו בטעינה או שטרם הועלה...</p></div>}
          </div>
          <div className="p-10">
            <h2 className="text-4xl text-white font-bold mb-4">שיעור {lesson.lesson_number}: {lesson.title}</h2>
          </div>
        </div>
      </main>
    </div>
  );
};

const AppRouter = () => {
  const { route } = useContext(RouterContext);
  switch (route.path) {
    case '/': return <LandingPage />;
    case '/dashboard': return <DashboardPage />;
    case '/lesson': return <LessonPage />;
    default: return <LandingPage />;
  }
};

export default function App() {
  return (
    <div dir="rtl" className="min-h-screen bg-slate-950 text-slate-200 selection:bg-amber-500 selection:text-slate-950 font-sans">
      <AppProviders><AppRouter /></AppProviders>
    </div>
  );
}
