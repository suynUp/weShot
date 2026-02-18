// components/Toast.jsx
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { useEffect, useState } from "react";

const Toast = ({ 
    message, 
    type = 'info', 
    duration = 3000, 
    onClose,
    position = 'top-right'
}) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => {
                onClose?.();
            }, 300); // 等待动画完成
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    if (!isVisible) return null;

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'error':
                return <AlertCircle className="w-5 h-5 text-red-500" />;
            case 'warning':
                return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
            case 'info':
            default:
                return <Info className="w-5 h-5 text-blue-500" />;
        }
    };

    const getBackgroundColor = () => {
        switch (type) {
            case 'success':
                return 'bg-green-50 border-green-200 text-green-600';
            case 'error':
                return 'bg-red-50 border-red-200 text-red-600';
            case 'warning':
                return 'bg-yellow-50 border-yellow-200 text-yellow-600';
            case 'info':
            default:
                return 'bg-blue-50 border-blue-200 text-blue-600';
        }
    };

    const getPositionClass = () => {
        switch (position) {
            case 'top-left':
                return 'top-24 left-8';
            case 'top-right':
                return 'top-24 right-8';
            case 'bottom-left':
                return 'bottom-8 left-8';
            case 'bottom-right':
                return 'bottom-8 right-8';
            default:
                return 'top-24 right-8';
        }
    };

    return (
        <div 
            className={`fixed ${getPositionClass()} z-[60] ${getBackgroundColor()} px-6 py-4 rounded-xl shadow-lg animate-slideIn border`}
        >
            <div className="flex items-center gap-3">
                {getIcon()}
                <p className="text-sm font-medium">{message}</p>
                <button 
                    onClick={() => {
                        setIsVisible(false);
                        setTimeout(() => onClose?.(), 300);
                    }}
                    className="ml-4 p-1 hover:bg-black/5 rounded-lg transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default Toast;