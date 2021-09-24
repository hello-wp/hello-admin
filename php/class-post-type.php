<?php
/**
 * Register the Admin Pages custom post type.
 *
 * @package Hello_Admin_Pages
 */

namespace Hello_Admin_Pages;

/**
 * Class Post_Type.
 */
class Post_Type {
	/**
	 * Post type slug.
	 *
	 * @var string
	 */
	public $slug = 'admin-page';

	/**
	 * Menu position meta key.
	 *
	 * @var string
	 */
	public $menu_position_key = 'menu_position';

	/**
	 * Plugin constructor.
	 */
	public function __construct() {
		$this->register_hooks();
	}

	/**
	 * Register any hooks that this class needs.
	 *
	 * @return void
	 */
	public function register_hooks() {
		add_action( 'init', [ $this, 'register_post_type' ] );
		add_action( 'init', [ $this, 'register_post_meta' ] );
		add_action( 'enqueue_block_editor_assets', [ $this, 'enqueue_editor_assets' ] );
		add_action( 'admin_init', [ $this, 'add_caps' ] );
		add_action( 'admin_init', [ $this, 'dequeue_theme_assets' ], 99 );
		add_action( 'admin_init', [ $this, 'dequeue_block_styles' ], 99 );
		add_action( 'admin_init', [ $this, 'dequeue_editor_styles' ], 99 );
		add_action( 'admin_init', [ $this, 'add_editor_color_palette' ], 100 );
	}

	/**
	 * Register the custom post type.
	 */
	public function register_post_type() {
		$labels = [
			'name'               => _x( 'Admin Pages', 'post type general name', 'hello-admin-pages' ),
			'singular_name'      => _x( 'Admin Page', 'post type singular name', 'hello-admin-pages' ),
			'menu_name'          => _x( 'Admin Pages', 'admin menu', 'hello-admin-pages' ),
			'name_admin_bar'     => _x( 'Admin Page', 'add new on admin bar', 'hello-admin-pages' ),
			'add_new'            => _x( 'Add New', 'block', 'hello-admin-pages' ),
			'add_new_item'       => __( 'Add New Admin Page', 'hello-admin-pages' ),
			'new_item'           => __( 'New Admin Page', 'hello-admin-pages' ),
			'edit_item'          => __( 'Edit Admin Page', 'hello-admin-pages' ),
			'view_item'          => __( 'View Admin Page', 'hello-admin-pages' ),
			'all_items'          => __( 'All Admin Pages', 'hello-admin-pages' ),
			'search_items'       => __( 'Search Admin Pages', 'hello-admin-pages' ),
			'parent_item_colon'  => __( 'Parent Admin Pages:', 'hello-admin-pages' ),
			'not_found'          => __( 'No admin pages found.', 'hello-admin-pages' ),
			'not_found_in_trash' => __( 'No admin pages found in Trash.', 'hello-admin-pages' ),
		];

		$args = [
			'labels'        => $labels,
			'public'        => false,
			'show_ui'       => true,
			'show_in_menu'  => true,
			'show_in_rest'  => true,
			'menu_position' => 20,
			'menu_icon'     => 'dashicons-pressthis',
			'query_var'     => true,
			'rewrite'       => [ 'slug' => $this->slug ],
			'hierarchical'  => true,
			'capabilities'  => $this->get_capabilities(),
			'map_meta_cap'  => true,
			'supports'      => [ 'title', 'editor', 'custom-fields' ],
		];

		register_post_type( $this->slug, $args );
	}

	/**
	 * Register the custom post type meta.
	 */
	public function register_post_meta() {
		register_meta(
			'post',
			'menu_position',
			[
				'object_subtype' => $this->slug,
				'type'           => 'integer',
				'single'         => true,
				'show_in_rest'   => true,
			]
		);
	}

	/**
	 * Add custom capabilities
	 */
	public function add_caps() {
		$admin = get_role( 'administrator' );
		if ( ! $admin ) {
			return;
		}

		foreach ( $this->get_capabilities() as $custom_capability ) {
			$admin->add_cap( $custom_capability );
		}
	}

	/**
	 * Gets the mapping of capabilities for the custom post type.
	 *
	 * @return array An associative array of capability key => custom capability value.
	 */
	public function get_capabilities(): array {
		return [
			'edit_post'          => 'edit_admin_page',
			'edit_posts'         => 'edit_admin_pages',
			'edit_others_posts'  => 'edit_others_admin_pages',
			'publish_posts'      => 'publish_admin_pages',
			'read_post'          => 'read_admin_page',
			'read_private_posts' => 'read_private_admin_pages',
			'delete_post'        => 'delete_admin_page',
		];
	}

