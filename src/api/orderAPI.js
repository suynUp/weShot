import request from "../utils/request"

class orderAPI {

    static createOrder = (order) => request.post('/order/create',order)

    /**
     * 摄影师抢单
     * @param orderId 
     * @returns 
     */
    static SnatchOrders = (orderId) => request.get(`/order/take/${orderId}`)
    
    /**
     * 
     * @returns 获取自己的待接取订单
     */
    static getMyPendingOrders = () => request.get('/order/photographer/pending')

    /**
     * 
     * @param pageNum 默认1 
     * @param pageSize 默认10
     * @returns 
     */
    static getLobbyList = (pageNum,pageSize) => request.get('/order/lobby',{pageNum,pageSize})
    
    //获取我的订单
    static getMyOrderList = () => request.get('/order/list')

    /**
     * 
     * @param orderAction {
     *     action：ACCEPT, REJECT, PAY, DELIVER, COMPLETE
     *     orderId
     * }
     * @returns 
     */
    static handleOrder = (orderAction) => {
        return request.post('/order/handle',orderAction)
    }

    /**{
        "orderId": 3,
        "score": 4,
        "content": "ea magna"
    } */
    static commentOrder = (rate) => {
        return request.post('/order/rate',rate)
    }

}

export default orderAPI