/**
 * Remember the default Fullscreen feature setting, so we can restore it when this page unloads.
 */
let fullscreenDefault = false;

wp.domReady( () => {
	removeEditorPanel();
	disableFullscreenMode();
} );

window.onbeforeunload = () => {
	restoreDefaultFullscreenMode();
};

/**
 * Disable the "Status & visibility" section in the inspector.
 */
const removeEditorPanel = () => {
	wp.data.dispatch( 'core/edit-post' ).removeEditorPanel( 'post-status' );
};

/**
 * Disable the Fullscreen feature.
 */
const disableFullscreenMode = () => {
	const isFullscreenMode = wp.data.select( 'core/edit-post' ).isFeatureActive( 'fullscreenMode' );
	fullscreenDefault = isFullscreenMode;
	if ( isFullscreenMode ) {
		wp.data.dispatch( 'core/edit-post' ).toggleFeature( 'fullscreenMode' );
	};
};

/**
 * Restore the default Fullscreen feature setting.
 */
const restoreDefaultFullscreenMode = () => {
	const isFullscreenMode = wp.data.select( 'core/edit-post' ).isFeatureActive( 'fullscreenMode' );
	if ( fullscreenDefault !== isFullscreenMode ) {
		wp.data.dispatch( 'core/edit-post' ).toggleFeature( 'fullscreenMode' );
	}
};
