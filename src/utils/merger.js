const merger = (...opts) => {
    let res = {};

    let combine = (opt) => {
        for (let prop in opt) {
            if (opt.hasOwnProperty(prop)) {

                //下面是深拷贝与浅拷贝的区别，用到了递归的思想
                if (Object.prototype.toString.call(opt[prop]) === '[object Object]') {

                    res[prop] = merger(res[prop], opt[prop]);

                } else {

                    res[prop] = opt[prop];

                }

            }
        }
    }

    //扩张运算符将两个对象合并到一个数组里因此可以调用length方法
    for (let i = 0; i < opts.length; i++) {
        combine(opts[i]);
    }
    return res;
}

export default merger