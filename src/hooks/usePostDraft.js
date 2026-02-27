import { useMutation } from "@tanstack/react-query"
import { toast } from "./useToast"
import { useCallback } from "react"
import PostDraftAPI from "../api/postDraftAPI"
import { PostDraftStore } from "../store/postDraftStore"

const pageConfig = {
    pageSize:8,
    pageNum:1
}

export const useGetDraft = () => {

    const getDraftList = PostDraftStore(state=>state.getDraftList)
    const setDraftList = PostDraftStore(state=>state.setDraftList)

    const getList = async () => {
    
        if(getDraftList()){
            console.log('load list from localstorage')
        }else{
            const data = await PostDraftAPI.getList(pageConfig.pageNum,pageConfig.pageSize)
            setDraftList(data.data.list)
        }

        return
    }

    const setDraft = PostDraftStore(state=>state.setDraft)

    const getDetail = useCallback(async (id) => {
        try{
            const data = await PostDraftAPI.getDetailById(id)
            if(data.code === 200){
                setDraft(data.data)
            }else{
                throw new Error(data.message || '获取草稿详情失败')
            }
        }catch(E){
            toast.error(E.message || '获取草稿详情失败')
        }
    },[setDraft]) 

    return{getList,getDetail}
}


export const useSaveDraftMutation = () => {

    const saveDraft = PostDraftStore(state=>state.saveDraft)

    return useMutation({
        mutationFn: async (draft) => {
            console.log('saving draft:', draft)
            const res = await PostDraftAPI.saveDraft(draft)
            if(res.code !== 200){
                throw new Error(res.message || '保存草稿失败')
            }
            return res
        },
        onSuccess:(data,draft)=>{
            saveDraft(draft,data.data.orderId,data.data.savedAt)
            toast.success('保存草稿成功')
        },
        onError:(e)=>{
            console.log(e)
            toast.error(e.message || '保存草稿失败')
        }
    })
}

export const useDeleteDraftMutation = () => {
    const deleteDraft = PostDraftStore(state=>state.deleteDraft)

    return useMutation({
        mutationFn: async (id) => {
            const res = await PostDraftAPI.deleteDraft(id)
            if(res.code !== 200){
                throw new Error(res.message || '删除草稿失败')
            }
            return res
        },
        onSuccess:(data,id)=>{
            deleteDraft(id)
            toast.success('删除成功')
        },
        onError:(e)=>{
            toast.error(e.message || '删除失败')
        }
    })
}