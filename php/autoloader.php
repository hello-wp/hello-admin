<?php
/**
 * Plugin Autoloader
 *
 * @package   Hello_Admin
 */

/**
 * Register Autoloader
 */
spl_autoload_register(
	function ( $class ) {
		// Assume we're using namespaces (because that's how the plugin is structured).
		$namespace = explode( '\\', $class );
		$root      = array_shift( $namespace );

		// If we're not in the plugin's namespace then just return.
		if ( 'Hello_Admin' !== $root ) {
			return;
		}

		// Class name is the last part of the FQN.
		$class_name = array_pop( $namespace );
		$filename   = 'class-' . $class_name . '.php';

		// For file naming, the namespace is everything but the class name and the root namespace.
		$namespace = trim( implode( DIRECTORY_SEPARATOR, $namespace ) );

		// Because WordPress file naming conventions are odd.
		$filename  = strtolower( str_replace( '_', '-', $filename ) );
		$namespace = strtolower( str_replace( '_', '-', $namespace ) );

		// Get the path to our files.
		$directory = dirname( __FILE__ );
		if ( ! empty( $namespace ) ) {
			$directory .= DIRECTORY_SEPARATOR . $namespace;
		}

		$file = $directory . DIRECTORY_SEPARATOR . $filename;

		if ( file_exists( $file ) ) {
			require_once $file;
		}
	}
);
