import request from "../utils/request"

class DraftAPI {
    static saveDraft = (draft) => {
        return request.post('/order/draft/save',draft)
    }

    static getList = (pageNum,pageSize) => {
        return request.get('/order/draft/getList',{
            pageNum:pageNum,
            pageSize:pageSize
        })
    }

    static getDetailById = (id) => {
        return request.get('/order/draft/getDetail',{
            orderId:id
        })
    }

    static deleteDraft = (id) => {
        return request.delete('/order/draft/delete/{orderId}',{
            orderId:id
        })
    }
}

export default DraftAPI