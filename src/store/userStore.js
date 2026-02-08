import { create } from "zustand";

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
        },

    })
)