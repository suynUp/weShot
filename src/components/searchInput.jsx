import { useEffect, useRef, useState, } from "react"
import { Search, X } from "lucide-react";

const SearchInput = ({
    searchHistory = [],
    suggest = [],           // 从 props 接收 suggest,
    searchFn,   //进行搜索
    clearAll,
    deleteOne,
    value,
    setValue
}) => {
    
    const searchRef = useRef()
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsFocused(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);  

    const handleFocus = () => setIsFocused(true);

    // 处理输入变化
    const handleSuggest = (e) => {
        const newValue = e.target.value;
        setValue(newValue);
    };

    const handleSearch = async (keyword) => {
        const searchKeyword = keyword !== null ? keyword : value;
        
        // 空搜索不处理
        if (!searchKeyword.trim()) return;
        
        try {
            await searchFn.mutate(searchKeyword);
            setIsFocused(false); // 搜索后关闭下拉框
        } catch(e) {
            console.log(e);
        }
    };

    const removeHistoryItem = (item, e) => {
        e.stopPropagation();
        if (deleteOne) {
            deleteOne(item);
        }else{
            console.log('没有配置fn')
        } 
    };

    // 处理键盘事件
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch(null);
        }
    };

    // 清空输入
    const handleClearInput = () => {
        setValue('');
    };

    return (
        <div className="max-w-3xl mx-auto mb-12 relative z-20" ref={searchRef}>
            <div className={`relative bg-white/80 backdrop-blur-sm shadow-lg transition-all duration-300 ${
                isFocused ? 'rounded-t-2xl shadow-xl' : 'rounded-2xl hover:shadow-xl'
            }`}>
                <div className="flex items-center px-4 py-3">
                    <Search className="w-5 h-5 text-orange-400 mr-3" />
                    <input 
                        onFocus={handleFocus}
                        onKeyDown={handleKeyDown}
                        className="w-full bg-transparent focus:outline-none text-gray-700 placeholder-gray-400"
                        placeholder="查找摄影师、作品或灵感..."
                        value={value}
                        onChange={handleSuggest}
                    />
                    {/* 添加清空按钮 */}
                    {value && (
                        <button 
                            onClick={handleClearInput}
                            className="p-1 hover:bg-gray-100 rounded-full"
                        >
                            <X className="w-4 h-4 text-gray-400" />
                        </button>
                    )}
                </div>
                
                {/* 搜索下拉框 */}
                <div className={`absolute bg-white/95 backdrop-blur-sm rounded-b-2xl w-full top-full shadow-xl transition-all duration-300 overflow-hidden z-50 ${
                    isFocused ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                    <div className="p-4 border-t border-orange-100">
                        {/* 有搜索词且有建议时显示建议 */}
                        {value.trim() && suggest.length > 0 ? (
                            <div>
                                <div className="flex justify-between items-center mb-3 px-2">
                                    <span className="text-sm font-medium text-orange-600">搜索建议</span>
                                </div>
                                <div className="space-y-1">
                                    {suggest.map((item, index) => (
                                        <div 
                                            key={index} 
                                            className="flex justify-between items-center px-3 py-2.5 hover:bg-orange-50 rounded-lg transition-colors group cursor-pointer"
                                            onClick={() => handleSearch(item)}
                                        >
                                            <span className="text-gray-600 text-sm">{item}</span>
                                            <Search className="w-3.5 h-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            /* 没有搜索词或没有建议时显示搜索历史 */
                            <div>
                                <div className="flex justify-between items-center mb-3 px-2">
                                    <span className="text-sm font-medium text-orange-600">最近搜索</span>
                                    {searchHistory.length > 0 && (
                                        <button 
                                            onClick={() => {
                                                if (clearAll) clearAll();
                                            }}
                                            className="text-xs text-gray-400 hover:text-orange-500 transition-colors"
                                        >
                                            清除全部
                                        </button>
                                    )}
                                </div>
                                {searchHistory.length > 0 ? (
                                    <div className="space-y-1">
                                        {searchHistory.map((history) => (
                                            <div 
                                                key={history} 
                                                className="flex justify-between items-center px-3 py-2.5 hover:bg-orange-50 rounded-lg transition-colors group cursor-pointer"
                                                onClick={() => handleSearch(history)}
                                            >
                                                <span className="text-gray-600 text-sm">{history}</span>
                                                <button 
                                                    onClick={(e) => removeHistoryItem(history, e)}
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-orange-200 rounded-full"
                                                >
                                                    <X className="w-3.5 h-3.5 text-gray-400 hover:text-orange-500" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-6 text-gray-400 text-sm">
                                        暂无搜索历史
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SearchInput;