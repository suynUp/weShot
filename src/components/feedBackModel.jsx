// components/FeedbackModal.jsx
import { useState, useRef } from 'react';
import { X, Image as ImageIcon, AlertCircle, CheckCircle, Camera } from 'lucide-react';
import { toast } from '../hooks/useToast';
import { imgUpload } from '../api/imgUpload';

const FeedbackModal = ({ isOpen, onClose, onSubmit }) => {
    const [feedbackType, setFeedbackType] = useState('功能建议');
    const [content, setContent] = useState('');
    const [contact, setContact] = useState('');
    const [imageFiles, setImageFiles] = useState([]); // 存储文件对象，用于预览
    const [imagePreviews, setImagePreviews] = useState([]); // 存储预览URL
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef(null);

    const feedbackTypes = [
        '功能建议',
        '操作体验',
        '卡顿/闪退',
        '其他反馈'
    ];

    // 处理图片选择（只预览，不上传）
    const handleImageSelect = (e) => {
        const files = Array.from(e.target.files);
        if (imageFiles.length + files.length > 9) {
            toast.warning('最多上传9张图片');
            return;
        }

        // 生成预览URL
        const newPreviews = files.map(file => URL.createObjectURL(file));
        
        setImageFiles(prev => [...prev, ...files]);
        setImagePreviews(prev => [...prev, ...newPreviews]);
    };

    // 删除图片
    const removeImage = (index) => {
        // 释放预览URL
        URL.revokeObjectURL(imagePreviews[index]);
        
        setImageFiles(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    // 提交反馈
    const handleSubmit = async () => {
        if (!content.trim()) {
            toast.warning('请填写问题描述');
            return;
        }

        setIsSubmitting(true);

        try {
            // 1. 先上传所有图片到服务器
            let uploadedImageUrls = [];
            if (imageFiles.length > 0) {
                
                // 并行上传所有图片
                const uploadPromises = imageFiles.map(file => imgUpload(file));
                uploadedImageUrls = await Promise.all(uploadPromises);
            }

            // 2. 构建提交数据
            const submitData = {
                type: feedbackType,
                content: content,
                contact: contact || "",
                images: uploadedImageUrls // 使用上传后的URL数组
            };

            console.log('提交的反馈数据:', submitData);

            // 3. 提交反馈数据
            await onSubmit(submitData);
            
            toast.success('反馈提交成功！');
            
            // 4. 清理预览URL
            imagePreviews.forEach(url => URL.revokeObjectURL(url));
            
            // 5. 重置表单
            setFeedbackType('功能建议');
            setContent('');
            setContact('');
            setImageFiles([]);
            setImagePreviews([]);
            onClose();
        } catch (error) {
            console.error('提交失败:', error);
            toast.error(error.message || '提交失败，请重试');
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
                        disabled={isSubmitting}
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
                                    disabled={isSubmitting}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                        feedbackType === type
                                            ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                                            : 'bg-white/50 border border-orange-200/50 text-gray-600 hover:bg-orange-50'
                                    } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                            disabled={isSubmitting}
                            className="w-full px-4 py-3 bg-white/50 border border-orange-200/50 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition-all resize-none disabled:opacity-50"
                        />
                    </div>

                    {/* 图片说明 */}
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <label className="block text-sm font-medium text-gray-600">
                                图片说明
                            </label>
                            <span className="text-xs text-gray-400">
                                {imageFiles.length}/9
                            </span>
                        </div>
                        
                        {/* 图片预览区域 */}
                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                            {imagePreviews.map((preview, index) => (
                                <div key={index} className="relative aspect-square rounded-xl overflow-hidden group">
                                    <img 
                                        src={preview} 
                                        alt={`preview-${index}`}
                                        className="w-full h-full object-cover"
                                    />
                                    {!isSubmitting && (
                                        <button
                                            onClick={() => removeImage(index)}
                                            className="absolute top-1 right-1 w-6 h-6 bg-red-500/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-4 h-4 text-white" />
                                        </button>
                                    )}
                                </div>
                            ))}
                            
                            {imageFiles.length < 9 && !isSubmitting && (
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
                            onChange={handleImageSelect}
                            className="hidden"
                            disabled={isSubmitting}
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
                            disabled={isSubmitting}
                            className="w-full px-4 py-3 bg-white/50 border border-orange-200/50 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition-all disabled:opacity-50"
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
                        disabled={isSubmitting}
                        className="flex-1 px-6 py-3 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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