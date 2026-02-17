import request from "../utils/request";

//专门用来调用API
class UserAPI{
    static getUser = () => {
        return request.get('/user/getProfile')
    }

    /**{
    "nickname": "析阳",
    "avatarUrl": "https://avatars.githubusercontent.com/u/68357909",
    "sex": 1,
    "phone": "42654087011",
    "detail": "sed",
    "photographer": {
            "style": "ut",
            "equipment": "veniam eiusmod",
            "type": "incididunt consectetur qui"
        }
    } */
    static updateUserData = (userData) => {
        return request.post('/user/updateProfile',userData)
    }

    static getOtherUserById = (casId) => {
        return request.get(`/user/info/${casId}`)
    }
}

export default UserAPI