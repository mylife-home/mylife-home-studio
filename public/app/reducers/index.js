import { combineReducers } from 'redux';

import dialogs from './dialogs';
import online from './online';

export default combineReducers({
  dialogs,
  online
});
