import { reqTransferInfo } from '../api/index';
import renderSize from '../utils/renderSize';

const state = {
    transferInfo:{}
}

const mutations = {
    // GETTRANSFERINFO(state,result){
    //     state.transferInfo=result
    // }
}

const actions = {
    // async getTransferInfo({commit}){
    //     // console.log(renderSize);
    //     let result = await reqTransferInfo()
    //     for (const key in result) {
    //         if (key!='dht_nodes'&&key!='connection_status') {
    //             result[key] = renderSize(result[key])
    //         } 
    //     }
    //     commit('GETTRANSFERINFO',result)
    // }
}

const getters = {

}

export default {
    state,
    mutations,
    actions,
    getters,
}    