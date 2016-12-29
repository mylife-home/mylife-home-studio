'use strict';

import { connect } from 'react-redux';

import DialogOperationSelect from '../components/dialogs/dialog-operation-select';

import {
  dialogExecuteOperations, dialogCancelOperations, dialogSetAllOperations, dialogSetOneOperation,
} from '../actions/index';

const mapStateToProps = (state) => ({
  operations: state.dialogs.operations && state.dialogs.operations.sortBy(op => op.uid).toArray()
});

const mapDispatchToProps = ({
  ok     : dialogExecuteOperations,
  cancel : dialogCancelOperations,
  setAll : dialogSetAllOperations,
  setOne : dialogSetOneOperation
});

const MainDialogOperationSelect = connect(
  mapStateToProps,
  mapDispatchToProps
)(DialogOperationSelect);

export default MainDialogOperationSelect;
