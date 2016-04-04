'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import debugLib from 'debug';

import Application from './components/application';
import Facade from './services/facade'; // import to force init
import OnlineStore from './stores/online-store'; // import to force init

//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

window.debugLib = debugLib;

ReactDOM.render(
  <Application/>,
  document.getElementById('content')
);