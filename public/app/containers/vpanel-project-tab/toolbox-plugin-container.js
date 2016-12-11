'use strict';

import { connect } from 'react-redux';

import ToolboxPlugin from '../../components/vpanel-project-tab/toolbox-plugin';
import AppDispatcher from '../../compat/dispatcher';
import { projectNewComponent } from '../../actions/index';

const mapDispatchToProps = (/*dispatch*/) => ({
  onNewComponent: (project, location, plugin) => AppDispatcher.dispatch(projectNewComponent(project, location, plugin))
});

const ToolboxPluginContainer = connect(
  null,
  mapDispatchToProps
)(ToolboxPlugin);

export default ToolboxPluginContainer;