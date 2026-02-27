import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { UserStore } from "../store/userStore"
import { userKey } from "../store/querykeys"
import UserAPI from "../api/userAPI"
import request from "../utils/request"
import LoginAPI from "../api/loginAPI"
import postAPI from "../api/postAPI"
import { toast } from "./useToast"
import orderAPI from "../api/orderAPI"
import { clearLocalStorage } from "../utils/localStorage"
import { DraftStore } from "../store/draftStore"
import { OrderDisplayStore } from "../store/orderDisplayStore"
import { OrderStore } from "../store/orderStore"
import photographerStore from "../store/photographerStore"
import postStore from "../store/postStore"
import { PostDraftStore } from "../store/postDraftStore"
import { useCallback } from "react"

export const useUserMutation=()=>{

    const update = UserStore(state=>state.update)
    const initUser = UserStore(state=>state.initializeFromStorage)

    return useMutation({
        mutationFn: async () => {
            
            if(!initUser()){
                //如果本地数据过期，则尝试使用token重新请求
                if(request.hasToken()){ 
                    try{

                        const res= await UserAPI.getUser()
                        update(res.data) 

                        return

                    }catch(error){
                        console.log(error)
                    }    
                }
                toast.error('请重新登录')
            }
           
        },
    })
} 

export const useOtherUserQuerry = (id) => {
    return useQuery({
        queryKey:userKey.OTHERUSER(id),
        queryFn:async ()=>{
            return UserAPI.getOtherUserById(id)
        }
    })
}
/**
 *     const { 
        data,           // 返回的数据
        isLoading,      // 加载状态
        error,          // 错误信息
        isError,        // 是否错误
        refetch         // 重新获取
    } = useOtherUserQuery(userId); 
*/
export const useGetMyPost = () => {

    const setMyPosts = UserStore(state => state.setMyPost)
    const setPostNum = UserStore(state=>state.setTotalPost)

    return useMutation({
        mutationFn: async ({pageNum,pageSize})=>{

            const res = await postAPI.getMyPosts(pageNum,pageSize)
            console.log('让我看看',res)
            if(res.code===200){
                console.log('进来了',res)
                return res.data
            }
            else{
                toast.error(res.msg||'获取失败')
            }
        },
        onSuccess:(data) => {
            console.log('222222222',data)
            setMyPosts(data.list)
            setPostNum(data.total)
        },
        onError:(e)=>{
            toast.error(e.message||'获取失败')
        }
    })
}

export const useGetMyOrder = () =>{

    const setMyOrders = UserStore(state=>state.setMyOrders)
    const setTotalOrders = UserStore(state=>state.setTotalOrders)

    return useMutation({
        mutationFn:({pageNum,pageSize})=>{
            return orderAPI.getMyOrderList(pageNum,pageSize)
        },
        onSuccess:(data)=>{
            if(data.code===200){
                setMyOrders(data.data.list)
                setTotalOrders(data.data.total)
            }
            else{
                toast.error(data.msg)
            }
        },
        onError:(e) => {
            toast.error(e.message||'获取失败')
        }
    })
}

export const useGetMyRecivedOrder = () => {

}


//这里只执行登录，都登陆完后从url中获取token,在主页调用useUserSet
export const useUserLogin = () => {

    return useMutation({
        mutationFn:async ()=>{
            LoginAPI.login()
        },
        
        onError:()=>{
            alert('失败')
        }
    })

}

export const useUserLoginSuccess = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn:(token)=>{
            if (!token) {
                throw new Error('token是必需的');
            }
            request.saveToken(token)
        },
        onSuccess:()=>{//触发一下useQuerry请求
            queryClient.invalidateQueries({queryKey:userKey.USER})
        }
    })
}

export const useUserUpdate = () => {

    const update = UserStore(state=>state.update)

    return useMutation({
        mutationFn:async (userData)=>{
            if(request.hasToken()){
                return UserAPI.updateUserData(userData)
                //更新后端数据
            }else{
                throw Error('未授权')
            }
        },
        onError:(e)=>{
            toast.error(e.message||'修改失败')
        },
        
        onSuccess:(data)=>{
            update(data.data)//更新UI以及localstorage
        }
    })
}

export const useGetOtherPostsMutation = () => useMutation({
    mutationFn: async ({pageNum,pageSize,casId,type=null,keyword=null}) => {
        const res = await postAPI.getSquareList(type,pageNum,pageSize,keyword,casId,1)
        if(res.code === 200){
            return res.data
        }else{
            throw new Error(res.msg || '获取帖子失败')
        }
    },
    onSuccess:(data)=>{
        UserStore.getState().setViewUserPosts(data.list)
        UserStore.getState().setViewUserTotalPost(data.total)
    },
    onError:(e)=>{  
        toast.error(e.message || '获取帖子失败')
    }
})


export const useGetOtherOrdersMutation = () => {
        return useMutation({
        mutationFn: async ({pageNum,pageSize,casId}) => {
            const res = await orderAPI.getCompletedOrders(pageNum,pageSize,casId)
            if(res.code === 200){
                return res.data
            }else{
                throw new Error(res.msg || '获取帖子失败')
            }
        },
        onSuccess:(data)=>{
            UserStore.getState().setUserCompletedOrders(data.list)
            UserStore.getState().setTotalCompletedOrders(data.total)
        },
        onError:(e)=>{
            toast.error(e.message || '获取帖子失败')
        }
    })
}

export const useLogOut = () => {
    const resetUser = UserStore(state=>state.reset)
    const resetDraft = DraftStore(state => state.reset)
    const resetOrderDisplay = OrderDisplayStore(state=>state.reset)
    const restOrder = OrderStore(state => state.reset)
    const resetphotographer = photographerStore(state => state.resetPhgStore)
    const resetPost = postStore(state => state.reset)
    const resetPostDraft = PostDraftStore(state=>state.reset)
    
    // 使用 useCallback 返回一个函数，这样在渲染时不会执行
    const logout = useCallback(() => {
        try{
            clearLocalStorage()
            resetUser()
            resetDraft()
            resetOrderDisplay()
            restOrder()
            resetphotographer()
            resetPost()
            resetPostDraft()
            
            // 可选：显示成功提示
            toast.success('退出登录成功')
        }catch(e){
            toast.error('退出登录失败')
            console.error('Logout error:', e)
        }
    }, [
        resetUser,
        resetDraft,
        resetOrderDisplay,
        restOrder,
        resetphotographer,
        resetPost,
        resetPostDraft
    ])
    
    return logout  // 返回函数，而不是执行结果
}
