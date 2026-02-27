import { Trash, PenLine, Clock, MapPin, FileText, Image as ImageIcon } from "lucide-react";

const DraftShifter = ({ draftlist, setLoadId, deleteDraft, hasLoaded }) => {
    // 自定义滚动条样式
    const scrollbarStyles = {
        customScrollbar: {
            scrollbarWidth: 'thin',
            scrollbarColor: '#f97316 #fef3c7',
        }
    };

    // 判断草稿类型并获取显示内容
    const getDraftContent = (draft) => {
        // 如果有 orderId，说明是订单草稿
        if (draft.orderId) {
            return {
                id: draft.orderId,
                title: draft.title || '未命名订单',
                savedAt: draft.savedAt || '未知时间',
                location: draft.location || '未填写地点',
                description: draft.description || '暂无描述',
                type: 'order',
                icon: <MapPin className="w-3.5 h-3.5 mr-2 text-orange-400 flex-shrink-0" />,
                time: draft.createdAt || draft.time
            };
        }
        
        // 如果有 postId，说明是作品草稿
        if (draft.postId) {
            return {
                id: draft.postId,
                title: draft.title || '未命名作品',
                savedAt: draft.createdAt ? formatDateTime(draft.createdAt) : '未知时间',
                location: '作品草稿',
                type: 'post',
                icon: <ImageIcon className="w-3.5 h-3.5 mr-2 text-orange-400 flex-shrink-0" />,
                time: draft.createdAt
            };
        }

        // 默认情况
        return {
            id: draft.id,
            title: '未知草稿',
            savedAt: '未知时间',
            location: '未知',
            type: 'unknown',
            icon: <FileText className="w-3.5 h-3.5 mr-2 text-orange-400 flex-shrink-0" />
        };
    };

    // 格式化日期时间
    const formatDateTime = (dateTimeStr) => {
        if (!dateTimeStr) return '未知时间';
        try {
            const date = new Date(dateTimeStr);
            return date.toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return dateTimeStr;
        }
    };

    // 获取草稿类型标签
    const getTypeTag = (type) => {
        switch(type) {
            case 'order':
                return (
                    <span className="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                        订单草稿
                    </span>
                );
            case 'post':
                return (
                    <span className="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                        作品草稿
                    </span>
                );
            default:
                return (
                    <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                        草稿
                    </span>
                );
        }
    };

    // 如果没有草稿，显示空状态
    if (!draftlist || draftlist.length === 0) {
        return (
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-8 text-center border border-orange-200/50">
                <FileText className="w-12 h-12 text-orange-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">暂无草稿</p>
                <p className="text-gray-400 text-xs mt-1">新建的草稿将显示在这里</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {/* 草稿箱标题 */}
            <div className="flex items-center justify-between mb-2 px-1">
                <h3 className="text-sm font-medium text-orange-700">我的草稿</h3>
                <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
                    共 {draftlist.length} 个
                </span>
            </div>

            {/* 草稿列表 - 使用内联样式或Tailwind的任意值 */}
            <div 
                className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-orange-400 scrollbar-track-orange-50"
                style={scrollbarStyles.customScrollbar}
            >
                {draftlist.map((draft, index) => {
                    const content = getDraftContent(draft);
                    
                    return (
                        <div 
                            key={content.id} 
                            className="group relative bg-gradient-to-br from-white to-orange-50/50 rounded-xl border border-orange-200/50 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                        >
                            {/* 统一使用橙色装饰线条 */}
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-400 to-amber-400" />
                            
                            <div className="p-4 pl-5">
                                {/* 顶部操作栏 */}
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        {getTypeTag(content.type)}
                                        <span className="text-xs text-gray-400">
                                            #{index + 1}
                                        </span>
                                    </div>
                                    <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={() => {
                                                setLoadId(content.id);
                                                hasLoaded(true);
                                            }}
                                            className="p-1.5 hover:bg-orange-100 rounded-lg transition-colors"
                                            title="编辑"
                                        >
                                            <PenLine className="w-4 h-4 text-orange-500" />
                                        </button>
                                        <button 
                                            onClick={() => deleteDraft(content.id)}
                                            className="p-1.5 hover:bg-red-100 rounded-lg transition-colors"
                                            title="删除"
                                        >
                                            <Trash className="w-4 h-4 text-red-400 hover:text-red-500" />
                                        </button>
                                    </div>
                                </div>

                                {/* 草稿内容 */}
                                <div className="space-y-2">
                                    {/* 标题/主要内容 */}
                                    <div className="flex items-center text-sm text-gray-600">
                                        {content.icon}
                                        <span className="truncate font-medium text-gray-800">
                                            {content.title}
                                        </span>
                                    </div>

                                    {/* 时间信息 */}
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Clock className="w-3.5 h-3.5 mr-2 text-orange-400 flex-shrink-0" />
                                        <span className="truncate">
                                            {content.type === 'post' ? '创建于 ' : '上次编辑于 '}
                                            <span className="text-gray-800 font-medium">
                                                {content.savedAt}
                                            </span>
                                        </span>
                                    </div>
                                    
                                    {/* 地点信息 - 只对订单草稿显示实际地点 */}
                                    {content.type === 'order' && (
                                        <div className="flex items-center text-sm text-gray-600">
                                            <MapPin className="w-3.5 h-3.5 mr-2 text-orange-400 flex-shrink-0" />
                                            <span className="truncate">
                                                拍摄地点 <span className="text-gray-800 font-medium">{content.location}</span>
                                            </span>
                                        </div>
                                    )}

                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DraftShifter;