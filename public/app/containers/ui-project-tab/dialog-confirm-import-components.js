'use strict';

import { connect } from 'react-redux';

import DialogConfirm from '../../components/dialogs/dialog-confirm';
import { projectUiConfirmImportComponents, projectUiCancelImportComponents } from '../../actions/index';
import { getProjectState } from '../../selectors/projects';

const mapStateToProps = (state, props) => {
  const projectState            = getProjectState(state, props);
  const pendingImportComponents = projectState && projectState.pendingImportComponents;

  return {
    title : 'Confirm',
    open  : !!pendingImportComponents,
    lines : (pendingImportComponents && ['The following elements will be lost:'].concat(pendingImportComponents.messages)) || []
  };
};

const mapDispatchToProps = (dispatch, { project }) => ({
  yes : () => dispatch(projectUiConfirmImportComponents(project)),
  no  : () => dispatch(projectUiCancelImportComponents(project))
});

const DialogConfirmImportComponents = connect(
  mapStateToProps,
  mapDispatchToProps
)(DialogConfirm);

export default DialogConfirmImportComponents;
