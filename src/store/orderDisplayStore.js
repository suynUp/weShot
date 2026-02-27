import { create } from "zustand";

export const OrderDisplayStore = create(
    (set) => ({
        orderList: [],
        totalOrders: 0,
        currentOrder:{},
        setOrderList: (orderList) =>{
            set({ orderList });
        },
        setTotalOrders: (totalOrders) => {
            set({ totalOrders });
        },
        setCurrentOrder: (currentOrder) => {
            set({ currentOrder });
        },
        reset:()=>set({
            orderList: [],
            totalOrders: 0,
            currentOrder:{},
        })
    })
)