import generalSettings from './general-settings/index.js';
import shortcut from './shortcut/index.js';
import notifications from './notifications/index.js';
import cockpit from './cockpit/index.js';

const available = { generalSettings, shortcut, notifications, cockpit };

export const components = {

	all: available,

	initialize: function(){
		var a;

		for( a in available ){
			available[a]();

		}

	}
};
