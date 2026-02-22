import { Trash, PenLine, Clock, MapPin, FileText } from "lucide-react";

const DraftShifter = ({ draftlist, setLoadId, deleteDraft, hasLoaded }) => {
    // 自定义滚动条样式
    const scrollbarStyles = {
        customScrollbar: {
            scrollbarWidth: 'thin',
            scrollbarColor: '#f97316 #fef3c7',
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
                {draftlist.map((d, index) => (
                    <div 
                        key={d.orderId} 
                        className="group relative bg-gradient-to-br from-white to-orange-50/50 rounded-xl border border-orange-200/50 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                    >
                        {/* 装饰性色条 */}
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-400 to-amber-400" />
                        
                        <div className="p-4 pl-5">
                            {/* 顶部操作栏 */}
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                                    草稿 #{index + 1}
                                </span>
                                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => {
                                            setLoadId(d.orderId);
                                            hasLoaded(true);
                                        }}
                                        className="p-1.5 hover:bg-orange-100 rounded-lg transition-colors"
                                        title="编辑"
                                    >
                                        <PenLine className="w-4 h-4 text-orange-500" />
                                    </button>
                                    <button 
                                        onClick={() => deleteDraft(d.orderId)}
                                        className="p-1.5 hover:bg-red-100 rounded-lg transition-colors"
                                        title="删除"
                                    >
                                        <Trash className="w-4 h-4 text-red-400 hover:text-red-500" />
                                    </button>
                                </div>
                            </div>

                            {/* 草稿内容 */}
                            <div className="space-y-2">
                                <div className="flex items-center text-sm text-gray-600">
                                    <Clock className="w-3.5 h-3.5 mr-2 text-orange-400 flex-shrink-0" />
                                    <span className="truncate">
                                        上次编辑于 <span className="text-gray-800 font-medium">{d.savedAt}</span>
                                    </span>
                                </div>
                                
                                <div className="flex items-center text-sm text-gray-600">
                                    <MapPin className="w-3.5 h-3.5 mr-2 text-orange-400 flex-shrink-0" />
                                    <span className="truncate">
                                        拍摄地点 <span className="text-gray-800 font-medium">{d.location}</span>
                                    </span>
                                </div>

                                {/* 可选：如果有其他信息可以继续添加 */}
                                {d.description && (
                                    <div className="flex items-center text-sm text-gray-600">
                                        <FileText className="w-3.5 h-3.5 mr-2 text-orange-400 flex-shrink-0" />
                                        <span className="truncate text-gray-500">{d.description}</span>
                                    </div>
                                )}
                            </div>

                            {/* 底部时间戳（可选） */}
                            {d.time && (
                                <div className="mt-3 text-[10px] text-gray-400 border-t border-orange-100/50 pt-2">
                                    创建于 {d.time}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DraftShifter;