import { create } from "zustand";
import { getFromLocalStorage, LOCAL_STORAGE_KEYS, saveToLocalStorage } from "../utils/localStorage";

//把user操作集中在这里了

export const UserStore = create(
   (set,get)=>({
        user:{
            avatarUrl:'www.123.com',
            nickname:'昵称未知',
            casId:'000',
            gender:'性别未知',
            contact:'110',
            detail:'祂很神秘',
            role:1,
            name:null,
            totalLikes:0
        },
        isVerFied:false,

        myPosts:[],
        totalPost:-1,
        setMyPost:(myposts)=>set({myPosts:myposts,totalPost:myposts.length}),

        myOrders:[],
        totalOrders:-1,
        setMyOrders:(orders) => set({myOrders:orders,totalOrders:orders.length}),

        myReceivedOrders:[],
        totalReceived:-1,
        setMyReceivedOrders:(orders)=>set({myReceivedOrders:orders,totalReceived:orders.length}),
        
        update: (partialUser) => {
            set((state) => ({
                user: {
                ...state.user,     // 保留原有字段
                ...partialUser,    // 用新值覆盖对应字段
                },
                isVerFied:partialUser.role === 2
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
                    user:oldUserData,
                    isVerFied:oldUserData.role===2
                }))
                console.log('load from localstorage')
                return true
            }
            //如果初始化不了，false
            return false
        }
    })
)