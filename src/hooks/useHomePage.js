import { OrderDisplayStore } from "../store/orderDisplayStore"
import { OrderStore } from "../store/orderStore"
import photographerStore from "../store/photographerStore"
import { useGetCompletedOrders, useGetOrder } from "./useOrder"
import { useGetOrderRanking, useGetRatingRanking } from "./usePhotographer"

const useHomePageData = () => {
    
    const {getAllLobbys} = useGetOrder()
    const getRatingRanking = useGetRatingRanking()
    const getOrderRanking = useGetOrderRanking()
    const getGallery = useGetCompletedOrders()

    const allPengdings = OrderStore(state => state.allPendingOrders)
    const rateRanking = photographerStore(state => state.phgRatingRanking)
    const orderRanking = photographerStore(state => state.phgOrderRanking)
    const gallery = OrderDisplayStore(state => state.orderList)

    const displayPending = () => getAllLobbys(1,6)
    const displayRR = () => getRatingRanking.mutate(3)    
    const displayOR = () => getOrderRanking.mutate(3)
    const displayComplete = () => getGallery.mutate({pageNum:1,pageSize:6})

    return {
        displayPending, 
        displayRR, 
        displayOR, 
        displayComplete,

        allPengdings,
        rateRanking, 
        orderRanking,
        gallery 
    }
}

export default useHomePageData