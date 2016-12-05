'use strict';

import React from 'react';
import * as mui from 'material-ui';

const DialogSelect = ({ title, open, items, select, cancel }) => (
  <mui.Dialog
    title={title}
    actions={<mui.FlatButton
              label="Cancel"
              onTouchTap={() => cancel()} />}
    modal={true}
    open={open}
    autoScrollBodyContent={true}>
    <mui.List>
      {items.map(it => (<mui.ListItem
                                      key={it}
                                      primaryText={it}
                                      onTouchTap={() => select(it)} />))}
    </mui.List>
  </mui.Dialog>
);

DialogSelect.propTypes = {
  title: React.PropTypes.string.isRequired,
  open: React.PropTypes.bool.isRequired,
  items: React.PropTypes.array.isRequired,
  select: React.PropTypes.func.isRequired,
  cancel: React.PropTypes.func.isRequired,
};

export default DialogSelect;