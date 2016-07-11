'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import * as mui from 'material-ui';
import * as bs from 'react-bootstrap';
import Measure from 'react-measure';
import base from '../base/index';

import Facade from '../../services/facade';
import AppConstants from '../../constants/app-constants';
import ProjectStateStore from '../../stores/project-state-store';
import ProjectActionCreators from '../../actions/project-action-creators';

import measureHelper from './measure-helper';

class CanvasBinding extends React.Component {

  constructor(props, context) {
    super(props);

    const projectState = ProjectStateStore.getProjectState(this.props.project);

    this.state = {
      isSelected:      false,
      measuresVersion: measureHelper.version(projectState),
      muiTheme:        context.muiTheme || muiStyles.getMuiTheme()
    };
  }

  componentDidMount() {
    ProjectStateStore.addChangeListener(this.handleStoreChange.bind(this));
  }

  componentWillUnmount() {
    ProjectStateStore.removeChangeListener(this.handleStoreChange.bind(this));
  }

  handleStoreChange() {
    const { project, binding } = this.props;
    const projectState = ProjectStateStore.getProjectState(project);
    this.setState({
      isSelected:      projectState.selection &&
                       projectState.selection.type === 'binding' &&
                       projectState.selection.remoteId === binding.remote.id &&
                       projectState.selection.localId === binding.local.id &&
                       projectState.selection.remoteAttribute === binding.remote_attribute &&
                       projectState.selection.localAction === binding.local_action,
      measuresVersion: measureHelper.version(projectState)
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if(nextState.isSelected !== this.state.isSelected) { return true; }
    if(nextState.measuresVersion !== this.state.measuresVersion) { return true; }
    return false;
  }

  select() {
    const { project, binding } = this.props;
    const projectState = ProjectStateStore.getProjectState(project);
    projectState.selection = {
      type: 'binding',
      remoteId: binding.remote.id,
      localId: binding.local.id,
      remoteAttribute: binding.remote_attribute,
      localAction: binding.local_action
    };
    ProjectActionCreators.stateRefresh(project);
  }

  render() {
    return null;
  }
}

/*
          <table>
            <tbody>
              <tr><td>bindings</td><td>&nbsp;</td><td>
                <ul>
                {component.bindings.map((binding) => (
                  <li key={binding.local_action + ':' + binding.remote_id + ':' + binding.remote_attribute}>
                    {binding.remote_id + ':' + binding.remote_attribute + ' -> ' + binding.local_action}
                  </li>
                ))}
                </ul>
              </td></tr>
            </tbody>
          </table>
*/

CanvasBinding.propTypes = {
  project: React.PropTypes.object.isRequired,
  binding: React.PropTypes.object.isRequired
};

CanvasBinding.contextTypes = {
  muiTheme: React.PropTypes.object
};

CanvasBinding.childContextTypes = {
  muiTheme: React.PropTypes.object
};

export default CanvasBinding;