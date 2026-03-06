// Home.jsx 中修改轮播区域部分

import { useEffect, useState } from "react";
import { X, ChevronRight, Users, Camera, Image as ImageIcon, Sparkles, Bell, MessageCircle } from "lucide-react"; // 添加 Bell, MessageCircle
import CenterCard from "../components/homepageCard";
import { useUserLoginSuccess } from "../hooks/useUser";
import { useSearchParams } from "react-router-dom";
import { useNavigation } from "../hooks/navigation";
import SearchInput from "../components/searchInput";
import request from "../utils/request";
import { UserStore } from "../store/userStore";
import useHomePageData from "../hooks/useHomePage";
import { useGetSuggestions as useGetPhotographerSuggestions } from "../hooks/usePhotographer";
import { useSearchSuggestWithDebounce } from "../hooks/usePost";
import photographerStore from "../store/photographerStore";
import postStore from "../store/postStore";
import { useGetAnnouncements } from "../hooks/useUser"; // 导入公告hooks
import FeedbackModal from "../components/feedBackModel";

const Home = () => {
    const {goto} = useNavigation()
    const loginSuccessMutation = useUserLoginSuccess();
    const [searchParams] = useSearchParams();
    const [searchHistory, setSearchHistory] = useState(['人像摄影', '毕业季', '婚礼跟拍', '商业摄影']);
    const [showOverlay, setShowOverlay] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0); // 当前显示的索引（包括公告和反馈）
    const [announcements, setAnnouncements] = useState([]); // 公告列表

    const photographerSuggestions = photographerStore(state => state.phgSuggestions)
    const postSuggestions = postStore(state => state.suggestions)

    const [mergedSuggestions, setMergedSuggestions] = useState([]);
    const [showFeedback, setShowFeedback] = useState(false);


    const isLoggedIn = request.hasToken();
    const isVerified = UserStore(state=>state.isVerFied)

    // 获取公告hooks
    const getAnnouncements = useGetAnnouncements();

    // 获取搜索建议hooks
    const getPhotographerSuggestions = useGetPhotographerSuggestions();
    const getPostSuggestions = useSearchSuggestWithDebounce();

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

    // 获取公告列表
    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const res = await getAnnouncements.mutateAsync();
                if (res.code === 200 && res.data) {
                    setAnnouncements(res.data);
                }
            } catch (error) {
                console.error('获取公告失败:', error);
            }
        };
        fetchAnnouncements();
    }, []);

    // 轮播自动切换（包括公告和反馈）
    useEffect(() => {
        // 总项目数 = 公告数量 + 1个反馈入口
        const totalItems = announcements.length + 1;
        if (totalItems > 1) {
            const timer = setInterval(() => {
                setCurrentIndex((prev) => 
                    prev < totalItems - 1 ? prev + 1 : 0
                );
            }, 5000); // 每5秒切换

            return () => clearInterval(timer);
        }
    }, [announcements]);

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

    // 合并搜索建议
    useEffect(() => {
        // 合并摄影师和帖子的建议，去重
        const allSuggestions = [...photographerSuggestions, ...postSuggestions];
        const uniqueSuggestions = [...new Set(allSuggestions)];
        setMergedSuggestions(uniqueSuggestions.slice(0, 8)); // 最多显示8条
    }, [photographerSuggestions, postSuggestions]);

    // 处理摄影师搜索建议 - 防抖
    useEffect(() => {
        const fetchPhotographerSuggestions = async () => {
            if (inputValue.trim()) getPhotographerSuggestions.mutateAsync(inputValue);
        };

        const debounceTimer = setTimeout(fetchPhotographerSuggestions, 300);
        return () => clearTimeout(debounceTimer);
    }, [inputValue]);

    // 处理帖子搜索建议 - 防抖
    useEffect(() => {
        const fetchPostSuggestions = async () => {
            if (inputValue.trim())
                    getPostSuggestions.mutateAsync(inputValue);
        };

        fetchPostSuggestions()
    }, [inputValue]);

    // 处理搜索
    const handleSearch = (keyword) => {
        if (keyword.trim()) {
            goto(`/search?q=${encodeURIComponent(keyword)}`);
        }
    };

    // 格式化日期
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };


    // 处理反馈提交
    const handleFeedbackSubmit = async (data) => {
        // 调用API提交反馈
        console.log('提交的反馈数据:', data);
        // const res = await request.post('/feedback', data);
    };

    // 判断当前显示的是公告还是反馈
    const isFeedback = currentIndex === announcements.length;

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
                        onSearch={handleSearch}
                        suggest={mergedSuggestions} // 传入合并后的搜索建议
                        suggestTitle="搜索摄影师或作品" // 可选：自定义建议标题
                   />

                    {/* 中部卡片区域 - 三列等高布局 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* 邀请入驻卡片 - 保持不变 */}
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
                        
                        {/* 公告&反馈轮播区域 - 改为公告+反馈轮播 */}
