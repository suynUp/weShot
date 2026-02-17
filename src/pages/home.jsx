import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import CenterCard from "../components/homepageCard";
import { useUserLoginSuccess } from "../hooks/useUser";
import { useSearchParams } from "react-router-dom";

const Home = () => {

    const loginSuccessMutation = useUserLoginSuccess()

    const [searchParams] = useSearchParams();
    const [isFocused, setIsFocused] = useState(false);
    const [searchHistory, setSearchHistory] = useState(['你好','不好']);

    const [showOverlay, setShowOverlay] = useState(true); // 新增：遮罩层状态

    useEffect(()=>{
        const token = searchParams.get('token');
            
        if (token) {
            loginSuccessMutation.mutate(token);
        } else {
            console.warn('URL 中没有找到 token');
        }
        
    }, [])

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    // 新增：关闭遮罩层
    const closeOverlay = () => {
        setShowOverlay(false);
    };

    return<>
    {showOverlay && (
        <div 
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
            onClick={closeOverlay} // 点击遮罩层关闭
        >
            {/* 可以在遮罩层中添加内容，比如模态框 */}
            <div 
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-8 w-96 shadow-2xl"
                onClick={(e) => e.stopPropagation()} // 阻止事件冒泡
            >
                <h2 className="text-xl font-bold mb-4">作品版权说明</h2>
                <p>
                    1.摄影师上传至平台的作品，版权归属摄影师。平台仅获得展示、推广权限，未经摄影师授权，任何用户不得擅自传播。
                </p>
                <p>                    
                    2.客户通过平台合作拍摄的作品，摄影师授予客户非商用使用权（含个人收藏、朋友圈分享等），客户不得用于商业宣传、盈利等用途。
                </p>
                <p>
                    3.管理员有权对违规使用他人作品的内容进行删除、屏蔽。
                </p>
                <button 
                    onClick={closeOverlay}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                    同意
                </button>
            </div>
        </div>
    )}

    <div className="">
        <div className="w-3xl">
            <div className={`relative bg-gray-100 m-[5%] ${isFocused?'rounded-t-lg':'rounded-lg'}`}>
                <div className="flex py-[10px] ">
                    <Search className="m-[5px]"></Search>      
                    <input 
                        onFocus={handleFocus}
                        onBlur={handleBlur} 
                        className="w-[95%] focus:outline-none"
                        placeholder="查找点什么吧"
                    />
                </div>
                <div>
                    <div className={`absolute bg-gray-100 rounded-b-lg w-full top-full shadow-lg transition-all duration-500 ${isFocused?'opacity-100':'opacity-0'}`}>
                        {searchHistory.map((history) => (
                            <div key={history}>{history}</div>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        <div className="flex h-[400px] mb-[2%]" >
            <div className="rounded-lg  p-[10px] flex-[1] bg-yellow-100 mx-5">
                <div>邀请邀请</div>
                <button>入入的驻</button>
            </div>

            <div className="flex-[2] mx-5">
                <div className="rounded-lg p-[10px] bg-yellow-100 h-full">
                    我是滑动轮盘
                </div>
                 <div className="absolute inset-x-0 m-auto bg-gray-100 w-[80px] h-[20px] flex items-center justify-center">
                    ...
                </div>
            </div>

            <div className="rounded-lg p-[10px] flex-[1] bg-yellow-100 mx-5">
                个人主页
            </div>
        </div>

        <div className="flex h-[400px]">
            <div className="flex-[1] rounded-lg mx-5 p-[10px] shadow-lg">客单广场</div>
            <div className="flex-[2] rounded-lg mx-5  shadow-lg">
                <div className="h-full">
                    <CenterCard/>
                </div>
            </div>
            <div className="flex-[1] rounded-lg mx-5 p-[10px] shadow-lg">
                作品展示
            </div>
        </div>
    </div>
    </>
}

export default Home