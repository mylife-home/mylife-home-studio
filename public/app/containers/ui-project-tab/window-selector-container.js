'use strict';

import { connect } from 'react-redux';

import WindowSelector from '../../components/ui-project-tab/window-selector';
import { makeGetSortedWindows, getWindows } from '../../selectors/ui-projects';

const mapStateToProps = () => {
  const getSortedWindows     = makeGetSortedWindows();
  return (state, props) => ({
    sortedWindows  : getSortedWindows(state, props),
    selectedWindow : getWindows(state, props).get(props.value)
  });
};

const WindowSelectorContainer = connect(
  mapStateToProps,
  null
)(WindowSelector);

export default WindowSelectorContainer;