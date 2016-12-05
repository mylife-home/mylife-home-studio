'use strict';

import { connect } from 'react-redux';

import DialogError from '../components/dialogs/dialog-error';

import { dialogErrorClean } from '../actions/index';

const mapStateToProps = (state) => ({
  error: state.dialogs.error
});

const mapDispatchToProps = ({
  onClose: dialogErrorClean
});

const MainDialogError = connect(
  mapStateToProps,
  mapDispatchToProps
)(DialogError);

export default MainDialogError;