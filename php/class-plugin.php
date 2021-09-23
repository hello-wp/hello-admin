<?php
/**
 * Primary plugin file.
 *
 * @package Hello_Admin_Pages
 */

namespace Hello_Admin_Pages;

/**
 * Class Plugin.
 */
class Plugin {
	/**
	 * Admin Pages post type.
	 *
	 * @var Post_Type
	 */
	public $post_type;

	/**
	 * Admin Menu.
	 *
	 * @var Admin_Menu
	 */
	public $admin_menu;

	/**
	 * Plugin constructor.
=	 */
	public function __construct() {
		$this->post_type  = new Post_Type();
		$this->admin_menu = new Admin_Menu();
	}
}
