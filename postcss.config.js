module.exports = {
    plugins: {
      "postcss-px-to-viewport": {
        viewportWidth: 750,
        unitPrecision: 5,
        viewportUnit: "vw",
        fontViewportUnit: "vw",
        selectorBlackList: [],
        minPixelValue: 1,
        mediaQuery: false,
        exclude: []
      }
    }
};

// unitToConvert: 'px', // (String) 需要转换的单位,默认为px
// viewportWidth: 320, // (Number)视窗的宽度，对应的是我们设计稿的宽度，一般是750
// unitPrecision: 5, // (Number) 单位转换后保留的小数位
// propList: ['*'], // (Array) 指定可以转换的css属性，默认是['*']，代表全部属性进行转换
// viewportUnit: 'vw', //  (String)指定需要转换成的视窗单位，默认vw
// fontViewportUnit: 'vw', // (String)指定字体需要转换成的视窗单位，默认vw
// selectorBlackList: [], // (Array) 指定不转换为视窗单位的类，保留px，值为string或正则regexp
// minPixelValue: 1, // (Number) 默认值1，小于或等于`1px`不转换为视窗单位
// mediaQuery: false, // (Boolean) 是否在媒体查询时也转换px，默认false
// replace: true, // (Boolean)替换包含vw的规则
// exclude: [], // (Array or Regexp) 设置忽略文件，如node_modules - [/^node_modules$/]
// landscape: false, // (Boolean) @media (orientation: landscape)与通过转换的值相加landscapeWidth
// landscapeUnit: 'vw', // (String) 横屏时使用的单位
// landscapeWidth: 568 // (Number) 横屏时使用的视口宽度