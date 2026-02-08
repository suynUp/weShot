import request from "../utils/request";

//专门用来调用API
class UserAPI{
    static getUser(){
        return request.get('/user/getProfile')
    }
    static updateUserData(userData){
        return request.post('/user/updateProfile',userData)
    }
}

export default UserAPI