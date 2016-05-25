'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import * as mui from 'material-ui';
import * as bs from 'react-bootstrap';
import base from '../base/index';

import Properties from './properties';
import Toolbox from './toolbox';
import Canvas from './canvas';

import ProjectActionCreators from '../../actions/project-action-creators';

import tabStyles from '../base/tab-styles';

class VPanelProjectTab extends React.Component {

  constructor(props) {
    super(props);
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
            <div>
              <base.DetailsTitle
                center={project.name}
                left={<base.icons.tabs.VPanel />}
                right={
                  <mui.IconButton onClick={() => ProjectActionCreators.close(project)}>
                    <base.icons.actions.Close />
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