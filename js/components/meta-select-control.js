/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;
const { SelectControl } = wp.components;
const { withSelect, withDispatch } = wp.data;
const { compose } = wp.compose;

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
		return {
			metaValue: select( 'core/editor' ).getEditedPostAttribute( 'meta' )[ props.metaKey ],
			adminPages: select( 'core' ).getEntityRecords( 'postType', 'admin-page', query ),
		};
	} )
)( function( props ) {
	const choices = [];
	if ( props.adminPages ) {
		choices.push( { value: 0, label: __( 'Select Parent Menu', 'hello-admin' ) } );
		props.adminPages.forEach( ( post ) => {
			choices.push( { value: post.id, label: post.title.rendered } );
		} );
	} else {
		choices.push( { value: 0, label: __( 'Loading', 'hello-admin' ) } );
	}
	return (
		<SelectControl
			options={ choices }
			label={ props.label }
			value={ props.metaValue }
			onChange={ ( value ) => {
				props.setMetaValue( value );
			} }
		/>
	);
} );

export default MetaSelectControl;