	/**
	 * Check if the current post is this post type.
	 *
	 * @return bool
	 */
	private function is_current_post_type(): bool {
		global $post;

		$post_type = false;
		$post_id   = filter_input( INPUT_GET, 'post', FILTER_SANITIZE_NUMBER_INT );

		if ( $post ) {
			$post_type = $post->post_type;
		} elseif ( $post_id ) {
			$post_type = get_post_type( $post_id );
		}

		return $post_type === $this->slug;
	}

	/**
	 * Enqueue Gutenberg editor assets.
	 */
	public function enqueue_editor_assets() {
		if ( ! $this->is_current_post_type() ) {
			return;
		}

		$version = hello_admin_pages_version();

		// Enqueue block editor styles for backend.
		wp_enqueue_style(
			'hello-admin-pages-editor-css',
			plugins_url( '/build/editor.css', dirname( __FILE__ ) ),
			[],
			$version
		);

		// Enqueue block editor script.
		wp_enqueue_script(
			'hello-admin-pages-js',
			plugins_url( '/build/plugin.js', dirname( __FILE__ ) ),
			[ 'wp-edit-post', 'wp-element', 'wp-components', 'wp-plugins', 'wp-data' ],
			$version,
			false
		);
	}

	/**
	 * Dequeue theme assets.
	 */
	public function dequeue_theme_assets() {
		if ( ! $this->is_current_post_type() ) {
			return;
		}

		global $wp_styles;

		foreach ( $wp_styles->registered as $handle => $style ) {
			if (
				false !== strpos( $style->src, get_stylesheet_directory_uri() ) ||
				false !== strpos( $style->src, get_template_directory_uri() )
			) {
				wp_dequeue_style( $handle );
			}
		}
	}

	/**
	 * Dequeue editor styles.
	 */
	public function dequeue_editor_styles() {
		if ( ! $this->is_current_post_type() ) {
			return;
		}

		remove_editor_styles();
	}

	/**
	 * Dequeue block styles.
	 */
	public function dequeue_block_styles() {
		if ( ! $this->is_current_post_type() ) {
			return;
		}

		$block_styles = \WP_Block_Styles_Registry::get_instance();
		foreach ( $block_styles->get_all_registered() as $block_name => $block_style ) {
			foreach ( $block_style as $block_style_name => $style_properties ) {
				$block_styles->unregister( $block_name, $block_style_name );
			}
		}

		// Remove support for Block Styles.
		remove_theme_support( 'wp-block-styles' );

		// Remove support for full and wide align images.
		remove_theme_support( 'align-wide' );
	}

	/**
	 * Add editor color palette.
	 */
	public function add_editor_color_palette() {
		if ( ! $this->is_current_post_type() ) {
			return;
		}

		// Editor color palette.
		$black        = '#101517';
		$gray         = '#646970';
		$light_gray   = '#a7aaad';
		$red          = '#d63638';
		$light_red    = '#f86368';
		$blue         = '#2271b1';
		$light_blue   = '#72aee6';
		$yellow       = '#996800';
		$light_yellow = '#f0c33c';
		$white        = '#f6f7f7';

		add_theme_support(
			'editor-color-palette',
			[
				[
					'name'  => esc_html__( 'Blue', 'hello-admin-pages' ),
					'slug'  => 'blue',
					'color' => $blue,
				],
				[
					'name'  => esc_html__( 'Red', 'hello-admin-pages' ),
					'slug'  => 'red',
					'color' => $red,
				],
				[
					'name'  => esc_html__( 'Yellow', 'hello-admin-pages' ),
					'slug'  => 'yellow',
					'color' => $yellow,
				],
				[
					'name'  => esc_html__( 'Light Blue', 'hello-admin-pages' ),
					'slug'  => 'light-blue',
					'color' => $light_blue,
				],
				[
					'name'  => esc_html__( 'Light Red', 'hello-admin-pages' ),
					'slug'  => 'light-red',
					'color' => $light_red,
				],
				[
					'name'  => esc_html__( 'Light Yellow', 'hello-admin-pages' ),
					'slug'  => 'yellow',
					'color' => $light_yellow,
				],
				[
					'name'  => esc_html__( 'Black', 'hello-admin-pages' ),
					'slug'  => 'black',
					'color' => $black,
				],
				[
					'name'  => esc_html__( 'Gray', 'hello-admin-pages' ),
					'slug'  => 'gray',
					'color' => $gray,
				],
				[
					'name'  => esc_html__( 'Light Gray', 'hello-admin-pages' ),
					'slug'  => 'light-gray',
					'color' => $light_gray,
				],
				[
					'name'  => esc_html__( 'White', 'hello-admin-pages' ),
					'slug'  => 'white',
					'color' => $white,
				],
			]
		);
	}
}
