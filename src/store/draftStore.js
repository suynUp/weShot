import { create } from "zustand";
import { getFromLocalStorage, LOCAL_STORAGE_KEYS, saveToLocalStorage } from "../utils/localStorage";

export const DraftStore = create(
        (set,get)=>({
        
        draftList:[{
            id:1,
            place:'山东大学',
            date:'2026-3-9'
        }],
        draftDetailList:[],
        currentDraft:{},

        setDraftList: (drafts)=>{//获取草稿列表
            set({
                draftList:drafts
            })

            saveToLocalStorage(LOCAL_STORAGE_KEYS.DRAFTLIST,drafts)
        },

        setDraft : (draft) => {
            set({
                currentDraft:draft
            })
        },

        getDraftDetail:(id) => {
            get().getDetails()
            const draft = get().draftDetailList.filter(d=>d.id===id)
            if(draft){
                set({
                    currentDraft:draft
                })
                return true
            }
            else return false
        },

        saveDraft:(draft,id,saveDate)=>{//保存新的草稿
        
            const newDraftList = [...get().draftList, {
                place: draft.place,
                id,
                saveDate
            }];
            const newDetailList = [...get().draftDetailList,draft]

            set({
                draftList:newDraftList,
                draftDetailList:newDetailList
            })

            saveToLocalStorage(LOCAL_STORAGE_KEYS.DRAFTDETAILIST,newDetailList)
            saveToLocalStorage(LOCAL_STORAGE_KEYS.DRAFTLIST,newDraftList)
        },

        getDraftList:() => {
            const list = getFromLocalStorage(LOCAL_STORAGE_KEYS.DRAFTLIST)
            if(list){
                set({
                    draftList:list
                })
                return true
            }
            
            return false
        },

        getDetails: () => {
            const detaillist = getFromLocalStorage(LOCAL_STORAGE_KEYS.DRAFTDETAILIST)
            if(detaillist){
                set({
                    draftDetailList:detaillist
                })
                return true
            }
            
            return false
        },

        deleteDraft:(draftId) => {

            const newDraftList = get().draftList.filter((d)=>d.id!==draftId)
            const newDetailList = get().draftDetailList.filter((d)=>d.id!==draftId)

            set({
                draftList:newDraftList,
                draftDetailList:newDetailList
            })

            saveToLocalStorage(LOCAL_STORAGE_KEYS.DRAFTDETAILIST,newDetailList)
            saveToLocalStorage(LOCAL_STORAGE_KEYS.DRAFTLIST,newDraftList)

            if(get().currentDraft.id === draftId){
                set({
                    currentDraft:{}
                })
            }
        }
    })
)
    

