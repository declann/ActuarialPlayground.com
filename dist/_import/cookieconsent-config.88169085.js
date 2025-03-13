/**
 * All config. options available here:
 * https://cookieconsent.orestbida.com/reference/configuration-reference.html
 */

import "https://cdn.jsdelivr.net/gh/orestbida/cookieconsent@3.1.0/dist/cookieconsent.umd.js";


CookieConsent.run({

  categories: {
      necessary: {
          enabled: true,  // this category is enabled by default
          readOnly: true  // this category cannot be disabled
      },
      analytics: {}
  },

  language: {
      default: 'en',
      translations: {
          en: {
              consentModal: {
                  title: 'We use CDNs, 🍪🍪 & opt-in analytics',
                  description: 'Hi, this website uses CDNs and other third parties to serve resources. It uses essential cookies. It uses analytics scripts to understand site interactions - to improve the Playground - but this is optional. If you accept our analytics provider Plausible will receive your IP address and selected site interactions - which will be anonymised for analysis.',
                  acceptAllBtn: 'Accept all',
                  acceptNecessaryBtn: 'Reject all',
                  showPreferencesBtn: 'Manage Individual preferences'
              },
              preferencesModal: {
                  title: 'Manage cookie preferences',
                  acceptAllBtn: 'Accept all',
                  acceptNecessaryBtn: 'Reject all',
                  savePreferencesBtn: 'Accept current selection',
                  closeIconLabel: 'Close modal',
                  sections: [
                      {
                          title: '🍪🍪 and analytics',
                          description: ''
                      },
                      {
                          title: 'Strictly Necessary cookies',
                          description: 'These cookies are essential for the proper functioning of the website and cannot be disabled.',

                          //this field will generate a toggle linked to the 'necessary' category
                          linkedCategory: 'necessary'
                      },
                      {
                          title: 'Performance and Analytics',
                          description: 'Optionally collects information about how you use our website. Data is anonymized by analytics provider Plausible.',
                          linkedCategory: 'analytics'
                      },
                      {
                          title: 'More information',
                          description: 'For any queries in relation to policy on cookies, analytics, and your choices, please <a href="https://calcwithdec.dev/about">contact Declan</a>.'
                      }
                  ]
              }
          }
      }
  }
});