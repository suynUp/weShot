import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { UserStore } from "../store/userStore"
import { userKey } from "../store/querykeys"
import UserAPI from "../api/userAPI"
import request from "../utils/request"
import LoginAPI from "../api/loginAPI"
import postAPI from "../api/postAPI"
import { toast } from "./useToast"

export const useUserQuerry=()=>{

    const update = UserStore(state=>state.update)
    const initUser = UserStore(state=>state.initializeFromStorage)

    return useQuery({
        queryKey:userKey.USER,
        queryFn: async () => {
            
            if(initUser())
            //如果本地数据过期，则尝试使用token重新请求

            if(request.hasToken){ 
                try{

                    //此数据结构后面再看
                    const res= await UserAPI.getUser()
                    update(res.data) 

                    return

                }catch(error){
                    console.log(error)
                }    
            }

            //token已过期，重新登陆

            alert('请重新登录')
            
        },
        retry: 2, // 失败时重试2次

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
        mutationFn:()=>{
            return postAPI.getMyPosts()
        },
        onSuccess:(data) => {
            console.log(data)
            if(data.code===200){
                setMyPosts(data.data.list)
                toast.success('获取成功')
            }else{
                toast.error(data.msg||'获取失败')
            }
        },
        onError:(e)=>{
            toast.error(e.message||'获取失败')
        }
    })
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
export const useUserUpdate = (userData) => {

    const update = UserStore(state=>state.update)

    return useMutation({
        mutationFn:async ()=>{
            if(request.hasToken){
                return UserAPI.updateUserData(userData)
                //更新后端数据
            }else{
                throw Error('未授权')
            }
        },
        onError:()=>{
            alert('失败')
        },
        
        onSuccess:()=>{
            update(userData)//更新UI以及localstorage
        }
    })
}