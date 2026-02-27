import request from "../utils/request"

class PostDraftAPI {
    static saveDraft = (draft) => {
        return request.post('/post/draft/save',draft)
    }

    static getList = (pageNum,pageSize) => {
        return request.get('/post/draft/list',{
            pageNum:pageNum,
            pageSize:pageSize
        })
    }

    static getDetailById = (id) => {
        return request.get('/post/draft/detail',{
            postId:id
        })
    }

    static deleteDraft = (id) => {
        return request.delete(`/post/draft/${id}`)
    }
}

export default PostDraftAPI