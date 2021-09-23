var fs = require('fs');

module.exports = {
  publicPath: '',

  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title = "SIMAR";
        return args;
      })
  },
  devServer: {
    open: process.platform === 'darwin',
    host: '0.0.0.0',
    https: process.env.NODE_ENV !== "production" ? {
      key: fs.readFileSync('./sim.key'),
      cert: fs.readFileSync('./sim.crt'),
    } : undefined,
    port: 8085,
    hotOnly: false,
  },
}