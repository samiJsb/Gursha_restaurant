import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { Sparkles, Utensils, Shield, Key, ChevronRight, CheckCircle } from 'lucide-react';

export default function Login() {
  const { user, loginWithGoogle, loading } = useAuth();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState<string | null>(null);

  // In-memory bypass for local testers/hirers to demo admin controls easily
  const [bypassSuccess, setBypassSuccess] = useState(false);

  if (loading) return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#070709]">
      <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  // If already logged in, go straight to public landing or operations control
  if (user || bypassSuccess) {
    return <Navigate to="/admin" replace />;
  }

  // Handle immediate sandbox profile injection to bypass iframe Google blockers
  const triggerSandboxBypass = (role: 'Owner/Admin' | 'Kitchen Manager' | 'Staff Cashier') => {
    localStorage.setItem('GURSHA_SANDBOX_USER', JSON.stringify({
      uid: 'bypass-889',
      displayName: `Samuel (${role})`,
      email: 'hiring-manager@gurshapremium.com',
      role: 'admin',
      roleTag: role
    }));
    setBypassSuccess(true);
  };

  return (
    <div className="min-h-screen bg-[#070709] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      
      {/* Cinematic Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(217,119,6,0.06)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="relative z-10 w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#0B0B0E] border border-white/5 p-8 md:p-10 rounded-2xl shadow-[0_15px_60px_rgba(0,0,0,0.8)]"
        >
          {/* Brand Panel */}
          <div className="text-center mb-8 space-y-3">
            <div className="inline-flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center shadow-[0_0_15px_rgba(217,119,6,0.3)]">
                <Utensils className="w-5 h-5 text-black" />
              </div>
              <div className="text-left">
                <h2 className="text-md font-black uppercase tracking-[0.2em] text-white">GURSHA</h2>
                <p className="text-[8px] font-bold text-amber-500 uppercase tracking-widest -mt-1">Addis Premium Dining</p>
              </div>
            </div>
            <div className="h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent w-full" />
            <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">
              Restaurant Management & Operations Control
            </p>
          </div>

          <div className="space-y-6">
            
            <div className="p-4 bg-zinc-950/80 border border-white/5 rounded-xl border-l-4 border-l-amber-500">
              <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest block mb-1">Preview Terminal Mode</span>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse mr-1" />
                <span className="text-[9px] font-mono text-white uppercase tracking-wider">Awaiting Staff Credentials...</span>
              </div>
            </div>

            {/* Standard Signature */}
            <button
              onClick={async () => {
                try {
                  await loginWithGoogle();
                } catch (e: any) {
                  setAuthError("Auth popup was blocked by browser framing. Please use the preset bypass roles below to evaluate!");
                }
              }}
              className="w-full py-4 bg-amber-500 text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-400 transition-all shadow-[0_4px_25px_rgba(217,119,6,0.15)] flex items-center justify-center gap-2"
            >
              Sign In with Google Cloud
            </button>

            {authError && (
              <p className="text-[8px] text-amber-500/80 uppercase tracking-wider text-center font-bold">
                {authError}
              </p>
            )}

            {/* Sandbox Quick Access Roles */}
            <div className="pt-6 border-t border-white/5 space-y-3">
              <span className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.2em] block">
                Instant Sandboxed Roles for Reviewers
              </span>
              
              <div className="space-y-2">
                {[
                  { title: 'Owner/Admin', desc: 'Full business sales insights, database logs & configuration', role: 'Owner/Admin' },
                  { title: 'Kitchen Manager', desc: 'Order preparations queue, telemetry & custom menu CRUD', role: 'Kitchen Manager' },
                  { title: 'Staff Cashier', desc: 'Fulfillment checks, delivery registers & receipts', role: 'Staff Cashier' }
                ].map(profile => (
                  <button
                    key={profile.title}
                    onClick={() => triggerSandboxBypass(profile.role as any)}
                    className="w-full text-left p-3.5 bg-zinc-900 hover:bg-zinc-850 border border-white/5 hover:border-amber-500/20 rounded-xl flex items-center justify-between transition-all group"
                  >
                    <div>
                      <h4 className="text-[10px] font-black text-white uppercase tracking-wider group-hover:text-amber-500 transition-colors">
                        {profile.title}
                      </h4>
                      <p className="text-[8px] text-zinc-400 uppercase tracking-tighter mt-0.5 line-clamp-1">
                        {profile.desc}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
                  </button>
                ))}
              </div>
            </div>

            {/* Micro details */}
            <div className="pt-4 flex justify-between text-[8px] font-mono text-zinc-500 uppercase tracking-widest">
              <span>PROD_GATEWAY: READY</span>
              <span>API_VER: 1.0.0</span>
            </div>
          </div>
        </motion.div>
        
        <p className="text-center mt-8 text-[9px] font-medium text-zinc-500 uppercase tracking-[0.25em] opacity-55">
          Gursha Premium &copy; {new Date().getFullYear()} &middot; Designed for Ethiopia
        </p>
      </div>
    </div>
  );
}
