import { reqTransferInfo } from '../api/index';
import renderSize from '../utils/renderSize';
//state：存储数据
const state = {
    transferInfo:{}
}
//mutation 修改state的唯一手段
const mutations = {
    GETTRANSFERINFO(state,result){
        state.transferInfo=result
    }
}
//业务逻辑，处理异步
const actions = {
    async getTransferInfo({commit}){
        // console.log(renderSize);
        let result = await reqTransferInfo()
        for (const key in result) {
            if (key!='dht_nodes'&&key!='connection_status') {
                result[key] = renderSize(result[key])
            } 
        }
        commit('GETTRANSFERINFO',result)
    }
}
//类计算属性，简化仓库数据
const getters = {

}

export default {
    state,
    mutations,
    actions,
    getters,
}    