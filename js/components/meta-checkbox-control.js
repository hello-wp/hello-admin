/**
 * WordPress dependencies.
 */
const { CheckboxControl } = wp.components;
const { useSelect, useDispatch } = wp.data;

const MetaCheckboxControl = ( function( props ) {
	const { postMeta } = useSelect( ( select ) => {
		return {
			postMeta: select( 'core/editor' ).getEditedPostAttribute( 'meta' ),
		};
	} );

	const { editPost } = useDispatch( 'core/editor', [ props.metaKey ] );

	const hasRole = ( role, selectedRoles ) => {
		return selectedRoles.includes( role );
	};

	const updateRoles = ( selected, value ) => {
		let roles = postMeta[ props.metaKey ];
		if ( selected ) {
			if ( roles.includes( value ) ) {
				return;
			}
			roles.push( value );
			editPost( { meta: { [ props.metaKey ]: roles } } );
		} else {
			roles = roles.filter( ( role ) => role !== value );
			editPost( { meta: { [ props.metaKey ]: roles } } );
		}
	};

	if ( ! props.options ) {
		return <></>;
	}

	return (
		props.options.map( ( option ) => (
			<CheckboxControl
				key={ option.value }
				label={ option.label }
				checked={ hasRole( option.value, postMeta[ props.metaKey ] ) }
				onChange={ ( selected ) => updateRoles( selected, option.value ) }
			/>
		) )

	);
} );

export default MetaCheckboxControl;
