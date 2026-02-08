import LoginAPI from "../api/loginAPI"

const Login = () => {
    const login = ()=>{
        console.log(LoginAPI.login())
    }

    return <div>
        <button onClick={login}>登录</button>
    </div>
}

export default Login