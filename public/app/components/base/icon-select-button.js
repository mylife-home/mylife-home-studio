'use strict';

import React from 'react';
import * as mui from 'material-ui';
import DialogSelect from './dialog-select';

class IconSelectButton extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      opened: false
    };
  }

  open() {
    this.setState({
      opened: true
    });
  }

  select(name) {
    this.close();
    if(!name) { return; }
    this.props.onItemSelect(name);
  }

  close() {
    this.setState({
      opened: false
    });
  }

  render() {
    const { selectTitle, selectItems, onItemSelect, children, ...props } = this.props;
    void onItemSelect;

    return (
      <div>
        <mui.IconButton onClick={() => this.open()} {...props}>
          {children}
        </mui.IconButton>


        <DialogSelect title={selectTitle}
                      open={this.state.opened}
                      items={selectItems}
                      select={(item) => this.select(item)}
                      cancel={() => this.close()}/>
      </div>
    );
  }
}

IconSelectButton.propTypes = {
  selectTitle: React.PropTypes.string.isRequired,
  selectItems: React.PropTypes.arrayOf(React.PropTypes.string.isRequired).isRequired,
  onItemSelect: React.PropTypes.func.isRequired,
  children: React.PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.node),
    React.PropTypes.node
  ])
};

export default IconSelectButton;