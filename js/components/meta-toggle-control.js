/**
 * WordPress dependencies.
 */
const { ToggleControl } = wp.components;
const { useSelect, useDispatch } = wp.data;

const MetaToggleControl = ( function( props ) {
	const { postMeta } = useSelect( ( select ) => {
		return {
			postMeta: select( 'core/editor' ).getEditedPostAttribute( 'meta' ),
		};
	} );

	const { editPost } = useDispatch( 'core/editor', [ props.metaKey ] );
	return (
		<ToggleControl
			label={ props.label }
			checked={ postMeta[ props.metaKey ] }
			onChange={ ( value ) => editPost( { meta: { [ props.metaKey ]: value } } ) }
		/>
	);
} );

export default MetaToggleControl;
