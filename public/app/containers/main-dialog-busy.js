'use strict';

import { connect } from 'react-redux';

import DialogBusy from '../components/dialogs/dialog-busy';

const mapStateToProps = (state) => ({
  text: state.dialogs.busyText
});

const MainDialogBusy = connect(
  mapStateToProps
)(DialogBusy);

export default MainDialogBusy;