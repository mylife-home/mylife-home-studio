'use strict';

import React from 'react';
import * as mui from 'material-ui';
import * as bs from 'react-bootstrap';
import icons from '../icons';
import MainTitle from '../main-title';

import Properties from './properties';
import ToolboxContainer from '../../containers/vpanel-project-tab/toolbox-container';
import Canvas from './canvas';
import DialogConfirm from '../dialogs/dialog-confirm';

import AppDispatcher from '../../compat/dispatcher';
import { projectClose, projectVPanelConfirmImportToolbox, projectVPanelCancelImportToolbox } from '../../actions/index';
import storeHandler from '../../compat/store';

import { getProjectState } from '../../selectors/projects';

import tabStyles from '../base/tab-styles';

class VPanelProjectTab extends React.Component {

  constructor(props) {
    super(props);
    this.state = { };

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
    const pendingImportToolbox = projectState && projectState.pendingImportToolbox;
    this.setState({ pendingImportToolbox });
  }

  render() {
    const { project } = this.props;

    return (
      <div style={Object.assign({}, tabStyles.fullHeight)}>
        <bs.Grid fluid={true} style={Object.assign({}, tabStyles.fullHeight)}>
          <bs.Row style={tabStyles.fullHeight}>
            <bs.Col sm={2} style={Object.assign({}, tabStyles.noPadding, tabStyles.fullHeight)}>
              <mui.Paper style={Object.assign({}, tabStyles.scrollable, tabStyles.fullHeight)}>
                <ToolboxContainer project={project.uid} />
              </mui.Paper>
            </bs.Col>
            <bs.Col sm={8} style={Object.assign({}, tabStyles.noPadding, tabStyles.scrollable, tabStyles.fullHeight)}>
              <div style={Object.assign({marginTop: '-10px' /* WTF ?! */}, tabStyles.noPadding, tabStyles.fullHeight)}>
                <MainTitle
                  center={project.name}
                  left={<icons.tabs.VPanel />}
                  right={
                    <mui.IconButton onClick={() => AppDispatcher.dispatch(projectClose(project.uid))}>
                      <icons.actions.Close />
                    </mui.IconButton>
                  }/>
                <Canvas project={project} />
              </div>
            </bs.Col>
            <bs.Col sm={2} style={Object.assign({}, tabStyles.noPadding, tabStyles.fullHeight)}>
              <mui.Paper style={Object.assign({}, tabStyles.scrollable, tabStyles.fullHeight)}>
                <Properties project={project} />
              </mui.Paper>
            </bs.Col>
          </bs.Row>
        </bs.Grid>

        <DialogConfirm title="Confirm"
                       open={!!this.state.pendingImportToolbox}
                       lines={(this.state.pendingImportToolbox && this.state.pendingImportToolbox.messages) || []}
                       yes={() => AppDispatcher.dispatch(projectVPanelConfirmImportToolbox(project.uid))}
                       no={() => AppDispatcher.dispatch(projectVPanelCancelImportToolbox(project.uid))}/>

      </div>
    );
  }
}

VPanelProjectTab.propTypes = {
  project: React.PropTypes.object.isRequired,
};

export default VPanelProjectTab;
