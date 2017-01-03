'use strict';

import React from 'react';
import icons from '../icons';

import PropertiesComponentContainer from '../../containers/vpanel-project-tab/properties-component-container';
import PropertiesBindingContainer from '../../containers/vpanel-project-tab/properties-binding-container';
import PropertiesProject from './properties-project';
import PropertiesLabel from '../properties/properties-label';
import PropertiesTitle from '../properties/properties-title';
import PropertiesValue from '../properties/properties-value';
import PropertiesEditor from '../properties/properties-editor';
import storeHandler from '../../compat/store';
import AppDispatcher from '../../compat/dispatcher';
import { projectChangeName } from '../../actions/index';
import { getProjectState } from '../../selectors/projects';

class Properties extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      selection: null,
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
    const { project } = this.props;
    const projectState = getProjectState(storeHandler.getStore().getState(), { project: project && project.uid });
    this.setState({
      selection : projectState && projectState.selection
    });
  }

  render() {
    const { project } = this.props;
    const { selection } = this.state;

    switch(selection && selection.type) {
      case 'component':
        return (<PropertiesComponentContainer project={project.uid} component={selection.uid} />);

      case 'binding': {
        return (<PropertiesBindingContainer project={project.uid} binding={selection.uid} />);
      }
    }

    return (<PropertiesProject project={project} onChangeName={(value) => AppDispatcher.dispatch(projectChangeName(project.uid, value))} />);
  }
}

Properties.propTypes = {
  project: React.PropTypes.object.isRequired,
};

export default Properties;