import endorphin from 'endorphin';
import { createRouter } from './router';

import { layout, pages } from './__routes__';

export default function routify(name, options) {
	return endorphin(name, createRouter(layout, pages), options);
}
