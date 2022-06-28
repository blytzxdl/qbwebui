import {reqLogin} from '../api/index';
const checkCookie = async ()=>{
    try {
        let result = await reqLogin()
        if (result == 'Ok.') {
            return true
        }else{
            return false
        }
    } catch (error) {
        return false
    }
}

export default checkCookie