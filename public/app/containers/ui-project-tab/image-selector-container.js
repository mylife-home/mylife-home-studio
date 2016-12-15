'use strict';

import { connect } from 'react-redux';

import ImageSelector from '../../components/ui-project-tab/image-selector';
import { makeGetSortedImages, getImage } from '../../selectors/ui-projects';

const mapStateToProps = () => {
  const getSortedImages     = makeGetSortedImages();
  return (state, props) => ({
    sortedImages  : getSortedImages(state, props),
    selectedImage : getImage(state, props)
  });
};

const ImageSelectorContainer = connect(
  mapStateToProps,
  null
)(ImageSelector);

export default ImageSelectorContainer;