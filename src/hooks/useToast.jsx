import { useEffect, useState } from "react";
import Toast from "../components/toast";
// hooks/useToast.js
let globalToastRef = null;

export const useToast = () => {
    const [toasts, setToasts] = useState([]);
    
    // 保存全局引用
    useEffect(() => {
        globalToastRef = {
            show: (message, type, duration) => {
                const id = Date.now();
                setToasts(prev => [...prev, { id, message, type, duration }]);
                return id;
            },
            remove: (id) => {
                setToasts(prev => prev.filter(toast => toast.id !== id));
            }
        };
    }, []);

    const show = (message, type = 'info', duration = 3000) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type, duration }]);
        return id;
    };

    const success = (message, duration) => show(message, 'success', duration);
    const error = (message, duration) => show(message, 'error', duration);
    const warning = (message, duration) => show(message, 'warning', duration);
    const info = (message, duration) => show(message, 'info', duration);

    const remove = (id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    const ToastContainer = () => (
        <>
            {toasts.map(toast => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    duration={toast.duration}
                    onClose={() => remove(toast.id)}
                />
            ))}
        </>
    );

    return {
        show,
        success,
        error,
        warning,
        info,
        ToastContainer,
        remove
    };
};

// 导出一个全局可用的方法
export const toast = {
    success: (message, duration) => globalToastRef?.show(message, 'success', duration),
    error: (message, duration) => globalToastRef?.show(message, 'error', duration),
    warning: (message, duration) => globalToastRef?.show(message, 'warning', duration),
    info: (message, duration) => globalToastRef?.show(message, 'info', duration),
};