import postAPI from "../api/postAPI"

const postPageConfig = {
    pageNum:1,
    pageSize
}

export const useGetPost = () => {
    const getAllPost = () => {
        return postAPI.getSquareList()
    }
}