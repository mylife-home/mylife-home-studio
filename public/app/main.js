'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import { Provider } from 'react-redux';

import injectTapEventPlugin from 'react-tap-event-plugin';
import debugLib from 'debug';

import Application from './components/application';
import reducer from './reducers/index';
import Facade from './services/facade';

import 'bootstrap/dist/css/bootstrap.css';

//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

window.debugLib = debugLib;

const store = createStore(
  reducer,
  applyMiddleware(thunk, createLogger())
);

Facade.repository.init((action) => store.dispatch(action));

ReactDOM.render(
  <Provider store={store}>
    <Application/>
  </Provider>,
  document.getElementById('content')
);