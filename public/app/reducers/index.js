import { combineReducers } from 'redux';

import dialogs from './dialogs';
import online from './online';
import activeTab from './active-tab';

export default combineReducers({
  dialogs,
  online,
  activeTab
});
