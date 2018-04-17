import React from 'react'
import { render } from 'react-dom'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'

// Material UI
import Reboot from 'material-ui/Reboot'

// FontAwesomeIcons
// - add it here, to enable usage in all component
// - see: https://github.com/FortAwesome/react-fontawesome#build-a-library-to-reference-icons-throughout-your-app-more-conveniently
import fontawesome from '@fortawesome/fontawesome'
import brands from '@fortawesome/fontawesome-free-brands'

// Store
import { Provider } from 'react-redux'
import { applyMiddleware, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunkMiddleware from 'redux-thunk'
import reducers from './reducers'

// Components
import AppPage from './pages/page-app'
import ConfigPage from './pages/page-config'

// Redux Store
const store = createStore(reducers, composeWithDevTools(applyMiddleware(thunkMiddleware)))

// enable add all brand icons in the entire app
fontawesome.library.add(brands)

export const TrelloMultiboard = () => (
  <Provider store={store}>
    <div>
      <Reboot />
      <Router>
        <Switch>
          <Route exact path="/config" component={ConfigPage} />
          <Route path="/" component={AppPage} />
        </Switch>
      </Router>
    </div>
  </Provider>
)
TrelloMultiboard.displayName = 'TrelloMultiboard'

const ROOT_NODE = document.querySelector('#app')
render(<TrelloMultiboard />, ROOT_NODE)
