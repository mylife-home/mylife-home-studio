'use strict';

import React from 'react';
import * as mui from 'material-ui';
import icons from '../icons';
import MainTitle from '../main-title';

const Title = ({ project, activeContent, component, image, window, onTabClosed }) => {

  let title = project.name;
  switch(activeContent && activeContent.type) {
    case 'component':
      title += ` - ${component.id}`;
      break;

    case 'image':
      title += ` - ${image.id}`;
      break;

    case 'window':
      title += ` - ${window.id}`;
      break;
  }

  return (
    <MainTitle
      center={title}
      left={<icons.tabs.Ui />}
      right={
        <mui.IconButton onClick={onTabClosed}>
          <icons.actions.Close />
        </mui.IconButton>
      }/>
  );
};

Title.propTypes = {
  project       : React.PropTypes.object.isRequired,
  activeContent : React.PropTypes.object,
  component     : React.PropTypes.object,
  image         : React.PropTypes.object,
  window        : React.PropTypes.object,
  onTabClosed   : React.PropTypes.func.isRequired
};

export default Title;
