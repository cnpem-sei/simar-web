module.exports = {
  
}

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
  }
}