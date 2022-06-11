import { reqTorrentInfo, reqTrackers, reqPeers, reqFiles, reqResume, reqPause } from '../api/index';
import dayjs from 'dayjs';
import renderSize from '../utils/renderSize';
import trimPath from '../utils/trimPath';


const state = {
    itemInfo: [],
    query: {
        filter: "all",
        category: "",
        tag: "",
        sort: "name",
        reverse: false,
    },
    byteFilter: [
        'completed',
        'downloaded',
        'size',
        "total_size",
        "uploaded",
        'dlspeed',
        'upspeed',
        'dl_limit',
        'up_limit'
    ],
    timeFilter: [
        'completion_on'
    ],
    trackers: [],
    trackerStatus: ['已禁用', '未联系', '工作中', '更新中', '未工作'],
    peers: [],
    files: [],
    selection: []
}
const mutations = {
    GETITEM(state, itemInfo) {
        state.itemInfo = itemInfo
    },
    CLEARQUERY(state) {
        state.query = {
            filter: "all",
            category: "",
            tag: "",
            sort: "name",
            reverse: false,
        }
    },
    GETTRACKERS(state, tra) {
        state.trackers = tra
    },
    GETPEERS(state, peers) {
        state.peers = peers
    },
    GETFILES(state, files) {
        state.files = files
    },
    SETSELECTION(state, sel) {
        state.selection = sel
    },
    CLEARSELECTION(state, sel) {
        state.selection = []
    }
}
const actions = {
    //请求/筛选种子数据
    async getItem() {
        let { filter, category, tag, sort, reverse } = state.query
        let result = await reqTorrentInfo(filter, category, tag, sort, reverse)
        this.dispatch('fixItemInfo', result)
    },
    //种子单位换算
    fixItemInfo({ commit }, res) {
        res.forEach((value, index, arr) => {
            //日期
            state.timeFilter.forEach(fil => {
                value[fil] = dayjs.unix(value[fil]).format('YYYY/MM/DD')
            });
            //字节
            state.byteFilter.forEach(fil => {
                if (value[fil] == -1) {
                    value[fil] = '无限制'
                } else {

                    value[fil] = renderSize(value[fil])
                }
            });
            //舍入
            value.progress = value.progress.toFixed(4)
        }, this)

        commit('GETITEM', res)
    },
    //获取trackers
    async getTrackers(context, hash) {
        let result = await reqTrackers(hash)
        this.dispatch('fixTrackerStatus', result)
    },
    //trackers状态翻译
    fixTrackerStatus({ commit }, res) {
        res.forEach((val) => {
            val.status = state.trackerStatus[val.status]
        })
        commit('GETTRACKERS', res)
    },
    //获取用户
    async getPeers({ commit }, hash) {
        let result = await reqPeers(hash)
        result = result.peers
        let res = []
        for (let i in result) {
            res.push(result[i])
        }
        res.forEach((val, ind) => {
            val.progress = val.progress * 100 + '%'
            val.relevance = val.relevance * 100 + '%'

        })
        commit('GETPEERS', res)
    },
    //获取种子内容
    async getFiles({ commit }, hash) {
        let result = await reqFiles(hash)
        let res = trimPath(result)
        commit('GETFILES', res)
    },
    //清理筛选
    clearQuery({ commit }) {
        commit('CLEARQUERY')
        this.dispatch('getItem')
    },
    //设置筛选
    setQuery({ commit }, par) {
        let { parName, parVal } = par
        if (parName == 'category') {
            if (parVal != '') {
                parVal = '&category=' + parVal
            }
        } else if (parName == 'tag') {
            if (parVal != '') {
                parVal = '&tag=' + parVal
            }
        }
        state.query[parName] = parVal
        // console.log(state.query);
        this.dispatch('getItem')
    },
    setSelection({ commit }, sel) {
        let result = ''
        sel.forEach((val, ind) => {
            if (ind > 0) {
                result += '|'
            }
            result += val.hash
        })
        commit('SETSELECTION', result)
    },
    async setResume({ commit }) {
        let result = await reqResume(state.selection)
        commit('CLEARSELECTION')
    },
    async setPause({ commit }) {
        let result = await reqPause(state.selection)
        commit('CLEARSELECTION')
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