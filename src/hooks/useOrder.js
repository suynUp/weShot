import { useMutation } from "@tanstack/react-query"
import orderAPI from "../api/orderAPI"
import { OrderStore } from "../store/orderStore"
import { useToast } from "./useToast"
import { useNavigation } from "./navigation"
import { OrderDisplayStore } from "../store/orderDisplayStore"
import { toast } from "./useToast"

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

    const setAllPendingOrders = OrderStore(state=>state.setAllPendingOrders)
    const setTotalPendingOrderNum = OrderStore(state=>state.setTotalPendingOrderNum)    

    const getAllLobbys = async (pageNum, pageSize) => {//获取所有待接订单  
        const res = await orderAPI.getLobbyList(pageNum, pageSize)
        setAllPendingOrders(res.data.list)
        setTotalPendingOrderNum(res.data.total)
    }

    return {getMyOrder,getMyAllPendings,getAllLobbys}
}

export const useCreateOrders = () => {
    const toast = useToast()
    const {goBack} = useNavigation()
    
    return useMutation({
        mutationFn: async (order) => {
                console.log('creating order with data:', order)
                const res = await orderAPI.createOrder(order)
                if (res.code !== 200) {
                    throw new Error(res.message || '创建订单失败')
                }
                return res
        },
        onSuccess: () => {
            toast.success('创建订单成功')
            goBack()
        },
        onError: (error) => {
            toast.error(error.message || '创建订单失败')
        }
    })
}

export const useTakeOrderMutation = () => {
    const toast = useToast()
    
    return useMutation({
        mutationFn: async (id) => {
                const res = await orderAPI.SnatchOrders(id)
                if (res.code !== 200) {
                    throw new Error(res.message || '接单失败')
                }
                return res
        },
        onSuccess: () => {
            toast.success('接单成功')
        },
        onError: (error) => {
            toast.error(error.message || '接单失败')
        }
    })
} 

export const useManageOrderMutation = () => {
    const toast = useToast()
    
    return useMutation({
        mutationFn: async (orderAction) => {
                const res = await orderAPI.handleOrder(orderAction)
                if (res.code !== 200) {
                    throw new Error(res.message || '操作失败')
                }
                return res
        },
        onSuccess: () => {
            toast.success('操作成功')
        },
        onError: (error) => {
            toast.error(error.message || '操作失败')
        }
    })
}

export const useCommentMutation = () => {
    const toast = useToast()
    
    return useMutation({
        mutationFn: async (comment) => {
                const res = await orderAPI.commentOrder(comment)
                if (res.code !== 200) {
                    throw new Error(res.message || '评论失败')
                }
                return res
        },
        onSuccess: () => {
            toast.success('评论成功')
        },
        onError: (error) => {
            toast.error(error.message || '评论失败')
        }
    })
}

export const useGetCompletedOrders = () =>{

    const setOrderList = OrderDisplayStore(state=>state.setOrderList)
    const setTotalOrders = OrderDisplayStore(state=>state.setTotalOrders)

    return useMutation({
        mutationFn:async ({pageNum,pageSize})=>{
            const res =await orderAPI.getCompletedOrders(pageNum,pageSize)
            if(res.code !== 200){
                throw new Error(res.message || '获取订单失败')
            }
            return res
        },
        onSuccess:(data)=>{
            setOrderList(data.data.list)
            setTotalOrders(data.data.total)   
        },
        onError:(e)=>{
            toast.error(e.message || '获取订单失败')
        }
    })
}