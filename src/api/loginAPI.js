import { RedirectHelper } from "../utils/redirector";

class LoginAPI{

    static async login  () {
        await RedirectHelper.redirectToLogin()
    }
}

export default LoginAPI