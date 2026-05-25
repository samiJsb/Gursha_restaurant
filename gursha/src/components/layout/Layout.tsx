import React from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  BarChart3, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Plus,
  ArrowLeft,
  Store,
  Clock,
  Activity,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick: () => void;
}

function SidebarItem({ icon: Icon, label, active, onClick }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-4 py-3 text-[10px] font-black uppercase tracking-widest transition-all duration-200 border-l-2 cursor-pointer ${
        active 
          ? "text-amber-500 border-amber-500 bg-amber-500/5" 
          : "text-zinc-500 border-transparent hover:text-white"
      }`}
    >
      <Icon className="w-4 h-4 shrink-0" />
      <span>{label}</span>
      {active && (
        <motion.div
          layoutId="active-dot"
          className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(217,119,6,0.6)]"
        />
      )}
    </button>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const { profile, logout } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = React.useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle support of fast sandbox bypasses 
  const bypassUser = localStorage.getItem('GURSHA_SANDBOX_USER');
  const activeProfile = bypassUser ? JSON.parse(bypassUser) : profile;

  const menuItems = [
    { icon: LayoutDashboard, label: 'Control Room', path: '/admin' },
    { icon: BarChart3, label: 'Financial Audits', path: '/analytics' },
    { icon: Settings, label: 'Client Config', path: '/settings' },
  ];

  const currentPathLabel = menuItems.find(i => i.path === location.pathname)?.label || 'Operations';

  const handleAdminLogout = () => {
    localStorage.removeItem('GURSHA_SANDBOX_USER');
    logout();
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-[#070709] text-white font-sans overflow-hidden">
      
      {/* Sidebar navigation drawer */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 240 : 0 }}
        className="relative flex flex-col h-full bg-[#0A0A0D] border-r border-white/5 overflow-hidden shrink-0"
      >
        <div className="flex flex-col h-20 px-8 justify-center border-b border-white/5">
          <div className="text-[8px] tracking-[0.25em] font-black text-amber-500 uppercase">SYS_NODE_LOC: BOLE</div>
          <div className="text-md font-sans font-black tracking-tight text-white mt-0.5">GURSHA PREMIUM</div>
        </div>

        <nav className="flex-1 py-10 space-y-2">
          <SidebarItem
            icon={LayoutDashboard}
            label="Control Room"
            active={location.pathname === '/admin'}
            onClick={() => navigate('/admin')}
          />
          <SidebarItem
            icon={BarChart3}
            label="Financial Audits"
            active={location.pathname === '/analytics'}
            onClick={() => navigate('/analytics')}
          />
          <SidebarItem
            icon={Settings}
            label="Client Config"
            active={location.pathname === '/settings'}
            onClick={() => navigate('/settings')}
          />

          {/* Quick return to public menu section */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 w-full px-4 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-all border-l-2 border-transparent mt-12 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 shrink-0 text-amber-500" />
            <span>Public Website</span>
          </button>
        </nav>

        <div className="p-6 space-y-4 border-t border-white/5 bg-[#08080A]">
          <div className="p-4 bg-zinc-950/80 border border-white/5 rounded-xl">
            <span className="text-[8px] uppercase tracking-widest text-zinc-500 block mb-1">Server State</span>
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse mr-0.5" />
              <span className="text-[9px] font-mono text-white uppercase tracking-wider">Node Stable</span>
            </div>
          </div>
          
          {activeProfile && (
            <div className="flex items-center gap-3 px-1.5 pt-2">
              <UserCheck className="w-5 h-5 text-amber-500 shrink-0" />
              <div className="overflow-hidden">
                <p className="text-[9px] font-black text-white truncate uppercase tracking-widest">{activeProfile.displayName}</p>
                <button 
                  onClick={handleAdminLogout} 
                  className="text-[8px] text-red-400 hover:text-red-300 uppercase font-black tracking-wider transition-colors block mt-0.5 cursor-pointer"
                >
                  Terminate session
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.aside>

      {/* Main Content Arena */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Header toolbar */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#09090C]/50 backdrop-blur-xl">
          <div className="flex items-center space-x-3 text-[9px] font-mono uppercase tracking-widest text-zinc-500">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="hover:text-white transition-colors cursor-pointer text-amber-500 font-bold">Menu</button>
            <span className="text-zinc-800">/</span>
            <span className="text-white font-bold">{currentPathLabel.toUpperCase()}</span>
          </div>

          <div className="flex items-center space-x-6 text-[10px] font-bold uppercase tracking-widest font-mono">
            <div className="flex flex-col items-end">
              <span className="text-zinc-600 font-bold text-[8px]">Uptime score</span>
              <span className="text-emerald-400 font-bold">99.992%</span>
            </div>
            <div className="w-[1px] h-6 bg-white/5"></div>
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black px-4 py-2.5 rounded-xl text-[9px] font-black tracking-widest transition-all"
            >
              <Store className="w-3.5 h-3.5" />
              DINING CATALOG
            </button>
          </div>
        </header>

        {/* Outer scrolling content body */}
        <div className="flex-1 overflow-y-auto p-8 md:p-10 pb-32">
          {children}
        </div>

        {/* Mini diagnostics system dock trailing line footer */}
        <footer className="bg-[#050508]/90 backdrop-blur-md border-t border-white/5 px-8 py-3 flex items-center justify-between z-[50]">
          <div className="flex items-center gap-6 text-[8px] font-black uppercase tracking-widest font-mono text-zinc-600">
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-emerald-400">REST API Stable</span>
            </div>
            <div className="h-3 w-[1px] bg-white/10" />
            <div>
              Platform: <span className="text-zinc-400">PRISMA + EXPRESS + VITE</span>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-[8px] font-mono font-bold uppercase tracking-widest text-zinc-700">
            <span>SECURE_JWT: ALIGN</span>
            <span>CHAPA_WEBHOOK: HOOKED</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
