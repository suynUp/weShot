import { create } from "zustand";

const photographerStore = create(
    (set, ) => ({
        // 状态
        phgList: [],
        phgTotal: 0,
        phgSuggestions: [],
        phgSearchHistory: [],
        phgOrderRanking: [],
        phgRatingRanking: [],
        loading: false,
        error: null,

        // 摄影师列表操作
        setPhgList: (list) => set({ phgList: list }),

        setPhgTotal: (total) => set({ phgTotal: total }),
        
        // 搜索建议操作
        setPhgSuggestions: (suggestions) => set({ phgSuggestions: suggestions }),
        
        // 搜索历史操作
        setPhgSearchHistory: (history) => set({ phgSearchHistory: history }),
        
        // 删除单个搜索历史
        removePhgSearchHistory: (keyword) => set((state) => ({
            phgSearchHistory: state.phgSearchHistory.filter(item => item !== keyword)
        })),
        
        // 订单排行榜
        setPhgOrderRanking: (ranking) =>set({ phgOrderRanking: ranking }),
        
        // 评分排行榜
        setPhgRatingRanking: (ranking) => set({ phgRatingRanking: ranking }),
        
        // 加载状态
        setLoading: (loading) => set({ loading }),
        
        // 错误状态
        setError: (error) => set({ error }),
        
        // 重置所有状态
        resetPhgStore: () => set({
            phgList: [],
            phgSuggestions: [],
            phgSearchHistory: [],
            phgOrderRanking: [],
            phgRatingRanking: [],
            loading: false,
            error: null
        })
    })
);


export default photographerStore