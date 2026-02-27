// store/userStore.js
import { create } from "zustand";
import { getFromLocalStorage, LOCAL_STORAGE_KEYS, saveToLocalStorage } from "../utils/localStorage";

//把user操作集中在这里了

export const UserStore = create((set, get) => ({
    // 当前登录用户信息
    user: {
        avatarUrl: 'www.123.com',
        nickname: '昵称未知',
        casId: '000',
        gender: '性别未知',
        contact: '110',
        detail: '祂很神秘',
        role: 1,
        name: null,
        totalLikes: 0,
        totalOrders:0
    },
    isVerFied: false,

    //发订单时需要调用
    updateTotalOrders:()=>{
        const user = getFromLocalStorage(LOCAL_STORAGE_KEYS.USER)
        const newUser = {
            ...user,
            totalOrders:user.totalOrders + 1
        }
        saveToLocalStorage(LOCAL_STORAGE_KEYS.USER)
        set({user:newUser})
    },

    // 自己的帖子
    myPosts: [],
    totalPost: -1,
    setMyPost: (myposts) => {
        console.log(myposts)
        set({ 
        myPosts: myposts, 
    })},
    setTotalPost:(totalPost)=>set({totalPost}),

    // 自己的发起订单
    myOrders: [],
    totalOrders: -1,
    setMyOrders: (orders) => set({ 
        myOrders: orders, 
    }),
    setTotalOrders:(totalOrders) => set({totalOrders}),


    // 自己的接收订单
    myReceivedOrders: [],
    totalReceived: -1,
    setMyReceivedOrders: (orders) => set({ 
        myReceivedOrders: orders, 
    }),
    setTotalReceived:(totalReceived) => set({totalReceived}),
    
    // ========== 查看他人主页相关 ==========
    
    // 他人帖子数据
    viewUserPosts: [],
    viewUserTotalPost: -1,
    setViewUserPosts: (posts) => set({ 
        viewUserPosts: posts, 
    }),
    setViewUserTotalPost: (total) => set({ 
        viewUserTotalPost: total, 
    }),
    
    // 他人已完成订单（对方是摄影师时）
    userCompletedOrders: [],
    totalCompletedOrders: -1,
    setUserCompletedOrders: (orders) => set({ 
        userCompletedOrders: orders, 
    }),
    setTotalCompletedOrders: (total) => set({ 
        totalCompletedOrders: total, 
    }),
    
    // 清空他人数据（切换查看对象时调用）
    clearViewUserData: () => set({
        viewUserPosts: [],
        viewUserTotalPost: -1,
        userCompletedOrders: [],
        totalCompletedOrders: -1
    }),
    
    // ========== 用户信息更新 ==========
    
    // 更新当前用户信息
    update: (partialUser) => {
        set((state) => ({
            user: {
                ...state.user,
                ...partialUser,
            },
            isVerFied: partialUser.role === 2
        }));

        setTimeout(() => {
            const updatedUser = get().user;
            saveToLocalStorage(LOCAL_STORAGE_KEYS.USER, updatedUser);
        }, 0);
    },

    // 设置目标用户信息（查看他人主页时）
    setTargetUser: (targetUserData) => set({ 
        targetUser: targetUserData,
        // 可选：如果需要缓存目标用户信息
    }),

    // ========== 初始化 ==========
    
    // 从localStorage初始化
    initializeFromStorage: () => {
        const oldUserData = getFromLocalStorage(LOCAL_STORAGE_KEYS.USER);
        if (oldUserData) {
            set(() => ({
                user: oldUserData,
                isVerFied: oldUserData.role === 2
            }));
            console.log('load from localstorage');
            return true;
        }
        return false;
    },

    // 重置所有数据（登出时调用）
    reset: () => set({
        user: {
            avatarUrl: 'www.123.com',
            nickname: '昵称未知',
            casId: '000',
            gender: '性别未知',
            contact: '110',
            detail: '祂很神秘',
            role: 1,
            name: null,
            totalLikes: 0
        },
        isVerFied: false,
        myPosts: [],
        totalPost: -1,
        myOrders: [],
        totalOrders: -1,
        myReceivedOrders: [],
        totalReceived: -1,
        viewUserPosts: [],
        viewUserTotalPost: -1,
        userCompletedOrders: [],
        totalCompletedOrders: -1
    })
}));