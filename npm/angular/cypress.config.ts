import { defineConfig } from 'cypress'

export default defineConfig({
  'experimentalFetchPolyfill': true,
  'fixturesFolder': false,
  'includeShadowDom': true,
  'fileServerFolder': 'src',
  'projectId': 'nf7zag',
  'component': {
    setupNodeEvents (on, config) {
      return require('./cypress/plugins')(on, config)
    },
    devServer (cypressDevServerConfig) {
      const { startDevServer } = require('@cypress/webpack-dev-server')
      const webpackConfig = require('./cypress/plugins/webpack.config')

      return startDevServer({
        options: cypressDevServerConfig,
        webpackConfig,
      })
    },
  },
})
