import { reqCategories,reqTags,reqTrackers } from '../api/index';

//state：存储数据
const state = {
    categories:{},
    tags:[],
    // trackers:[]
}
//mutation 修改state的唯一手段
const mutations = {
    GETCATEGORIES(state,result){
        state.categories=result
    },
    GETTAGS(state,result){
        state.tags=result
    },
    // GETTRACKERS(state,result){
    //     state.trackers=result
    // },
}
//业务逻辑，处理异步
const actions = {
    async getCategories({commit}){
        let result = await reqCategories()
        commit('GETCATEGORIES',result)
    },
    async getTags({commit}){
        let result = await reqTags()
        commit('GETTAGS',result)
    },
    // async getTrackers({commit}){
    //     let result = await reqTrackers()
    //     commit('GETTRACKERS',result)
    // }
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