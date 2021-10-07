<?php
/**
 * Plugin Name: Hello Admin
 * Plugin URI: https://github.com/hello-charts/hello-admin/
 * Description: Bring block editor content to the WordPress admin.
 * Author: Hello WP
 * Author URI: https://github.com/hello-charts/
 * Version: 1.3.2
 * License: GPL2+
 * License URI: https://www.gnu.org/licenses/gpl-2.0.txt
 *
 * @package Hello_Admin
 */

use Hello_Admin\Plugin;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Set up the plugin autoloader.
require_once 'php/autoloader.php';

/**
 * Get plugin version.
 *
 * @return string
 */
function hello_admin_version(): string {
	return '1.0.0';
}

/**
 * Initializer.
 *
 * @return Plugin
 */
function hello_admin(): Plugin {
	static $instance;

	if ( null === $instance ) {
		$instance = new Plugin();
	}

	return $instance;
}

hello_admin();
