'use strict';

import React from 'react';
import * as mui from 'material-ui';

const DialogInfo = ({ title, open, lines, onClose }) => (
  <mui.Dialog
    title={title}
    actions={<mui.FlatButton
              label="OK"
              onTouchTap={() => onClose()} />}
    modal={true}
    open={open}
    autoScrollBodyContent={true}>
    <mui.List>
      {(lines || []).map(it => (<mui.ListItem
                                      key={it}
                                      primaryText={it} />))}
    </mui.List>
  </mui.Dialog>
);

DialogInfo.propTypes = {
  title: React.PropTypes.string,
  open: React.PropTypes.bool.isRequired,
  lines: React.PropTypes.array,
  onClose: React.PropTypes.func.isRequired
};

export default DialogInfo;