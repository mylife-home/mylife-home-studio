'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import injectTapEventPlugin from 'react-tap-event-plugin';
import debugLib from 'debug';

import Application from './components/application';
import reducer from './reducers/index';

import Facade from './services/facade'; // import to force init
import storeInit from './stores/init'; // import to force init
import storeHandler from './compat/store';

void Facade;
void storeInit;

//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

window.debugLib = debugLib;

const store = createStore(reducer);
storeHandler.setStore(store);

ReactDOM.render(
  <Provider store={store}>
    <Application/>
  </Provider>,
  document.getElementById('content')
);