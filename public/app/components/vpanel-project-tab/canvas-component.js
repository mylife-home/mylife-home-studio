'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import * as mui from 'material-ui';
import * as bs from 'react-bootstrap';
import * as dnd from 'react-dnd';
import base from '../base/index';

import Facade from '../../services/facade';
import AppConstants from '../../constants/app-constants';
import ProjectStateStore from '../../stores/project-state-store';
import ProjectActionCreators from '../../actions/project-action-creators';

function getStyles(props, state) {
  const { muiTheme, isSelected } = state;
  const { baseTheme } = muiTheme;
//console.log(baseTheme);

  return {
    title: {
      cursor: 'move',
      background: (isSelected ? baseTheme.palette.primary1Color : baseTheme.palette.primary3Color)
    }
  };
}

class CanvasComponent extends React.Component {

  constructor(props, context) {
    super(props);

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
      isSelected: projectState.selection === component.id
    });
  }

  select() {
    const project = this.props.project;
    const projectState = ProjectStateStore.getProjectState(project);
    projectState.selection = this.props.component.id;
    ProjectActionCreators.stateRefresh(project);
  }

  render() {
    const { project, component, connectDragSource, connectDragPreview, isDragging } = this.props;
    const { isSelected } = this.state;
    const location = component.designer.location;
    const styles = getStyles(this.props, this.state);

    if(isDragging) {
      return null;
    }

    return connectDragPreview(
      <div style={{
        position : 'absolute',
        left    : location.x,
        top     : location.y
      }} onClick={base.utils.stopPropagationWrapper(this.select.bind(this))}>
        <mui.Paper>
          {connectDragSource(
            <div style={styles.title}>
              {component.id}
            </div>
          )}
          <table>
            <tbody>
              <tr><td>entity</td><td>&nbsp;</td><td>{component.plugin.entityId}</td></tr>
              <tr><td>plugin</td><td>&nbsp;</td><td>{component.plugin.library + ':' + component.plugin.type}</td></tr>
              <tr><td>bindings</td><td>&nbsp;</td><td>
                <ul>
                {component.bindings.map((binding) => (
                  <li key={binding.local_action + ':' + binding.remote_id + ':' + binding.remote_attribute}>
                    {binding.remote_id + ':' + binding.remote_attribute + ' -> ' + binding.local_action}
                  </li>
                ))}
                </ul>
              </td></tr>
              <tr><td>config</td><td>&nbsp;</td><td>{JSON.stringify(component.config)}</td></tr>
              <tr><td>designer</td><td>&nbsp;</td><td>{JSON.stringify(component.designer)}</td></tr>
            </tbody>
          </table>
        </mui.Paper>
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

export default dnd.DragSource(AppConstants.DragTypes.VPANEL_COMPONENT, componentSource, collect)(CanvasComponent);;