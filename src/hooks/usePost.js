import { useMutation } from "@tanstack/react-query"
import postAPI from "../api/postAPI"
import { toast } from "./useToast"
import postStore from "../store/postStore"
import { useCallback, useEffect, useRef } from "react"
import DebounceThrottle from "../utils/debonceThrottle"
import { PostDraftStore } from "../store/postDraftStore"

export const useGetPost = () => {

    const setTotal = postStore(state => state.setTotalPost)
    const setPostList = postStore(state => state.setPostList)

    const getAllPost = async (type=null,pageNum,pageSize,keyword=null) => {
        try{
            const res = await postAPI.getSquareList(type,pageNum,pageSize,keyword,null,1)
            if(res.code === 200){
                setTotal(res.data.total)
                setPostList(res.data.list)
            }
            // return data so callers (e.g. usePagination) can extract `total`
            return res;
        }catch(E){
            console.log(E)
            // propagate error if needed
            throw E;
        }
    }

    const setCurresntPost = postStore(state => state.setCurrentPost)

    const getPostDetail = async (postId) => {
        try{
            const res = await postAPI.getPostDetail(postId)
            if(res.code === 200){
                setCurresntPost(res.data)
                return res.data;
            }
        }catch(E){
            toast.error(E.message || '获取帖子详情失败')
        }
    }

    return {getAllPost, getPostDetail}
}

export const usePostAction = () => {
    const like = async (postId) => {
        postAPI.likePost(postId)
    }
    
    const dislike = async (postId) => {
        postAPI.dislikePost(postId)
    }

    
    return {
        like,
        dislike,
    }
}

    /**
     * @param {*} comment
     * {
     * "postId": 1,
     * "content": "太棒了"
     * } 
     */
export const useComment = () => {

    return useMutation({
        mutationFn: async (comment) => {
            const res = await postAPI.comment(comment) 
            if(res.code === 200){
                return res.data
            }else{
                throw new Error(res.msg || '评论失败')
            }
        },
        onSuccess:() => {
            toast.success('评论成功')
        },
        onError:(error) => {
            toast.error(error.message || '评论失败')
        }
    })
}

export const useDeletePost = () => useMutation({
    mutationFn:(postId)=>{
        const res = postAPI.deletePost(postId)
        if(res.code !== 200){
            throw Error
        }
    },
    onError:()=>toast.error('删除失败，请稍后再试')
})

export const usePostPublish = () =>{ //记得加一下本地缓存清除，另一个发布也是

    const deleteDraft = PostDraftStore(state => state.deleteDraft)

    return useMutation({
        mutationFn:async ( formData )=>{
            console.log(formData)
            
            return await postAPI.publish(formData)

        },
        onError:(error)=>{
            toast.error(error)
        },
        onSuccess:(data,formData)=>{
            if(data.code === 200){
                deleteDraft(formData.postId); // 删除草稿
                toast.success('成功发布')

            } 
                else toast.error(data.message || '发布失败')
        }
    })
}

export const useSearchHistory = () => {
    const setHistory = postStore(state => state.setHistory); // 注意：应该是 setHistory 方法

    return useMutation({
        mutationFn: async () => {
            const response = await postAPI.getSearchHistory();
            if (response.code !== 200) {
                throw new Error(response.message || '获取搜索历史失败');
            }
            return response;
        },
        onSuccess: (data) => {
            setHistory(data.data);
            // 历史记录获取成功通常不需要提示，如果需要可以取消注释
            // toast.success('获取历史记录成功');
        },
        onError: (error) => {
            toast.error(error.message || '获取搜索历史失败');
        }
    });
};


export const useSearchSuggestWithDebounce = (delay = 500) => {
    const setSuggestions = postStore(state => state.setSuggestions);
    const debounceRef = useRef(null);

    // 基础搜索建议 mutation
    const suggestMutation = useMutation({
        mutationFn: async (keyword) => {
            if (!keyword.trim()) {
                return { data: [] };
            }
            const response = await postAPI.suggest(keyword);
            if (response.code !== 200) {
                throw new Error(response.message || '获取搜索建议失败');
            }
            return response;
        },
        onSuccess: (data) => {
            setSuggestions(data.data);
        },
        onError: (error) => {
            toast.error(error.message || '获取搜索建议失败');
            setSuggestions([]);
        }
    });

    // 初始化防抖函数
    useEffect(() => {
        debounceRef.current = DebounceThrottle.debounce;
        
        return () => {
            if (debounceRef.current && debounceRef.current.cancel) {
                debounceRef.current.cancel();
            }
        };
    }, []);

    // 防抖搜索建议
    const fetchDebouncedSuggest = useCallback((keyword) => {
        if (!keyword.trim()) {
            // 空输入立即执行
            suggestMutation.mutate(keyword);
            return;
        }

        if (debounceRef.current) {
            debounceRef.current(
                () => suggestMutation.mutate(keyword),
                delay
            );
        }
    }, [suggestMutation, delay]);

    return {
        fetchDebouncedSuggest,
        suggestions: suggestMutation.data?.data || [],
        isLoading: suggestMutation.isPending,
        error: suggestMutation.error,
        isSuccess: suggestMutation.isSuccess,
        // 如果需要直接调用 mutation
        mutate: suggestMutation.mutate,
        // 如果需要异步调用
        mutateAsync: suggestMutation.mutateAsync
    };
};

export const useGetPostDetail = () =>{

    const setCurrentPost = postStore(state=>state.setCurrentPost)

    return useMutation({
        mutationFn:async (postId)=>{
            const res = await postAPI.getPostDetail(postId)
            if(res.code === 200){
                return res.data
            }else{
                throw new Error(res.msg || '获取帖子详情失败')
            }
        },
        onSuccess:(data)=>{
            setCurrentPost(data)
        },
        onError:(error)=>{
            toast.error(error.message || '获取帖子详情失败')
        }
    })  
} 

export const useGetPostComments = () =>{

    const setCommentList = postStore(state => state.setCommentList)
    const setTotalComments = postStore(state => state.setTotalComments)

    return useMutation({
        mutationFn:async ({postId,pageNum,pageSize})=>{
            const res = await postAPI.getCommentsById(postId,pageNum,pageSize)
            if(res.code === 200){
                return res.data
            }else{
                throw new Error(res.msg || '获取评论失败')
            }
        },
        onSuccess:(data)=>{
            setCommentList(data.list)
            setTotalComments(data.total)
        },
        onError:(error)=>{
            toast.error(error.message || '获取评论失败')
        }
    })
}