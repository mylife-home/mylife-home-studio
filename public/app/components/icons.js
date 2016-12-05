'use strict';

import ActionAutorenew from 'material-ui/svg-icons/action/autorenew';
import ActionBuild from 'material-ui/svg-icons/action/build';
import ActionCode from 'material-ui/svg-icons/action/code';
import ActionExtension from 'material-ui/svg-icons/action/extension';
import ActionInfo from 'material-ui/svg-icons/action/info';
import ActionSearch from 'material-ui/svg-icons/action/search';
import ActionSettings from 'material-ui/svg-icons/action/settings';
import ActionSubject from 'material-ui/svg-icons/action/subject';
import ActionOpenInBrowser from 'material-ui/svg-icons/action/open-in-browser';

import AvAddToQueue from 'material-ui/svg-icons/av/add-to-queue';

import ContentSave from 'material-ui/svg-icons/content/save';

import CommunicationImportContacts from 'material-ui/svg-icons/communication/import-contacts';

import EditorTextFields from 'material-ui/svg-icons/editor/text-fields';
import EditorInsertPhoto from 'material-ui/svg-icons/editor/insert-photo';

import FileCreateNewFolder from 'material-ui/svg-icons/file/create-new-folder';
import FileFolderOpen from 'material-ui/svg-icons/file/folder-open';

import HardwareMemory from 'material-ui/svg-icons/hardware/memory';
import HardwareDesktopWindows from 'material-ui/svg-icons/hardware/desktop-windows';
import HardwareDeveloperBoard from 'material-ui/svg-icons/hardware/developer-board';
import HardwareRouter from 'material-ui/svg-icons/hardware/router';

import ImageImage from 'material-ui/svg-icons/image/image';

import NavigationClose from 'material-ui/svg-icons/navigation/close';

import NotificationPersonalVideo from 'material-ui/svg-icons/notification/personal-video';

import SocialPublic from 'material-ui/svg-icons/social/public';
import SocialShare from 'material-ui/svg-icons/social/share';

export default {

  actions: {
    New           : FileCreateNewFolder,
    OpenOnline    : FileFolderOpen,
    OpenFile      : ActionOpenInBrowser,
    SaveAll       : ContentSave,
    Save          : ContentSave,
    SaveAs        : ContentSave,
    Refresh       : ActionAutorenew,
    Info          : ActionInfo,
    Close         : NavigationClose,
    NewWindow     : AvAddToQueue,
    NewImage      : EditorInsertPhoto,
  },

  tabs: {
    Online        : SocialPublic,
    VPanel        : HardwareMemory,
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

  Binding         : SocialShare,

  UiImage         : ImageImage,
  UiText          : EditorTextFields,
  UiWindow        : HardwareDesktopWindows,
};