'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import immutableStateInvariant from 'redux-immutable-state-invariant'; // FIXME: remove immutableStateInvariant in production
import { Provider } from 'react-redux';

import injectTapEventPlugin from 'react-tap-event-plugin';
import debugLib from 'debug';

import Application from './components/application';
import reducer from './reducers/index';

import Facade from './services/facade'; // import to force init
import storeHandler from './compat/store';

void Facade;

//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

window.debugLib = debugLib;

const store = createStore(
  reducer,
  applyMiddleware(immutableStateInvariant(), thunk, createLogger()) // FIXME: remove immutableStateInvariant in production
);

storeHandler.setStore(store);

ReactDOM.render(
  <Provider store={store}>
    <Application/>
  </Provider>,
  document.getElementById('content')
);