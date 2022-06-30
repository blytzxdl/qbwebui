
import requests from './request';

export const reqVersion = () => {
    return requests({
        url: '/v2/app/version',
        method: 'get'
    })
}

export const reqTags = () => requests({
    url: '/v2/torrents/tags',
    method: 'get'
})

export const reqCategories = () => requests({
    url: '/v2/torrents/categories',
    method: 'get'
})

export const reqTorrentInfo = (filter,category,tag,sort,reverse) => requests({
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
    data:`hash=${hash}`,
})

export const reqPeers = (hash) => requests({
    method: 'post',
    url: `/v2/sync/torrentPeers`,
    data:`hash=${hash}`,

})

export const reqFiles = (hash) => requests({
    method: 'post',
    url: '/v2/torrents/files',
    data:`hash=${hash}`,
})

export const reqResume = (hash) => requests({
    method: 'post',
    url: '/v2/torrents/resume',
    data:`hashes=${hash}`,
})

export const reqPause = (hash) => requests({
    method: 'post',
    url: '/v2/torrents/pause',
    data:`hashes=${hash}`,
})

export const reqLogin = (userName,password) => requests({
    method: 'post',
    url: '/v2/auth/login',
    data:`username=${userName}&password=${password}`,
})

export const reqMaindata = (rid) => requests({
    method: 'get',
    url: `/v2/sync/maindata?rid=${rid}`,
})

export const reqAddTorrents = (link) => requests({
    method: 'post',
    url: `/v2/torrents/add`,
    data:link,
})

export const reqDelete = (hash,all) => requests({
    method: 'post',
    url: '/v2/torrents/delete',
    data:`hashes=${hash}&deleteFiles=${all}`,
})