wp.domReady( () => {
	const { removeEditorPanel } = wp.data.dispatch( 'core/edit-post' );
	removeEditorPanel( 'post-status' );

	const isFullscreenMode = wp.data.select( 'core/edit-post' ).isFeatureActive( 'fullscreenMode' );
	if ( isFullscreenMode ) {
		wp.data.dispatch( 'core/edit-post' ).toggleFeature( 'fullscreenMode' );
	};
} );
