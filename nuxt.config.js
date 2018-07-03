const remjs = 'var deviceWidth = document.documentElement.clientWidth;document.documentElement.style.fontSize = deviceWidth / 10 + "px";window.onresize = function () {var deviceWidth = document.documentElement.clientWidth;document.documentElement.style.fontSize = deviceWidth / 10 + "px"}'
module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    script:[
      { innerHTML: remjs, type: 'text/javascript' }
    ],
    title: 'my-nuxt-app',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, height=device-height, user-scalable=no, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0' },
      { hid: 'description', name: 'description', content: '{{escape description }}' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    __dangerouslyDisableSanitizers: ['script']
  },
  /*
  ** Global CSS
  */
  css: ['~/assets/css/main.scss'],
  /*
  ** Plugins
  */
  plugins: [
  { src: '~plugins/mint-ui', ssr: true },
  // { src: '~plugins/statistics', ssr: false },
  // { src: '~plugins/localstorage', ssr: false },
  { src: '~plugins/cookie', ssr: false }
],
  /*
  ** Build configuration
  */
  build: {
    vendor: ['axios', 'mint-ui', 'vue-cookie'],
    babel: {
      'plugins': [['component', [
        {
          'libraryName': 'mint-ui',
          'style': true
        },
        'transform-async-to-generator',
        'transform-runtime'
      ]]],
      comments: true
    },
    /*
    ** Run ESLint on save
    */
    extend (config, ctx) {
      const inlineSizeThreshold = 10000
      config.module.rules.filter(v => v.test.toString() === String(/\.(png|jpe?g|gif|svg)$/)).map(v => { v.options.limit = inlineSizeThreshold })
      config.module.rules.filter(v => v.test.toString() === String(/\.(woff2?|eot|ttf|otf)(\?.*)?$/)).map(v => { v.options.limit = inlineSizeThreshold })
      if (ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
