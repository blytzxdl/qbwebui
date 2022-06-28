import { reqTorrentInfo, reqTrackers, reqPeers, reqFiles, reqResume, reqPause, reqMaindata, reqAddTorrents, reqDelete, reqCategories, reqTags } from '@/api/index';
import renderVal from '@/utils/renderVal';
// import renderSize from '@/utils/renderSize';
// import trimPath from '@/utils/trimPath';
import merger from '@/utils/merger';
import _ from 'lodash';
const state = {
    rid: 0,
    originalData: {},
    itemInfo: [],
    globalInfo: {},
    files: [],
    // query: {
    //     filter: "all",
    //     category: "",
    //     tag: "",
    //     sort: "name",
    //     reverse: false,
    // },

    // trackerStatus: ['已禁用', '未联系', '工作中', '更新中', '未工作'],
    // peers: [],
    // selection: [],
}
const mutations = {
    //处理主体数据
    GETMAINDATA(state, newData) {
        //处理删减
        if (newData.torrents_removed) {
            newData.torrents_removed.forEach((hash) => {
                delete state.originalData.torrents[hash]
            })
        } else if (newData.full_update) {//处理完全更新
            state.originalData = {}
            merger(state.originalData, newData)
        } else {
            merger(state.originalData, newData)
        }
        state.rid += 1
    },
    //存入种子列表
    GETITEMINFO(state, itemInfo) {
        state.itemInfo = Object.values(itemInfo)
    },
    //存入全局信息
    GETGLOBALINFO(state, globalInfo) {
        state.globalInfo = globalInfo
    },
    //存入当前种子内容
    GETFILES(state, files) {
        state.files=files
    },
}
const actions = {
    //筛选种子数据
    // async getFil({ commit }) {
    //     let { filter, category, tag, sort, reverse } = state.query
    //     let result = await reqTorrentInfo(filter, category, tag, sort, reverse)
    //     commit('GETITEM', result)
    // },
    //同步数据
    async getMaindata({ commit }) {
        let res = await reqMaindata(state.rid)
        commit('GETMAINDATA', res)
        this.dispatch('getItemInfo')
    },
    //种子单位换算
    getItemInfo({ commit }) {
        let res = JSON.parse(JSON.stringify(state.originalData.torrents))
        for (let hash in res) {
            let ite = res[hash]
            ite.hash = hash
            for (const key in ite) {
                ite[key] = renderVal(key, ite[key])
            }
        }
        commit('GETITEMINFO', res)
        this.dispatch('getGlobalInfo')
    },
    //获取全局信息
    getGlobalInfo({ commit }) {
        let res = JSON.parse(JSON.stringify(state.originalData.server_state))
        for (let key in res) {
            res[key] = renderVal(key, res[key])
        }
        commit('GETGLOBALINFO', res)
    },
    //获取种子内容
    async getFiles({ commit }, hash) {
        // let res = trimPath(await reqFiles(hash))
        // let res = await reqFiles(hash)
        // commit('GETFILES', res)
    },
}


const getters = {
    downloading(state) {
        return state.itemInfo.filter(i => i.state == 'downloading')
    },
    categories(state) {
        return state.originalData.categories
    },
    tags(state) {
        return state.originalData.tags
    },
    trackers(state) {
        return state.originalData.trackers
    }
}

export default {
    state,
    mutations,
    actions,
    getters,
}   