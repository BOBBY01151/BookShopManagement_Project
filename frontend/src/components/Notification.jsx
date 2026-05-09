import React from 'react';
import { toast, Toaster, resolveValue } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, AlertTriangle, X } from 'lucide-react';

const Notification = () => {
  return (
    <Toaster position="top-right">
      {(t) => (
        <AnimatePresence>
          {t.visible && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.9, x: 20 }}
              animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
              exit={{ opacity: 0, y: -20, scale: 0.9, x: 20 }}
              className={`${
                t.visible ? 'animate-enter' : 'animate-leave'
              } max-w-md w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-2xl rounded-[24px] pointer-events-auto flex ring-1 ring-black/5 overflow-hidden border border-white/20`}
            >
              <div className="flex-1 w-0 p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-0.5">
                    {t.type === 'success' && (
                      <div className="h-10 w-10 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm shadow-emerald-100">
                        <CheckCircle2 className="h-6 w-6" />
                      </div>
                    )}
                    {t.type === 'error' && (
                      <div className="h-10 w-10 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 shadow-sm shadow-red-100">
                        <XCircle className="h-6 w-6" />
                      </div>
                    )}
                    {t.type === 'loading' && (
                      <div className="h-10 w-10 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm shadow-blue-100">
                        <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                          className="h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full"
                        />
                      </div>
                    )}
                    {t.type !== 'success' && t.type !== 'error' && t.type !== 'loading' && (
                      <div className="h-10 w-10 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 shadow-sm shadow-amber-100">
                        <AlertTriangle className="h-6 w-6" />
                      </div>
                    )}
                  </div>
                  <div className="ml-4 flex-1">
                    <p className={`text-sm font-black uppercase tracking-widest ${
                      t.type === 'success' ? 'text-emerald-600' :
                      t.type === 'error' ? 'text-red-600' :
                      'text-amber-600'
                    }`}>
                      {t.type === 'success' ? 'Success' :
                       t.type === 'error' ? 'System Error' :
                       'Notification'}
                    </p>
                    <p className="mt-1 text-sm font-bold text-gray-900 leading-tight">
                      {resolveValue(t.message, t)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex border-l border-gray-100">
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-400 hover:text-gray-900 focus:outline-none"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              {/* Progress Bar Animation */}
              <motion.div 
                initial={{ width: "100%" }}
                animate={{ width: 0 }}
                transition={{ duration: t.duration / 1000 || 4, ease: "linear" }}
                className={`absolute bottom-0 left-0 h-1 ${
                  t.type === 'success' ? 'bg-emerald-500' :
                  t.type === 'error' ? 'bg-red-500' :
                  'bg-amber-500'
                }`}
              />
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </Toaster>
  );
};

export default Notification;
