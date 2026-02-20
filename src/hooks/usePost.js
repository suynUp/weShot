import { useMutation } from "@tanstack/react-query"
import postAPI from "../api/postAPI"
import { imgUpload } from "../api/imgUpload"
import { useToast } from "./useToast"
import postStore from "../store/postStore"
import { useCallback, useEffect, useRef } from "react"
import DebounceThrottle from "../utils/debonceThrottle"

export const squarePostConfig = {
    pageNum:1,
    pageSize:8
}

export const useGetPost = () => {

    const setTotal = postStore(state => state.setTotalPost)
    const setPostList = postStore(state => state.setPostList)

    const getAllPost = async (type,pageNum,pageSize) => {
        try{
            const res = await postAPI.getSquareList(type,pageNum,pageSize)
            if(res.code === 200){
                setTotal(res.data.total)
                setPostList(res.data)
            }
        }catch(E){
            console.log(E)
        }
    }

    const getMyPost = () => {}

    return {getAllPost,getMyPost}
}

export const usePostAction = () => {
    const like = async (postId) => {
        postAPI.likePost(postId)
    }
    
    const dislike = async (postId) => {
        postAPI.dislikePost(postId)
    }

    /**
     * 
     * @param {*} comment
     * {
     * "postId": 1,
     * "content": "太棒了"
     * } 
     */
    const comment = async (comment) => {
        postAPI.comment(comment)
    }

    const getComments = async (postId) => {
        postAPI.getCommentsById(postId)
    }

    return {
        like,
        dislike,
        comment,
        getComments
    }
}

export const usePostPublish = () =>{

    const toast = useToast()

    return useMutation({
        mutationFn:async ({ images, formData })=>{
            console.log(formData)
            const uploadPromises = images.map(async (item) => {
                const url = await imgUpload(item.file);
                return url;
            });
            
            const imgUrls = await Promise.all(uploadPromises);
            
            return await postAPI.publish({
                ...formData,
                images:imgUrls
            })

        },
        onError:(error)=>{
            toast.error(error)
        },
        onSuccess:(data)=>{
            if(data.code === 200) toast.success('成功发布')
                else toast.error(data.massage)
        }
    })
}

export const useSearchHistory = () => {
    const toast = useToast();
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


export const useSearchSuggestWithDebounce = (delay = 300) => {
    const toast = useToast();
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

export const useSearch = () => {
    const toast = useToast();
    const setSearchResults = postStore(state => state.setSearchResults);

    return useMutation({
        mutationFn: async (keyword) => {
            if (!keyword.trim()) {
                throw new Error('请输入搜索关键词');
            }
            const response = await postAPI.search(keyword);
            if (response.code !== 200) {
                throw new Error(response.message || '搜索失败');
            }
            return response;
        },
        onSuccess: (data) => {
            setSearchResults(data.data);
            
            if (data.data.length > 0) {
                toast.success(`找到 ${data.data.length} 条结果`);
            } else {
                toast.info('没有找到相关内容');
            }
        },
        onError: (error) => {
            toast.error(error.message || '搜索失败');
            // 错误时清空搜索结果
            setSearchResults([]);
        }
    });
};

export const useGetPostDetail = () =>{

    const setCurrentPost = postStore(state=>state.setCurrentPost)

    return useMutation({
        mutationFn:()=>{
            
        },
        onSuccess:()=>{

        },
        onError:()=>{


        }
    })  
} 