'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import * as mui from 'material-ui';

class DialogInfo extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleSelect(item) {
    this.props.select(item);
  }

  render() {
    return (
      <mui.Dialog
          title={this.props.title}
          actions={<mui.FlatButton
                    label="OK"
                    onTouchTap={() => this.props.close()} />}
          modal={true}
          open={this.props.open}
          autoScrollBodyContent={true}>
          <mui.List>
            {this.props.lines.map(it => (<mui.ListItem
                                            key={it}
                                            primaryText={it} />))}
          </mui.List>
        </mui.Dialog>
    );
  }
}

DialogInfo.propTypes = {
  title: React.PropTypes.string.isRequired,
  open: React.PropTypes.bool.isRequired,
  lines: React.PropTypes.array.isRequired,
  close: React.PropTypes.func.isRequired
};

export default DialogInfo;