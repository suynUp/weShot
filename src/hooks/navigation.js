import { useNavigate } from "react-router-dom";

export const useNavigation = () => {
    
    const navigate = useNavigate()
    
    const goto = (url) => {
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