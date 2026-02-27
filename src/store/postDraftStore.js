import { create } from "zustand";
import { getFromLocalStorage, LOCAL_STORAGE_KEYS, saveToLocalStorage } from "../utils/localStorage"

export const PostDraftStore = create(
    (set, get) => ({
        draftList: [],
        currentDraft: {},

        setDraftList: (drafts) => {
            set({ draftList: drafts });
            saveToLocalStorage(LOCAL_STORAGE_KEYS.POST_DRAFTLIST, drafts);
        },

        setDraft: (draft) => {
            set({ currentDraft: draft });
        },

        saveDraft: (draft, orderId, createdAt) => {
            const oldDraftList = getFromLocalStorage(LOCAL_STORAGE_KEYS.POST_DRAFTLIST) || [];
            
            // 创建完整的草稿对象，包含所有信息
            const newDraft = {
                ...draft,  // 包含 location 和其他所有草稿信息
                orderId,
                createdAt
            };
            
            const newDraftList = [...oldDraftList, newDraft];

            set({ draftList: newDraftList });
            saveToLocalStorage(LOCAL_STORAGE_KEYS.POST_DRAFTLIST, newDraftList);
        },

        getDraftList: () => {
            const list = getFromLocalStorage(LOCAL_STORAGE_KEYS.POST_DRAFTLIST);
            if (list) {
                set({ draftList: list });
                return true;
            }
            return false;
        },

        deleteDraft: (draftId) => {
            const oldDraftList = getFromLocalStorage(LOCAL_STORAGE_KEYS.POST_DRAFTLIST) || [];
            const newDraftList = oldDraftList.filter(d => d.orderId !== draftId);

            set({ draftList: newDraftList });
            saveToLocalStorage(LOCAL_STORAGE_KEYS.POST_DRAFTLIST, newDraftList);

            if (get().currentDraft.orderId === draftId) {
                set({ currentDraft: {} });
            }
        },

        reset:() => set({
            draftList: [],
            currentDraft: {},
        })
    })
);