
import requests from './request';
import axios from 'axios';

export const reqVersion = () => requests({
    url: '/v2/app/version',
    method: 'get'
})

export const reqTags = () => requests({
    url: '/v2/torrents/tags',
    method: 'get'
})

export const reqCategories = () => requests({
    url: '/v2/torrents/categories',
    method: 'get'
})

export const reqTorrentInfo = (filter, category, tag, sort, reverse) => requests({
    url: `/v2/torrents/info?filter=${filter}${category}&sort=${sort}${tag}`,
    method: 'get'
})

export const reqTransferInfo = () => requests({
    url: '/v2/transfer/info',
    method: 'get'
})

export const reqTrackers = (hash) => requests({
    method: 'post',
    url: '/v2/torrents/trackers',
    data: `hash=${hash}`,
})

export const reqPeers = (hash) => requests({
    method: 'post',
    url: `/v2/sync/torrentPeers`,
    data: `hash=${hash}`,

})

export const reqFiles = (hash) => requests({
    method: 'post',
    url: '/v2/torrents/files',
    data: `hash=${hash}`,
})

export const reqResume = (hash) => requests({
    method: 'post',
    url: '/v2/torrents/resume',
    data: `hashes=${hash}`,
})

export const reqPause = (hash) => requests({
    method: 'post',
    url: '/v2/torrents/pause',
    data: `hashes=${hash}`,
})

export const reqLogin = (userName, password) => requests({
    method: 'post',
    url: '/v2/auth/login',
    data: `username=${userName}&password=${password}`,
})

export const reqMaindata = (rid) => requests({
    method: 'get',
    url: `/v2/sync/maindata?rid=${rid}`,
})

export const reqAddTorrents = (link) => requests({
    method: 'post',
    url: `/v2/torrents/add`,
    data: link,
})

export const reqDelete = (hash, all) => requests({
    method: 'post',
    url: '/v2/torrents/delete',
    data: `hashes=${hash}&deleteFiles=${all}`,
})

export const reqSetDownloadLimit = (val) => requests({
    method: 'post',
    url: '/v2/transfer/setDownloadLimit',
    data: `limit=${val}`,
})

export const reqSetUploadLimit = (val) => requests({
    method: 'post',
    url: '/v2/transfer/setUploadLimit',
    data: `limit=${val}`,
})

export const reqToggleSpeedLimitsMode = () => requests({
    method: 'post',
    url: '/v2/transfer/toggleSpeedLimitsMode',
})

export const reqLocalFile = (data) => requests({
    method: 'post',
    url: `/localFile`,
    data
})

export const reqClearVideoTemp = () => requests({
    method: 'get',
    url: `/localFile/clearVideoTemp`,
})

export const reqVideoSrc = () => requests({
    method: 'get',
    url: `/localFile/videoSrc`,
})

export const reqCheckFileServer = () => requests({
    method: 'get',
    url: `/localFile/checkFileServer`,
})

export const reqRename = (data) => requests({
    method: 'post',
    url: `/v2/torrents/rename`,
    headers:{
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    data:`hash=${data.hash}&name=${data.name}`
})

export const reqChangeFSSettings = (data) => requests({
    method: 'post',
    url: `/localFile/changeFileServerSettings`,
    data
})

export const reqUpdateLibrary = (data) => requests({
    method: 'get',
    url: `/localFile/updateLibrary`,
})

export const reqToggleOriginUI = () => requests({
    method: 'get',
    url: `/v2/app/setPreferences?json={"alternative_webui_enabled":false}`,
})

export const reqMatchVideo = (name) => {
    return axios.create()({
    method: 'get',
    url: `https://api.dandanplay.net/api/v2/search/anime?keyword=${name}`,
})}