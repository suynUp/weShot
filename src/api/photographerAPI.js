import request from "../utils/request"

class photographerAPI {
    /**
     * 
     * @param pageNum 页数，默认1
     * @param pageSize 页面大小，默认10
     * @returns 
     */
    static getPhotographerList=(pageNum,pageSize,keyword)=>{
        return request.get('/photographer/list',{pageNum,pageSize,keyword})
    }

    static enroll = (inviteCode) => {
        return request.post('/photographer/enroll',null,{inviteCode})
    }

    static searchSuggest = (keyword) => {
        return request.get('/photographer/search/suggest',{keyword})
    }

    static searchHistory = () => {
        return request.get('/photographer/search/history')
    }

    static orderRank = (limit) => {
        return request.get('/photographer/ranking/orders',{limit})
    }

    static rateRank = (limit) => {
        return request.get('/photographer/ranking/ratings',{limit})
    }

    static getEvaluation=(casId)=>{
        return request.get(`/photographer/performance/${casId}`)
    }

}

export default photographerAPI