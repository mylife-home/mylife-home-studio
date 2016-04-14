'use strict';

import ActionBuild from 'material-ui/svg-icons/action/build';
import ActionCode from 'material-ui/svg-icons/action/code';
import ActionExtension from 'material-ui/svg-icons/action/extension';
import ActionSearch from 'material-ui/svg-icons/action/search';
import ActionSettings from 'material-ui/svg-icons/action/settings';
import ActionSubject from 'material-ui/svg-icons/action/subject';

import CommunicationImportContacts from 'material-ui/svg-icons/communication/import-contacts';

import HardwareMemory from 'material-ui/svg-icons/hardware/memory';
import HardwareDeveloperBoard from 'material-ui/svg-icons/hardware/developer-board';
import HardwareRouter from 'material-ui/svg-icons/hardware/router';

import NotificationPersonalVideo from 'material-ui/svg-icons/notification/personal-video';

import SocialPublic from 'material-ui/svg-icons/social/public';

import FileCreateNewFolder from 'material-ui/svg-icons/file/create-new-folder';
import FileFolderOpen from 'material-ui/svg-icons/file/folder-open';
import ActionOpenInBrowser from 'material-ui/svg-icons/action/open-in-browser';
import ContentSave from 'material-ui/svg-icons/content/save';

export default {

  toolbar: {
    New           : FileCreateNewFolder,
    OpenOnline    : FileFolderOpen,
    OpenFile      : ActionOpenInBrowser,
    SaveAll       : ContentSave,
    Save          : ContentSave,
    SaveAs        : ContentSave
  },

  tabs: {
    Online        : SocialPublic,
    Vpanel        : HardwareMemory,
    Ui            : NotificationPersonalVideo,
  },

  Entity          : HardwareRouter,
  EntityCore      : SocialPublic,
  EntityResources : CommunicationImportContacts,
  EntityUi        : NotificationPersonalVideo,

  Resource        : ActionSubject,

  Plugin          : ActionExtension,
  PluginDriver    : HardwareMemory,
  PluginVPanel    : SocialPublic,
  PluginUi        : NotificationPersonalVideo,

  Component       : HardwareDeveloperBoard,

  NetClass        : ActionCode,
  NetAction       : ActionBuild,
  NetAttribute    : ActionSearch,

  NetConfig       : ActionSettings,
};