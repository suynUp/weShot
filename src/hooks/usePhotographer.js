import { useMutation } from "@tanstack/react-query"
import photographerAPI from "../api/photographerAPI"
import { toast } from "./useToast"
import photographerStore from "../store/photographerStore"

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

export const useEnroll = () => useMutation({
    mutationFn: async (inviteCode)=>{
        return photographerAPI.enroll(inviteCode)
    },
    onSuccess:(data)=>{
        if(data.code === 200){
            toast.success('成功入驻！')
        }else{
            toast.error(data.msg||'入驻失败')
        }
    },
    onError:(e)=>{
        toast.error(e.message||'入驻失败')
    }
})

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
            return photographerAPI.searchHistory()
        },
        onSuccess:(data)=>{
            if(data.code === 200){
                setHistory(data.data)
            }else{
                toast.error(data.msg||'获取失败')
            }
        },
        onError:(e)=>{
            toast.error(e.message||'获取失败')
        }
    })
} 

export const useGetOrderRanking = () => {

    const setOrderRanking = photographerStore(state => state.setPhgOrderRanking)

    return useMutation({
        mutationFn: async () => {
            return photographerAPI.orderRank()
        },
        onSuccess:(data)=>{
            if(data.code === 200){
                setOrderRanking(data.data)
            }else{
                toast.error(data.msg||'获取失败')
            }
        },
        onError:(e)=>{
            toast.error(e.message||'获取失败')
        }
    })
}

export const useGetRatingRanking = () => {

    const setRatingRanking = photographerStore(state => state.setPhgRatingRanking)

    return useMutation({
        mutationFn: async () => {
            return photographerAPI.rateRank()
        },
        onSuccess:(data)=>{
            if(data.code === 200){
                setRatingRanking(data.data)
            }else{
                toast.error(data.msg||'获取失败')
            }
        },
        onError:(e)=>{
            toast.error(e.message||'获取失败')
        }
    })
}