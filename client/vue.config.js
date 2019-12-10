module.exports = {
  transpileDependencies: ['vuetify', 'vuejs-dialog'],
  outputDir: '../public',
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000/api',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}
