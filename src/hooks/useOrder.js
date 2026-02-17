import { useMutation } from "@tanstack/react-query"
import orderAPI from "../api/orderAPI"
import { OrderStore } from "../store/orderStore"

export const orderAction={
    ACCEPT:'ACCEPT',
    REJECT:'REJECT',
    CANCEL:'CANCEL',
    PAY:'PAY',
    DELIVER:'DELIVER'
}

export const useGetOrder = () => {

    const getMyOrderList = OrderStore(state=>state.getMyOrderList)
    const setMyOrderList = OrderStore(state=>state.setMyOrderList)

    const getMyOrder = async () => {//获取自身订单
        if(getMyOrderList()){
            console.log('load from localStorage')
        }else{
            const res = await orderAPI.getMyOrderList()
            setMyOrderList(res)
        }
    }

    const setMyPending = OrderStore(state=>state.setMyPendings)

    const getMyAllPendings = async () =>{
        const res = await orderAPI.getMyPendingOrders()
        setMyPending(res)
    }

    const setAllOrders = OrderStore(state=>state.setAllOrders)

    const getAllLobbys = async () => {//获取所有待接订单     
        const res = await orderAPI.getLobbyList()
        setAllOrders(res)
    }

    return {getMyOrder,getMyAllPendings,getAllLobbys}
}

export const useCreateOrders = () => useMutation({
    mutationFn: async (order) => {
        return orderAPI.createOrder(order)
    }
})

export const useTakeOrderMutation = () => {
    return useMutation({
        mutationFn: async (id) => {
            return orderAPI.SnatchOrders(id)
        },
        onSuccess:()=>{
            console.log('接取成功')
        }
    })
} 

export const useOrderLunchMutation = () => {
    return useMutation({
        mutationFn:async (order) => {
            return orderAPI.createOrder(order)
        }
    })
}

export const useManageOrderMutation = () => {
    return useMutation({
        mutationFn: async (orderAction)=>{
            return orderAPI.handleOrder(orderAction)
        }
    })
}

export const useCommentMutation = () => {
    return useMutation({
        mutationFn: async (comment) => {
            return orderAPI.commentOrder(comment)
        }
    })
}