import { useMutation } from "@tanstack/react-query"
import DraftAPI from "../api/draftAPI"
import { DraftStore } from "../store/draftStore"
import { toast } from "./useToast"

const pageConfig = {
    pageSize:8,
    pageNum:1
}

export const useGetDraft = () => {

    const getDraftList = DraftStore(state=>state.getDraftList)
    const setDraftList = DraftStore(state=>state.setDraftList)

    const getList = async () => {
    
        if(getDraftList()){
            console.log('load list from localstorage')
        }else{
            const data = await DraftAPI.getList(pageConfig.pageNum,pageConfig.pageSize)
            setDraftList(data.data.list)
        }

        return
    }

    const setDraft = DraftStore(state=>state.setDraft)

    const getDetail = async (id) => {
        const data = await DraftAPI.getDetailById(id)
        if(data.code === 200){
            setDraft(data.data)
        }else{
            toast.error(data.message || '获取草稿详情失败')
        }
    }

    return{getList,getDetail}
}


export const useSaveDraftMutation = () => {

    const saveDraft = DraftStore(state=>state.saveDraft)

    return useMutation({
        mutationFn: async (draft) => {
            console.log('saving draft:', draft)
            const res = await DraftAPI.saveDraft(draft)
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
    const deleteDraft = DraftStore(state=>state.deleteDraft)

    return useMutation({
        mutationFn: async (id) => {
            const res = await DraftAPI.deleteDraft(id)
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