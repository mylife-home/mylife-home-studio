'use strict';

import React from 'react';
import * as mui from 'material-ui';
import * as bs from 'react-bootstrap';
import icons from '../icons';
import MainTitle from '../main-title';

import PropertiesContainer from '../../containers/vpanel-project-tab/properties-container';
import ToolboxContainer from '../../containers/vpanel-project-tab/toolbox-container';
import DialogConfirmImportToolbox from '../../containers/vpanel-project-tab/dialog-confirm-import-toolbox';
import CanvasContainer from '../../containers/vpanel-project-tab/canvas-container';

import tabStyles from '../base/tab-styles';

const VPanelProjectTab = ({ project, onTabClosed }) => (
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
                <mui.IconButton onClick={() => onTabClosed(project.uid)}>
                  <icons.actions.Close />
                </mui.IconButton>
              }/>
            <CanvasContainer project={project} />
          </div>
        </bs.Col>
        <bs.Col sm={2} style={Object.assign({}, tabStyles.noPadding, tabStyles.fullHeight)}>
          <mui.Paper style={Object.assign({}, tabStyles.scrollable, tabStyles.fullHeight)}>
            <PropertiesContainer project={project.uid} />
          </mui.Paper>
        </bs.Col>
      </bs.Row>
    </bs.Grid>

    <DialogConfirmImportToolbox project={project.uid}/>

  </div>
);

VPanelProjectTab.propTypes = {
  project: React.PropTypes.object.isRequired,
  onTabClosed: React.PropTypes.func.isRequired
};

export default VPanelProjectTab;
