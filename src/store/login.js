import {reqLogin} from '../api';
import router from '../router';


const state = {
    showError:false
}

const mutations = {
    SHOWERROR(state){
        state.showError = true
    }
}

const actions = {
    async login({commit},userInfo){
        let {userName,password} = userInfo
        let result = await reqLogin(userName,password)
        // console.log(result);
        if (result == 'Fails.') {
            commit('SHOWERROR')
        }else if (result== 'Ok.') {
            router.push('/Home')         
        }      
    }

}

const getters = {

}

export default {
    state,
    mutations,
    actions,
    getters,
}    