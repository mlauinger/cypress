declare namespace CypressCracoDevServer {
  interface CypressCracoDevServerConfig {
    /**
     * The object exported of your craco.config.js file
     */
    cracoConfig: any

    /**
     * Path to an index.html file that will serve as the template in
     * which your components will be rendered.
     */
    indexHtml?: string
  }

  /**
   * Sets up a dev server for using Cypress compoennt testing with CRACO (https://github.com/gsoft-inc/craco)
   * @param cypressDevServerConfig comes from the `devServer()` function first argument
   * @param devServerConfig additional config object (create an empty object to see how to use it)
   * @returns the resolved dev server object that cypress can use to start testing
   */
  function devServer(cypressDevServerConfig: Cypress.DevServerConfig, devServerConfig: CypressCracoDevServerConfig): Cypress.ResolvedDevServerConfig
}

/**
 * Setup a dev server for using Cypress compoennt testing with CRACO (https://github.com/gsoft-inc/craco)
 * @param on comes from the argument of the `pluginsFile` function
 * @param config comes from the argument of the `pluginsFile` function
 * @param cracoConfig the object exported of your craco.config.js file
 */
declare function CypressCracoDevServer(on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions, cracoConfig: any): void

export = CypressCracoDevServer;