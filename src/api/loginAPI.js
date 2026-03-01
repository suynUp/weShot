import { RedirectHelper } from "../utils/redirector";

class LoginAPI{

    static login  () {
         RedirectHelper.redirectToLogin()
    }
}

export default LoginAPI