<div className="bg-gradient-to-br from-pink-400 to-orange-400 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 h-64 overflow-hidden">
    <div className="h-full flex flex-col">
        <div className="flex justify-between items-center mb-3">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                {isFeedback ? (
                    <>
                        <MessageCircle className="w-5 h-5" />
                        意见反馈
                    </>
                ) : (
                    <>
                        <Bell className="w-5 h-5" />
                        平台公告
                    </>
                )}
            </h3>
            <Sparkles className="w-5 h-5 text-yellow-200" />
        </div>
        
        <div className="flex-1 relative">
            {/* 反馈入口 - 优化排版，确保内容不超出 */}
            {isFeedback ? (
                <div 
                    className="absolute inset-0 flex flex-col animate-fadeIn cursor-pointer"
                    onClick={() => setShowFeedback(true)}
                >
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 h-full flex flex-col">
                        <div className="flex-1 flex flex-col items-center justify-center">
                            <div className="w-16 h-16 bg-white/30 rounded-2xl flex items-center justify-center mb-2">
                                <MessageCircle className="w-8 h-8 text-white" />
                            </div>
                            <h4 className="text-white font-semibold text-base mb-1 text-center">
                                告诉我们你的想法
                            </h4>
                        </div>
                        <button className="mt-1 w-full py-2 bg-white/30 text-white rounded-lg hover:bg-white/40 transition-colors text-sm font-medium">
                            立即反馈
                        </button>
                    </div>
                </div>
            ) : (
                // 公告内容 - 中文排版优化：首行缩进2字符，左对齐
                announcements.length > 0 && announcements[currentIndex] ? (
                    <div className="absolute inset-0 flex flex-col animate-fadeIn">
                        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 h-full flex flex-col">
                            <h4 className="text-white font-semibold text-base mb-2 leading-relaxed pl-0">
                                {announcements[currentIndex]?.title}
                            </h4>
                            <div className="flex-1 overflow-y-auto mb-2 pr-1" style={{
                                scrollbarWidth: 'thin',
                                scrollbarColor: 'rgba(255,255,255,0.5) transparent'
                            }}>
                                <p className="text-white/90 text-xs leading-relaxed break-words whitespace-pre-wrap"
                                   style={{
                                       textIndent: '2em', // 首行缩进2字符
                                       textAlign: 'left'
                                   }}>
                                    {announcements[currentIndex]?.content}
                                </p>
                            </div>
                            {/* 日期放在右下角 */}
                            <div className="flex justify-end mt-auto">
                                <span className="text-white/60 text-[10px] bg-white/10 px-2 py-1 rounded-full">
                                    {formatDate(announcements[currentIndex]?.created_at)}
                                </span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex items-center justify-center">
                        <p className="text-white/80 text-sm text-center">暂无公告</p>
                    </div>
                )
            )}

            {/* 分页指示器 - 显示所有公告+反馈的总数 */}
            {announcements.length > 0 && (
                <div className="absolute -bottom-3 left-0 right-0 flex justify-center space-x-1.5">
                    {[...Array(announcements.length + 1)].map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`transition-all rounded-full ${
                                index === currentIndex 
                                    ? 'w-3 h-1.5 bg-white' 
                                    : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/60'
                            }`}
                        />
                    ))}
                </div>
            )}
        </div>
    </div>
</div>

{/* 添加自定义滚动条样式 */}
<style>{`
    .overflow-y-auto::-webkit-scrollbar {
        width: 2px;
    }
    .overflow-y-auto::-webkit-scrollbar-track {
        background: transparent;
    }
    .overflow-y-auto::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.3);
        border-radius: 10px;
    }
    .overflow-y-auto::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.5);
    }
`}</style>

                        {/* 个人主页卡片 - 完全保留原样 */}
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

                    {/* 底部卡片区域 - 保持不变 */}
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
                                                <img src={order.customerAvatar} className="w-12 h-12 rounded-xl flex-shrink-0" alt="avatar"></img>
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

                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-orange-200/50 h-[480px]">
                            <CenterCard
                            OrderRanking={orderRanking}
                            RatingRanking={rateRanking}
                             />
                        </div>

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
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />
                                        <div
                                            onClick={()=>{
                                                goto(`/gallery?order_id=${o.order_id}`)
                                            }}
                                         className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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

            <FeedbackModal 
                isOpen={showFeedback}
                onClose={() => setShowFeedback(false)}
                onSubmit={handleFeedbackSubmit}
            />

            {/* 样式 */}
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
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.5s ease forwards;
                }
                .line-clamp-3 {
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </>
    );
};

export default Home;