'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Measure from 'react-measure';
import * as mui from 'material-ui';
import * as bs from 'react-bootstrap';
import * as dnd from 'react-dnd';
import base from '../base/index';

import Facade from '../../services/facade';
import AppConstants from '../../constants/app-constants';
import ProjectStateStore from '../../stores/project-state-store';
import ProjectActionCreators from '../../actions/project-action-creators';
import commonStyles from './canvas-component-styles';

const styles = Object.assign({
  highlight: {
    backgroundColor: 'lightgray'
  }
}, commonStyles);

class CanvasComponentAction extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    ProjectStateStore.addChangeListener(this.handleStoreChange.bind(this));
  }

  componentWillUnmount() {
    ProjectStateStore.removeChangeListener(this.handleStoreChange.bind(this));
  }

  handleStoreChange() {
  }

  render() {
    const { project, component, action, connectDropTarget, isHighlighted } = this.props;

    const containerStyle = isHighlighted ?
      Object.assign({}, styles.detailsContainer, styles.highlight) :
      Object.assign({}, styles.detailsContainer);

    return connectDropTarget(
      <div>
    {/* TODO: create connectors! */}
        <Measure onMeasure={(dimensions) => console.log(component.id, action.name, dimensions)}>
          <div style={containerStyle}>
            <div style={styles.detailsIconContainer}><base.icons.NetAction style={styles.detailsIcon} /></div>
            <div style={styles.detailsText}>{`${action.name} (${action.types})`}</div>
          </div>
        </Measure>
      </div>
    );
  }
}

CanvasComponentAction.propTypes = {
  project: React.PropTypes.object.isRequired,
  component: React.PropTypes.object.isRequired,
  action: React.PropTypes.object.isRequired,
  connectDropTarget: React.PropTypes.func.isRequired,
  isHighlighted: React.PropTypes.bool.isRequired
};

const actionTarget = {
  drop(props) {
    const { component, action } = props;
    return {
      componentId: component.id,
      actionName: action.name
    };
  },

  canDrop(props, monitor) {
    const { project, component, action } = props;
    const { componentId, attributeName } = monitor.getItem();

    return Facade.projects.vpanelCanCreateBinding(project, componentId, attributeName, component.id, action.name);
  }
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isHighlighted: monitor.canDrop()
  }
}

export default dnd.DropTarget(AppConstants.DragTypes.VPANEL_COMPONENT_ATTRIBUTE, actionTarget, collect)(CanvasComponentAction);