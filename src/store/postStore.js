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

    commentList:[],
    totalComments:0,
    setTotalComments:(total) => set({totalComments:total}),
    setCommentList: (newComments) => {
      console.log('Setting comment list with new comments:', newComments);
      // 使用 Map 或 Set 去重，假设每个评论有唯一的 id
      const currentComments = postStore.getState().commentList;
      
      // 创建一个 Map，key 为评论 id，value 为评论
      const commentMap = new Map();
      
      // 先添加现有的评论
      currentComments.forEach(comment => {
        commentMap.set(comment.id, comment);
      });
      
      // 再添加新评论（如果 id 重复会自动覆盖）
      newComments.forEach(comment => {
        commentMap.set(comment.id, comment);
      });
      
      // 转换回数组
      const uniqueComments = Array.from(commentMap.values());
      console.log('Unique comments after merging:', uniqueComments);
      
      set({ commentList: uniqueComments });
    },
    addComment:(newComment) => set((state) => {
      // 使用 Map 或 Set 去重，假设每个评论有唯一的 id
      const currentComments = state.commentList;
      const commentMap = new Map();
      
      // 先添加现有的评论
      currentComments.forEach(comment => {
        commentMap.set(comment.id, comment);
      });
      
      // 再添加新评论（如果 id 重复会自动覆盖）
      commentMap.set(newComment.id, newComment);
      
      // 转换回数组
      const uniqueComments = Array.from(commentMap.values());

      console.log('Adding comment:', newComment);
      
      return { commentList: uniqueComments, totalComments: uniqueComments.length };
    }),
    clearComments:() => set({commentList:[],totalComments:0}),

    setHistory: (history) => set({ history }),
    setSuggestions: (suggestions) => set({ suggestions }),
    // 仅更新列表，不触碰 totalposts
    setPostList: (posts) => set({ postList: posts }),
    setCurrentPost: (post) => {set({currentPost:post})},
    setTotalPost:(total) => set({totalposts:total}),

    reset: () => set({
      totalposts:0,
      history: [],
      suggestions: [],
      postList:[],
      currentPost:{},

      draftList:[],
      currentDraft:{},

      commentList:[],
      totalComments:0
    })
  })
)

export default postStore