import { useUserLogin } from "../hooks/useUser"

const Login = () => {

    const loginMutation = useUserLogin()

    return <div>
        <button onClick={()=>loginMutation.mutate()}>登录</button>
    </div>
}

export default Login