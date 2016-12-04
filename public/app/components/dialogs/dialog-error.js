'use strict';

import React from 'react';
import * as mui from 'material-ui';

const DialogError = ({ error, onClose }) => (
  <mui.Dialog
    title="Error occured !"
    actions={<mui.FlatButton
              label="OK"
              primary={true}
              onTouchTap={onClose} />}
    modal={true}
    open={!!error}>
    <div style={{whiteSpace: 'pre'}}>
      {error && error.toString()}
    </div>
  </mui.Dialog>
);

DialogError.propTypes = {
  error: React.PropTypes.object,
  onClose: React.PropTypes.func.isRequired
};

export default DialogError;