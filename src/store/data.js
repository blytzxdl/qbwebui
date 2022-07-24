import { reqTorrentInfo, reqTrackers, reqPeers, reqFiles, reqResume, reqPause, reqMaindata, reqAddTorrents, reqDelete, reqCategories, reqTags } from '@/api/index';
import renderVal from '@/utils/renderVal';
import trimPath from '@/utils/trimPath';
import merger from '@/utils/merger';
import _ from 'lodash';
import dayjs from 'dayjs';
const state = {
    rid: 0,
    originalData: {},//原始数据
    itemInfo: [],//种子信息
    globalInfo: {},//全局信息
    files: [],//选中种子内容
    deleteName: "",//要删除的种子名称
    checkedHash: '',//已选择种子的哈希
    globalHistory: [],//全局上下行历史
    categories: [],//分类信息
    tags: [],//标签信息

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
        state.files = files
    },
    //弹窗确认删除
    QUERYDELETE(state, val) {
        let { name, hash } = val
        state.deleteName = name
        state.checkedHash = hash
    },
    //取消删除
    CANCELDELETE(state) {
        state.deleteName = ''
        state.checkedHash = ''
    },
    //保存全局信息历史
    SAVEGLOBALHISTORY(state) {
        let obj = {}
        obj.dl_info_speed = state.originalData.server_state.dl_info_speed
        obj.up_info_speed = state.originalData.server_state.up_info_speed
        obj.now = dayjs().format()
        let num = state.globalHistory.push(obj)
        if (num >= 901) {
            state.globalHistory.shift()
        }
    },
    //统计分类与标签
    SAVECATEGORIESANDTAGS(state) {
        let cats = merger({ 'uncategorized': { name: 'uncategorized' } }, state.originalData.categories)
        for (const key in cats) {
            cats[key].value = 0
        }
        let tags = Object.values(state.originalData.tags)
        let tagres = {}
        tags.push('untagged')
        tags.forEach((val) => {
            tagres[val] = { name: val, value: 0 }
        })
        state.itemInfo.forEach((item) => {
            if (item.category == '') { cats.uncategorized.value++ } else {
                cats[item.category].value++
            }
            let arr = item.tags.split(', ')
            arr.forEach(v => {
                if (tagres[v]) { tagres[v].value++ } else {
                    tagres.untagged.value++
                }
            })
        })
        state.tags = Object.values(tagres)
        state.categories = Object.values(cats)
    }
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
        commit('SAVEGLOBALHISTORY')
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

        commit('SAVECATEGORIESANDTAGS')
    },
    //获取种子内容
    async getFiles({ commit }, hash) {
        let res = trimPath(await reqFiles(hash))
        commit('GETFILES', res)
    },
    //删除种子
    async deleteTorrent({ state }, all) {
        let result = await reqDelete(state.checkedHash, all)
    },
    //恢复下载
    async setResume({ commit }, hash) {
        await reqResume(hash)
    },
    //暂停下载
    async setPause({ commit }, hash) {
        await reqPause(hash)
    },
    //添加种子
    async addTorrents({ commit }, link) {
        let par = Object.keys(link)
        var forms = new FormData()
        par.forEach((key) => {
            forms.append(key, link[key])
        })
        // console.log(forms);
        let result = await reqAddTorrents(forms)
        if (result == 'Fails.') {
            return false
        } else { return true }
    },
}


const getters = {
    downloading(state) {
        return state.itemInfo.filter(i => i.state == 'downloading')
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