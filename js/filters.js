wp.domReady( () => {
	const { removeEditorPanel } = wp.data.dispatch( 'core/edit-post' );

	removeEditorPanel( 'post-status' );
} );
