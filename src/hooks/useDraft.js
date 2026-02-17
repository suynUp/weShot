import { useMutation } from "@tanstack/react-query"
import DraftAPI from "../api/draftAPI"
import { DraftStore } from "../store/draftStore"

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
            const list = await DraftAPI.getList(pageConfig.pageNum,pageConfig.pageSize)
            setDraftList(list)
        }

        return
    }

        const getDraftDetail = DraftStore(state => state.getDraftDetail)
        const setDraft = DraftStore(state=>state.setDraft)

    const getDetail = async (id) => {

        if(getDraftDetail(id)){
            return
        }else{
            const draft = await DraftAPI.getDetailById(id)
            console.log(draft)
            setDraft(draft)
        }

    }

    return{getList,getDetail}
}


export const useSaveDraftMutation = () => {

    const saveDraft = DraftStore(state=>state.saveDraft)
    
    return useMutation({
        queryFn: async (draft) => {
            return DraftAPI.saveDraft(draft)
        },
        onSuccess:(data,draft)=>{
            saveDraft(draft,data.id,data.date)
        }
    })
}

export const useDeleteDraftMutation = () => {
    const deleteDraft = DraftStore(state=>state.deleteDraft)

    return useMutation({
        queryFn: async (id) => {
            deleteDraft(id)
            return DraftAPI.deleteDraft()
        },
        onSuccess:(data)=>{
            if(data.code===200){
                console.log('成功')
            }
        },
        onError:(e)=>{
            console.log(e)
        }
    })
}