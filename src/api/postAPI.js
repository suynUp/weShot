import request from "../utils/request"

//帖子相关
class postAPI {
    
    /**
     * 
     * @param {*} square 
     * {
        "type": 2,
        "title": "何he意味",
        "content": "呵呵呵呵呵呵呵",
        "images": "https://loremflickr.com/400/400?lock=850010465791641"
        }
     * @returns 
     */
    static publish = (square) => {
        return request.post('/square/publish',square)
    }

    static getSquareList = (type,pageNum,pageSize) => {
        return request.get('/square/posts',{type,pageNum,pageSize})
    }

    static likeSquare = (postId) => {
        return request.post(`/square/like/${postId}`,)
    }

    static dislikeSquare = (postId) => {
        return request.post(`/square/unlike/${postId}`,)
    }

    /**{
    "postId": 1,
    "content": "太棒了"
    } */
    static comment = (contentObj) => {
        return request.post('/square/comment',contentObj)
    }

    static getCommentsById = (postId,pageNum,pageSize) => {
        return request.get(`/square/comments/${postId}`,{pageNum,pageSize})
    }

    static search = (keyword) => {
        return request.get('/square/search',{keyword})
    }

    static suggest = (keyword) => {
        return request.get('/square/search/suggest',{keyword})
    }

    static getSearchHistory = () => {
        return request.get('/square/search/history')
    }
}

export default postAPI