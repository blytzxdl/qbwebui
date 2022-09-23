const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave:false,
  devServer:{
    https:true,
    proxy:{
      '/api':{
        // target:'http://localhost:8989',
        target:'https://localhost:7788',
        // pathRewrite:{'^/api':''},
        secure:false,
      }
    }
  }
})
