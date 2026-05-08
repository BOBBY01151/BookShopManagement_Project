import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit3, 
  Save, 
  X,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Bell,
  Globe,
  Database,
  Terminal,
  Activity,
  Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDate } from '../utils/helpers';
import { motion, AnimatePresence } from 'framer-motion';
import { authAPI } from '../api/auth';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adminUser, setAdminUser] = useState(null);

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
    reset: resetProfile
  } = useForm();

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      const response = await authAPI.getMe();
      if (response.data.status === 'success') {
        const userData = response.data.data.user;
        setAdminUser(userData);
        resetProfile({
          name: userData.name,
          email: userData.email,
          phone: userData.phone || '',
          address: userData.address?.street || '',
        });
      }
    } catch (error) {
      toast.error('Failed to load system profile');
    } finally {
      setLoading(false);
    }
  };

  const onSubmitProfile = async (data) => {
    try {
      // In a real app, we'd call an updateMe API here
      // For now, we'll simulate it and update local state
      toast.success('System profile updated');
      setAdminUser({ ...adminUser, ...data });
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const tabs = [
    { id: 'profile', label: 'Admin Profile', icon: User },
    { id: 'security', label: 'Security', icon: ShieldCheck },
    { id: 'system', label: 'System Config', icon: Database },
    { id: 'notifications', label: 'Alerts', icon: Bell },
  ];

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-12 w-12 text-[#22c55e] animate-spin" />
        <p className="text-gray-500 font-bold animate-pulse uppercase tracking-widest text-xs">Accessing Secure Profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 bg-[#22c55e] rounded-3xl flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-green-100">
              {adminUser?.name?.charAt(0) || 'A'}
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Admin Settings</h1>
              <p className="text-gray-500 font-medium mt-1">Logged in as <span className="text-[#22c55e]">{adminUser?.name}</span></p>
            </div>
          </div>
          <div className="flex gap-3">
             <div className="bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-100">
                <p className="text-[10px] uppercase font-black text-emerald-600 tracking-widest">System Status</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-sm font-bold text-emerald-900">Optimal</span>
                </div>
             </div>
             <div className="bg-blue-50 px-4 py-2 rounded-2xl border border-blue-100">
                <p className="text-[10px] uppercase font-black text-blue-600 tracking-widest">Access Level</p>
                <p className="text-sm font-bold text-blue-900 mt-1 font-mono uppercase">{adminUser?.role || 'ROOT_ADMIN'}</p>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${
                  activeTab === tab.id 
                    ? 'bg-[#22c55e] text-white shadow-lg shadow-green-100 translate-x-2' 
                    : 'bg-white text-gray-500 hover:bg-gray-50 border border-transparent hover:border-gray-100'
                }`}
              >
                <Icon className="h-5 w-5" />
                {tab.label}
              </button>
            );
          })}
          
          <div className="mt-8 p-6 bg-gray-900 rounded-3xl text-white overflow-hidden relative group">
            <Terminal className="absolute -right-4 -bottom-4 h-24 w-24 text-white/5 group-hover:scale-125 transition-transform duration-700" />
            <p className="text-xs font-black text-green-400 uppercase tracking-widest mb-4">System Console</p>
            <div className="font-mono text-[10px] space-y-1 opacity-80">
              <p>&gt; uptime: 24d 12h 4m</p>
              <p>&gt; cpu_load: 12.4%</p>
              <p>&gt; mem_usage: 1.2GB/4GB</p>
              <p className="text-green-500 animate-pulse">&gt; Ready_</p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 p-8 min-h-[500px]"
            >
              {activeTab === 'profile' && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-black text-gray-900">Administrator Profile</h2>
                    {!isEditing && (
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 text-[#22c55e] font-bold hover:underline"
                      >
                        <Edit3 className="h-4 w-4" /> Edit Profile
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleSubmitProfile(onSubmitProfile)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-1">Full Identity</label>
                      <input 
                        {...registerProfile('name')}
                        disabled={!isEditing}
                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-green-500/20 disabled:opacity-60"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-1">System Email</label>
                      <input 
                        {...registerProfile('email')}
                        disabled={true}
                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-green-500/20 opacity-60"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-1">Direct Line</label>
                      <input 
                        {...registerProfile('phone')}
                        disabled={!isEditing}
                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-green-500/20 disabled:opacity-60"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-1">Physical Location</label>
                      <input 
                        {...registerProfile('address')}
                        disabled={!isEditing}
                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-green-500/20 disabled:opacity-60"
                      />
                    </div>

                    {isEditing && (
                      <div className="md:col-span-2 flex gap-4 mt-4">
                        <button type="submit" className="flex-1 bg-[#22c55e] text-white py-4 rounded-2xl font-black shadow-lg shadow-green-100 hover:scale-[1.02] active:scale-[0.98] transition-all">Save Profile</button>
                        <button type="button" onClick={() => setIsEditing(false)} className="flex-1 bg-gray-100 text-gray-500 py-4 rounded-2xl font-black">Cancel</button>
                      </div>
                    )}
                  </form>

                  <div className="pt-8 border-t border-gray-50 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 bg-gray-50 rounded-3xl">
                       <Calendar className="h-6 w-6 text-emerald-600 mb-2" />
                       <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Account Created</p>
                       <p className="text-lg font-black text-gray-900 mt-1">{adminUser?.createdAt ? formatDate(adminUser.createdAt) : 'N/A'}</p>
                    </div>
                    <div className="p-6 bg-gray-50 rounded-3xl">
                       <Activity className="h-6 w-6 text-blue-600 mb-2" />
                       <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Last Access</p>
                       <p className="text-lg font-black text-gray-900 mt-1">{adminUser?.lastLogin ? formatDate(adminUser.lastLogin) : 'Just now'}</p>
                    </div>
                    <div className="p-6 bg-gray-50 rounded-3xl">
                       <ShieldCheck className="h-6 w-6 text-purple-600 mb-2" />
                       <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Security Level</p>
                       <p className="text-lg font-black text-gray-900 mt-1 uppercase italic tracking-tight">Tier 1 {adminUser?.role}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-8">
                  <h2 className="text-2xl font-black text-gray-900">Security Credentials</h2>
                  <div className="p-8 bg-amber-50 rounded-3xl border border-amber-100 flex items-start gap-4">
                    <div className="p-3 bg-white rounded-2xl shadow-sm text-amber-600">
                      <Lock className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-black text-amber-900">Two-Factor Authentication</p>
                      <p className="text-sm text-amber-700 mt-1">Adding an extra layer of security to your admin account is highly recommended.</p>
                      <button className="mt-4 bg-amber-200 text-amber-900 px-6 py-2 rounded-xl font-bold text-sm">Enable 2FA Now</button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl">
                      <div>
                        <p className="font-bold text-gray-900">Primary Password</p>
                        <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">Encrypted and Secure</p>
                      </div>
                      <button className="px-6 py-2 bg-white text-[#22c55e] border border-gray-200 rounded-xl font-bold text-sm hover:border-[#22c55e] transition-colors">Rotate Password</button>
                    </div>
                    <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl">
                      <div>
                        <p className="font-bold text-gray-900">Active Session ID</p>
                        <p className="text-[10px] font-mono text-gray-500 mt-1 truncate max-w-[200px] uppercase">{adminUser?.activeSessionId || 'NO_ACTIVE_SESSION'}</p>
                      </div>
                      <button className="px-6 py-2 bg-white text-red-600 border border-gray-200 rounded-xl font-bold text-sm hover:border-red-600 transition-colors">Purge Current Session</button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'system' && (
                <div className="space-y-8">
                   <h2 className="text-2xl font-black text-gray-900">System Configuration</h2>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-6 border border-gray-100 rounded-3xl space-y-4">
                         <div className="flex items-center gap-3">
                           <Globe className="h-5 w-5 text-[#22c55e]" />
                           <p className="font-black text-gray-900">Store Region</p>
                         </div>
                         <select className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold">
                           <option>Global (Default)</option>
                           <option>North America</option>
                           <option>Europe</option>
                           <option>Asia Pacific</option>
                         </select>
                      </div>
                      <div className="p-6 border border-gray-100 rounded-3xl space-y-4">
                         <div className="flex items-center gap-3">
                           <Database className="h-5 w-5 text-blue-500" />
                           <p className="font-black text-gray-900">Data Retention</p>
                         </div>
                         <select className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold">
                           <option>12 Months</option>
                           <option>24 Months</option>
                           <option>Unlimited</option>
                         </select>
                      </div>
                   </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-8">
                   <h2 className="text-2xl font-black text-gray-900">Alert Preferences</h2>
                   <div className="space-y-4">
                     {[
                       { label: 'Low Stock Alerts', desc: 'Notify when items fall below threshold', default: true },
                       { label: 'New Employee Registration', desc: 'Alert for pending HR approvals', default: true },
                       { label: 'System Updates', desc: 'Critical infrastructure maintenance notices', default: false },
                       { label: 'Weekly Reports', desc: 'Automated performance summaries via email', default: true },
                     ].map((item, i) => (
                       <div key={i} className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors rounded-3xl group">
                         <div>
                           <p className="font-bold text-gray-900">{item.label}</p>
                           <p className="text-sm text-gray-500">{item.desc}</p>
                         </div>
                         <div className="w-12 h-6 bg-green-100 rounded-full p-1 relative flex items-center group-hover:bg-green-200 transition-colors">
                           <div className={`w-4 h-4 rounded-full transition-all ${item.default ? 'bg-[#22c55e] ml-6' : 'bg-gray-400 ml-0'}`} />
                         </div>
                       </div>
                     ))}
                   </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
