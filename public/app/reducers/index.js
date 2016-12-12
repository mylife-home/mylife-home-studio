import { combineReducers } from 'redux';

import dialogs from './dialogs';
import online from './online';
import activeTab from './active-tab';
import projects from './projects';

export default combineReducers({
  dialogs,
  online,
  activeTab,
  projects
});
