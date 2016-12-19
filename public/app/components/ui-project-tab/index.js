'use strict';

import React from 'react';
import * as mui from 'material-ui';
import * as bs from 'react-bootstrap';
import icons from '../icons';
import MainTitle from '../main-title';

import Properties from './properties';
import ExplorerContainer from '../../containers/ui-project-tab/explorer-container';
import Toolbox from './toolbox';
import Canvas from './canvas';

import AppDispatcher from '../../compat/dispatcher';
import { projectClose } from '../../actions/index';
import storeHandler from '../../compat/store';

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
    const projectVersion = project && project.version;
    const { activeContent } = this.state;
    this.setState({ projectVersion, activeContent });
  }

  render() {
    const { project } = this.props;
    const { activeContent } = this.state;

    let title = project.name;
    if(activeContent) {
      switch(activeContent.type) {
        case 'component': {
          const component = project.components.find(comp => comp.id === activeContent.id);
          title += ` - ${component.id}`;
          break;
        }

        case 'image': {
          const image = project.images.find(img => img.uid === activeContent.uid);
          title += ` - ${image.id}`;
          break;
        }

        case 'window': {
          const window = project.windows.find(wnd => wnd.uid === activeContent.uid);
          title += ` - ${window.id}`;
          break;
        }
      }
    }

    return (
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
    );
  }
}

UiProjectTab.propTypes = {
  project: React.PropTypes.object.isRequired,
};

export default UiProjectTab;
