import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useUserStore } from "../store/userStore"
import { userKey } from "../store/querrykeys"
import { getFromLocalStorage, LOCAL_STORAGE_KEYS } from "../utils/localStorage"
import UserAPI from "../api/userAPI"
import request from "../utils/request"
import LoginAPI from "../api/loginAPI"

export const useUserQuerry=()=>{

    const update = useUserStore(state=>state.update)

    return useQuery({
        queryKey:userKey.USER,
        queryFn: async () => {
            const oldUserData=getFromLocalStorage(LOCAL_STORAGE_KEYS.USER)
            if(oldUserData){
                update(oldUserData)
                console.log('load from localstorage')
                return
            }

            //如果本地数据过期，则尝试使用token重新请求
            //但是token获取还不完善,先这样

            if(request.hasToken){ 
                try{

                    const res= await UserAPI.getUser()
                    update(res.data) 

                }catch(error){
                    console.log(error)
                    console.log('请重新登录')
                }    
            }else{
                alert('请重新登录')
            }

        },
        retry: 2, // 失败时重试2次
        refetchOnMount: false //设定刷新是否重新请求
    })
} 

export const useUserLogin = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn:()=>{
            LoginAPI.login()//这里可以获取得到token的
            request.saveToken('token')//先写死吧，后面处理
        },
        
        onError:()=>{
            alert('失败')
        },
        
        onSuccess:()=>{
            queryClient.invalidateQueries({queryKey:userKey.USER})
            //将queryKey设置无效，触发对应useQuery
        }
    })

}

export const useUserUpdate = (userData) => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn:()=>{
            if(request.hasToken){
                UserAPI.updateUserData(userData)
            }else{
                throw Error
            }
        },
        
        onError:()=>{
            alert('失败')
        },
        
        onSuccess:()=>{
            queryClient.invalidateQueries({queryKey:userKey.USER})
            //将queryKey设置无效，触发对应useQuery
        }
    })
}