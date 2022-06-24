const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave:false,
  devServer:{
    proxy:{
      '/api':{
        target:'https://localhost:8844',
        // pathRewrite:{'^/api':''},
        secure:false,
      }
    }
  }
})
