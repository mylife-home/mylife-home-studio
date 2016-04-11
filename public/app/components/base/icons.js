'use strict';

import ActionBuild from 'material-ui/lib/svg-icons/action/build';
import ActionCode from 'material-ui/lib/svg-icons/action/code';
import ActionExtension from 'material-ui/lib/svg-icons/action/extension';
import ActionSearch from 'material-ui/lib/svg-icons/action/search';
import ActionSettings from 'material-ui/lib/svg-icons/action/settings';
import ActionSubject from 'material-ui/lib/svg-icons/action/subject';

import CommunicationImportContacts from 'material-ui/lib/svg-icons/communication/import-contacts';

import HardwareMemory from 'material-ui/lib/svg-icons/hardware/memory';
import HardwareDeveloperBoard from 'material-ui/lib/svg-icons/hardware/developer-board';
import HardwareRouter from 'material-ui/lib/svg-icons/hardware/router';

import NotificationPersonalVideo from 'material-ui/lib/svg-icons/notification/personal-video';

import SocialPublic from 'material-ui/lib/svg-icons/social/public';

export default {
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

  NetConfig       : ActionSettings
};