<script>
	import '../app.css';
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { theme, toggleTheme } from '$lib/stores/theme';

	let navIntroTl;
	let mobileMenuOpen = false;
	let currentTheme = 'dark';

	// Subscribe to theme store
	$: currentTheme = $theme;

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	function closeMobileMenu() {
		mobileMenuOpen = false;
	}

	onMount(() => {
		// Set initial theme attribute
		document.documentElement.setAttribute('data-theme', $theme);

		navIntroTl = gsap.timeline({ paused: true });

		navIntroTl.from('nav', {
			yPercent: -100,
			duration: 0.8,
			ease: 'power3.out'
		});

		navIntroTl.from(
			['.logo', '.nav-links li', '.nav-right'],
			{
				y: 30,
				opacity: 0,
				duration: 0.6,
				ease: 'power3.out',
				stagger: 0.2
			},
			0.6
		);

		function startNavAnimation() {
			navIntroTl.play();
		}

		document.addEventListener('preloaderFinished', startNavAnimation);

		return () => {
			document.removeEventListener('preloaderFinished', startNavAnimation);
		};
	});
</script>

<nav>
	<div class="logo">
		<a href="/">Azore<span>Dev</span></a>
	</div>

	<!-- Desktop Navigation -->
	<ul class="nav-links desktop-nav">
		<li><a href="/#home">Home</a></li>
		<li><a href="/#about">Skills</a></li>
		<li><a href="/#achievements">Awards</a></li>
		<li><a href="/#projects">Projects</a></li>
	</ul>

	<div class="nav-right">
		<button class="theme-toggle" aria-label="Toggle dark mode" on:click={toggleTheme}>
			{#if currentTheme === 'dark'}
				<i class="fas fa-moon"></i>
			{:else}
				<i class="fas fa-sun"></i>
			{/if}
		</button>
		<a href="/#contact" class="contact-button desktop-only">Hire Me</a>

		<!-- Mobile Hamburger -->
		<button
			class="hamburger"
			class:active={mobileMenuOpen}
			aria-label="Toggle menu"
			on:click={toggleMobileMenu}
			on:mouseenter={() => mobileMenuOpen = true}
		>
			<span></span>
			<span></span>
			<span></span>
		</button>
	</div>
</nav>

<!-- Mobile Menu Overlay -->
{#if mobileMenuOpen}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="mobile-menu-overlay" on:click={closeMobileMenu}></div>
{/if}

<!-- Mobile Dropdown Menu -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div 
	class="mobile-menu" 
	class:open={mobileMenuOpen}
	on:mouseenter={() => mobileMenuOpen = true}
	on:mouseleave={closeMobileMenu}
>
	<ul class="mobile-nav-links">
		<li><a href="/#home" on:click={closeMobileMenu}>Home</a></li>
		<li><a href="/#about" on:click={closeMobileMenu}>About</a></li>
		<li><a href="/#achievements" on:click={closeMobileMenu}>Awards</a></li>
		<li><a href="/#projects" on:click={closeMobileMenu}>Projects</a></li>
	</ul>
	<a href="/#contact" class="contact-button mobile-cta" on:click={closeMobileMenu}>Hire Me</a>
</div>

<main>
	<slot />
</main>

<style>
	:global(html) {
		scroll-behavior: smooth;
	}

	:global(body) {
		background-color: var(--bg-primary);
		background-image: linear-gradient(to right, var(--grid-color) 1px, transparent 1px),
			linear-gradient(to bottom, var(--grid-color) 1px, transparent 1px);
		background-size: 50px 50px;
		min-height: 100vh;
		color: var(--text-primary);
	}

	nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 2.5rem;
		font-family: 'Poppins', sans-serif;
		background-color: var(--bg-nav);
		backdrop-filter: blur(10px);
		position: sticky;
		top: 0;
		z-index: 50;
		width: 100%;
		box-sizing: border-box;
		border-bottom: 1px solid var(--border-light);
	}

	.logo a {
		font-size: 1.75rem;
		font-weight: 700;
		color: var(--text-primary);
		text-decoration: none;
	}

	.logo a span {
		color: var(--accent-primary);
	}

	.nav-links {
		display: flex;
		list-style: none;
		margin: 0;
		padding: 0;
		gap: 2.5rem;
	}

	.nav-links a {
		color: var(--text-primary);
		text-decoration: none;
		font-size: 1.1rem;
		font-weight: 500;
		transition: color 0.3s ease;
		position: relative;
		padding-bottom: 5px;
	}

	.nav-links a::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 2px;
		background-color: var(--accent-primary);
		transform: scaleX(0);
		transform-origin: bottom right;
		transition: transform 0.3s ease-out;
	}

	.nav-links a:hover {
		color: var(--accent-primary);
	}

	.nav-links a:hover::after {
		transform: scaleX(1);
		transform-origin: bottom left;
	}

	.nav-right {
		display: flex;
		align-items: center;
		gap: 1.5rem;
	}

	.theme-toggle {
		background: none;
		border: none;
		color: var(--text-primary);
		font-size: 1.5rem;
		cursor: pointer;
		transition: color 0.3s ease, transform 0.3s ease;
		padding: 0.5rem;
	}

	.theme-toggle:hover {
		color: var(--accent-primary);
		transform: rotate(15deg);
	}

	a.contact-button {
		background-color: #a0acff;
		color: #0d0d2e;
		text-decoration: none;
		font-weight: 600;
		padding: 0.75rem 1.5rem;
		border-radius: 50px;
		transition: all 0.3s ease;
	}

	.contact-button:hover {
		background-color: #a0acff;
		transform: translateY(-2px);
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
	}

	/* Hamburger Menu Button */
	.hamburger {
		display: none;
		flex-direction: column;
		justify-content: space-around;
		width: 28px;
		height: 24px;
		background: transparent;
		border: none;
		cursor: pointer;
		padding: 0;
		z-index: 100;
	}

	.hamburger span {
		width: 100%;
		height: 3px;
		background-color: var(--text-primary);
		border-radius: 3px;
		transition: all 0.3s ease;
		transform-origin: center;
	}

	.hamburger.active span:nth-child(1) {
		transform: rotate(45deg) translate(6px, 6px);
	}

	.hamburger.active span:nth-child(2) {
		opacity: 0;
	}

	.hamburger.active span:nth-child(3) {
		transform: rotate(-45deg) translate(6px, -6px);
	}

	/* Mobile Menu Overlay */
	.mobile-menu-overlay {
		display: none;
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
		z-index: 40;
	}

	/* Mobile Slide-out Menu */
	/* Mobile Dropdown Menu */
	.mobile-menu {
		display: none;
		position: fixed;
		top: 60px; /* Aligned with bottom of nav */
		right: 10px; /* "Most right" positioning with slight padding */
		left: auto;
		width: 180px; /* slightly wider for better breathability */
		height: auto;
		background-color: var(--bg-nav); /* Uses uniform nav bg */
		z-index: 100;
		padding: 1rem 0.5rem; /* Vertical padding */
		border: 1px solid var(--border-light);
		border-radius: 16px; /* Modern cleaner curve */
		box-shadow: 
            0 10px 40px rgba(0, 0, 0, 0.2),
            0 0 0 1px rgba(255, 255, 255, 0.05); /* Inner stroke detail */
		backdrop-filter: blur(20px); /* Heavy glass effect */
        -webkit-backdrop-filter: blur(20px);
		
		/* Dropdown Animation */
		transform: translateY(-10px) scale(0.95);
        transform-origin: top right;
		opacity: 0;
		visibility: hidden;
		transition: all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
	}

	.mobile-menu.open {
		transform: translateY(0) scale(1);
		opacity: 1;
		visibility: visible;
		right: 10px;
	}



	.mobile-nav-links {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.mobile-nav-links li {
		margin-bottom: 0.2rem;
        width: 100%;
	}

	.mobile-nav-links a {
		color: var(--text-primary);
		text-decoration: none;
		font-size: 0.95rem;
		font-weight: 500;
		transition: all 0.2s ease;
        display: block;
        padding: 0.6rem 1rem;
        border-radius: 8px;
        background: transparent;
        text-align: center;
	}

	.mobile-nav-links a:hover {
		color: var(--accent-primary);
        background: rgba(var(--accent-primary-rgb, 255, 62, 0), 0.1); 
        /* Fallback if rgb var not defined, assumes orange-ish tint */
        background: var(--bg-card-hover);
	}

	.mobile-cta {
		display: block;
		text-align: center;
		margin-top: 0.8rem;
        font-size: 0.9rem;
        padding: 0.6rem 1rem;
        width: 90%;
        margin-left: auto;
        margin-right: auto;
	}

	main {
		display: block;
		background-color: transparent;
	}

	/* Responsive Styles */
	@media (max-width: 768px) {
		nav {
			padding: 1rem 1.5rem;
		}

		.desktop-nav {
			display: none;
		}

		.desktop-only {
			display: none;
		}

		.hamburger {
			display: flex;
		}

		.mobile-menu-overlay {
			display: block;
		}

		.mobile-menu {
			display: block;
		}
	}

	@media (max-width: 480px) {
		.logo a {
			font-size: 1.4rem;
		}

		nav {
			padding: 0.8rem 1rem;
		}
	}
</style>