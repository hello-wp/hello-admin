<?php
/**
 * Register admin menu items.
 *
 * @package Hello_Admin_Pages
 */

namespace Hello_Admin_Pages;

/**
 * Class Post_Type.
 */
class Admin_Menu {
	/**
	 * Menu slug prefix.
	 *
	 * @var string
	 */
	public $prefix = 'admin-page-';

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
		add_action( 'admin_menu', [ $this, 'register_menu_items' ] );
		add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_admin_assets' ] );
	}

	/**
	 * Register the custom post type.
	 */
	public function register_menu_items() {
		$admin_pages_query = new \WP_Query(
			[
				'posts_per_page' => 99,
				'post_type'      => hello_admin_pages()->post_type->slug,
			]
		);

		while ( $admin_pages_query->have_posts() ) {
			$admin_pages_query->the_post();
			$menu_position = get_post_meta(
				get_the_ID(),
				hello_admin_pages()->post_type->menu_position_key,
				true
			);

			add_menu_page(
				get_the_title(),
				get_the_title(),
				'read',
				$this->prefix . get_post_field( 'post_name' ),
				[ $this, 'render_menu_page' ],
				'',
				$menu_position
			);
		}

		wp_reset_postdata();
	}

	/**
	 * Enqueue admin assets.
	 */
	public function enqueue_admin_assets() {
		if ( ! is_admin() ) {
			return;
		}

		$version = hello_admin_pages_version();

		// Enqueue block editor styles for backend.
		wp_enqueue_style(
			'hello-admin-pages-admin-css',
			plugins_url( '/build/admin.css', dirname( __FILE__ ) ),
			[],
			$version
		);
	}

	/**
	 * Render the menu page.
	 */
	public function render_menu_page() {
		global $current_screen;
		$slug = substr( $current_screen->parent_base, strlen( $this->prefix ) );
		$post = get_posts(
			[
				'name'           => $slug,
				'post_type'      => hello_admin_pages()->post_type->slug,
				'posts_per_page' => 1,
			]
		)[0];

		wp_enqueue_style( 'wp-block-library' );
		wp_enqueue_style( 'wp-block-library-theme' );

		do_action( 'hello_admin_pages_pre_render_content' );
		$content = apply_filters( 'the_content', $post->post_content );
		$content = apply_filters( 'hello_admin_page_content', $content );

		echo '<div class="wrap hello-admin-pages-wrap">';
		echo '<h1>' . esc_html( get_the_title( $post->ID ) ) . '</h1>';
		echo $content;
		echo '</div>';

		do_action( 'hello_admin_pages_post_render_content' );
	}
}
