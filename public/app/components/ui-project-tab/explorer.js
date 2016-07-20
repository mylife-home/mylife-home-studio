'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import * as mui from 'material-ui';
import * as bs from 'react-bootstrap';
import base from '../base/index';

import Toolbar from './toolbar';

import tabStyles from '../base/tab-styles';

const styles = {
  mainList: {
    height: 'calc(100% - 74px)'
  }
};

class Explorer extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const project = this.props.project;

    return (
      <div style={Object.assign({}, tabStyles.fullHeight)}>
        <mui.List style={Object.assign({}, tabStyles.scrollable, styles.mainList)}>
          <mui.ListItem key={'project'} primaryText={'Project'} leftIcon={<base.icons.tabs.Ui />} />
          <mui.ListItem key={'components'} primaryText={'Components'} leftIcon={<base.icons.Component />} />
          <mui.ListItem key={'images'} primaryText={'Images'} leftIcon={<base.icons.UiImage />} />
          <mui.ListItem key={'windows'} primaryText={'Windows'} leftIcon={<base.icons.UiWindow />} />
        </mui.List>
        <Toolbar project={project} />
      </div>
    );
  }
}

Explorer.propTypes = {
  project: React.PropTypes.object.isRequired,
};

export default Explorer;