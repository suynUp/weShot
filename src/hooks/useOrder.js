import { useMutation } from "@tanstack/react-query"
import orderAPI from "../api/orderAPI"
import { OrderStore } from "../store/orderStore"
import { toast } from "./useToast"
import { useNavigation } from "./navigation"
import { OrderDisplayStore } from "../store/orderDisplayStore"
import { DraftStore } from "../store/draftStore"
import { UserStore } from "../store/userStore"

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
        if(res.code !== 200){
            throw new Error(res.message || '获取待接订单失败')
        }
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
    const {goBack} = useNavigation()
    const deleteDraft = DraftStore(state=>state.deleteDraft)
    const updateTotalOrders = UserStore(state=>state.updateTotalOrders)

    return useMutation({
        mutationFn: async (order) => {
                console.log('creating order with data:', order)
                const res = await orderAPI.createOrder(order)
                if (res.code !== 200) {
                    throw new Error(res.message || '创建订单失败')
                }
                return res
        },
        onSuccess: (data,order) => {
            deleteDraft(order.orderId); // 删除草稿
            toast.success('创建订单成功')
            updateTotalOrders()
            goBack()
        },
        onError: (error) => {
            toast.error(error.message || '创建订单失败')
        }
    })
}

export const useTakeOrderMutation = () => {
    
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
    
    return useMutation({
        mutationFn: async ({orderAction,orderId,deliverUrl=null,}) => {
                const res = await orderAPI.handleOrder({action:orderAction,orderId,deliverUrl})
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
    
    return useMutation({
        mutationFn: async (comment) => {
                const res = await orderAPI.commentOrder(comment)
                if (res.code !== 200) {
                    throw new Error(res.message || '评价')
                }
                return res
        },
        onSuccess: () => {
            toast.success('评价')
        },
        onError: (error) => {
            toast.error(error.message || '评价')
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

export const useGetOrderDetail = () => {
    const setCurrentOrder = OrderDisplayStore(state => state.setCurrentOrder)

    return useMutation({
        mutationFn: async (orderId) => {
            const res = await orderAPI.getOrderDetail(orderId)
            if (res.code !== 200) {
                throw new Error(res.message || '获取订单详情失败')
            }
            return res
        },
        onSuccess: (data) => {
            setCurrentOrder(data.data)
        },
        onError: (e) => {
            toast.error(e.message || '获取订单详情失败')
        }
    })
}