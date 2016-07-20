'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import * as mui from 'material-ui';
import * as bs from 'react-bootstrap';
import base from '../base/index';

import Properties from './properties';
import Explorer from './explorer';
import Toolbox from './toolbox';
import Canvas from './canvas';

import ProjectActionCreators from '../../actions/project-action-creators';
import ProjectStore from '../../stores/project-store';

import tabStyles from '../base/tab-styles';

class UiProjectTab extends React.Component {

  constructor(props) {
    super(props);
    this.state = { };

    this.boundHandleStoreChange = this.handleStoreChange.bind(this);
  }

  componentDidMount() {
    ProjectStore.addChangeListener(this.boundHandleStoreChange);
  }

  componentWillUnmount() {
    ProjectStore.removeChangeListener(this.boundHandleStoreChange);
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
            <div>
              <mui.Paper style={Object.assign({}, tabStyles.scrollable, tabStyles.fullHeight)}>
                <Toolbox project={project} />
              </mui.Paper>
              <mui.Paper style={Object.assign({}, tabStyles.scrollable, tabStyles.fullHeight)}>
                <Explorer project={project} />
              </mui.Paper>
            </div>
          </bs.Col>
          <bs.Col sm={8} style={Object.assign({}, tabStyles.noPadding, tabStyles.scrollable, tabStyles.fullHeight)}>
            <div>
              <base.DetailsTitle
                center={project.name}
                left={<base.icons.tabs.Ui />}
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

UiProjectTab.propTypes = {
  project: React.PropTypes.object.isRequired,
};

export default UiProjectTab;
