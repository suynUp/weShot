// components/FeedbackModal.jsx
import { useState, useRef } from 'react';
import { X, Image as ImageIcon, AlertCircle, CheckCircle, Camera } from 'lucide-react';
import { toast } from '../hooks/useToast';

const FeedbackModal = ({ isOpen, onClose, onSubmit }) => {
    const [feedbackType, setFeedbackType] = useState('功能建议');
    const [content, setContent] = useState('');
    const [contact, setContact] = useState('');
    const [images, setImages] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef(null);

    const feedbackTypes = [
        '功能建议',
        '操作体验',
        '卡顿/闪退',
        '其他反馈'
    ];

    // 处理图片上传
    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (images.length + files.length > 9) {
            toast.warning('最多上传9张图片');
            return;
        }

        // 这里应该是上传到服务器的逻辑，现在先用本地预览
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImages(prev => [...prev, {
                    file: file,
                    preview: reader.result,
                    name: file.name
                }]);
            };
            reader.readAsDataURL(file);
        });
    };

    // 删除图片
    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    // 提交反馈
    const handleSubmit = async () => {
        if (!content.trim()) {
            toast.warning('请填写问题描述');
            return;
        }

        setIsSubmitting(true);

        // 构建提交数据
        const submitData = {
            content: content,
            contact: contact || "", // 如果没填联系方式就传空字符串
            image: [] // 这里应该是上传后的图片URL数组，需要先上传图片
        };

        try {
            // 如果有图片，先上传图片
            if (images.length > 0) {
                // TODO: 实现图片上传逻辑
                // const uploadPromises = images.map(img => uploadImage(img.file));
                // const imageUrls = await Promise.all(uploadPromises);
                // submitData.image = imageUrls;
                
                // 临时用预览图替代
                submitData.image = images.map(img => img.preview);
            }

            await onSubmit(submitData);
            toast.success('反馈提交成功！');
            
            // 重置表单
            setFeedbackType('功能建议');
            setContent('');
            setContact('');
            setImages([]);
            onClose();
        } catch (error) {
            toast.error('提交失败，请重试');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-50 backdrop-blur-md transition-opacity duration-300 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div 
                className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-8 w-full max-w-2xl shadow-2xl border border-orange-200/50 transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
                style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#f97316 #fff1e6'
                }}
            >
                {/* 头部 */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent flex items-center gap-2">
                        <AlertCircle className="w-6 h-6 text-orange-500" />
                        意见反馈
                    </h2>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-orange-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-orange-500" />
                    </button>
                </div>

                {/* 表单区域 */}
                <div className="space-y-6">
                    {/* 问题类型 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-3">
                            问题类型
                        </label>
                        <div className="flex flex-wrap gap-3">
                            {feedbackTypes.map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setFeedbackType(type)}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                        feedbackType === type
                                            ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                                            : 'bg-white/50 border border-orange-200/50 text-gray-600 hover:bg-orange-50'
                                    }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 具体问题描述 */}
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <label className="block text-sm font-medium text-gray-600">
                                具体问题描述
                            </label>
                            <span className={`text-xs ${content.length >= 200 ? 'text-red-500' : 'text-gray-400'}`}>
                                {content.length}/200
                            </span>
                        </div>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value.slice(0, 200))}
                            placeholder="请描述具体问题..."
                            rows="4"
                            className="w-full px-4 py-3 bg-white/50 border border-orange-200/50 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition-all resize-none"
                        />
                    </div>

                    {/* 图片说明 */}
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <label className="block text-sm font-medium text-gray-600">
                                图片说明
                            </label>
                            <span className="text-xs text-gray-400">
                                {images.length}/9
                            </span>
                        </div>
                        
                        {/* 图片上传区域 */}
                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                            {images.map((img, index) => (
                                <div key={index} className="relative aspect-square rounded-xl overflow-hidden group">
                                    <img 
                                        src={img.preview} 
                                        alt={`preview-${index}`}
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1 right-1 w-6 h-6 bg-red-500/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-4 h-4 text-white" />
                                    </button>
                                </div>
                            ))}
                            
                            {images.length < 9 && (
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="aspect-square rounded-xl border-2 border-dashed border-orange-200/50 hover:border-orange-300 bg-white/30 flex flex-col items-center justify-center gap-1 transition-colors group"
                                >
                                    <Camera className="w-6 h-6 text-gray-400 group-hover:text-orange-400 transition-colors" />
                                    <span className="text-xs text-gray-400 group-hover:text-orange-400 transition-colors">
                                        上传图片
                                    </span>
                                </button>
                            )}
                        </div>
                        
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                        
                        <p className="text-xs text-gray-400 mt-2">
                            支持 jpg、png、gif 格式，最多上传9张
                        </p>
                    </div>

                    {/* 联系方式 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-3">
                            联系方式（选填）
                        </label>
                        <input
                            type="text"
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                            placeholder="微信号/手机号/QQ号"
                            className="w-full px-4 py-3 bg-white/50 border border-orange-200/50 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition-all"
                        />
                        <p className="text-xs text-gray-400 mt-2">
                            方便我们与你联系，进一步了解问题
                        </p>
                    </div>
                </div>

                {/* 提交按钮 */}
                <div className="mt-8 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-6 py-3 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                        取消
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !content.trim()}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                提交中...
                            </>
                        ) : (
                            <>
                                <CheckCircle className="w-5 h-5" />
                                提交反馈
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* 自定义滚动条样式 */}
            <style>{`
                .overflow-y-auto::-webkit-scrollbar {
                    width: 4px;
                }
                .overflow-y-auto::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                .overflow-y-auto::-webkit-scrollbar-thumb {
                    background: linear-gradient(to bottom, #f97316, #f59e0b);
                    border-radius: 10px;
                }
            `}</style>
        </div>
    );
};

export default FeedbackModal;