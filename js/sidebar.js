/**
 * WordPress dependencies.
 */
const { registerPlugin } = wp.plugins;

import AdminPageSettings from './components/admin-page-settings';

registerPlugin( 'hello-admin-menu-panel', {
	render() {
		return <AdminPageSettings />;
	},
} );
