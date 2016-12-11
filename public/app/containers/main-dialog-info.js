'use strict';

import { connect } from 'react-redux';

import DialogInfo from '../components/dialogs/dialog-info';

import { dialogInfoClean } from '../actions/index';

const mapStateToProps = (state) => ({
  open: !!state.dialogs.info,
  title: state.dialogs.info && state.dialogs.info.title,
  lines: state.dialogs.info && state.dialogs.info.lines
});

const mapDispatchToProps = ({
  onClose: dialogInfoClean
});

const MainDialogInfo = connect(
  mapStateToProps,
  mapDispatchToProps
)(DialogInfo);

export default MainDialogInfo;