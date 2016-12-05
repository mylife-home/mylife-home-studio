'use strict';

import React from 'react';
import * as mui from 'material-ui';

const IconFileButton = ({ onFileSelected, children, ...props }) => {

  let fileInput;

  const handler = (e) => {
    e.stopPropagation();
    const file = e.target.files[0];
    e.target.value = '';
    if(!file) { return; }
    onFileSelected(file);
  };

  return (
    <div>
      <mui.IconButton onClick={() => fileInput.click()} {...props}>
        {children}
      </mui.IconButton>

      <input
        ref={(input) => { fileInput = input; }}
        type="file"
        style={{display : 'none'}}
        onChange={handler}/>
    </div>
  );
};

IconFileButton.propTypes = {
  onFileSelected: React.PropTypes.func.isRequired,
  children: React.PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.node),
    React.PropTypes.node
  ])
};

export default IconFileButton;
