import { create } from "zustand";
import { getFromLocalStorage, LOCAL_STORAGE_KEYS, saveToLocalStorage } from "../utils/localStorage";


export const OrderStore = create(
    (set)=>({

        //自己的，此处应有localStorage
        myOrderList:[],
        myPengdings:[],

        //你看别人的
        otherOrderList:[],

        //广场上的
        allPendingOrders:[],

        setMyOrderList:(orders)=>{
            saveToLocalStorage(LOCAL_STORAGE_KEYS.MYORDER,orders)
            set({
                myOrderList:orders
            })
        },

        setMyPendings:(orders)=>set({myPengdings:orders}), 

        setAllPendingOrders:(orders) => set({allPendingOrders:orders}),

        getMyOrderList:()=>{

            const myOrders = getFromLocalStorage(LOCAL_STORAGE_KEYS.MYORDER)

            if(myOrders){
                set({
                    myOrderList:myOrders
                })
                return true
            }
            
            return false
        }
    }
))