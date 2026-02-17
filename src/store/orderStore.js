import { create } from "zustand";
import { getFromLocalStorage, LOCAL_STORAGE_KEYS, saveToLocalStorage } from "../utils/localStorage";

//这里主要就处理自己的订单吧
export const OrderStore = create(
    (set)=>({

        pageSize:9,
        myOrderList:[],
        myPengdings:[],
        allOrders:[],

        setMyOrderList:(orders)=>{
            saveToLocalStorage(LOCAL_STORAGE_KEYS.MYORDER,orders)
            set({
                myOrderList:orders
            })
        },

        setMyPendings:(orders)=>{
            set({
                myPengdings:orders
            }) 
        },

        setAllOrders:(orders) => {
            set({
                allOrders:orders
            })
        },

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