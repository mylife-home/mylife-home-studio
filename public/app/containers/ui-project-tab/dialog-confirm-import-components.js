'use strict';

import { connect } from 'react-redux';

import DialogConfirm from '../../components/dialogs/dialog-confirm';
import { projectUiConfirmImportComponents, projectUiCancelImportComponents } from '../../actions/index';
import { getProjectState } from '../../selectors/projects';

const mapStateToProps = (state, props) => {
  const projectState            = getProjectState(state, props);
  const importComponentsConfirm = projectState && projectState.importComponentsConfirm;

  return {
    title : 'Confirm',
    open  : !!importComponentsConfirm,
    lines : (importComponentsConfirm && ['The following elements will be lost:'].concat(importComponentsConfirm.messages)) || []
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
