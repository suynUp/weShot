import { useMutation } from "@tanstack/react-query"
import photographerAPI from "../api/photographerAPI"
import { toast } from "./useToast"
import photographerStore from "../store/photographerStore"
import { LOCAL_STORAGE_KEYS, removeFromLocalStorage } from "../utils/localStorage"
import { UserStore } from "../store/userStore"

export const useGetPhgList = () => {
    
    const setPhgList = photographerStore(state => state.setPhgList)
    const setPhgTotal = photographerStore(state => state.setPhgTotal)
    
    return useMutation({
        mutationFn:({pageNum,pageSize,keyword}) => {
            return photographerAPI.getPhotographerList(pageNum,pageSize,keyword)
        },
        onSuccess:(data)=>{
            if(data.code===200){
                setPhgList(data.data.list)
                setPhgTotal(data.data.total)
            }else{
                toast.error(data.msg||'获取失败')
            }
        },
        onError:(e)=>{
            toast.error(e.message||'获取失败')
        }
    })
}

export const useEnroll = () => {

    const update = UserStore(state=>state.update)

    return useMutation({
    mutationFn: async (inviteCode)=>{
        const res = await photographerAPI.enroll(inviteCode)
        if(res.code === 200){
            return res.data
        }else{
            throw new Error(res.msg || '入驻失败')
        }
    },
    onSuccess:()=>{    
        toast.success('入驻成功！')
        update({
            role: 2
        })
    },
    onError:(e)=>{
        toast.error(e.message||'入驻失败')
    }
})}

export const useGetSuggestions = () =>{

    const setSuggestions = photographerStore(state => state.setPhgSuggestions)

    return useMutation({
        mutationFn: async (keyword) => {
            return photographerAPI.searchSuggest(keyword)
        },
        onSuccess:(data)=>{
            if(data.code === 200){
                setSuggestions(data.data)
            }else{
                toast.error(data.msg||'获取失败')
            }
        },
        onError:(e)=>{
            toast.error(e.message||'获取失败')
        }
    })
}

export const useGetHistory = () => {

    const setHistory = photographerStore(state => state.setPhgSearchHistory)

    return useMutation({
        mutationFn: async () => {
            const res = await photographerAPI.searchHistory()
            if(res.code === 200){
                return res.data
            }else{
                throw new Error(res.msg || '获取失败')
            }
        },
        onSuccess:(data)=>{
            setHistory(data)
        },
    })
} 

export const useGetOrderRanking = () => {

    const setOrderRanking = photographerStore(state => state.setPhgOrderRanking)

    return useMutation({
        mutationFn: async (limit) => {
            const res = await photographerAPI.orderRank(limit)
            if(res.code === 200){
                return res.data
            }else{
                throw new Error(res.msg || '获取失败')
            }
        },
        onSuccess:(data)=>{
            setOrderRanking(data)
        }
    })
}

export const useGetRatingRanking = () => {

    const setRatingRanking = photographerStore(state => state.setPhgRatingRanking)

    return useMutation({
        mutationFn: async (limit) => {
            const res = await photographerAPI.rateRank(limit)
            if(res.code === 200){
                return res.data
            }else{
                throw new Error(res.msg || '获取失败')
            }
        },
        onSuccess:(data)=>{
            setRatingRanking(data)
        }
    })
}