var fs = require('fs');

module.exports = {
  publicPath: '',
  transpileDependencies: [
    'vuetify'
  ],
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title = "SIMAR - EPICS Variant";
        return args;
      })
  },
  devServer: {
    open: process.platform === 'darwin',
    host: '0.0.0.0',
    https: {
      key: fs.readFileSync('./sim.key'),
      cert: fs.readFileSync('./sim.crt'),
    },
    port: 8085,
    https: true,
    hotOnly: false,
  },
}