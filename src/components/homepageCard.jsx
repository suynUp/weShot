// components/homepageCard.jsx (优化后的CenterCard)
import { useNavigation } from "../hooks/navigation";
import { Users, PenSquare, Trophy, MessageCircle, Star, Camera } from "lucide-react";

const CenterCard = ({RatingRanking,OrderRanking}) => {
    const { goto } = useNavigation();

    return (
        <div className="grid grid-cols-2 gap-4 w-full h-full">
            {/* 合并后的摄影师列表+排行榜卡片 */}
            <div 
                className="cursor-pointer bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 border border-orange-100/50 hover:scale-[1.02] group flex flex-col col-span-2"
                onClick={() => goto('/photographers')}
            >
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <Camera className="w-5 h-5 text-orange-600" />
                        </div>
                        <h3 className="text-lg font-bold text-orange-800">摄影师列表 · 排行榜</h3>
                    </div>
                    <div className="text-xs text-orange-500 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        查看全部 <span>→</span>
                    </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">浏览专业摄影师，查看单量榜和评分榜</p>
                
                {/* 预览数据 */}
                <div className="grid grid-cols-2 gap-3 mt-1">
                    {/* 单量榜预览 */}
                    <div className="bg-white/60 backdrop-blur-sm rounded-lg p-2">
                        <div className="flex items-center gap-1 mb-2">
                            <Trophy className="w-3.5 h-3.5 text-yellow-500" />
                            <span className="text-xs font-medium text-gray-700">单量排行</span>
                        </div>
                        <div className="space-y-1.5">
                            {OrderRanking.map((i,index) => (
                                <div key={i.cas_id} className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-gray-400 w-4">#{index+1}</span>
                                    <img src={i.avatar_url} className="w-4 h-4 rounded-full flex-shrink-0" />
                                    <span className="text-[10px] text-gray-600 truncate flex-1">
                                        {i.nickname}
                                    </span>
                                    <span className="text-[10px] font-medium text-gray-700">{i.orderCount}单</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* 评分榜预览 */}
                    <div className="bg-white/60 backdrop-blur-sm rounded-lg p-2">
                        <div className="flex items-center gap-1 mb-2">
                            <Star className="w-3.5 h-3.5 text-yellow-500" />
                            <span className="text-xs font-medium text-gray-700">评分排行</span>
                        </div>
                        <div className="space-y-1.5">
                            {RatingRanking.map((i,index) => (
                                <div key={i.cas_id} className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-gray-400 w-4">#{index+1}</span>
                                    <img src={i.avatar_url} className="w-4 h-4 rounded-full flex-shrink-0" />
                                    <span className="text-[10px] text-gray-600 truncate flex-1">
                                        {i.nickname}
                                    </span>
                                    <span className="text-[10px] font-medium text-gray-700">{i.ratingCount}分</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            
            {/* 发表需求卡片 */}
            <div 
                className="cursor-pointer bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 border border-blue-100/50 hover:scale-[1.02] group flex flex-col"
                onClick={() => goto('/launch')}
            >
                <div className="mb-2">
                    <PenSquare className="w-6 h-6 text-blue-500 group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-base font-bold text-blue-800 mb-1">发表需求</h3>
                <p className="text-xs text-gray-600 flex-1">发布摄影需求</p>
                <div className="mt-2 text-[10px] text-blue-500 group-hover:translate-x-1 transition-transform">
                    发布 →
                </div>
            </div>
            
            {/* 摄影实践圈卡片 */}
            <div 
                className="cursor-pointer bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 border border-green-100/50 hover:scale-[1.02] group flex flex-col"
                onClick={() => goto('/community')}
            >
                <div className="mb-2">
                    <MessageCircle className="w-6 h-6 text-green-500 group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-base font-bold text-green-800 mb-1">摄影实践圈</h3>
                <p className="text-xs text-gray-600 flex-1">加入交流社区</p>
                <div className="mt-2 text-[10px] text-green-500 group-hover:translate-x-1 transition-transform">
                    加入 →
                </div>
            </div>
        </div>
    );
};

export default CenterCard;