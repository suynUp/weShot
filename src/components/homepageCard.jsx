// components/homepageCard.jsx (优化后的CenterCard)
import { useNavigation } from "../hooks/navigation";
import { PenSquare, Trophy, MessageCircle, Star, Camera } from "lucide-react";

const CenterCard = ({RatingRanking,OrderRanking}) => {
    const { goto } = useNavigation();

    const getNum = (num) => {
        return Number(num).toFixed(1);
    }

    return (
        <div className="grid grid-cols-2 gap-4 w-full h-full">
            {/* 合并后的摄影师列表+排行榜卡片 - 白色底色，橙色点缀 */}
            <div 
                className="cursor-pointer bg-white/90 backdrop-blur-sm rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 border border-orange-200/50 hover:scale-[1.02] group flex flex-col col-span-2"
                onClick={() => goto('/photographers')}
            >
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-1 bg-orange-100 rounded-lg">
                            <img src="/src/assets/userImg/摄影师列表图标.png" alt="摄影师" className="w-10 h-10 text-orange-500" />
                        </div>
                        <h3 className="text-lg font-bold text-orange-700">摄影师列表 · 排行榜</h3>
                    </div>
                    <div className="text-xs text-orange-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        查看全部 <span>→</span>
                    </div>
                </div>
                
                <p className="text-sm text-gray-500 mb-3">浏览专业摄影师，查看单量榜和评分榜</p>
                
                {/* 预览数据 */}
                <div className="grid grid-cols-2 gap-3 mt-1">
                    {/* 单量榜预览 - 更白的底色 */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-2 border border-orange-100">
                        <div className="flex items-center gap-1 mb-2">
                            <Trophy className="w-3.5 h-3.5 text-orange-400" />
                            <span className="text-xs font-medium text-orange-600">单量排行</span>
                        </div>
                        <div className="space-y-1.5">
                            {OrderRanking.map((i,index) => (
                                <div key={i.cas_id} className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-orange-300 w-4">#{index+1}</span>
                                    <img src={i.avatar_url} className="w-4 h-4 rounded-full flex-shrink-0 border border-orange-100" />
                                    <span className="text-[10px] text-gray-500 truncate flex-1">
                                        {i.nickname}
                                    </span>
                                    <span className="text-[10px] font-medium text-orange-500">{i.orderCount}单</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* 评分榜预览 - 更白的底色 */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-2 border border-orange-100">
                        <div className="flex items-center gap-1 mb-2">
                            <Star className="w-3.5 h-3.5 text-orange-400" />
                            <span className="text-xs font-medium text-orange-600">评分排行</span>
                        </div>
                        <div className="space-y-1.5">
                            {RatingRanking.map((i,index) => (
                                <div key={i.cas_id} className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-orange-300 w-4">#{index+1}</span>
                                    <img src={i.avatar_url} className="w-4 h-4 rounded-full flex-shrink-0 border border-orange-100" />
                                    <span className="text-[10px] text-gray-500 truncate flex-1">
                                        {i.nickname}
                                    </span>
                                    <span className="text-[10px] font-medium text-orange-500">{getNum(i.avgScore)}分</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            
            {/* 发表需求卡片 - 白色底色 */}
            <div 
                className="cursor-pointer bg-white/90 backdrop-blur-sm rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 border border-orange-200/50 hover:scale-[1.02] group flex flex-col"
                onClick={() => goto('/launch')}
            >
                <div className="mb-2 flex">
                    <div className="p-1 bg-orange-100 rounded-lg flex items-center justify-center">
                        <img src="/src/assets/userImg/添加框图标.png" alt="相机" className="w-8 h-8 text-orange-500 group-hover:scale-110 transition-transform" />
                    </div>
                </div>
                <h3 className="text-base font-bold text-orange-700 mb-1">发表需求</h3>
                <p className="text-xs text-gray-500 flex-1">发布摄影需求，寻找合适摄影师</p>
                <div className="mt-2 text-[10px] text-orange-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    立即发布 <span>→</span>
                </div>
            </div>
            
            {/* 摄影实践圈卡片 - 白色底色 */}
            <div 
                className="cursor-pointer bg-white/90 backdrop-blur-sm rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 border border-orange-200/50 hover:scale-[1.02] group flex flex-col"
                onClick={() => goto('/community')}
            >
                <div className="mb-2 flex">
                    <div className="p-1 bg-orange-100 rounded-lg flex items-center justify-center">
                        <img src="/src/assets/userImg/摄影实践圈图标.png" alt="社区" className="w-8 h-8 text-orange-500 group-hover:scale-110 transition-transform" />
                    </div>
                </div>
                <h3 className="text-base font-bold text-orange-700 mb-1">摄影实践圈</h3>
                <p className="text-xs text-gray-500 flex-1">加入交流社区，分享摄影心得</p>
                <div className="mt-2 text-[10px] text-orange-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    立即进入 <span>→</span>
                </div>
            </div>
        </div>
    );
};

export default CenterCard;