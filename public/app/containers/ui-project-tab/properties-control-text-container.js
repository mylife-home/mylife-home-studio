
'use strict';

import { connect } from 'react-redux';

import PropertiesControlText from '../../components/ui-project-tab/properties-control-text';

import {
  projectControlChangeTextFormat, projectControlAddTextContext, projectControlDeleteTextContext, projectControlChangeTextContextId, projectControlChangeTextContextComponent
} from '../../actions/index';

import { getComponents } from '../../selectors/ui-projects';

const mapStateToProps = (state, { project, control }) => ({
  project,
  control,
  components : getComponents(state, { project })
});

const mapDispatchToProps = (dispatch, { project, window, control }) => ({
  onFormatChange        : (value) => dispatch(projectControlChangeTextFormat(project, window, control.uid, value)),
  onTextNew             : (newItem) => dispatch(projectControlAddTextContext(project, window, control.uid, newItem)),
  onTextDelete          : (item) => dispatch(projectControlDeleteTextContext(project, window, control.uid, item.uid)),
  onTextIdChange        : (item, newId) => dispatch(projectControlChangeTextContextId(project, window, control.uid, item.uid, newId)),
  onTextComponentChange : (item, component, attribute) => dispatch(projectControlChangeTextContextComponent(project, window, control.uid, item.uid, component, attribute))
});

const PropertiesControlTextContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PropertiesControlText);

export default PropertiesControlTextContainer;

