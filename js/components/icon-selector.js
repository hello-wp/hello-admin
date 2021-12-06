const { __ } = wp.i18n;
const { useSelect, useDispatch } = wp.data;
import icons from '../../assets/icons';

const IconSelector = ( props ) => {
	const { postMeta } = useSelect( ( select ) => {
		return {
			postMeta: select( 'core/editor' ).getEditedPostAttribute( 'meta' ),
		};
	} );

	const { editPost } = useDispatch( 'core/editor', [ props.metaKey ] );

	const iconClass = ( icon ) => {
		const selected = postMeta.menu_icon === icon ? 'selected' : '';
		return 'icon ' + selected;
	};

	return (
		<div className="hello-admin-icon-container">
			<label htmlFor="hello-admin-icon">{ __( 'Icon:', 'hello-admin' ) }</label>
			<input
				name="hello-admin-icon"
				type="hidden"
				id="hello-admin-icon"
				value={ postMeta.menu_icon || icons.admin_generic } />
			<span id="hello-admin-icon-current">
				{ icons[ postMeta.menu_icon ] || icons.admin_generic }
			</span>
			<a className="button hello-admin-icon-button" id="hello-admin-icon-choose" href="#hello-admin-icon-choose">
				{ __( 'Choose', 'hello-admin' ) }
			</a>
			<a className="button hello-admin-icon-button" id="hello-admin-icon-close" href="#">
				{ __( 'Close', 'hello-admin' ) }
			</a>
			<span className="hello-admin-icon-select" id="hello-admin-icon-select">
				{ Object.entries( icons ).map( ( svg ) => (
					<span
						key={ svg[ 0 ] }
						className={ iconClass( svg[ 0 ] ) }
						onClick={ () => editPost( { meta: { menu_icon: svg[ 0 ] } } ) }
						aria-hidden="true"
					>
						{ svg[ 1 ] }
					</span>
				) ) }
			</span>
		</div>
	);
};

export default IconSelector;
