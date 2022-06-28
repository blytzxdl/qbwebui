
let merger = (a, b) => {

    //遍历b
    for (const key in b) {
        //如果b[key]不是Object
        if (!(b[key] instanceof Object)) {
            a.set(key,b[key])
        } else {
            if (!a.get(key)) {
                a.set(key,new Map())
            }
            merger(a.get(key), b[key])
        }
    }
    return a
}

export default merger