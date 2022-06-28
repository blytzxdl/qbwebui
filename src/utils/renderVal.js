import dayjs from 'dayjs';
import renderSize from '@/utils/renderSize';
const byteFilter = [
    'completed',
    'downloaded',
    'size',
    "total_size",
    "uploaded",
    'dlspeed',
    'upspeed',
    'dl_limit',
    'up_limit',
    'up_info_speed',
    'dl_info_speed',
    'up_rate_limit',
    'dl_rate_limit',
    'dl_info_data',
    'up_info_data'
]
const timeFilter = [
    'completion_on'
]
const renderVal=(key,val)=>{
    //日期
    if (timeFilter.includes(key)) {
        val = dayjs.unix(val).format('YYYY/MM/DD')
    }
    //字节
    if (byteFilter.includes(key)) {
        if (val != -1) {
            val = renderSize(val)
        }
    }
    //舍入
    if (key == 'progress') {
        val = parseFloat(val * 100).toFixed(2)
    }
    if (key == 'ratio') {
        val = val.toFixed(2)
    }
    return val
}
export default renderVal