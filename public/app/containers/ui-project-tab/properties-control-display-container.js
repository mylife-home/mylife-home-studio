'use strict';

import { connect } from 'react-redux';

import PropertiesControlDisplay from '../../components/ui-project-tab/properties-control-display';

import {
  projectControlChangeImage, projectControlChangeDisplayComponent,
  projectControlChangeDisplayMappingImage, projectControlChangeDisplayMappingValue, projectControlChangeDisplayMappingMin, projectControlChangeDisplayMappingMax, projectControlAddDisplayMapping, projectControlDeleteDisplayMapping
} from '../../actions/index';

import { getComponent, getImages } from '../../selectors/ui-projects';

const mapStateToProps = (state, { project, control }) => ({
  project,
  control,
  images    : getImages(state, { project }),
  component : getComponent(state, { project, component: control.display.component })
});

const mapDispatchToProps = (dispatch, { project, window, control }) => ({
  onImageChange        : (img) => dispatch(projectControlChangeImage(project, window, control.uid, img)),
  onComponentChange    : (component, attribute) => dispatch(projectControlChangeDisplayComponent(project, window, control.uid, component, attribute)),
  onMappingNew         : (newItem) => dispatch(projectControlAddDisplayMapping(project, window, control.uid, newItem)),
  onMappingDelete      : (item) => dispatch(projectControlDeleteDisplayMapping(project, window, control.uid, item.uid)),
  onMappingImageChange : (item, img) => dispatch(projectControlChangeDisplayMappingImage(project, window, control.uid, item.uid, img)),
  onMappingValueChange : (item, value) => dispatch(projectControlChangeDisplayMappingValue(project, window, control.uid, item.uid, value)),
  onMappingMinChange   : (item, value) => dispatch(projectControlChangeDisplayMappingMin(project, window, control.uid, item.uid, value)),
  onMappingMaxChange   : (item, value) => dispatch(projectControlChangeDisplayMappingMax(project, window, control.uid, item.uid, value))
});

const PropertiesControlDisplayContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PropertiesControlDisplay);

export default PropertiesControlDisplayContainer;
