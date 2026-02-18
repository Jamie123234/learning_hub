import { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, Info, AlertCircle } from 'lucide-react';
import './Toast.css';

const ToastContext = createContext(null);

export function useToast() {
    return useContext(ToastContext);
}

let toastId = 0;

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((msg, type = 'info') => {
        const id = ++toastId;
        setToasts(prev => [...prev, { id, msg, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3500);
    }, []);

    const toast = useCallback((msg, type) => addToast(msg, type), [addToast]);

    return (
        <ToastContext.Provider value={toast}>
            {children}
            <div className="toast-wrap">
                <AnimatePresence>
                    {toasts.map(t => (
                        <motion.div
                            key={t.id}
                            className={`toast t-${t.type}`}
                            initial={{ x: 120, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 120, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                        >
                            {t.type === 'success' && <CheckCircle size={16} />}
                            {t.type === 'info' && <Info size={16} />}
                            {t.type === 'error' && <AlertCircle size={16} />}
                            <span>{t.msg}</span>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}
