'use strict';

import { connect } from 'react-redux';

import DialogBusy from '../components/dialogs/dialog-busy';

const mapStateToProps = (state) => ({
  text: state.dialogs.busyText
});

const mapDispatchToProps = ({
});

const MainDialogBusy = connect(
  mapStateToProps,
  mapDispatchToProps
)(DialogBusy);

export default MainDialogBusy;