'use strict';

import React from 'react';
import * as mui from 'material-ui';
import * as bs from 'react-bootstrap';
import icons from '../icons';
import MainTitle from '../main-title';

import Properties from './properties';
import Toolbox from './toolbox';
import Canvas from './canvas';

import storeHandler from '../../compat/store';
import AppDispatcher from '../../compat/dispatcher';
import { projectClose } from '../../actions/index';

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
    const project = this.props.project;
    let projectVersion = project && project.version;
    this.setState({ projectVersion });
  }

  render() {
    const project = this.props.project;

    return (
      <bs.Grid fluid={true} style={Object.assign({}, tabStyles.fullHeight)}>
        <bs.Row style={tabStyles.fullHeight}>
          <bs.Col sm={2} style={Object.assign({}, tabStyles.noPadding, tabStyles.fullHeight)}>
            <mui.Paper style={Object.assign({}, tabStyles.scrollable, tabStyles.fullHeight)}>
              <Toolbox project={project} />
            </mui.Paper>
          </bs.Col>
          <bs.Col sm={8} style={Object.assign({}, tabStyles.noPadding, tabStyles.scrollable, tabStyles.fullHeight)}>
            <div style={Object.assign({marginTop: '-10px' /* WTF ?! */}, tabStyles.noPadding, tabStyles.fullHeight)}>
              <MainTitle
                center={project.name}
                left={<icons.tabs.VPanel />}
                right={
                  <mui.IconButton onClick={() => AppDispatcher.dispatch(projectClose(project))}>
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

VPanelProjectTab.propTypes = {
  project: React.PropTypes.object.isRequired,
};

export default VPanelProjectTab;
