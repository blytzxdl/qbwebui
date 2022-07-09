const renderSize = (value, mode = 'default') => {
    if (null == value || value == '' || parseInt(value) == 0) {
        if (mode == 'default') {
            return "0 Bytes";
        } else if (mode == 'formatter') {
            return { size: 0, unit: '' }
        }
    }
    var unitArr = new Array("Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB");
    var index = 0;
    var srcsize = parseFloat(value);
    index = Math.floor(Math.log(srcsize) / Math.log(1024));
    var size = srcsize / Math.pow(1024, index);
    if (mode == 'default') {
        size = size.toFixed(2);//保留的小数位数
        return size + unitArr[index];
    } else if (mode == 'formatter') {
        if (size > 100) {
            size = parseInt(size)
        } else {
            size = size.toFixed(1)
        }
        return { size, 'unit': unitArr[index] }
    }
}
export default renderSize