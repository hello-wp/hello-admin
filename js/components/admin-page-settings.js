/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;
const { PluginDocumentSettingPanel } = wp.editPost;
const { PanelRow } = wp.components;
const { compose } = wp.compose;
const { withSelect, withDispatch } = wp.data;

const icon = 'editor-ul';

import { MetaTextControl, MetaSelectControl, MetaToggleControl } from '.';

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
				<>
					<PanelRow>
						<MetaSelectControl
							label={ __( 'Menu Parent', 'hello-admin' ) }
							metaKey="parent_menu"
							placeholder={ __( 'Select Parent Menu', 'hello-admin' ) }
							getAdminPages={ true }
						/>
					</PanelRow>
				</>
			}
			<PanelRow>
				<div className="hello-admin-select-multiple">
					<MetaSelectControl
						label={ __( 'User Roles', 'hello-admin' ) }
						metaKey="user_roles"
						placeholder="All User Roles"
						help="Choose which user roles should see this admin page"
						multiple={ true }
						getUserRoles={ true }
					/>
				</div>
			</PanelRow>
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
