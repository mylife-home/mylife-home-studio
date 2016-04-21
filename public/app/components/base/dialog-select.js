'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import * as mui from 'material-ui';

class DialogSelect extends React.Component {

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
                    label="Cancel"
                    onTouchTap={() => this.props.cancel()} />}
          modal={true}
          open={this.props.open}
          autoScrollBodyContent={true}>
          <mui.List>
            {this.props.items.map(it => (<mui.ListItem
                                            key={it}
                                            primaryText={it}
                                            onTouchTap={() => this.props.select(it)} />))}
          </mui.List>
        </mui.Dialog>
    );
  }
}

DialogSelect.propTypes = {
  title: React.PropTypes.string.isRequired,
  open: React.PropTypes.bool.isRequired,
  items: React.PropTypes.array.isRequired,
  select: React.PropTypes.func.isRequired,
  cancel: React.PropTypes.func.isRequired,
};

export default DialogSelect;