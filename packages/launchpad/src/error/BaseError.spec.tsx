import { defaultMessages } from '@cy/i18n'
import BaseError from './BaseError.vue'
import Button from '@cy/components/Button.vue'
import { BaseErrorFragmentDoc } from '../generated/graphql-test'

// Selectors
const headerSelector = '[data-testid=error-header]'
const messageSelector = '[data-testid=error-message]'
const retryButtonSelector = '[data-testid=error-retry-button]'
const docsButtonSelector = '[data-testid=error-read-the-docs-button]'
const customFooterSelector = '[data-testid=custom-error-footer]'
const openConfigFileSelector = '[data-testid=open-config-file]'

// Constants
const messages = defaultMessages.launchpadErrors.generic
const customHeaderMessage = 'Well, this was unexpected!'
const customMessage = `Don't worry, just click the "It's fixed now" button to try again.`
const customFooterText = `Yikes, try again!`
const customStack = `some err message
    at fn (foo.js:1:1)
    at Context.<anonymous> (BaseError.spec.tsx:57)
    at Context.runnable.fn (cypress:///../driver/src/cypress/cy.ts:1064)
    at callFn (cypress:///../driver/node_modules/mocha/lib/runnable.js:395)
    at Test.Runnable.run (cypress:///../driver/node_modules/mocha/lib/runnable.js:382)
    at eval (cypress:///../driver/src/cypress/runner.ts:1463)
    at PassThroughHandlerContext.finallyHandler (cypress:////Users/bart/Documents/github/cypress/node_modules/bluebird/js/release/finally.js:56)
    at PassThroughHandlerContext.tryCatcher (cypress:////Users/bart/Documents/github/cypress/node_modules/bluebird/js/release/util.js:16)
    at Promise._settlePromiseFromHandler (cypress:////Users/bart/Documents/github/cypress/node_modules/bluebird/js/release/promise.js:512)
    at Promise._settlePromise (cypress:////Users/bart/Documents/github/cypress/node_modules/bluebird/js/release/promise.js:569)
`

describe('<BaseError />', () => {
  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.setItem('latestGQLOperation', '{}')
    })
  })

  afterEach(() => {
    cy.percySnapshot()
  })

  it('renders the default error the correct messages', () => {
    cy.mountFragment(BaseErrorFragmentDoc, {
      onResult: (result) => {
        if (result.baseError) {
          result.baseError.title = messages.header
        }

        if (result.currentProject) {
          result.currentProject.configFilePath = 'cypress.config.ts'
        }
      },
      render: (gqlVal) => <BaseError gql={gqlVal} />,
    })
    .get(headerSelector)
    .should('contain.text', messages.header)
    .get(messageSelector)
    .should('contain.text', messages.message.replace('{0}', 'cypress.config.ts'))
    .get(retryButtonSelector)
    .should('contain.text', messages.retryButton)
    .get(docsButtonSelector)
    .should('contain.text', messages.readTheDocsButton)
    .get(openConfigFileSelector)
    .click()

    cy.get('#headlessui-dialog-title-3').contains('Select Preferred Editor')
  })

  it('renders custom error messages and headers with props', () => {
    cy.mountFragment(BaseErrorFragmentDoc, {
      onResult: (result) => {
        if (result.baseError) {
          result.baseError.title = customHeaderMessage
          result.baseError.message = customMessage
          result.baseError.stack = customStack
        }
      },
      render: (gqlVal) => <BaseError gql={gqlVal} />,
    })
    .get('body')
    .should('contain.text', customHeaderMessage)
    .and('contain.text', customMessage)

    cy.contains('button', 'Stack Trace').click()
    cy.contains(customStack.trim()).should('be.visible')
  })

  it('renders the header, message, and footer slots', () => {
    cy.mountFragment(BaseErrorFragmentDoc, {
      onResult: (result) => {
        if (result.baseError) {
          result.baseError.title = messages.header
          result.baseError.message = messages.message
        }
      },
      render: (gqlVal) => (
        <BaseError
          gql={gqlVal}
          v-slots={{
            footer: () => <Button size="lg" data-testid="custom-error-footer">{ customFooterText }</Button>,
            header: customHeaderMessage,
            message: customMessage,
          }}
        />),
    })
    .get('body')
    .should('contain.text', customHeaderMessage)
    .and('contain.text', customMessage)
    .get(customFooterSelector)
    .should('contain.text', customFooterText)
  })
})
