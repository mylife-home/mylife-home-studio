'use strict';

import React from 'react';
import * as mui from 'material-ui';
import muiThemeable from 'material-ui/styles/muiThemeable';
import * as dnd from 'react-dnd';
import Measure from 'react-measure';
import icons from '../icons';
import { stopPropagationWrapper, snapToGrid } from '../../utils/index';

import Facade from '../../services/facade';
import { dragTypes } from '../../constants/index';
import AppDispatcher from '../../compat/dispatcher';
import { projectStateSelect, projectMoveComponent } from '../../actions/index';
import storeHandler from '../../compat/store';

import CanvasComponentAttribute from './canvas-component-attribute';
import CanvasComponentAction from './canvas-component-action';
import commonStyles from './canvas-component-styles';
import { getProjectState } from '../../selectors/projects';
import { getPlugin } from '../../selectors/vpanel-projects';

function getStyles(props, state) {
  const { isSelected } = state;
  const { muiTheme } = props;

  return Object.assign({
    titleContainer: {
      cursor     : 'move',
      background : (isSelected ? muiTheme.palette.primary1Color : muiTheme.palette.primary3Color),
      color      : (isSelected ? muiTheme.palette.alternateTextColor : muiTheme.palette.textColor),
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
      isSelected: false
    };

    this.boundHandleStoreChange = this.handleStoreChange.bind(this);
  }

  componentDidMount() {
    this.unsubscribe = storeHandler.getStore().subscribe(this.boundHandleStoreChange);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  handleStoreChange() {
    const { project, component } = this.props;
    const projectState = getProjectState(storeHandler.getStore().getState(), { project: project && project.uid });
    this.setState({
      isSelected: projectState && projectState.selection && projectState.selection.type === 'component' && projectState.selection.uid === component.uid
    });
  }

  handleMeasureChange(dim) {
    const { component } = this.props;

    if(!dim) {
      const node = this.refs.component;
      // may be not yet rendered
      if(!node) { return; }
      dim = node.getBoundingClientRect();
    }

    this.context.canvasManager.componentMeasureChanged(this, component, dim);
  }

  measureMember(name) {
    const node = this.refs[name];
    // may be not yet rendered
    if(!node) { return; }
    return node.getBoundingClientRect();
  }

  select() {
    const { project, component } = this.props;
    AppDispatcher.dispatch(projectStateSelect(project, { type: 'component', uid: component.uid }));
  }

  renderIcon(styles, plugin) {
    const iconColor = styles.titleContainer.color;

    switch(plugin.usage) {
      case Facade.metadata.pluginUsage.driver:
        return (
          <icons.PluginDriver color={iconColor} style={styles.titleIcon} />
        );

      case Facade.metadata.pluginUsage.vpanel:
        return (
          <icons.PluginVPanel color={iconColor} style={styles.titleIcon} />
        );

      case Facade.metadata.pluginUsage.ui:
        return (
          <icons.PluginUi color={iconColor} style={styles.titleIcon} />
        );

      default:
        return null;
    }
  }

  render() {
    const { project, component, connectDragPreview, connectDragSource, isDragging } = this.props;
    const location = component.designer.location;
    const styles = getStyles(this.props, this.state);
    const plugin = getPlugin(storeHandler.getStore().getState(), { project: project.uid, plugin: component.plugin });
    const entityHost = plugin.entityId.split('_')[1];

    return (
      <div ref={'component'} style={{
        zIndex : 2,
        position : 'absolute',
        left    : location.x,
        top     : location.y,
        opacity : isDragging ? 0.5 : 1
      }} onClick={stopPropagationWrapper(this.select.bind(this))}>
        <Measure onMeasure={this.handleMeasureChange.bind(this)}>
          <div>
            {connectDragPreview(
              <div>
                <mui.Paper>
                  {/* title */}
                  {connectDragSource(
                    <div style={styles.titleContainer}>
                      <div style={styles.titleIconContainer}>{this.renderIcon(styles, plugin)}</div>
                      <div style={styles.titleText}>{component.id}</div>
                    </div>
                  )}
                  {/* details */}
                  <div style={styles.details}>
                    <div style={styles.detailsContainer}>
                      <div style={styles.detailsIconContainer}><icons.Plugin style={styles.detailsIcon} /></div>
                      <div style={styles.detailsText}>{entityHost}</div>
                    </div>
                    <div style={styles.detailsContainer}>
                      <div style={styles.detailsIconContainer}><icons.Plugin style={styles.detailsIcon} /></div>
                      <div style={styles.detailsText}>{`${plugin.library}:${component.plugin.type}`}</div>
                    </div>
                    {Object.keys(component.config).map(name => (
                      <div key={name} style={styles.detailsContainer}>
                        <div style={styles.detailsIconContainer}><icons.NetConfig style={styles.detailsIcon} /></div>
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
  canvasManager: React.PropTypes.object.isRequired
};

const componentSource = {
  beginDrag(props, monitor, uiComponent) {
    uiComponent.select();
    const component = props.component;
    return {
      id: component.id
    };
  },

  endDrag(props, monitor, uiComponent) {
    if(!monitor.didDrop()) { return; }

    const { component, project } = props;

    const { delta } = monitor.getDropResult();
    const location = {
      x: component.designer.location.x + Math.round(delta.x),
      y: component.designer.location.y + Math.round(delta.y)
    };
    snapToGrid(location, true);

    AppDispatcher.dispatch(projectMoveComponent(project.uid, component.uid, location));

    uiComponent.handleMeasureChange();
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  };
}

export default muiThemeable()(dnd.DragSource(dragTypes.VPANEL_COMPONENT, componentSource, collect)(CanvasComponent));