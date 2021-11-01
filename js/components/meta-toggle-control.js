/**
 * WordPress dependencies.
 */
const { ToggleControl } = wp.components;
const { withSelect, withDispatch } = wp.data;
const { compose } = wp.compose;

const MetaToggleControl = compose(
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
		<ToggleControl
			label={ props.label }
			checked={ props.metaValue }
			onChange={ ( value ) => {
				props.setMetaValue( value );
			} }
		/>
	);
} );

export default MetaToggleControl;
