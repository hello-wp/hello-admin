/**
 * WordPress dependencies.
 */

( function( wp ) {
	const { __ } = wp.i18n;
	const { registerPlugin } = wp.plugins;
	const { PluginDocumentSettingPanel } = wp.editPost;
	const { TextControl } = wp.components;
	const { withSelect, withDispatch } = wp.data;
	const { compose } = wp.compose;

	const icon = 'editor-ul';

	const MetaTextControl = compose(
		withDispatch( function( dispatch, props ) {
			return {
				setMetaValue( value ) {
					dispatch( 'core/editor' ).editPost( {
						meta: { [ props.metaKey ]: value },
					} );
				},
			};
		} ),
		withSelect( function( select, props ) {
			return {
				metaValue: select( 'core/editor' ).getEditedPostAttribute( 'meta' )[ props.metaKey ],
			};
		} )
	)( function( props ) {
		return (
			<TextControl
				type={ props.type }
				label={ props.label }
				value={ props.metaValue }
				onChange={ ( value ) => {
					props.setMetaValue( value );
				} }
			/>
		);
	} );

	registerPlugin( 'admin-pages-menu-panel', {
		render() {
			return (
				<PluginDocumentSettingPanel
					name="admin-pages-menu-panel"
					title={ __( 'Admin Menu' ) }
					icon={ icon }
				>
					<MetaTextControl
						type="number"
						label={ __( 'Menu Position', 'hello-admin-pages' ) }
						metaKey="menu_position"
					/>
				</PluginDocumentSettingPanel>
			);
		},
	} );
}( window.wp ) );
