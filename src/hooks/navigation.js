import { useNavigate } from "react-router-dom";
import request from "../utils/request";
import { toast } from "./useToast";

export const useNavigation = () => {
    const isLogin = request.hasToken()
    const navigate = useNavigate()
    
    const goto = (url) => {

        if(!isLogin&&url !== '/login'&&url!=='/'){
            toast.warning('请先登录')
            return
        }
        navigate(url)
    }
    
    const goBack = () => {
        navigate(-1);
    };

    return {
        goto,
        goBack
    }
}