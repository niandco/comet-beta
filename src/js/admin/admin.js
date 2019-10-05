import dashboard from './dashboard.js';
//import templates from './templates.js';
import fonts from './fonts/index.js';
import templates from './templates/index.js';
//import fonts from './fonts.js';
import { getParameters } from '../utils/url.js';
import Interface from './interface/index.js';

'use strict';


(function( cometAdmin ){

  cometAdmin();

}(function(){
	const INTERFACE =  new Interface();
	INTERFACE.init();

}
	/*const current = getParameters();

	console.log( current );

	if( current.page !== 'comet' ){
		return;

	}


	switch( current.rq ){

		case 'mytemplates':
			templates();
			return;

		case 'fonts':
			fonts();
			return;

		case undefined:
		case null:
			return;
			
		default:
			dashboard();


	}

	window.onpopstate = function (event) {
		console.log( history, history.state, history.state.id );
    if (history.state && history.state.id === 'homepage') {
        // Render new content for the hompage
    }
};

}*/));
