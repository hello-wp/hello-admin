/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;
const { PluginDocumentSettingPanel } = wp.editPost;
const { PanelRow } = wp.components;
const { compose } = wp.compose;
const { withSelect, withDispatch } = wp.data;

const icon = 'editor-ul';

import MetaTextControl from './meta-text-control';
import MetaSelectControl from './meta-select-control';
import MetaToggleControl from './meta-toggle-control';

const AdminPageSettings = function( props ) {
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
			{ props.postMeta.sub_menu &&
				<PanelRow>
					<MetaSelectControl
						label={ __( 'Menu Parent', 'hello-admin' ) }
						metaKey="menu_parent"
					/>
				</PanelRow>
			}
		</PluginDocumentSettingPanel>
	);
};

export default compose( [
	withSelect( ( select ) => {
		return {
			postMeta: select( 'core/editor' ).getEditedPostAttribute( 'meta' ),
			postType: select( 'core/editor' ).getCurrentPostType(),
		};
	} ),
	withDispatch( ( dispatch ) => {
		return {
			setPostMeta( newMeta ) {
				dispatch( 'core/editor' ).editPost( { meta: newMeta } );
			},
		};
	} ),
] )( AdminPageSettings );
