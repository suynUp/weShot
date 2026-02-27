// Home.jsx
import { useEffect, useState } from "react";
import { X, ChevronRight, Users, Camera, Image as ImageIcon, Sparkles } from "lucide-react";
import CenterCard from "../components/homepageCard";
import { useUserLoginSuccess } from "../hooks/useUser";
import { useSearchParams } from "react-router-dom";
import { useNavigation } from "../hooks/navigation";
import SearchInput from "../components/searchInput";
import request from "../utils/request";
import { UserStore } from "../store/userStore";
import useHomePageData from "../hooks/useHomePage";
const Home = () => {
    const {goto} = useNavigation()
    const loginSuccessMutation = useUserLoginSuccess();
    const [searchParams] = useSearchParams();
    const [searchHistory, setSearchHistory] = useState(['人像摄影', '毕业季', '婚礼跟拍', '商业摄影']);
    const [showOverlay, setShowOverlay] = useState(false);
    const [inputValue, setInputValue] = useState('')

    const isLoggedIn = request.hasToken();

    const isVerified = UserStore(state=>state.isVerFied)

    const {
        displayPending, 
        displayRR, 
        displayOR, 
        displayComplete,

        allPengdings,
        rateRanking, 
        orderRanking,
        gallery 
    } = useHomePageData()

    useEffect(()=>{
        displayPending() 
        displayComplete()
        displayRR() 
        displayOR()
    },[])

    const closeOverlay = () => {
        setShowOverlay(false)
    }

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            loginSuccessMutation.mutate(token);
        } else {
            if(!isLoggedIn)
            console.warn('URL 中没有找到 token');
        }
    }, []);

    return (
        <>
            {/* 版权说明遮罩层 */}
            {showOverlay && (
                <div 
                    className="fixed inset-0 z-50 bg-gradient-to-br from-orange-500/40 via-pink-500/40 to-amber-500/40 backdrop-blur-md transition-opacity duration-300 flex items-center justify-center p-4"
                    onClick={closeOverlay}
                >
                    <div 
                        className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-8 w-full max-w-md shadow-2xl border border-orange-200/50 transform transition-all duration-300 scale-100 hover:scale-105"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                                作品版权说明
                            </h2>
                            <button 
                                onClick={closeOverlay}
                                className="p-2 hover:bg-orange-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-orange-500" />
                            </button>
                        </div>
                        
                        <div className="space-y-4 text-gray-700">
                            <div className="flex gap-3">
                                <span className="text-start text-orange-500 font-bold">1.</span>
                                <p className="text-left">摄影师上传至平台的作品，版权归属摄影师。平台仅获得展示、推广权限，未经摄影师授权，任何用户不得擅自传播。</p>
                            </div>
                            <div className="flex gap-3">
                                <span className="text-start text-orange-500 font-bold">2.</span>
                                <p className="text-left">客户通过平台合作拍摄的作品，摄影师授予客户非商用使用权（含个人收藏、朋友圈分享等），客户不得用于商业宣传、盈利等用途。</p>
                            </div>
                            <div className="flex gap-3">
                                <span className="text-start text-orange-500 font-bold">3.</span>
                                <p className="text-left">管理员有权对违规使用他人作品的内容进行删除、屏蔽。</p>
                            </div>
                        </div>
                        
                        <button 
                            onClick={closeOverlay}
                            className="mt-6 w-full px-4 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all shadow-md hover:shadow-lg font-medium"
                        >
                            同意并继续
                        </button>
                    </div>
                </div>
            )}

            {/* 主内容区域 */}
            <div className="min-h-screen bg-gradient-to-br from-orange-100 via-pink-100 to-blue-100 relative overflow-hidden">
                {/* 装饰性背景元素 */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full filter blur-3xl opacity-40 -translate-y-1/2 translate-x-1/3" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-200 rounded-full filter blur-3xl opacity-40 translate-y-1/2 -translate-x-1/3" />
                <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-orange-200 rounded-full filter blur-3xl opacity-30" />
                
                <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
                   <SearchInput
                   searchHistory={searchHistory}
                   setSearchHistory={setSearchHistory}
                   value={inputValue}
                   setValue={setInputValue}
                   />

                    {/* 中部卡片区域 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* 邀请入驻卡片 */}
                        <div className="group bg-gradient-to-br from-orange-400 to-amber-500 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 h-64">
                        <div className="h-full flex flex-col justify-between">
                            {!isVerified ? (
                            // 未入驻状态
                            <>
                                <div>
                                <Users className="w-12 h-12 text-white mb-4" />
                                <h3 className="text-2xl font-bold text-white mb-2">摄影师入驻</h3>
                                <p className="text-orange-100 text-base">分享你的摄影作品，获得更多曝光机会</p>
                                </div>
                                <button
                                onClick={() => goto('/signup')}
                                className="mt-4 px-5 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all flex items-center justify-between group text-base"
                                >
                                <span>立即入驻</span>
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </>
                            ) : (
                            // 已入驻状态
                            <>
                                <div>
                                <Users className="w-12 h-12 text-white mb-4" />
                                <h3 className="text-2xl font-bold text-white mb-2">欢迎摄影师</h3>
                                <p className="text-orange-100 text-base">你已经成功入驻，开始分享你的作品吧</p>
                                </div>
                                <div className="mt-4 px-5 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl flex items-center justify-center text-base">
                                <span>✓ 已入驻</span>
                                </div>
                            </>
                            )}
                        </div>
                        </div>
                        {/* 轮播区域 */}
                        <div className="bg-gradient-to-br from-pink-400 to-orange-400 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 h-64">
                            <div className="h-full flex flex-col">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-2xl font-bold text-white">热门推荐</h3>
                                    <Sparkles className="w-6 h-6 text-yellow-200" />
                                </div>
                                <div className="flex-1 relative overflow-hidden">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-full space-y-3">
                                            {[1, 2, 3].map((i) => (
                                                <div key={i} className="bg-white/20 backdrop-blur-sm rounded-xl p-4 animate-pulse">
                                                    <div className="flex items-center space-x-4">
                                                        <div className="w-12 h-12 bg-white/30 rounded-lg"></div>
                                                        <div className="flex-1">
                                                            <div className="h-3.5 bg-white/30 rounded w-3/4 mb-2"></div>
                                                            <div className="h-3 bg-white/20 rounded w-1/2"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-center mt-4 space-x-2">
                                    <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                                    <div className="w-2.5 h-2.5 bg-white/50 rounded-full"></div>
                                    <div className="w-2.5 h-2.5 bg-white/50 rounded-full"></div>
                                </div>
                            </div>
                        </div>

                        {/* 个人主页卡片 */}
                        <div className="group bg-gradient-to-br from-blue-400 to-pink-400 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 h-64">
                            <div className="h-full flex flex-col justify-between">
                                <div>
                                    <Camera className="w-12 h-12 text-white mb-4" />
                                    <h3 className="text-2xl font-bold text-white mb-2">个人主页</h3>
                                    <p className="text-blue-100 text-base">管理你的作品集和个人信息</p>
                                </div>
                                {isLoggedIn ? (
                                    <button onClick={()=>goto('/profile')} className="mt-4 px-5 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all flex items-center justify-between group text-base">
                                        <span>查看主页</span>
                                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                ):(
                                    <button onClick={()=>goto('/login')} className="mt-4 px-5 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all flex items-center justify-between group text-base">
                                        <span>立即登录</span>
                                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </button>)}
                            </div>
                        </div>
                    </div>

                    {/* 底部卡片区域 - 三列等高布局，无滚动条 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* 客单广场 */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-orange-200/50 flex flex-col h-[480px]">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-orange-800">客单广场</h3>
                                <span className="text-sm bg-orange-100 text-orange-600 px-3 py-1.5 rounded-full">最新6单</span>
                            </div>
                            <div className="flex-1 overflow-y-auto pr-1" style={{
                                scrollbarWidth: 'thin',
                                scrollbarColor: '#f97316 #fff1e6'
                            }}>
                                <div className="space-y-3">
                                    {allPengdings.map((order) => (
                                        <div key={order.orderId} className="flex items-center justify-between p-3 hover:bg-orange-50 rounded-xl transition-colors">
                                            <div className="flex items-center space-x-3">
                                                <img src={order.customerAvatar} className="w-12 h-12 rounded-xl flex-shrink-0"></img>
                                                <div className="min-w-0">
                                                    <p className="text-start text-sm font-medium text-gray-700 truncate">{order.type}</p>
                                                    <p className="text-xs text-gray-500 truncate">发起人：{order.customerName}</p>
                                                </div>
                                            </div>
                                            <button className="text-xs px-2 py-1 text-orange-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors flex-shrink-0">
                                                查看
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div 
                            onClick={()=>goto('/pendingorders')}
                            className="cursor-pointer hover:bg-orange-200 hover:shadow-lg transition-all duration-200 w-[95%] items-center justify-center text-orange-500 text-[12px] bg-orange-100 flex h-[35px] mt-2 mx-auto rounded-lg">
                                进入广场
                            </div>
                        </div>

                        {/* 中心卡片 - 与CenterCard完全匹配，无标题，无滚动 */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-orange-200/50 h-[480px]">
                            <CenterCard
                            OrderRanking={orderRanking}
                            RatingRanking={rateRanking}
                             />
                        </div>

                        {/* 作品展示 */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-orange-200/50 flex flex-col h-[480px]">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-orange-800">作品展示</h3>
                                <ImageIcon className="w-5 h-5 text-orange-400" />
                            </div>
                            <div className="flex-1 overflow-y-auto pr-1" style={{
                                scrollbarWidth: 'thin',
                                scrollbarColor: '#f97316 #fff1e6'
                            }}>
                                <div className="grid grid-cols-2 gap-3">
                                   {gallery.map((o) => (
                                    <div 
                                        key={o.order_id} 
                                        className="aspect-square rounded-xl overflow-hidden cursor-pointer relative group"
                                    >
                                        <img 
                                        src={o.cover_url||null} 
                                        alt="gallery"
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                        />
                                        {/* 遮罩层 - hover时变暗 */}
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />
                                        
                                        {/* 查看文字 */}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <span className="text-white text-sm font-medium px-4 py-2 bg-black/50 rounded-full backdrop-blur-sm">
                                            查看
                                        </span>
                                        </div>
                                    </div>
                                    ))}
                                </div>
                            </div>
                            <button
                            onClick={()=>goto('/gallery')}
                            className="w-full mt-4 px-4 py-2.5 text-sm text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-xl transition-colors flex-shrink-0">
                                查看更多作品
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 为了支持WebKit浏览器的滚动条样式，添加一个style标签 */}
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
        </>
    );
};

export default Home;