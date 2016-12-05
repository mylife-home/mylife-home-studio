'use strict';

import React from 'react';
import * as mui from 'material-ui';

const DialogConfirm = ({ title, open, lines, yes, no }) => (
  <mui.Dialog
    title={title}
    actions={<div>
              <mui.FlatButton
                label="Yes"
                onTouchTap={() => yes()} />
              <mui.FlatButton
                label="No"
                onTouchTap={() => no()} />
            </div>}
    modal={true}
    open={open}
    autoScrollBodyContent={true}>
    <mui.List>
      {lines.map(it => (<mui.ListItem
                          key={it}
                          primaryText={it} />))}
    </mui.List>
  </mui.Dialog>
);

DialogConfirm.propTypes = {
  title: React.PropTypes.string.isRequired,
  open: React.PropTypes.bool.isRequired,
  lines: React.PropTypes.array.isRequired,
  yes: React.PropTypes.func.isRequired,
  no: React.PropTypes.func.isRequired,
};

export default DialogConfirm;