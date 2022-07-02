const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave:false,
  devServer:{
    proxy:{
      '/api':{
        target:'https://localhost:8888',
        // pathRewrite:{'^/api':''},
        secure:false,
      }
    }
  }
})
