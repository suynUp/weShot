import { create } from "zustand";

export const OrderDisplayStore = create(
    (set) => ({
        orderList: [],
        totalOrders: 0,
        setOrderList: (orderList) =>{
            set({ orderList });
        },
        setTotalOrders: (totalOrders) => {
            set({ totalOrders });
        },
    })
)