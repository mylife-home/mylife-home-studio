'use strict';

import { connect } from 'react-redux';

import Explorer from '../../components/ui-project-tab/explorer';
import { makeGetSortedComponents, makeGetSortedImages, makeGetSortedWindows } from '../../selectors/ui-projects';
import { projectStateSelectAndActiveContent } from '../../actions/index';

const mapStateToProps = () => {
  const getSortedComponents = makeGetSortedComponents();
  const getSortedImages     = makeGetSortedImages();
  const getSortedWindow     = makeGetSortedWindows();
  return (state, props) => ({
    components : getSortedComponents(state, props),
    images     : getSortedImages(state, props),
    windows    : getSortedWindow(state, props)
  });
};

const mapDispatchToProps = (dispatch, { project }) => ({
  onSelect: (data) => dispatch(projectStateSelectAndActiveContent(project, data, data))
});

const ExplorerContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Explorer);

export default ExplorerContainer;