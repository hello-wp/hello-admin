/**
 * WordPress dependencies.
 */
const { TextControl } = wp.components;
const { withSelect, withDispatch } = wp.data;
const { compose } = wp.compose;

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

export default MetaTextControl;
