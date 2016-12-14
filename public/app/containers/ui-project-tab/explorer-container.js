'use strict';

import { connect } from 'react-redux';

import Explorer from '../../components/ui-project-tab/explorer';
import { makeGetSortedComponents, makeGetSortedImages, makeGetSortedWindows } from '../../selectors/ui-projects';
import { projectStateSelectAndActiveContent } from '../../actions/index';

const mapStateToProps = () => {
  const getSortedComponents = makeGetSortedComponents();
  const getSortedImages     = makeGetSortedImages();
  const getSortedWindows     = makeGetSortedWindows();
  return (state, props) => ({
    sortedComponents : getSortedComponents(state, props),
    sortedImages     : getSortedImages(state, props),
    sortedWindows    : getSortedWindows(state, props)
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