import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Mail, 
  Lock, 
  User,
  Phone,
  ArrowRight,
  BookOpen,
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { authAPI } from '../api/auth';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Security keys do not match.');
      return;
    }

    // Phone validation (10 digits starting with 07)
    const phoneRegex = /^07\d{8}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error('Phone number must be 10 digits and start with 07.');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });

      if (response.data.status === 'success') {
        toast.success('Admin Enrollment Successful! Access Granted.');
        // Store token if needed, or just redirect
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
        setTimeout(() => navigate('/'), 1500);
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Enrollment failed. Please check credentials.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
         <div className="absolute -top-[15%] -right-[10%] w-[50%] h-[50%] bg-green-50 rounded-full blur-[140px] opacity-60" />
         <div className="absolute -bottom-[15%] -left-[10%] w-[50%] h-[50%] bg-emerald-50 rounded-full blur-[140px] opacity-60" />
      </div>

      <div className="max-w-[1400px] w-full h-full lg:h-[850px] grid grid-cols-1 lg:grid-cols-2 bg-white lg:rounded-[48px] shadow-2xl shadow-green-900/10 lg:border lg:border-gray-100 overflow-hidden relative z-10">
        
        {/* Left Side: Branding (Mirrors Login) */}
        <div className="hidden lg:flex flex-col justify-between p-16 bg-[#166534] relative overflow-hidden">
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
                System <br />
                <span className="text-[#22c55e]">Enrollment</span>
              </h2>
              <p className="text-green-100/60 mt-8 text-xl max-w-sm font-medium leading-relaxed">
                Join the elite administration team. Request your credentials to manage the global bookshop ecosystem.
              </p>
           </div>

           <div className="relative z-10">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-[32px] inline-block">
                 <div className="flex items-center gap-4 mb-4">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                       <ShieldCheck className="h-5 w-5 text-[#22c55e]" />
                    </div>
                    <span className="text-sm font-black text-white uppercase tracking-widest">Security Protocol</span>
                 </div>
                 <p className="text-sm text-green-100/60 font-medium">All new accounts require Level-3 senior administrator verification before system access is granted.</p>
              </div>
           </div>

           <Sparkles className="absolute -right-16 -bottom-16 h-64 w-64 text-white/5 rotate-12" />
        </div>

        {/* Right Side: Register Form */}
        <div className="p-8 lg:p-20 overflow-y-auto custom-scrollbar">
          <div className="max-w-md mx-auto">
            <div className="mb-10">
               <div className="lg:hidden flex items-center space-x-2 mb-8">
                 <div className="bg-[#22c55e] p-2 rounded-xl">
                   <BookOpen className="h-6 w-6 text-white" />
                 </div>
                 <span className="text-xl font-black tracking-tight text-gray-900 italic">AdminPro</span>
              </div>
              <h3 className="text-4xl font-black text-gray-900 tracking-tight">Create Identity</h3>
              <p className="text-gray-500 mt-2 font-medium">Register your administrative profile</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Legal Identity</label>
                <div className="relative group">
                   <User className="absolute left-5 top-5 h-5 w-5 text-gray-400 group-focus-within:text-[#22c55e] transition-colors" />
                   <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Full Name"
                    className="w-full pl-14 pr-6 py-5 bg-gray-50 border-none rounded-[24px] font-bold text-gray-900 focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
                   />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Work Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-5 top-5 h-5 w-5 text-gray-400 group-focus-within:text-[#22c55e] transition-colors" />
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="admin@local"
                      className="w-full pl-14 pr-6 py-5 bg-gray-50 border-none rounded-[24px] font-bold text-gray-900 focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Contact</label>
                  <div className="relative group">
                    <Phone className="absolute left-5 top-5 h-5 w-5 text-gray-400 group-focus-within:text-[#22c55e] transition-colors" />
                    <input 
                      type="tel" 
                      required
                      maxLength="10"
                      pattern="07[0-9]{8}"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="07XXXXXXXX"
                      className="w-full pl-14 pr-6 py-5 bg-gray-50 border-none rounded-[24px] font-bold text-gray-900 focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Secret Access Key</label>
                <div className="relative group">
                   <Lock className="absolute left-5 top-5 h-5 w-5 text-gray-400 group-focus-within:text-[#22c55e] transition-colors" />
                   <input 
                    type="password" 
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="••••••••••••"
                    className="w-full pl-14 pr-6 py-5 bg-gray-50 border-none rounded-[24px] font-bold text-gray-900 focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
                   />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Confirm Secret Key</label>
                <div className="relative group">
                   <Lock className="absolute left-5 top-5 h-5 w-5 text-gray-400 group-focus-within:text-[#22c55e] transition-colors" />
                   <input 
                    type="password" 
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    placeholder="••••••••••••"
                    className="w-full pl-14 pr-6 py-5 bg-gray-50 border-none rounded-[24px] font-bold text-gray-900 focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
                   />
                </div>
              </div>

              <div className="flex items-start space-x-3 px-1 pt-2">
                 <div className="mt-1">
                    <CheckCircle2 className="h-4 w-4 text-[#22c55e]" />
                 </div>
                 <p className="text-xs font-bold text-gray-500 leading-relaxed">By submitting this request, you agree to the system's administrative protocols and security policies.</p>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className={`w-full bg-[#166534] hover:bg-[#114d27] text-white py-5 rounded-[24px] font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-green-100 transition-all active:scale-95 mt-4 ${loading ? 'opacity-70 cursor-not-allowed' : 'group'}`}
              >
                {loading ? 'Processing...' : 'Submit Enrollment'}
                {!loading && <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-gray-500 font-bold">
                Already have an identity? {' '}
                <Link to="/login" className="text-[#22c55e] hover:underline">Access System</Link>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;
