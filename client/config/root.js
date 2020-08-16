/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-duplicates */
import React from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import { Switch, Route, Redirect, StaticRouter } from 'react-router-dom'

import store, { history } from '../redux'

import Home from '../components/home'
import Username from '../components/username'
import DummyView from '../components/dummy-view'
import NotFound from '../components/404'

import Startup from './startup'
import Repositoryname from '../components/respositoryname'

const OnlyAnonymousRoute = ({ component: Component, ...rest }) => {
  const func = (props) =>
    !!rest.user && !!rest.user.name && !!rest.token ? (
      <Redirect to={{ pathname: '/' }} />
    ) : (
      <Component {...props} />
    )
  return <Route {...rest} render={func} />
}

const PrivateRoute = ({ component: Component, ...rest }) => {
  const func = (props) =>
    !!rest.user && !!rest.user.name && !!rest.token ? (
      <Component {...props} />
    ) : (
      <Redirect
        to={{
          pathname: '/login'
        }}
      />
    )
  return <Route {...rest} render={func} />
}

const types = {
  component: PropTypes.func.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string
  }),
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string
  }),
  token: PropTypes.string
}

const defaults = {
  location: {
    pathname: ''
  },
  user: null,
  token: ''
}

OnlyAnonymousRoute.propTypes = types
PrivateRoute.propTypes = types

PrivateRoute.defaultProps = defaults
OnlyAnonymousRoute.defaultProps = defaults

const ScillcrucialRouter = (props) =>
  typeof window !== 'undefined' ? <ConnectedRouter {...props} /> : <StaticRouter {...props} />

const Root = (props) => {
  return (
    <Provider store={store}>
      <ScillcrucialRouter history={history} location={props.location} context={props.context}>
        <Startup>
          <Switch>
            <Route exact path="/" component={() => <Home />} />
            <Route exact path="/:userName" component={() => <Username />} /> 
            <Route exact path="/:userName/:repositoryName" component={() => <Repositoryname />} />
            <PrivateRoute exact path="/hidden-route" component={() => <DummyView />} />
            <Route component={() => <NotFound />} />
          </Switch>
        </Startup>
      </ScillcrucialRouter>
    </Provider>
  )
}

export default Root


