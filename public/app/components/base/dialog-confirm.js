'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import * as mui from 'material-ui';

class DialogConfirm extends React.Component {

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
          actions={<div>
                    <mui.FlatButton
                      label="Yes"
                      onTouchTap={() => this.props.yes()} />
                    <mui.FlatButton
                      label="No"
                      onTouchTap={() => this.props.no()} />
                  </div>}
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

DialogConfirm.propTypes = {
  title: React.PropTypes.string.isRequired,
  open: React.PropTypes.bool.isRequired,
  lines: React.PropTypes.array.isRequired,
  yes: React.PropTypes.func.isRequired,
  no: React.PropTypes.func.isRequired,
};

export default DialogConfirm;