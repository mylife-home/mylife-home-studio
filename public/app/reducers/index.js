import { combineReducers } from 'redux';

import dialogs from './dialogs';
import online from './online';
import activeTab from './activeTab';

export default combineReducers({
  dialogs,
  online,
  activeTab
});
