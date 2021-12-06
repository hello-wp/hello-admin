/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;
const { PluginDocumentSettingPanel } = wp.editPost;
const { PanelRow } = wp.components;
const { useSelect } = wp.data;
const { useState } = wp.element;
const apiFetch = wp.apiFetch;

const icon = 'editor-ul';

import { MetaTextControl, MetaSelectControl, MetaToggleControl, IconSelector } from '.';

const AdminPageSettings = function() {
	const { postMeta } = useSelect( ( select ) => {
		return {
			postMeta: select( 'core/editor' ).getEditedPostAttribute( 'meta' ),
		};
	} );

	const [ state, setState ] = useState( {
		loading: true,
		menuItems: [
			{ value: -1, label: __( 'Select Parent Menu', 'hello-admin' ) },
			{ value: -1, label: __( 'Loading…', 'hello-admin' ), disabled: true },
		],
	} );

	if ( state.loading ) {
		apiFetch( { path: '/hello-admin/v1/menus' } ).then( ( { success, data } ) => {
			if ( success ) {
				const menuItems = [ state.menuItems[ 0 ] ];
				for ( const id in data ) {
					let label = data[ id ][ 0 ];

					if ( '' === label ) {
						continue;
					}

					// Remove HTML from label.
					label = label.replace( /<\w+(?: \w*=".*")*>.*<\/\w+>/g, '' ).trim();

					menuItems.push( { value: id, label } );
				}
				setState( {
					loading: false,
					menuItems,
				} );
			}
		} );
	}

	return (
		<PluginDocumentSettingPanel
			name="hello-admin-menu-panel"
			title={ __( 'Admin Menu' ) }
			icon={ icon }
		>
			<PanelRow>
				<MetaTextControl
					type="number"
					label={ __( 'Menu Position', 'hello-admin' ) }
					metaKey="menu_position"
				/>
			</PanelRow>
			<PanelRow>
				<MetaToggleControl
					label={ __( 'Sub-Menu', 'hello-admin' ) }
					metaKey="sub_menu"
				/>
			</PanelRow>
			{ postMeta.sub_menu &&
				<>
					<PanelRow>
						<MetaSelectControl
							options={ state.menuItems }
							label={ __( 'Menu Parent', 'hello-admin' ) }
							metaKey="parent_menu"
						/>
					</PanelRow>
				</>
			}
			{ ! postMeta.sub_menu &&
				<>
					<PanelRow>
						<IconSelector />
					</PanelRow>
				</>
			}
		</PluginDocumentSettingPanel>
	);
};

export default AdminPageSettings;
