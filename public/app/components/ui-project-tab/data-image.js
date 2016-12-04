'use strict';

import React from 'react';

const DataImage = ({ image, ...props }) => (
  <img {...props} src={(image && image.content) ? `data:;base64,${image.content}` : null} />
);

DataImage.propTypes = {
  image: React.PropTypes.object,
};

export default DataImage;