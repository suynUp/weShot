import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, Image, X, Plus, Send, Sparkles, Camera, Upload, Trash2, MoveLeft, Inbox, Save } from 'lucide-react';
import { useNavigation } from '../hooks/navigation';
import { useToast } from '../hooks/useToast';
import DraftShifter from '../components/draftShifter';
import { DraftStore } from '../store/draftStore';
import { useDeleteDraftMutation, useGetDraft } from '../hooks/useDraft';
import { usePostPublish } from '../hooks/usePost';

const PostPublish = () => {
    // 路由和提示
    const { goBack } = useNavigation();
    const toast = useToast();

    // 草稿箱状态
    const [hasload, setHasLoad] = useState(false);
    const [loadId, setLoadId] = useState(-1);
    const draftList = DraftStore(state => state.draftList);
    const deleteMutation = useDeleteDraftMutation();
    const { getDetail, getList } = useGetDraft();

    // 表单数据
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [images, setImages] = useState([]); // 最多9张
    const [category, setCategory] = useState('人像摄影');
    const [isPublishing, setIsPublishing] = useState(false);

    // 图片上传相关
    const fileInputRef = useRef(null);

    // 动画样式
    const slideInKeyframes = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes fadeInScale {
            from {
                opacity: 0;
                transform: scale(0.9);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }
    `;

    // 监听删除操作的结果
    useEffect(() => {
        if (deleteMutation.isError) {
            toast.error(`删除失败：${deleteMutation.error.message}`);
        }
        if (deleteMutation.isSuccess) {
            toast.success('删除成功！');
        }
    }, [deleteMutation.isError, deleteMutation.isSuccess, deleteMutation.error]);

    // 分类选项
    const categories = [
        '人像摄影', '风光摄影', '街拍摄影', '商业摄影', 
        '婚礼摄影', '纪实摄影', '宠物摄影', '美食摄影', '其他'
    ];

    const postPublishMutation = usePostPublish()


    // 处理图片上传
    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const remainingSlots = 9 - images.length;
        
        if (files.length > remainingSlots) {
            toast.warning(`最多只能上传9张图片，还能上传${remainingSlots}张`);
            return;
        }

        // 模拟图片上传（实际项目中应上传到服务器）
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImages(prev => [...prev, {
                    id: Date.now() + Math.random(),
                    url: e.target.result,
                    file: file,
                    name: file.name
                }]);
            };
            reader.readAsDataURL(file);
        });
    };

    // 删除图片
    const handleRemoveImage = (imageId) => {
        setImages(prev => prev.filter(img => img.id !== imageId));
    };

    // 移动图片位置（左移/右移）
    const handleMoveImage = (index, direction) => {
        const newImages = [...images];
        const targetIndex = direction === 'left' ? index - 1 : index + 1;
        
        if (targetIndex >= 0 && targetIndex < images.length) {
            [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];
            setImages(newImages);
        }
    };

    // 验证表单
    const validateForm = () => {
        if (!title.trim()) {
            toast.warning('请输入作品标题');
            return false;
        }
        if (!content.trim()) {
            toast.warning('请输入作品内容');
            return false;
        }
        if (images.length === 0) {
            toast.warning('请至少上传一张图片');
            return false;
        }
        return true;
    };

    // 发布作品
    const handlePublish = async () => {
        if(!validateForm())return
        setIsPublishing(true)
        postPublishMutation.mutate({
            images:images,
            formData:{
                type:category,
                title,
                content
            }
        })
    };

    // 保存草稿
    const handleSaveDraft = () => {
        const requiredFields = [
            { value: title, name: '作品标题' },
            { value: content, name: '作品描述' },
            { value: images.length > 0, name: '作品图片' }
        ];

        const emptyField = requiredFields.find(field => !field.value);
        if (emptyField) {
            toast.warning(`${emptyField.name}不能为空`);
            return;
        }

        // 模拟保存草稿
        toast.success('草稿保存成功');
    };

    // 重置表单
    const handleResetForm = () => {
        setTitle('');
        setContent('');
        setImages([]);
        setCategory('人像摄影');
        toast.info('表单已重置');
    };

    // 删除草稿
    const deleteDraft = (id) => {
        deleteMutation.mutate(id);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-100 via-pink-100 to-blue-100 relative overflow-hidden">
            {/* 添加动画样式 */}
            <style>{slideInKeyframes}</style>


            {/* 装饰性背景元素 */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full filter blur-3xl opacity-40 -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-200 rounded-full filter blur-3xl opacity-40 translate-y-1/2 -translate-x-1/3" />
            <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-orange-200 rounded-full filter blur-3xl opacity-30" />
            
            {/* 装饰性相机图标 */}
            <Camera className="absolute top-20 right-20 w-16 h-16 text-orange-200/30 rotate-12" />
            <Camera className="absolute bottom-20 left-20 w-20 h-20 text-pink-200/30 -rotate-12" />

            {/* 顶部导航栏 */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-orange-200/50">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="flex items-center justify-between h-16">
                        <button 
                            className="flex items-center text-gray-600 hover:text-orange-600 transition-colors group"
                            onClick={goBack}
                        >
                            <ChevronLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                            <span className="ml-1">返回</span>
                        </button>
                        
                        <h1 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-orange-400" />
                            发布作品
                            <Sparkles className="w-5 h-5 text-orange-400" />
                        </h1>
                        
                        <div className="flex items-center space-x-3">
                            <button 
                                onClick={() => setHasLoad(!hasload)}
                                className="p-2 hover:bg-orange-50 rounded-xl transition-colors relative"
                                title="草稿箱"
                            >
                                <Inbox className="h-5 w-5 text-gray-600" />
                                {draftList.length > 0 && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full text-[10px] text-white flex items-center justify-center">
                                        {draftList.length}
                                    </span>
                                )}
                            </button>
                            
                            <button 
                                onClick={handleSaveDraft}
                                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all shadow-md hover:shadow-lg flex items-center gap-2 text-sm"
                            >
                                <Save className="w-4 h-4" />
                                保存草稿
                            </button>
                            
                            <button 
                                onClick={handlePublish}
                                disabled={isPublishing}
                                className={`px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all shadow-md hover:shadow-lg flex items-center gap-2 text-sm ${
                                    isPublishing ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                {isPublishing ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        发布中...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" />
                                        发布作品
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 右侧草稿箱面板 - 仿Launch风格 */}
            <div className={`fixed top-16 right-0 bottom-0 z-40 transition-all duration-300 ${hasload ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="w-80 h-full bg-white/95 backdrop-blur-md shadow-2xl border-l border-orange-200/50 p-5 overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-orange-800">作品草稿箱</h2>
                        <button 
                            onClick={() => setHasLoad(false)}
                            className="p-2 hover:bg-orange-50 rounded-lg transition-colors"
                        >
                            <X className="w-4 h-4 text-gray-500" />
                        </button>
                    </div>
                    
                    <button
                        onClick={handleResetForm}
                        className="w-full mb-4 px-4 py-3 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl text-orange-600 hover:from-orange-100 hover:to-amber-100 transition-all flex items-center justify-center gap-2 text-sm"
                    >
                        <Plus className="w-4 h-4" />
                        新建作品
                    </button>

                    <DraftShifter
                        draftlist={draftList}
                        setLoadId={setLoadId}
                        deleteDraft={deleteDraft}
                        hasLoaded={setHasLoad}
                    />
                </div>
            </div>

            {/* 主内容区域 */}
            <div className="relative z-10 pt-20 pb-12 px-6">
                <div className="max-w-3xl mx-auto">
                    {/* 表单区域 - 仿Launch的卡片式设计 */}
                    <div className="space-y-6">
                        {/* 标题输入 */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-orange-200/50 hover:shadow-lg transition-all">
                            <div className="flex items-center mb-3">
                                <span className="text-red-400 mr-1 text-lg">*</span>
                                <label className="text-lg font-medium text-orange-800">作品标题</label>
                            </div>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="例如：春日人像摄影精选"
                                className="w-full px-4 py-3 bg-white/90 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-700 placeholder-gray-400"
                                maxLength={50}
                            />
                            <div className="flex justify-end mt-2">
                                <span className="text-xs text-gray-400">{title.length}/50</span>
                            </div>
                        </div>

                        {/* 内容输入 - 类似Launch的textarea */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-orange-200/50 hover:shadow-lg transition-all">
                            <div className="flex items-center mb-3">
                                <span className="text-red-400 mr-1 text-lg">*</span>
                                <label className="text-lg font-medium text-orange-800">作品描述</label>
                            </div>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="分享你的拍摄心得、技巧和故事..."
                                rows={5}
                                className="w-full px-4 py-3 bg-white/90 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-700 placeholder-gray-400 resize-none"
                                maxLength={500}
                            />
                            <div className="flex justify-end mt-2">
                                <span className="text-xs text-gray-400">{content.length}/500</span>
                            </div>
                        </div>

                        {/* 图片上传区域 - 限制9张 */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-orange-200/50 hover:shadow-lg transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center">
                                    <span className="text-red-400 mr-1 text-lg">*</span>
                                    <label className="text-lg font-medium text-orange-800">作品图片</label>
                                </div>
                                <span className="text-sm text-gray-500">
                                    {images.length}/9 张
                                </span>
                            </div>
                            
                            {/* 图片网格 */}
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mb-4">
                                {images.map((image, index) => (
                                    <div 
                                        key={image.id}
                                        className="relative group aspect-square rounded-xl overflow-hidden border-2 border-orange-200/50 shadow-md animate-[fadeInScale_0.3s_ease-out]"
                                    >
                                        <img 
                                            src={image.url} 
                                            alt={`作品图 ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                        
                                        {/* 图片序号 */}
                                        <div className="absolute top-1 left-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md">
                                            {index + 1}
                                        </div>

                                        {/* 操作遮罩 */}
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                                            {/* 左移按钮 */}
                                            {index > 0 && (
                                                <button
                                                    onClick={() => handleMoveImage(index, 'left')}
                                                    className="p-1.5 bg-white/90 rounded-lg hover:bg-white transition-colors"
                                                    title="左移"
                                                >
                                                    <MoveLeft className="w-4 h-4 text-gray-700" />
                                                </button>
                                            )}
                                            {/* 右移按钮 */}
                                            {index < images.length - 1 && (
                                                <button
                                                    onClick={() => handleMoveImage(index, 'right')}
                                                    className="p-1.5 bg-white/90 rounded-lg hover:bg-white transition-colors"
                                                    title="右移"
                                                >
                                                    <MoveLeft className="w-4 h-4 text-gray-700 rotate-180" />
                                                </button>
                                            )}
                                            {/* 删除按钮 */}
                                            <button
                                                onClick={() => handleRemoveImage(image.id)}
                                                className="p-1.5 bg-red-500/90 rounded-lg hover:bg-red-500 transition-colors"
                                                title="删除"
                                            >
                                                <Trash2 className="w-4 h-4 text-white" />
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {/* 上传按钮 - 限制最多9张 */}
                                {images.length < 9 && (
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="aspect-square rounded-xl border-2 border-dashed border-orange-200 hover:border-orange-400 bg-orange-50/50 hover:bg-orange-100/50 transition-all flex flex-col items-center justify-center gap-1 group"
                                    >
                                        <Plus className="w-8 h-8 text-orange-300 group-hover:text-orange-400 transition-colors" />
                                        <span className="text-xs text-orange-400">上传图片</span>
                                    </button>
                                )}
                            </div>

                            {/* 隐藏的文件输入 */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageUpload}
                                className="hidden"
                            />

                            {/* 图片上传提示 */}
                            <div className="p-3 bg-orange-50/50 rounded-xl border border-orange-200/50">
                                <p className="text-xs text-gray-500 flex items-center gap-2">
                                    <Image className="w-4 h-4 text-orange-400" />
                                    支持 JPG、PNG、WEBP 格式，最多上传9张，可拖拽调整顺序
                                </p>
                            </div>
                        </div>

                        {/* 分类选择 - 类似Launch的option */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-orange-200/50 hover:shadow-lg transition-all">
                            <div className="flex items-center mb-3">
                                <span className="text-red-400 mr-1 text-lg">*</span>
                                <label className="text-lg font-medium text-orange-800">作品分类</label>
                            </div>
                            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setCategory(cat)}
                                        className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                                            category === cat
                                                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                                                : 'bg-white border border-orange-200 text-gray-600 hover:border-orange-400 hover:bg-orange-50'
                                        }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 发布承诺 - 类似Launch的提示框 */}
                        <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-200/50">
                            <p className="text-xs text-gray-500 flex items-start gap-2">
                                <Sparkles className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                                发布即表示你同意遵守社区规范，保证上传内容为原创或已获得授权，不得侵犯他人权益。
                            </p>
                        </div>
                    </div>

                    {/* 底部按钮 - 仿Launch */}
                    <div className="mt-8 flex justify-end space-x-4">
                        <button
                            onClick={goBack}
                            className="px-6 py-2.5 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                            取消
                        </button>
                        <button
                            onClick={handleSaveDraft}
                            className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all shadow-md hover:shadow-lg"
                        >
                            保存草稿
                        </button>
                        <button
                            onClick={handlePublish}
                            disabled={isPublishing}
                            className={`px-6 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all shadow-md hover:shadow-lg ${
                                isPublishing ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            {isPublishing ? '发布中...' : '立即发布'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostPublish;