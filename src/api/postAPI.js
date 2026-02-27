import request from "../utils/request"

//帖子相关
class postAPI {
    
    /**
     * 
     * @param {*} square 
     * {
        "type": "类型",
        "title": "何he意味",
        "content": "呵呵呵呵呵呵呵",
        "images": ["https://loremflickr.com/400/400?lock=850010465791641"]
        }
     * @returns 
     */
    static publish = (square) => {
        return request.post('/square/publish',square)
    }

    static getSquareList = (type,pageNum,pageSize,keyword,casId=null,status=null) => {
        return request.get('/square/posts',{type,pageNum,pageSize,keyword,casId,status})
    }

    static getMyPosts = (pageNum,pageSize) => {
        return request.get('/square/my-posts',{pageNum,pageSize})
    }

    static getPostDetail = (postId) => {
        return request.get(`/square/detail/${postId}`)
    }

    static likePost = (postId) => {
        return request.post(`/square/like/${postId}`,)
    }

    static dislikePost = (postId) => {
        return request.post(`/square/unlike/${postId}`,)
    }
    
    static deletePost = (postId) => {
        return request.delete(`/square/posts/${postId}`)
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

    static suggest = (keyword) => {
        return request.get('/square/search/suggest',{keyword})
    }

    static getSearchHistory = () => {
        return request.get('/square/search/history')
    }
}

export default postAPI