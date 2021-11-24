/**
 * WordPress dependencies.
 */
const { SelectControl } = wp.components;
const { useSelect, useDispatch } = wp.data;

const MetaSelectControl = ( function( props ) {
	const { postMeta } = useSelect( ( select ) => {
		return {
			postMeta: select( 'core/editor' ).getEditedPostAttribute( 'meta' ),
		};
	} );

	const { editPost } = useDispatch( 'core/editor', [ props.metaKey ] );

	return (
		<SelectControl
			options={ props.options }
			label={ props.label }
			value={ postMeta[ props.metaKey ] }
			onChange={ ( value ) => editPost( { meta: { [ props.metaKey ]: value } } ) }
		/>
	);
} );

export default MetaSelectControl;
