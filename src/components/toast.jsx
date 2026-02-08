import { useState, useEffect, useRef, memo } from 'react';

// ==============================
// 内部实现
// ==============================

const TOAST_CONFIG = {
    error: {
        title: "错误",
        borderColor: "border-red-700",
        bgColor: "bg-red-100",
        textColor: "text-red-800",
        icon: "❌"
    },
    success: {
        title: "成功",
        borderColor: "border-green-700",
        bgColor: "bg-green-100",
        textColor: "text-green-800",
        icon: "✅"
    },
    warning: {
        title: "警告",
        borderColor: "border-yellow-700",
        bgColor: "bg-yellow-100",
        textColor: "text-yellow-800",
        icon: "⚠️"
    },
    info: {
        title: "信息",
        borderColor: "border-blue-700",
        bgColor: "bg-blue-100",
        textColor: "text-blue-800",
        icon: "ℹ️"
    }
};

const POSITION_CLASSES = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "top-center": "top-4 left-1/2 -translate-x-1/2",
    "bottom-center": "bottom-4 left-1/2 -translate-x-1/2"
};

// 全局状态
let globalToasts = [];
let updateCallbacks = [];
let toastIdCounter = 0;

const updateAllComponents = () => {
    requestAnimationFrame(() => {
        const currentToasts = [...globalToasts];
        updateCallbacks.forEach(callback => {
            try {
                callback(currentToasts);
            } catch (error) {
                console.error('Toast更新回调出错:', error);
            }
        });
    });
};

// 内部函数
const addToast = (detail, options = {}) => {
    const { type = 'info', duration = 3000, position = 'top-right' } = options;
    
    if (!detail || typeof detail !== 'string') {
        console.warn('Toast detail应为非空字符串');
        return null;
    }
    
    const id = `toast_${Date.now()}_${++toastIdCounter}`;
    const newToast = { 
        id, 
        detail, 
        type, 
        duration: Math.max(0, duration), 
        position: POSITION_CLASSES[position] ? position : 'top-right' 
    };
    
    globalToasts = [...globalToasts, newToast];
    updateAllComponents();
    
    if (duration > 0) {
        setTimeout(() => {
            removeToast(id);
        }, duration);
    }
    
    return id;
};

const removeToast = (id) => {
    if (!id) return;
    globalToasts = globalToasts.filter(toast => toast.id !== id);
    updateAllComponents();
};

const clearAllToasts = () => {
    globalToasts = [];
    updateAllComponents();
};

// ==============================
// 主要导出对象
// ==============================

// Toast API对象
export const toast = {
    // 基本方法
    success: (detail, options = {}) => addToast(detail, { ...options, type: 'success' }),
    error: (detail, options = {}) => addToast(detail, { ...options, type: 'error' }),
    warning: (detail, options = {}) => addToast(detail, { ...options, type: 'warning' }),
    info: (detail, options = {}) => addToast(detail, { ...options, type: 'info' }),
    show: addToast,
    remove: removeToast,
    clearAll: clearAllToasts,
    getAll: () => [...globalToasts]
};

// 自定义Hook
export const useToast = () => {
    return toast;
};

// ToastItem组件 (内部使用)
const ToastItem = memo(({ toast, onClose }) => {
    const [exiting, setExiting] = useState(false);
    const timeoutRef = useRef(null);
    
    useEffect(() => {
        if (toast.duration > 0) {
            timeoutRef.current = setTimeout(() => {
                setExiting(true);
                setTimeout(() => {
                    if (onClose) onClose(toast.id);
                }, 300);
            }, toast.duration);
            
            return () => {
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
            };
        }
    }, [toast.duration, toast.id, onClose]);
    
    const handleManualClose = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setExiting(true);
        setTimeout(() => {
            if (onClose) onClose(toast.id);
        }, 300);
    };
    
    const config = TOAST_CONFIG[toast.type] || TOAST_CONFIG.info;
    const positionClass = POSITION_CLASSES[toast.position] || POSITION_CLASSES['top-right'];
    
    return (
        <div className={`fixed z-50 flex items-center justify-between p-4 w-full max-w-md rounded-lg shadow-lg border-l-4 
            transition-all duration-300 ease-in-out transform
            ${config.borderColor} ${config.bgColor} ${config.textColor} 
            ${positionClass}
            ${exiting ? 'opacity-0 translate-y-[-20px]' : 'opacity-100 translate-y-0'}`}>
            <div className="flex items-center">
                <span className="text-xl mr-3">{config.icon}</span>
                <div>
                    <div className="font-semibold">{config.title}</div>
                    <div className="text-sm mt-1">{toast.detail}</div>
                </div>
            </div>
            <button 
                onClick={handleManualClose}
                className="ml-4 text-xl font-bold hover:opacity-70"
            >
                ×
            </button>
        </div>
    );
});

