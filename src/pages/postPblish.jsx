import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, Image, X, Plus, Send, Sparkles, Camera, Trash2, MoveLeft, Inbox, Save } from 'lucide-react';
import { useNavigation } from '../hooks/navigation';
import { toast } from '../hooks/useToast';
import DraftShifter from '../components/draftShifter';
import { PostDraftStore } from '../store/postDraftStore';
import { useDeleteDraftMutation, useGetDraft, useSaveDraftMutation } from '../hooks/usePostDraft';
import { usePostPublish } from '../hooks/usePost';
import { useSearchParams } from 'react-router-dom';
import { imgUpload } from '../api/imgUpload';

const MAX_DRAFTS = 3; // 最大草稿数量

const PostPublish = () => {
    // 路由和提示
    const { goBack } = useNavigation();
    const [searchParams] = useSearchParams();

    // 草稿箱状态
    const [hasload, setHasLoad] = useState(false);
    const [loadId, setLoadId] = useState(-1);
    const [isLoadingDraft, setIsLoadingDraft] = useState(false);
    const [isSavingDraft, setIsSavingDraft] = useState(false);
    const draftList = PostDraftStore(state => state.draftList);
    const currentDraft = PostDraftStore(state => state.currentDraft);
    
    // hooks
    const deleteMutation = useDeleteDraftMutation();
    const saveDraftMutation = useSaveDraftMutation();
    const { getDetail, getList } = useGetDraft();

    // 表单数据
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageFiles, setImageFiles] = useState([]); // 存储本地File对象（用于上传）
    const [imagePreviews, setImagePreviews] = useState([]); // 存储预览URL
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

    // 初始化加载草稿列表
    useEffect(() => {
        getList();
    }, []);

    // 监听URL参数，处理从草稿箱点击发布的情况
    useEffect(() => {
        const draftId = searchParams.get('draft_id');
        if (draftId) {
            setLoadId(draftId);
            setHasLoad(false); // 关闭草稿箱面板
        }
    }, [searchParams]);

    // 当loadId变化时加载草稿详情
    useEffect(() => {
        if (loadId !== -1) {
            try {
            setIsLoadingDraft(true);
            getDetail(loadId);
            } catch (error) {
                setLoadId(-1);
            }    
        }
    }, [loadId, getDetail]);

    // 当currentDraft变化时填充表单
    useEffect(() => {
        if (currentDraft && loadId !== -1) {
            loadDraftData(currentDraft);
            setIsLoadingDraft(false);
            setLoadId(-1); // 重置loadId
        }
    }, [currentDraft]);

    // 监听删除操作的结果
    useEffect(() => {
        if (deleteMutation.isError) {
            toast.error(`删除失败：${deleteMutation.error.message}`);
        }
        if (deleteMutation.isSuccess) {
            toast.success('删除成功！');
            getList(); // 刷新列表
        }
    }, [deleteMutation.isError, deleteMutation.isSuccess, deleteMutation.error]);

    // 监听保存草稿结果
    useEffect(() => {
        if (saveDraftMutation.isError) {
            toast.error(`保存失败：${saveDraftMutation.error.message}`);
            setIsSavingDraft(false);
        }
        if (saveDraftMutation.isSuccess) {
            toast.success('草稿保存成功！');
            setIsSavingDraft(false);
            getList(); // 刷新列表
        }
    }, [saveDraftMutation.isError, saveDraftMutation.isSuccess, saveDraftMutation.error]);

    // 分类选项
    const categories = [
        '人像摄影', '风光摄影', '街拍摄影', '商业摄影', 
        '婚礼摄影', '纪实摄影', '宠物摄影', '美食摄影', '其他'
    ];

    const postPublishMutation = usePostPublish();

    // 监听发布结果
    useEffect(() => {
        if (postPublishMutation.isError) {
            toast.error(`发布失败：${postPublishMutation.error.message}`);
            setIsPublishing(false);
        }
        if (postPublishMutation.isSuccess) {
            toast.success('发布成功！');
            setIsPublishing(false);
            handleResetForm(); // 清空表单
        }
    }, [postPublishMutation.isError, postPublishMutation.isSuccess, postPublishMutation.error]);

    // 从草稿加载数据
    const loadDraftData = (draftData) => {
        try {
            // 填充表单数据
            if (draftData.title) {
                setTitle(draftData.title);
            }
            if (draftData.content) {
                setContent(draftData.content);
            }
            if (draftData.type) {
                setCategory(draftData.type);
            }
            
            // 处理图片 - 从图片URL数组创建预览
            if (draftData.images && draftData.images.length > 0) {
                // 草稿中的图片已经是服务器URL，直接用于预览
                setImagePreviews(draftData.images.map((url, index) => ({
                    id: `draft-${Date.now()}-${index}-${Math.random()}`,
                    url: url,
                    name: `作品图 ${index + 1}`
                })));
                // 注意：草稿加载时不需要设置imageFiles，因为图片已经在服务器上
            }

            toast.success('草稿加载成功');
        } catch (error) {
            console.error('加载草稿失败:', error);
            toast.error('加载草稿失败');
        }
    };

    // 处理图片选择（只创建预览，不上传）
    const handleImageSelect = (e) => {
        const files = Array.from(e.target.files);
        const remainingSlots = 9 - imagePreviews.length;
        
        if (files.length > remainingSlots) {
            toast.warning(`最多只能上传9张图片，还能上传${remainingSlots}张`);
            return;
        }

        // 创建预览URL并存储File对象
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                // 添加预览
                setImagePreviews(prev => [...prev, {
                    id: `preview-${Date.now()}-${Math.random()}`,
                    url: e.target.result,
                    name: file.name
                }]);
                
                // 存储File对象用于后续上传
                setImageFiles(prev => [...prev, file]);
            };
            reader.readAsDataURL(file);
        });

        // 清空input，允许重新选择相同文件
        e.target.value = '';
    };

    // 删除图片
    const handleRemoveImage = (imageId) => {
        // 从预览中移除
        setImagePreviews(prev => prev.filter(img => img.id !== imageId));
        
        // 从文件列表中移除对应的文件
        // 通过索引匹配，因为可能有多个相同文件名的文件
        const index = imagePreviews.findIndex(img => img.id === imageId);
        if (index !== -1) {
            setImageFiles(prev => prev.filter((_, i) => i !== index));
        }
    };

    // 移动图片位置（左移/右移）
    const handleMoveImage = (index, direction) => {
        // 同时移动预览和文件列表
        const newPreviews = [...imagePreviews];
        const newFiles = [...imageFiles];
        const targetIndex = direction === 'left' ? index - 1 : index + 1;
        
        if (targetIndex >= 0 && targetIndex < imagePreviews.length) {
            // 交换预览
            [newPreviews[index], newPreviews[targetIndex]] = [newPreviews[targetIndex], newPreviews[index]];
            setImagePreviews(newPreviews);
            
            // 如果有文件，也交换文件列表
            if (newFiles.length > 0) {
                [newFiles[index], newFiles[targetIndex]] = [newFiles[targetIndex], newFiles[index]];
                setImageFiles(newFiles);
            }
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
        if (imagePreviews.length === 0) {
            toast.warning('请至少选择一张图片');
            return false;
        }
        return true;
    };

    // 上传所有图片
    const uploadAllImages = async () => {
        const uploadedUrls = [];
        
        // 遍历所有需要上传的图片文件
        for (let i = 0; i < imageFiles.length; i++) {
            try {
                const url = await imgUpload(imageFiles[i]);
                uploadedUrls.push(url);
            } catch (error) {
                throw new Error(`第${i + 1}张图片上传失败: ${error.message}`);
            }
        }
        
        // 返回上传成功的URL数组
        return uploadedUrls;
    };

    // 发布作品
    const handlePublish = async () => {
        if(!validateForm()) return;
        
        setIsPublishing(true);
        
        try {
            // 先上传所有新图片
            let finalImageUrls = [];
            console.log('准备上传图片，当前文件列表:', imagePreviews);
            // 获取已有图片URL（来自草稿的图片）
            const existingImageUrls = imagePreviews
                .filter(preview => !preview.id.startsWith('preview-'))
                .map(preview => preview.url);
            
            // 如果有新图片需要上传
            if (imageFiles.length > 0) {
                toast.info('正在上传图片...');
                const newImageUrls = await uploadAllImages();
                finalImageUrls = [...existingImageUrls, ...newImageUrls];
            } else {
                finalImageUrls = existingImageUrls;
            }
            
            // 构建符合API要求的数据结构
            const publishData = {
                title: title,
                content: content,
                type: category,
                images: finalImageUrls
            };
            console.log('准备发布，最终数据:', publishData);
            
            // 发布作品
            postPublishMutation.mutate(publishData);
        } catch (error) {
            toast.error(error.message || '图片上传失败，请重试');
            setIsPublishing(false);
        }
    };

    // 保存草稿
    const handleSaveDraft = async () => {
        // 检查草稿数量限制
        if (draftList.length >= MAX_DRAFTS) {
            toast.warning(`草稿数量已达上限(${MAX_DRAFTS}个)，请删除一些旧草稿再保存`);
            setHasLoad(true); // 打开草稿箱方便删除
            return;
        }

        const requiredFields = [
            { value: title, name: '作品标题' },
            { value: content, name: '作品描述' },
            { value: imagePreviews.length > 0, name: '作品图片' }
        ];

        const emptyField = requiredFields.find(field => !field.value);
        if (emptyField) {
            toast.warning(`${emptyField.name}不能为空`);
            return;
        }

        setIsSavingDraft(true);

        try {
            // 先上传所有新图片
            let finalImageUrls = [];
            
            // 获取已有图片URL（来自之前草稿的图片）
            const existingImageUrls = imagePreviews
                .filter(preview => !preview.id.startsWith('preview-'))
                .map(preview => preview.url);
            
            // 如果有新图片需要上传
            if (imageFiles.length > 0) {
                toast.info('正在上传图片...');
                const newImageUrls = await uploadAllImages();
                finalImageUrls = [...existingImageUrls, ...newImageUrls];
            } else {
                finalImageUrls = existingImageUrls;
            }
            
            // 构建草稿数据
            const draftData = {
                title: title,
                content: content,
                type: category,
                images: finalImageUrls
            };

            saveDraftMutation.mutate(draftData);
        } catch (error) {
            toast.error(error.message || '图片上传失败，请重试');
            setIsSavingDraft(false);
        }
    };

    // 重置表单
    const handleResetForm = () => {
        setTitle('');
        setContent('');
        setImagePreviews([]);
        setImageFiles([]);
        setCategory('人像摄影');
        toast.info('表单已重置');
    };

    // 删除草稿
    const deleteDraft = (id) => {
        deleteMutation.mutate(id);
    };

    // 清理预览URL
    useEffect(() => {
        return () => {
            // 组件卸载时清理所有预览URL
            imagePreviews.forEach(preview => {
                if (preview.id.startsWith('preview-') && preview.url.startsWith('blob:')) {
                    URL.revokeObjectURL(preview.url);
                }
            });
        };
    }, [imagePreviews]);

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
                            className="flex items-center text-gray-600 hover:text-orange-600 transition-colors group hover:scale-105 active:scale-95"
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
                                className="p-2 hover:bg-orange-50 rounded-xl transition-colors relative hover:scale-105 active:scale-95"
                                title="草稿箱"
                            >
                                <Inbox className="h-5 w-5 text-gray-600" />
                                {draftList.length > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full text-[10px] text-white flex items-center justify-center ring-2 ring-white">
                                        {draftList.length}/{MAX_DRAFTS}
                                    </span>
                                )}
                            </button>
                            
                            <button 
                                onClick={handleSaveDraft}
                                disabled={isSavingDraft || isLoadingDraft}
                                className={`px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all shadow-md hover:shadow-lg flex items-center gap-2 text-sm hover:scale-105 active:scale-95 ${
                                    (isSavingDraft || isLoadingDraft) ? 'opacity-50 cursor-not-allowed hover:scale-100 active:scale-100' : ''
                                }`}
                            >
                                {isSavingDraft ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        保存中...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        保存草稿
                                    </>
                                )}
                            </button>
                            
                            <button 
                                onClick={handlePublish}
                                disabled={isPublishing || isLoadingDraft}
                                className={`px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all shadow-md hover:shadow-lg flex items-center gap-2 text-sm hover:scale-105 active:scale-95 ${
                                    (isPublishing || isLoadingDraft) ? 'opacity-50 cursor-not-allowed hover:scale-100 active:scale-100' : ''
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
                        <div>
                            <h2 className="text-lg font-bold text-orange-800">作品草稿箱</h2>
                            <p className="text-xs text-gray-500 mt-1">
                                {draftList.length}/{MAX_DRAFTS} 个草稿
                            </p>
                        </div>
                        <button 
                            onClick={() => setHasLoad(false)}
                            className="p-2 hover:bg-orange-50 rounded-lg transition-colors hover:scale-105 active:scale-95"
                        >
                            <X className="w-4 h-4 text-gray-500" />
                        </button>
                    </div>
                    
                    <button
                        onClick={handleResetForm}
                        className="w-full mb-4 px-4 py-3 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl text-orange-600 hover:from-orange-100 hover:to-amber-100 transition-all flex items-center justify-center gap-2 text-sm hover:scale-105 active:scale-95"
                    >
                        <Plus className="w-4 h-4" />
                        新建作品
                    </button>

                    {draftList.length >= MAX_DRAFTS && (
                        <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-xl">
                            <p className="text-xs text-orange-600 flex items-center gap-1">
                                <Inbox className="w-3 h-3" />
                                草稿箱已满，请删除一些旧草稿
                            </p>
                        </div>
                    )}

                    {isLoadingDraft && (
                        <div className="flex items-center justify-center py-8">
                            <div className="w-8 h-8 border-3 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
                        </div>
                    )}

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
                                disabled={isLoadingDraft}
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
                                disabled={isLoadingDraft}
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
                                    {imagePreviews.length}/9 张
                                </span>
                            </div>
                            
                            {/* 图片网格 */}
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mb-4">
                                {imagePreviews.map((image, index) => (
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
                                                    className="p-1.5 bg-white/90 rounded-lg hover:bg-white transition-colors hover:scale-105 active:scale-95"
                                                    title="左移"
                                                >
                                                    <MoveLeft className="w-4 h-4 text-gray-700" />
                                                </button>
                                            )}
                                            {/* 右移按钮 */}
                                            {index < imagePreviews.length - 1 && (
                                                <button
                                                    onClick={() => handleMoveImage(index, 'right')}
                                                    className="p-1.5 bg-white/90 rounded-lg hover:bg-white transition-colors hover:scale-105 active:scale-95"
                                                    title="右移"
                                                >
                                                    <MoveLeft className="w-4 h-4 text-gray-700 rotate-180" />
                                                </button>
                                            )}
                                            {/* 删除按钮 */}
                                            <button
                                                onClick={() => handleRemoveImage(image.id)}
                                                className="p-1.5 bg-red-500/90 rounded-lg hover:bg-red-500 transition-colors hover:scale-105 active:scale-95"
                                                title="删除"
                                            >
                                                <Trash2 className="w-4 h-4 text-white" />
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {/* 选择图片按钮 - 限制最多9张 */}
                                {imagePreviews.length < 9 && !isLoadingDraft && (
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="aspect-square rounded-xl border-2 border-dashed border-orange-200 hover:border-orange-400 bg-orange-50/50 hover:bg-orange-100/50 transition-all flex flex-col items-center justify-center gap-1 group hover:scale-105 active:scale-95"
                                    >
                                        <Plus className="w-8 h-8 text-orange-300 group-hover:text-orange-400 transition-colors" />
                                        <span className="text-xs text-orange-400">选择图片</span>
                                    </button>
                                )}
                            </div>

                            {/* 隐藏的文件输入 */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageSelect}
                                className="hidden"
                                disabled={isLoadingDraft}
                            />

                            {/* 图片上传提示 */}
                            <div className="p-3 bg-orange-50/50 rounded-xl border border-orange-200/50">
                                <p className="text-xs text-gray-500 flex items-center gap-2">
                                    <Image className="w-4 h-4 text-orange-400" />
                                    支持 JPG、PNG、WEBP 格式，最多选择9张，可拖拽调整顺序（图片将在发布或保存草稿时上传）
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
                                        disabled={isLoadingDraft}
                                        className={`px-3 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105 active:scale-95 ${
                                            category === cat
                                                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                                                : 'bg-white border border-orange-200 text-gray-600 hover:border-orange-400 hover:bg-orange-50'
                                        } ${isLoadingDraft ? 'opacity-50 cursor-not-allowed hover:scale-100 active:scale-100' : ''}`}
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
                            className="px-6 py-2.5 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors hover:scale-105 active:scale-95"
                        >
                            取消
                        </button>
                        <button
                            onClick={handleSaveDraft}
                            disabled={isSavingDraft || isLoadingDraft}
                            className={`px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all shadow-md hover:shadow-lg hover:scale-105 active:scale-95 ${
                                (isSavingDraft || isLoadingDraft) ? 'opacity-50 cursor-not-allowed hover:scale-100 active:scale-100' : ''
                            }`}
                        >
                            {isSavingDraft ? '保存中...' : '保存草稿'}
                        </button>
                        <button
                            onClick={handlePublish}
                            disabled={isPublishing || isLoadingDraft}
                            className={`px-6 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all shadow-md hover:shadow-lg hover:scale-105 active:scale-95 ${
                                (isPublishing || isLoadingDraft) ? 'opacity-50 cursor-not-allowed hover:scale-100 active:scale-100' : ''
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