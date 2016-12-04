'use strict';

import React from 'react';
import * as mui from 'material-ui';

const DialogBusy = ({ text }) => (
  <mui.Dialog
    title="Please wait ..."
    modal={true}
    open={!!text}>
    {text}
  </mui.Dialog>
);

DialogBusy.propTypes = {
  text: React.PropTypes.string,
};

export default DialogBusy;