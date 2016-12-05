'use strict';

import React from 'react';
import * as mui from 'material-ui';

const DialogOperationSelect = ({ open, operations, ok, cancel, setAll, setOne }) => (
  <mui.Dialog
    title="Select operations to execute"
    actions={<div>
              <mui.FlatButton
                label="Select all"
                onTouchTap={() => setAll(true)} />
              <mui.FlatButton
                label="Unselect all"
                onTouchTap={() => setAll(false)} />
              <mui.FlatButton
                label="OK"
                onTouchTap={() => ok()} />
              <mui.FlatButton
                label="Cancel"
                onTouchTap={() => cancel()} />
            </div>}
    modal={true}
    open={open}
    autoScrollBodyContent={true}>
    <mui.List>
      {operations.map(op => (<mui.ListItem
                           key={op.id}
                           primaryText={op.description}
                           leftCheckbox={
                             <mui.Checkbox checked={op.enabled}
                                           onCheck={(event, isInputChecked) => setOne(op, isInputChecked)}
                             />} />))}
    </mui.List>
  </mui.Dialog>
);

DialogOperationSelect.propTypes = {
  open: React.PropTypes.bool.isRequired,
  operations: React.PropTypes.arrayOf(React.PropTypes.object.isRequired).isRequired,
  ok: React.PropTypes.func.isRequired,
  cancel: React.PropTypes.func.isRequired,
  setAll: React.PropTypes.func.isRequired,
  setOne: React.PropTypes.func.isRequired
};

export default DialogOperationSelect;