ToastItem.displayName = 'ToastItem';

// ToastContainer组件
export const ToastContainer = () => {
    const [toasts, setToasts] = useState([]);
    const mountedRef = useRef(true);
    
    useEffect(() => {
        mountedRef.current = true;
        
        const handleUpdate = (newToasts) => {
            if (mountedRef.current) {
                setToasts(newToasts);
            }
        };
        
        const timer = setTimeout(() => {
            if (mountedRef.current) {
                setToasts([...globalToasts]);
            }
        }, 0);
        
        updateCallbacks.push(handleUpdate);
        
        return () => {
            mountedRef.current = false;
            clearTimeout(timer);
            
            const index = updateCallbacks.indexOf(handleUpdate);
            if (index > -1) {
                updateCallbacks.splice(index, 1);
            }
        };
    }, []);
    
    if (toasts.length === 0) return null;
    
    return (
        <>
            {toasts.map(toast => (
                <ToastItem 
                    key={toast.id} 
                    toast={toast} 
                    onClose={removeToast}
                />
            ))}
        </>
    );
};

// 兼容原版Toast组件
export const Toast = ({ 
    detail = "", 
    type = "info", 
    duration = 3000,
    position = "top-right",
    onClose 
}) => {
    const [visible, setVisible] = useState(true);
    const [exiting, setExiting] = useState(false);
    const timeoutRef = useRef(null);
    
    useEffect(() => {
        if (duration > 0) {
            timeoutRef.current = setTimeout(() => {
                setExiting(true);
                setTimeout(() => {
                    setVisible(false);
                    if (onClose) onClose();
                }, 300);
            }, duration);
            
            return () => {
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
            };
        }
    }, [duration, onClose]);
    
    const handleManualClose = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setExiting(true);
        setTimeout(() => {
            setVisible(false);
            if (onClose) onClose();
        }, 300);
    };
    
    if (!visible) return null;
    
    const config = TOAST_CONFIG[type] || TOAST_CONFIG.info;
    const positionClass = POSITION_CLASSES[position] || POSITION_CLASSES['top-right'];
    
    return (
        <div className={`fixed z-50 flex items-center justify-between p-4 w-full max-w-md rounded-lg shadow-lg border-l-4 
            transition-all duration-300 ease-in-out transform
            ${config.borderColor} ${config.bgColor} ${config.textColor} 
            ${positionClass}
            ${exiting ? 'opacity-0 translate-y-[-20px]' : 'opacity-100 translate-y-0'}`}>
            <div className="flex items-center">
                <span className="text-xl mr-3">{config.icon}</span>
                <div>
                    <div className="font-semibold">{config.title}</div>
                    <div className="text-sm mt-1">{detail}</div>
                </div>
            </div>
            <button 
                onClick={handleManualClose}
                className="ml-4 text-xl font-bold hover:opacity-70"
            >
                ×
            </button>
        </div>
    );
};

// ==============================
// 默认导出
// ==============================

// 也可以选择默认导出主要对象
export default {
    toast,
    Toast,
    ToastContainer,
    useToast
};

// 或者单独导出每个主要功能
// export { toast, Toast, ToastContainer, useToast };