'use strict';

import React from 'react';
import * as mui from 'material-ui';
import * as bs from 'react-bootstrap';
import icons from '../icons';
import MainTitle from '../main-title';

import Properties from './properties';
import ExplorerContainer from '../../containers/ui-project-tab/explorer-container';
import DialogConfirmImportComponents from '../../containers/ui-project-tab/dialog-confirm-import-components';
import Toolbox from './toolbox';
import Canvas from './canvas';

import storeHandler from '../../compat/store';

import { getProjectState } from '../../selectors/projects';

import tabStyles from '../base/tab-styles';

const styles = {
  explorerHeight : {
    height: 'calc(100% - 144px)'
  }
};

class UiProjectTab extends React.Component {

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
    const activeContent = projectState && projectState.activeContent;
    const importComponentsConfirm = projectState && projectState.pendingImportComponents;
    this.setState({ activeContent, importComponentsConfirm });
  }

  render() {
    const { project, onTabClosed } = this.props;
    const { activeContent } = this.state;

    let title = project.name;
    if(activeContent) {
      switch(activeContent.type) {
        case 'component': {
          const component = project.components.get(activeContent.uid);
          title += ` - ${component.id}`;
          break;
        }

        case 'image': {
          const image = project.images.get(activeContent.uid);
          title += ` - ${image.id}`;
          break;
        }

        case 'window': {
          const window = project.windows.get(activeContent.uid);
          title += ` - ${window.id}`;
          break;
        }
      }
    }

    return (
      <div style={Object.assign({}, tabStyles.fullHeight)}>
        <bs.Grid fluid={true} style={Object.assign({}, tabStyles.fullHeight)}>
          <bs.Row style={tabStyles.fullHeight}>
            <bs.Col sm={2} style={Object.assign({}, tabStyles.noPadding, tabStyles.fullHeight)}>
              <div style={tabStyles.fullHeight}>
                <mui.Paper>
                  <Toolbox project={project} />
                </mui.Paper>
                <mui.Paper style={Object.assign({}, tabStyles.scrollable, styles.explorerHeight)}>
                  <ExplorerContainer project={project.uid} fullProject={project}/>
                </mui.Paper>
              </div>
            </bs.Col>
            <bs.Col sm={8} style={Object.assign({}, tabStyles.noPadding, tabStyles.scrollable, tabStyles.fullHeight)}>
              <div style={Object.assign({marginTop: '-10px' /* WTF ?! */}, tabStyles.noPadding, tabStyles.fullHeight)}>
                <MainTitle
                  center={title}
                  left={<icons.tabs.Ui />}
                  right={
                    <mui.IconButton onClick={() => onTabClosed(project.uid)}>
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

        <DialogConfirmImportComponents project={project.uid}/>
      </div>
    );
  }
}

UiProjectTab.propTypes = {
  project: React.PropTypes.object.isRequired,
  onTabClosed: React.PropTypes.func.isRequired
};

export default UiProjectTab;
