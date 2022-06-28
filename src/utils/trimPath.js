

//遍历文件列表
const trimPath = (path) => {
    
    let res = [{}]
    path.forEach((val, index, arr) => {
        let place = res
        //单个文件路径path拆分为数组
        let path = val.name.split('/')
        if (!place[0].label) {
            place[0].label = path[0]

        }
        //遍历每层文件路径判断工作路径place
        for (let i = 0; i < path.length; i++) {
            //比较已有路径树
            let newPath = place.every((item, ind) => {
                //根据label，如果当前层路径已存在，则工作路径为同路径
                if (path[i] == item.label) {
                    if (!item.children) {
                        item.children = [{}]
                    }
                    place = item.children
                    return false
                } else { return true }
            });
            // 否则，在res路径树新建工作路径
            if (newPath) {
                if (place[0].label) {
                    place[place.length] = {}
                }
                place[place.length - 1].label = path[i]
                if (i != path.length - 1) {

                    place[place.length - 1].children = [{}]
                }
                place = place[place.length - 1].children
            }

        }
    })
    return res;
}

export default trimPath