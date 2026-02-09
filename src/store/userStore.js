import { create } from "zustand";
import { getFromLocalStorage, LOCAL_STORAGE_KEYS, saveToLocalStorage } from "../utils/localStorage";

//把user操作集中在这里了

export const UserStore = create(
   (set,get)=>({
        user:{
            avatar:'www.123.com',
            nickName:'昵称未知',
            gender:'性别未知',
            contact:'110',
            outline:'祂很神秘'
        },
        
        update: (partialUser) => {
            set((state) => ({
                user: {
                ...state.user,     // 保留原有字段
                ...partialUser,    // 用新值覆盖对应字段
                }
            }));

            setTimeout(() => {//set
                const updatedUser = get().user; // 获取最新的状态
                saveToLocalStorage(LOCAL_STORAGE_KEYS.USER,updatedUser)
            }, 0);
        },

        initializeFromStorage: () => {//初始化函数，在useQuerr中
            const oldUserData=getFromLocalStorage(LOCAL_STORAGE_KEYS.USER)
            if(oldUserData){
                set(()=>({
                    user:oldUserData
                }))
                console.log('load from localstorage')
                return true
            }
            //如果初始化不了，false
            return false
        }
    })
)