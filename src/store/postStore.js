import { create } from "zustand";

const postStore = create(
  (set)=>({
    totalposts:0,
    history: [],
    suggestions: [],
    postList:[],
    currentPost:{},

    draftList:[],
    currentDraft:{},

    setHistory: (history) => set({ history }),
    setSuggestions: (suggestions) => set({ suggestions }),
    // 仅更新列表，不触碰 totalposts
    setPostList: (posts) => set({ postList: posts }),
    setCurrentPost: (post) => set({currentPost:post}),
    setTotalPost:(total) => set({totalposts:total}),
  })
)

export default postStore