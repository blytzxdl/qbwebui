const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  outputDir: 'dist/public',
  devServer: {
    // server:{
      // type:'https',
      // options:{  
      //   key:'./test/ssl/domain.key',
      //   cert:'./test/ssl/domain.pem'
      // },
    // },
    proxy: {
      '/api': {
        // target:'http://localhost:8989',
        target: 'http://pc.victorytoken.top:7788',
        // pathRewrite:{'^/api':''},
        secure: false,
        // changeOrigin:true,
      },
      // '/socket': {// 设置websocket代理
        // target: 'https://localhost:7788',
        // ws: true, // 开启websocket代理
        // changeOrigin: true,
        // pathRewrite: {
        //   '^/socket.io': ''
        // }
      // }
    },
  }
})
