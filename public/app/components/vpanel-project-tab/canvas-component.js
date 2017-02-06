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

import CanvasComponentAttribute from './canvas-component-attribute';
import CanvasComponentAction from './canvas-component-action';
import commonStyles from './canvas-component-styles';

function getStyles(props) {
  const { isSelected, muiTheme } = props;

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
  }

  handleMeasureChange(dim) {
    const { component, plugin } = this.props;

    if(!dim) {
      const node = this.refs.component;
      // may be not yet rendered
      if(!node) { return; }
      dim = node.getBoundingClientRect();
    }

    this.context.canvasManager.componentMeasureChanged(this, component, plugin, dim);
  }

  measureMember(name) {
    const node = this.refs[name];
    // may be not yet rendered
    if(!node) { return; }
    return node.getBoundingClientRect();
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
    const { project, component, plugin, onSelected, onCreateBinding, connectDragPreview, connectDragSource, isDragging } = this.props;
    const location   = component.designer.location;
    const styles     = getStyles(this.props);
    const entityHost = plugin.entityId.split('_')[1];

    return (
      <div ref={'component'} style={{
        zIndex : 2,
        position : 'absolute',
        left    : location.x,
        top     : location.y,
        opacity : isDragging ? 0.5 : 1
      }} onClick={stopPropagationWrapper(onSelected)}>
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
                      <div style={styles.detailsText}>{`${plugin.library}:${plugin.type}`}</div>
                    </div>
                    {Object.keys(component.config).map(name => (
                      <div key={name} style={styles.detailsContainer}>
                        <div style={styles.detailsIconContainer}><icons.NetConfig style={styles.detailsIcon} /></div>
                        <div style={styles.detailsText}>{`${name} : ${component.config[name]}`}</div>
                      </div>
                    ))}
                    {plugin.clazz.attributes.map(attribute => (
                      <div ref={attribute.name} key={attribute.name}>
                        <CanvasComponentAttribute component={component}
                                                  attribute={attribute}
                                                  onCreateBinding={onCreateBinding} />
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
  project            : React.PropTypes.object.isRequired,
  component          : React.PropTypes.object.isRequired,
  plugin             : React.PropTypes.object.isRequired,
  isSelected         : React.PropTypes.bool.isRequired,
  onSelected         : React.PropTypes.func.isRequired,
  onComponentMove    : React.PropTypes.func.isRequired,
  onCreateBinding    : React.PropTypes.func.isRequired,
  connectDragSource  : React.PropTypes.func.isRequired,
  connectDragPreview : React.PropTypes.func.isRequired,
  isDragging         : React.PropTypes.bool.isRequired
};

CanvasComponent.contextTypes = {
  canvasManager: React.PropTypes.object.isRequired
};

const componentSource = {
  beginDrag(props/*, monitor, uiComponent*/) {
    const { component, onSelected } = props;
    onSelected();
    return {
      id: component.id
    };
  },

  endDrag(props, monitor, uiComponent) {
    if(!monitor.didDrop()) { return; }

    const { component, onComponentMove } = props;

    const { delta } = monitor.getDropResult();
    const location = {
      x: component.designer.location.x + Math.round(delta.x),
      y: component.designer.location.y + Math.round(delta.y)
    };
    snapToGrid(location, true);

    onComponentMove(location);

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