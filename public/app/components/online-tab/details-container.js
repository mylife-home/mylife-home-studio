'use strict';

import React from 'react';
import * as muiStyles from 'material-ui/styles/index';

const styles = {
  text: {
    padding: '10px',
    position: 'absolute',
    lineHeight: '50px',
    overflowY: 'auto',
    width: '100%',
    wordWrap: 'break-word',
  }
};

class DetailsContainer extends React.Component {

  constructor(props, context) {
    super(props);
    this.state = {
      content: null,
      muiTheme: context.muiTheme || muiStyles.getMuiTheme()
    };
  }

  getChildContext() {
    return {
      muiTheme: this.state.muiTheme,
    };
  }

  render() {
    const additionalStyle = {
      fontFamily: this.state.muiTheme.fontFamily,
      color: this.state.muiTheme.palette.primaryColor,
    };

    return (
      <div style={Object.assign({}, styles.text, additionalStyle)} {...this.props} {...this.state}>
        {this.props.children}
      </div>
    );
  }
}

DetailsContainer.propTypes = {
  muiTheme: React.PropTypes.object
};

DetailsContainer.childContextTypes = {
  muiTheme: React.PropTypes.object
};

DetailsContainer.contextTypes = {
  muiTheme: React.PropTypes.object
};

export default DetailsContainer;