'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import * as mui from 'material-ui';
import * as bs from 'react-bootstrap';
import * as dnd from 'react-dnd';
import Measure from 'react-measure';
import base from '../base/index';

import Facade from '../../services/facade';
import AppConstants from '../../constants/app-constants';
import ProjectStateStore from '../../stores/project-state-store';
import ProjectActionCreators from '../../actions/project-action-creators';

import CanvasComponentAttribute from './canvas-component-attribute';
import CanvasComponentAction from './canvas-component-action';
import commonStyles from './canvas-component-styles';
import linkHelper from './link-helper';

function getStyles(props, state) {
  const { muiTheme, isSelected } = state;
  const { baseTheme } = muiTheme;

  return Object.assign({
    titleContainer: {
      cursor     : 'move',
      background : (isSelected ? baseTheme.palette.primary1Color : baseTheme.palette.primary3Color),
      color      : (isSelected ? baseTheme.palette.alternateTextColor : baseTheme.palette.textColor),
    },
    titleText: {
      whiteSpace    : 'nowrap',
      overflow      : 'hidden',
      textOverflow  : 'ellipsis',
      margin        : 0,
      paddingTop    : 2,
      paddingLeft   : 8,
      paddingRight  : 8,
      letterSpacing : 0,
      fontSize      : 16,
      fontWeight    : 'normal',
      height        : '25px',
      lineHeight    : '25px'
    },
    titleIconContainer: {
      float  : 'left',
      width  : '25px',
      height : '25px'
    },
    titleIcon: {
      textAlign     : 'center',
      height        : '25px',
      lineHeight    : '25px',
      verticalAlign : 'middle'
    },
    details: {
      paddingTop    : '2px',
      paddingBottom : '2px'
    }
  }, commonStyles);
}

class CanvasComponent extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      isSelected: false,
      muiTheme: context.muiTheme || muiStyles.getMuiTheme()
    };
  }

  componentDidMount() {
    ProjectStateStore.addChangeListener(this.handleStoreChange.bind(this));
  }

  componentWillUnmount() {
    ProjectStateStore.removeChangeListener(this.handleStoreChange.bind(this));
  }

  handleStoreChange() {
    const { project, component } = this.props;
    const projectState = ProjectStateStore.getProjectState(project);
    this.setState({
      isSelected: projectState.selection && projectState.selection.type === 'component' && projectState.selection.id === component.id
    });
  }

  handleMeasureChange(dim) {
    const { project, component } = this.props;
    const projectState = ProjectStateStore.getProjectState(project);

    linkHelper.componentOnMeasureChanged(this, component, project, projectState, dim);
  }

  measureMember(name) {
    const node = this.refs[name];
    // may be not yet rendered
    if(!node) { return; }
    return node.getBoundingClientRect();
  }

  shouldComponentUpdate(nextProps, nextState) {
    if(nextState.isSelected !== this.state.isSelected) { return true; }
    if(nextProps.isDragging !== this.props.isDragging) { return true; }
    return false;
  }

  select() {
    const { project, component } = this.props;
    const projectState = ProjectStateStore.getProjectState(project);
    projectState.selection = { type: 'component', id: component.id };
    ProjectActionCreators.stateRefresh(project);
  }

  renderIcon(styles) {
    const { component } = this.props;
    const iconColor = styles.titleContainer.color;

    switch(component.plugin.usage) {
    case Facade.metadata.pluginUsage.driver:
      return (
        <base.icons.PluginDriver color={iconColor} style={styles.titleIcon} />
      );

    case Facade.metadata.pluginUsage.vpanel:
      return (
        <base.icons.PluginVPanel color={iconColor} style={styles.titleIcon} />
      );

    case Facade.metadata.pluginUsage.ui:
      return (
        <base.icons.PluginUi color={iconColor} style={styles.titleIcon} />
      );

    default:
      return null;
    }
  }

  render() {
    const { project, component, connectDragPreview, connectDragSource, isDragging } = this.props;
    const { isSelected } = this.state;
    const location = component.designer.location;
    const styles = getStyles(this.props, this.state);
    const entityHost = component.plugin.entityId.split('_')[1];
    const plugin = component.plugin;

    if(isDragging) {
      return null;
    }

    return (
      <div style={{
        zIndex : 2,
        position : 'absolute',
        left    : location.x,
        top     : location.y
      }} onClick={base.utils.stopPropagationWrapper(this.select.bind(this))}>
        <Measure onMeasure={this.handleMeasureChange.bind(this)}>
          <div>
            {connectDragPreview(
              <div>
                <mui.Paper>
                  {/* title */}
                  {connectDragSource(
                    <div style={styles.titleContainer}>
                      <div style={styles.titleIconContainer}>{this.renderIcon(styles)}</div>
                      <div style={styles.titleText}>{component.id}</div>
                    </div>
                  )}
                  {/* details */}
                  <div style={styles.details}>
                    <div style={styles.detailsContainer}>
                      <div style={styles.detailsIconContainer}><base.icons.Plugin style={styles.detailsIcon} /></div>
                      <div style={styles.detailsText}>{`${entityHost} - ${plugin.library}:${component.plugin.type}`}</div>
                    </div>
                    {Object.keys(component.config).map(name => (
                      <div key={name} style={styles.detailsContainer}>
                        <div style={styles.detailsIconContainer}><base.icons.NetConfig style={styles.detailsIcon} /></div>
                        <div style={styles.detailsText}>{`${name} : ${component.config[name]}`}</div>
                      </div>
                    ))}
                    {plugin.clazz.attributes.map(attribute => (
                      <div ref={attribute.name} key={attribute.name}>
                        <CanvasComponentAttribute project={project}
                                                  component={component}
                                                  attribute={attribute} />
                      </div>
                    ))}
                    {plugin.clazz.actions.map(action => (
                      <div ref={action.name} key={action.name}>
                        <CanvasComponentAction project={project}
                                               component={component}
                                               action={action} />
                      </div>
                    ))}
                  </div>
                </mui.Paper>
              </div>
            )}
          </div>
        </Measure>
      </div>
    );
  }
}

CanvasComponent.propTypes = {
  project: React.PropTypes.object.isRequired,
  component: React.PropTypes.object.isRequired,
  connectDragSource: React.PropTypes.func.isRequired,
  connectDragPreview: React.PropTypes.func.isRequired,
  isDragging: React.PropTypes.bool.isRequired
};

CanvasComponent.contextTypes = {
  muiTheme: React.PropTypes.object
};

CanvasComponent.childContextTypes = {
  muiTheme: React.PropTypes.object
};

const componentSource = {
  beginDrag(props, monitor, uiComponent) {
    uiComponent.select();
    const component = props.component;
    return {
      id: component.id
    };
  },

  endDrag(props, monitor) {
    if(!monitor.didDrop()) { return; }

    const { component, project } = props;

    const location = component.designer.location;
    const { delta } = monitor.getDropResult();
    location.x += Math.round(delta.x);
    location.y += Math.round(delta.y);
    base.utils.snapToGrid(location, true);

    // keep ui fluid
    window.setTimeout(() => Facade.projects.dirtify(project), 0);
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  }
}

export default dnd.DragSource(AppConstants.DragTypes.VPANEL_COMPONENT, componentSource, collect)(CanvasComponent);