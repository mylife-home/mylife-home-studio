'use strict';

import { connect } from 'react-redux';

import DialogConfirm from '../../components/dialogs/dialog-confirm';
import { projectVPanelConfirmImportToolbox, projectVPanelCancelImportToolbox } from '../../actions/index';
import { getProjectState } from '../../selectors/projects';

const mapStateToProps = (state, props) => {
  const projectState         = getProjectState(state, props);
  const pendingImportToolbox = projectState && projectState.pendingImportToolbox;

  return {
    title : 'Confirm',
    open  : !!pendingImportToolbox,
    lines : (pendingImportToolbox && pendingImportToolbox.messages) || []
  };
};

const mapDispatchToProps = (dispatch, { project }) => ({
  yes : () => dispatch(projectVPanelConfirmImportToolbox(project)),
  no  : () => dispatch(projectVPanelCancelImportToolbox(project))
});

const DialogConfirmImportToolbox = connect(
  mapStateToProps,
  mapDispatchToProps
)(DialogConfirm);

export default DialogConfirmImportToolbox;