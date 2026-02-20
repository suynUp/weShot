import { create } from "zustand";

const postStore = create(    
    (set)=>({
        totalposts:-1,
        history: [],           // 搜索历史
        suggestions: [],       // 搜索建议
        searchResults: [],     // 搜索结果  
        postList:[],
        currentPost:{},
        
        setHistory: (history) => set({ history }),
        setSuggestions: (suggestions) => set({ suggestions }),
        setSearchResults: (results) => set({ searchResults: results }),
        setPostList: (posts) => set({postList:posts}),
        setCurrentPost: (post) => set({currentPost:post}),
        setTotalPost:(total) => set({totalposts:total}),
    })
)

export default postStore