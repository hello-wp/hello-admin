/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;
const { SelectControl } = wp.components;
const { withSelect, withDispatch } = wp.data;
const { compose } = wp.compose;
const apiFetch = wp.apiFetch;

const MetaSelectControl = compose(
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
		const currentPostId = select( 'core/editor' ).getCurrentPostId();
		const query = {
			per_page: -1,
			exclude: currentPostId,
			metaKey: 'sub_menu',
			metaValue: 0,
		};

		let primaryMenus;
		apiFetch( { path: '/hello-admin/v1/menus' } ).then( ( menus ) => {
			primaryMenus = menus;
		} );

		return {
			metaValue: select( 'core/editor' ).getEditedPostAttribute( 'meta' )[ props.metaKey ],
			adminPages: select( 'core' ).getEntityRecords( 'postType', 'admin-page', query ),
			allPages: primaryMenus,
		};
	} )
)( function( props ) {
	const options = [
		{ value: -1, label: props.placeholder },
	];
	if ( props.adminPages ) {
		props.adminPages.forEach( ( post ) => {
			options.push( { value: post.id, label: post.title.rendered } );
		} );
	} else {
		options.push( { value: -1, label: __( 'Loading…', 'hello-admin' ), disabled: true } );
	}
	return (
		<SelectControl
			options={ options }
			label={ props.label }
			value={ props.metaValue }
			onChange={ ( value ) => {
				props.setMetaValue( value );
			} }
		/>
	);
} );

export default MetaSelectControl;
