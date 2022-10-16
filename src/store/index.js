import Vue from 'vue';
import Vuex from 'vuex';
import {
    reqLogin,
    reqFiles,
    reqResume,
    reqPause,
    reqMaindata,
    reqAddTorrents,
    reqDelete,
    reqSetDownloadLimit,
    reqSetUploadLimit,
    reqToggleSpeedLimitsMode,
    reqLocalFile,
    reqClearVideoTemp,
    reqVideoSrc,
    reqCheckFileServer,
    // reqRename,
    reqChangeFSSettings,
    reqToggleOriginUI,
    reqUpdateLibrary
} from '@/api/index';
// import { reqMatchVideo } from '@/api/request';
import renderVal from '@/utils/renderVal';
import trimPath from '@/utils/trimPath';
import merger from '@/utils/merger';
import translation from "@/utils/translation";
import dayjs from 'dayjs';
import router from '@/router';
Vue.use(Vuex)



export default new Vuex.Store({
    state() {
        return {
            showError: false,
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
            filter: { mode: 'none' },//筛选参数
            foldHash: null,//折叠的种子hash
            playVideo: false,//控制播放器界面的显示
            fileName: '',//请求文件内容的文件名
            translation,
            fileServerState: false,
            FSSettings: {},
            showFSSettings: false,
            showAddTorrents: false,
            setSpeedLimit: false,
            showSettings: false
        }
    },
    mutations: {
        //登录错误提示
        SHOWERROR(state) {
            state.showError = true
        },
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
            //正常模式
            if (state.filter.mode == 'none') {
                state.itemInfo = Object.values(itemInfo)
                state.itemInfo.sort((aVal, bVal) => {
                    let index = ['error', 'missingFiles', 'queuedUP', 'downloading', 'pausedDL', 'uploading']
                    let a = index.indexOf(aVal.state)
                    a = a >= 0 ? a : 99
                    let b = index.indexOf(bVal.state)
                    b = b >= 0 ? b : 99
                    // console.log(a,b);
                    if (a == b) {
                        if (aVal.added_on > bVal.added_on) {
                            return -1
                        } else return 1
                    }
                    return a - b
                })
            }
            //搜索模式
            if (state.filter.mode == 'search') {
                state.itemInfo = []
                for (const hash in itemInfo) {
                    state.filter.par.forEach((val) => {
                        let reg = new RegExp(val, 'gim')
                        if (reg.test(itemInfo[hash].name) || reg.test(itemInfo[hash].category) || reg.test(itemInfo[hash].tags) || (itemInfo[hash].animeInfo && itemInfo[hash].animeInfo.animeTitle && reg.test(itemInfo[hash].animeInfo.animeTitle))) {
                            if (!state.itemInfo.includes(itemInfo[hash])) {
                                state.itemInfo.push(itemInfo[hash])
                            }
                        }
                    })
                }
            }
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
        },
        //设置筛选
        SETFILTER(state, par) {
            state.filter = par
            this.commit('GETITEMINFO')
        },
        //清除筛选
        CLEARFILTER(state) {
            state.filter = { mode: 'none' },
                this.dispatch('getItemInfo')
        },
        //控制种子折叠互斥
        SETFOLDHASH(state, hash) {
            if (state.foldHash == hash) {
                state.foldHash = null
            } else {
                state.foldHash = hash
                this.dispatch("getFiles", hash);
            }
        },
        //控制播放器界面显示
        CONTROLVIDEO(state, val) {
            state.playVideo = val;
        },
        CONTROLFSSETTINGS(state, val) {
            state.showFSSettings = val
        },
        CONTROLADDTORRENTS(state, val) {
            state.showAddTorrents = val
        },
        CONTROLSETSPEEDLIMIT(state, val) {
            state.setSpeedLimit = val
        },
        SONTROLSETTINGS(state, val) {
            state.showSettings = val
        }
    },
    actions: {
        //登录处理
        async login({ commit }, userInfo) {
            let { userName, password } = userInfo
            let result = await reqLogin(userName, password)
            if (result) {
                router.push('/home')
            } else {
                return false
            }
        },
        //同步数据
        async getMaindata({ commit, state }) {
            let res = await reqMaindata(state.rid)
            commit('GETMAINDATA', res)
            commit('SAVEGLOBALHISTORY')
            this.dispatch('getItemInfo')
        },
        //种子单位换算
        getItemInfo({ commit, state }) {
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
        getGlobalInfo({ commit, state }) {
            let res = JSON.parse(JSON.stringify(state.originalData.server_state))
            for (let key in res) {
                res[key] = renderVal(key, res[key])
            }
            commit('GETGLOBALINFO', res)
            commit('SAVECATEGORIESANDTAGS')
        },
        //获取种子内容
        async getFiles({ commit }, hash) {
            commit('GETFILES', false)
            let res = trimPath(await reqFiles(hash))
            commit('GETFILES', res)
        },
        //删除种子
        async deleteTorrent({ state }, all) {
            let result = await reqDelete(state.checkedHash, all)
            return result
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
        async addTorrents({ commit }, data) {
            var forms = new FormData()
            for (const key in data) {
                forms.append(key, data[key])
                if (key == 'fileList') {
                    data[key].forEach((val, ind) => {
                        forms.append('file', val.raw)
                    })
                }
            }
            // console.log(forms);
            return await reqAddTorrents(forms)
        },
        //设置限速
        async setSpeedLimit({ state, commit }, limit) {
            await reqSetDownloadLimit(limit.download * 1024)
            await reqSetUploadLimit(limit.upload * 1024)
            if (limit.alternativeSpeedLimit != state.originalData.server_state.use_alt_speed_limits) {
                await reqToggleSpeedLimitsMode()
            }
            commit("CONTROLSETSPEEDLIMIT", false);
        },
        //发送文件内容请求
        async tryLocalFile({ commit, dispatch, state }, file) {
            let { fileName, met } = file
            let res = await reqLocalFile(fileName)
            if (res && (met == 'play')) {
                state.fileName = fileName.name
                commit('CONTROLVIDEO', true)
            } else if (res && (met == 'path')) {
                return dispatch('getVideoSrc')
            }
        },
        //清理服务器视频缓存
        clearVideoTemp() {
            reqClearVideoTemp()
        },
        //获取视频串流地址
        async getVideoSrc() {
            return await reqVideoSrc()
        },
        async checkFileServer({ state }) {
            try {
                var res = await reqCheckFileServer()
            } catch (error) {
                console.log(error);
            }
            if (res) {
                state.FSSettings = res
                state.fileServerState = true
            }
        },
        async changeFSSettings({ commit }, settings) {
            let result = await reqChangeFSSettings(settings)
            commit("CONTROLFSSETTINGS", !result);
        },
        async toggleOriginUI() {
            await reqToggleOriginUI()
        },
        updateLibrary({commit}) {
            reqUpdateLibrary()
            commit("SONTROLSETTINGS", false)
        }
    },
    getters: {
        //筛选下载中的种子
        downloading(state) {
            return state.itemInfo.filter(i => i.state == 'downloading')
        },
        trackers(state) {
            return state.originalData.trackers
        },
        allStatus(state) {
            let statusType = {
                active: [
                    "downloading",
                    "uploading",
                    "queuedUP",
                    "queuedDL",
                    "checkingUP",
                    "forcedUP",
                    "allocating",
                    "metaDL",
                    "checkingDL",
                    "forcedDL",
                    "checkingResumeData",
                    "moving",
                ],
                inactive: ["pausedDL", "stalledUP", "stalledDL", "unknown"],
                done: ["pausedUP"],
                error: ["error", "missingFiles"],
            };
            let allStatus = {
                downloading: {
                    icon: "pause-circle-o",
                    click(hash) {
                        this.dispatch("setPause", hash);
                    },
                },
                pausedDL: {
                    icon: "play-circle-o",
                    click(hash) {
                        this.dispatch("setResume", hash);
                    },
                },
                error: { icon: "warning-o", click: null, },
                missingFiles: {
                    icon: "warning-o",
                    click: null,
                },
                uploading: {
                    icon: "upgrade",
                    click(hash) {
                        this.dispatch("setPause", hash);
                    },
                },
                pausedUP: {
                    icon: "passed",
                    click: null,
                },
                queuedUP: {
                    icon: "more-o",
                    click: null,
                },
                stalledUP: {
                    icon: "more-o",
                    click: null,
                },
                checkingUP: {
                    icon: "more-o",
                    click: null,
                },
                forcedUP: {
                    icon: "upgrade",
                    click(hash) {
                        this.dispatch("setPause", hash);
                    },
                },
                allocating: {
                    icon: "more-o",
                    click: null,
                },
                metaDL: {
                    icon: "more-o",
                    click: null,
                },
                queuedDL: {
                    icon: "more-o",
                    click: null,
                },
                stalledDL: {
                    icon: "more-o",
                    click: null,
                },
                checkingDL: {
                    icon: "more-o",
                    click: null,
                },
                forcedDL: {
                    icon: "more-o",
                    click: null,
                },
                checkingResumeData: {
                    icon: "more-o",
                    click: null,
                },
                moving: {
                    icon: "more-o",
                    click: null,
                },
                unknown: {
                    icon: "more-o",
                    click: null,
                },
            };
            for (const name in allStatus) {
                allStatus[name].name = name;
                allStatus[name].translate = state.translation.chs.torrentState[name];
                if (!allStatus[name].click) {
                    allStatus[name].click = () => { console.log(name) }
                }
                for (const type in statusType) {
                    if (statusType[type].includes(name)) {
                        allStatus[name].statusColor = `statusBar-color-${type}`
                        allStatus[name].statusIconColor = `statusIcon-color-${type}`
                    }
                }
            }
            return allStatus;
        },
    }
})