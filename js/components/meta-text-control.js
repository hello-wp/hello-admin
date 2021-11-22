/**
 * WordPress dependencies.
 */
const { TextControl } = wp.components;
const { useSelect, useDispatch } = wp.data;

const MetaTextControl = ( function( props ) {
	const { postMeta } = useSelect( ( select ) => {
		return {
			postMeta: select( 'core/editor' ).getEditedPostAttribute( 'meta' ),
		};
	} );

	const { editPost } = useDispatch( 'core/editor', [ props.metaKey ] );

	return (
		<TextControl
			type={ props.type }
			label={ props.label }
			value={ postMeta[ props.metaKey ] }
			onChange={ ( value ) => editPost( { meta: { [ props.metaKey ]: value } } ) }
		/>
	);
} );

export default MetaTextControl;
