'use strict';

import React from 'react';
import * as mui from 'material-ui';

class IconFileButton extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const handler = (e) => {
      e.stopPropagation();
      const file = e.target.files[0];
      e.target.value = '';
      if(!file) { return; }
      this.props.onFileSelected(file);
    };

    return (
      <div>
        <mui.IconButton tooltip={this.props.tooltip}
                        style={this.props.style}
                        onClick={() => this.refs.fileInput.click()}>
          {this.props.children}
        </mui.IconButton>

        <input
          ref="fileInput"
          type="file"
          style={{display : 'none'}}
          onChange={handler}/>
      </div>
    );
  }
}

IconFileButton.propTypes = {
  tooltip: React.PropTypes.string,
  style: React.PropTypes.object,
  onFileSelected: React.PropTypes.func.isRequired,
  children: React.PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.node),
    React.PropTypes.node
  ])
};

export default IconFileButton;
