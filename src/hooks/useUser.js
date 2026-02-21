import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { UserStore } from "../store/userStore"
import { userKey } from "../store/querykeys"
import UserAPI from "../api/userAPI"
import request from "../utils/request"
import LoginAPI from "../api/loginAPI"
import postAPI from "../api/postAPI"
import { toast } from "./useToast"
import orderAPI from "../api/orderAPI"

export const useUserMutation=()=>{

    const update = UserStore(state=>state.update)
    const initUser = UserStore(state=>state.initializeFromStorage)

    return useMutation({
        mutationFn: async () => {
            
            if(!initUser()){
                //如果本地数据过期，则尝试使用token重新请求
                if(request.hasToken()){ 
                    try{

                        //此数据结构后面再看
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

    return useMutation({
        mutationFn:({pageNum,pageSize})=>{
            return postAPI.getMyPosts(pageNum,pageSize)
        },
        onSuccess:(data) => {
            console.log(data.data.list)
            if(data.code===200){
                setMyPosts(data.data.list)
            }else{
                toast.error(data.msg||'获取失败')
            }
        },
        onError:(e)=>{
            toast.error(e.message||'获取失败')
        }
    })
}

export const useGetMyOrder = () =>{

    const setMyOrders = UserStore(state=>state.setMyOrders)

    return useMutation({
        mutationFn:({pageNum,pageSize})=>{
            return orderAPI.getMyOrderList(pageNum,pageSize)
        },
        onSuccess:(data)=>{
            if(data.code===200)
                setMyOrders(data.data.list)
            else
                toast.error(data.msg)
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

//这里还需要添加乐观更新
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