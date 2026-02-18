import Toast from "../components/toast";
import { useState } from "react";
// Toast管理器
export const useToast = () => {
    const [toasts, setToasts] = useState([]);

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

