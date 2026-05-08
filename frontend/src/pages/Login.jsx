import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight,
  BookOpen,
  ShieldCheck,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { authAPI } from '../api/auth';
import toast from 'react-hot-toast';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authAPI.login(formData);
      if (response.data.status === 'success') {
        toast.success('System Access Granted. Welcome back.');
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
        navigate('/');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Identity verification failed.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
         <div className="absolute -top-[15%] -left-[10%] w-[50%] h-[50%] bg-green-50 rounded-full blur-[140px] opacity-60" />
         <div className="absolute -bottom-[15%] -right-[10%] w-[50%] h-[50%] bg-emerald-50 rounded-full blur-[140px] opacity-60" />
      </div>

      <div className="max-w-[1400px] w-full h-full lg:h-[850px] grid grid-cols-1 lg:grid-cols-2 bg-white lg:rounded-[48px] shadow-2xl shadow-green-900/10 lg:border lg:border-gray-100 overflow-hidden relative z-10">
        
        {/* Left Side: Branding Visuals */}
        <div className="hidden lg:flex flex-col justify-between p-16 bg-[#166534] relative overflow-hidden">
           {/* Grid Pattern */}
           <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
           
           <div className="relative z-10">
              <div className="flex items-center space-x-4 mb-16">
                 <div className="bg-[#22c55e] p-3 rounded-2xl shadow-2xl shadow-green-900/40">
                   <BookOpen className="h-8 w-8 text-white" />
                 </div>
                 <span className="text-2xl font-black tracking-tight text-white uppercase italic">
                   Admin<span className="text-[#22c55e]">Pro</span>
                 </span>
              </div>
              <h2 className="text-6xl font-black text-white leading-[1.1]">
                Command <br />
                <span className="text-[#22c55e]">Center</span>
              </h2>
              <p className="text-green-100/60 mt-8 text-xl max-w-sm font-medium leading-relaxed">
                Unlock the central hub for bookshop logistics, payroll analytics, and system configurations.
              </p>
           </div>

           <div className="relative z-10">
              <div className="flex items-center space-x-4 group cursor-pointer bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl w-fit">
                 <div className="h-12 w-12 rounded-2xl bg-[#22c55e] flex items-center justify-center font-bold text-white shadow-lg">
                    L3
                 </div>
                 <div>
                    <p className="text-sm font-black text-white uppercase tracking-widest">Level 3 Clearance</p>
                    <p className="text-xs text-green-100/40 font-bold mt-0.5">Encrypted Session Active</p>
                 </div>
                 <ChevronRight className="h-5 w-5 text-white/20 group-hover:text-white transition-colors" />
              </div>
           </div>

           {/* Large Background Icon */}
           <ShieldCheck className="absolute -right-16 -bottom-16 h-64 w-64 text-white/5 rotate-12" />
        </div>

        {/* Right Side: Authentication Form */}
        <div className="p-8 lg:p-20 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-12">
              <div className="lg:hidden flex items-center space-x-2 mb-8">
                 <div className="bg-[#22c55e] p-2 rounded-xl">
                   <BookOpen className="h-6 w-6 text-white" />
                 </div>
                 <span className="text-xl font-black tracking-tight text-gray-900 italic">AdminPro</span>
              </div>
              <h3 className="text-4xl font-black text-gray-900 tracking-tight">System Login</h3>
              <p className="text-gray-500 mt-2 font-medium">Verify your identity to proceed</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Identity Key</label>
                <div className="relative group">
                   <Mail className="absolute left-5 top-5 h-5 w-5 text-gray-400 group-focus-within:text-[#22c55e] transition-colors" />
                   <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="admin@system.local"
                    className="w-full pl-14 pr-6 py-5 bg-gray-50 border-none rounded-[24px] font-bold text-gray-900 focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
                   />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Security Secret</label>
                  <button type="button" className="text-[10px] font-black text-[#22c55e] hover:underline uppercase tracking-widest">Restore</button>
                </div>
                <div className="relative group">
                   <Lock className="absolute left-5 top-5 h-5 w-5 text-gray-400 group-focus-within:text-[#22c55e] transition-colors" />
                   <input 
                    type={showPassword ? 'text' : 'password'} 
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="••••••••••••"
                    className="w-full pl-14 pr-14 py-5 bg-gray-50 border-none rounded-[24px] font-bold text-gray-900 focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
                   />
                   <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-5 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                   >
                     {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                   </button>
                </div>
              </div>

              <div className="flex items-center space-x-3 px-1">
                 <div className="relative flex items-center">
                    <input type="checkbox" id="remember" className="peer h-5 w-5 opacity-0 absolute cursor-pointer" />
                    <div className="h-5 w-5 border-2 border-gray-200 rounded-lg peer-checked:bg-[#22c55e] peer-checked:border-[#22c55e] transition-all flex items-center justify-center">
                       <div className="h-2 w-2 bg-white rounded-full opacity-0 peer-checked:opacity-100 transition-opacity" />
                    </div>
                 </div>
                 <label htmlFor="remember" className="text-sm font-bold text-gray-500 cursor-pointer">Remember this terminal</label>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className={`w-full bg-[#166534] hover:bg-[#114d27] text-white py-6 rounded-[28px] font-black text-xl flex items-center justify-center gap-3 shadow-2xl shadow-green-900/10 transition-all active:scale-95 mt-4 ${loading ? 'opacity-70 cursor-not-allowed' : 'group'}`}
              >
                {loading ? 'Verifying...' : 'Access System'}
                {!loading && <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>

            <div className="mt-12 text-center">
              <p className="text-gray-500 font-bold">
                New system administrator? {' '}
                <Link to="/register" className="text-[#22c55e] hover:underline">Enroll Here</Link>
              </p>
            </div>
            
            <div className="mt-16 pt-12 border-t border-gray-50 flex items-center justify-center gap-8 grayscale opacity-40">
               <Sparkles className="h-6 w-6" />
               <ShieldCheck className="h-6 w-6" />
               <BookOpen className="h-6 w-6" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
