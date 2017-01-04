'use strict';

import { connect } from 'react-redux';

import Title from '../../components/ui-project-tab/title';

import { getProject, getProjectState } from '../../selectors/projects';
import { getComponent, getImage, getWindow } from '../../selectors/ui-projects';

const mapStateToProps = (state, { project }) => {
  const projectState  = getProjectState(state, { project });
  const activeContent = projectState && projectState.activeContent;
  let component, image, window;
  switch(activeContent && activeContent.type) {
    case 'component':
      component = getComponent(state, { project, component: activeContent.uid });
      break;

    case 'image':
      image = getImage(state, { project, image: activeContent.uid });
      break;

    case 'window':
      window = getWindow(state, { project, window: activeContent.uid });
      break;
  }

  return {
    project : getProject(state, { project }),
    activeContent,
    component,
    image,
    window
  };
};

const TitleContainer = connect(
  mapStateToProps,
  null
)(Title);

export default TitleContainer;
