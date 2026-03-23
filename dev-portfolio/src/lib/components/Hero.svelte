<script>
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';

	import profilePic from '$lib/assets/mez.jpg';
	import peacePic from '$lib/assets/pice.jpg';

	let heroText;
	let profileImage;
	let isHovered = false;
	let heroIntroTl; // The reusable timeline
	let showModal = false;
	const cvAvailable = false; // Set to true when CV is uploaded

	function handleDownloadClick(event) {
		if (!cvAvailable) {
			event.preventDefault();
			showModal = true;
		}
	}

	function closeModal() {
		showModal = false;
	}

	onMount(() => {
		gsap.registerPlugin(ScrambleTextPlugin);
		gsap.registerPlugin(ScrollTrigger);

		// --- 1. SETUP HERO ELEMENTS ---
		const scrambleElements = gsap.utils.toArray(heroText.querySelectorAll('.greeting, .name'));
		const titleElement = heroText.querySelector('.title');
		const imageWrapper = profileImage.closest('.profile-image-wrapper');
		const allHeroElements = [heroText, imageWrapper];

		// --- 2. CREATE REUSABLE HERO INTRO TIMELINE ---
		heroIntroTl = gsap.timeline({
			paused: true,
			onComplete: () => {
				introFinished = true;
			}
		});

		// A. Set initial states
		heroIntroTl.set(scrambleElements, { textContent: ' ' });
		heroIntroTl.set(titleElement, { opacity: 0, y: 30 });
		heroIntroTl.set(imageWrapper, { opacity: 0, scale: 0.8 });

		// B. Animate scramble elements in
		heroIntroTl.to(
			scrambleElements,
			{
				duration: 2.5, // Your longer duration
				scrambleText: {
					text: (index) => scrambleElements[index].getAttribute('data-text'),
					chars: 'abcdefghijklmnopqrstuvwxyz1234567890',
					ease: 'none'
				},
				stagger: 0.2
			},
			0
		);

		// C. Animate title element in
		heroIntroTl.to(
			titleElement,
			{
				opacity: 1,
				y: 0,
				duration: 0.8,
				ease: 'power3.out'
			},
			0.2
		);

		// D. Animate image in
		heroIntroTl.to(
			imageWrapper,
			{
				opacity: 1,
				scale: 1,
				duration: 1,
				ease: 'power3.out'
			},
			0.1
		);

		// --- 3. TRIGGER INTRO ON LOAD (After "preloader") ---
		function startHeroAnimation() {
			heroIntroTl.play();
		}
		// Listen for the custom event from app.html
		document.addEventListener('preloaderFinished', startHeroAnimation);

		// --- 4. CREATE ON-SCROLL FADE-OUT & SCRAMBLE-IN ---
		const fadeOutTl = gsap.to(allHeroElements, {
			opacity: 0,
			y: -50,
			stagger: 0.1,
			duration: 0.5,
			ease: 'power2.out',
			paused: true
		});

		ScrollTrigger.create({
			trigger: '.hero-section',
			start: 'bottom 70%',
			onEnter: () => fadeOutTl.play(),
			onLeaveBack: () => {
				fadeOutTl.reverse();
				// heroIntroTl.restart(); // Don't restart fully to verify stable state

				// Ensure opacity is back to 1 if we reversed
			}
		});

		// Add Svelte's cleanup function for the event listener
		return () => {
			document.removeEventListener('preloaderFinished', startHeroAnimation);
		};
	});

	let introFinished = false;

	function scramble(event) {
		if (!introFinished) return; // Prevent overwriting intro animation

		const element = event.currentTarget;
		const originalText = element.getAttribute('data-text');

		gsap.to(element, {
			duration: 0.8,
			scrambleText: {
				text: originalText,
				chars: 'abcdefghijklmnopqrstuvwxyz1234567890',
				ease: 'none'
			},
			overwrite: 'auto' // Use auto to overlap safely if needed
		});
	}
</script>

<div class="hero-section" id="home">
	<div class="hero-text" bind:this={heroText}>
		<p class="greeting" data-text="Hello, I'm" on:mouseenter={scramble}>Hello, I'm</p>
		<h1 class="name" data-text="Mark Joseph M. Potot" on:mouseenter={scramble}>
			Mark Joseph M. Potot
		</h1>
		<p class="title" data-text="A Full Stack Developer" on:mouseenter={scramble}>
			A <span class="highlight">Full Stack Developer</span>
		</p>
		<p class="quote">"Herding semicolons and wrangling bugs until your ideas are a reality."</p>

		<div class="hero-buttons">
			<a href="/" download class="hero-button primary-button" on:click={handleDownloadClick}>
				<i class="fas fa-download"></i> Download CV
			</a>
			<a href="/#contact" class="hero-button secondary-button">
				<i class="fas fa-envelope"></i> Contact Me
			</a>
		</div>
	</div>

	<div
		class="profile-image-wrapper"
		role="img"
		aria-label="Profile picture"
		on:mouseenter={() => (isHovered = true)}
		on:mouseleave={() => (isHovered = false)}
	>
		<img
			src={isHovered ? peacePic : profilePic}
			alt="Your Profile"
			bind:this={profileImage}
			class="profile-image"
		/>
	</div>
</div>

<!-- CV Not Available Modal -->
<!-- svelte-ignore a11y_interactive_supports_focus -->
{#if showModal}
	<!-- svelte-ignore a11y_interactive_supports_focus -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		class="modal-overlay"
		on:click={closeModal}
		role="dialog"
		aria-modal="true"
		aria-labelledby="modal-title"
	>
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<div class="modal-content" on:click|stopPropagation role="document">
			<button class="modal-close" on:click={closeModal} aria-label="Close modal">
				<i class="fas fa-times"></i>
			</button>

			<div class="modal-icon">
				<i class="fas fa-file-pdf"></i>
			</div>

			<h2 id="modal-title" class="modal-title">CV Coming Soon!</h2>

			<p class="modal-message">
				I'm currently polishing my CV to showcase my best work. In the meantime, feel free to
				explore my projects or reach out directly!
			</p>

			<div class="modal-buttons">
				<a href="/#projects" class="modal-btn secondary" on:click={closeModal}>
					<i class="fas fa-folder-open"></i> View Projects
				</a>
				<a href="/#contact" class="modal-btn primary" on:click={closeModal}>
					<i class="fas fa-envelope"></i> Contact Me
				</a>
			</div>
		</div>
	</div>
{/if}

<style>
	/* All your Hero and Button styles go here */
	.hero-section {
		display: grid;
		grid-template-columns: 1fr 1fr;
		align-items: center;
		min-height: calc(100vh - 4rem);
		padding: 2rem 5%;
		box-sizing: border-box;
		gap: 3rem;
		font-family: 'Poppins', sans-serif;
		background-color: transparent; /* Background handles by body */
	}
	.hero-text {
		max-width: 645px;
		text-align: left;
	}
	.greeting {
		font-size: 1.5rem;
		margin-bottom: 0.5rem;
		color: var(--text-muted);
	}
	.name {
		font-size: 2.7rem;
		font-weight: 800;
		margin-top: 0;
		margin-bottom: 0.5rem;
		line-height: 1.1;
		color: var(--accent-primary);

		cursor: pointer;
	}
	.title {
		font-size: 2rem;
		font-weight: 600;
		margin-bottom: 1rem;
		color: var(--text-primary);
		cursor: pointer;
	}
	.highlight {
		color: var(--accent-secondary);
	}
	.quote {
		font-size: 1.1rem;
		font-style: italic;
		color: var(--text-secondary);
		line-height: 1.6;
		margin-bottom: 2rem;
	}
	.profile-image-wrapper {
		width: 400px;
		height: 400px;
		border-radius: 50%;
		overflow: hidden;
		box-shadow: 0 0 35px rgba(var(--accent-primary), 0.2);
		transition:
			transform 0.5s ease-in-out,
			box-shadow 0.5s ease-in-out,
			border-color 0.5s ease-in-out;
		justify-self: center;
	}

	.profile-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		transition: transform 0.5s ease-in-out;
	}

	.profile-image-wrapper:hover .profile-image {
		cursor: pointer;
	}

	.hero-buttons {
		display: flex;
		gap: 1.5rem;
		margin-top: 2rem;
		flex-wrap: wrap;
	}

	.hero-button {
		display: inline-flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.9rem 1.8rem;
		border-radius: 50px;
		font-weight: 600;
		font-size: 1rem;
		text-decoration: none;
		transition:
			background-color 0.3s ease,
			transform 0.2s ease,
			box-shadow 0.3s ease,
			color 0.3s ease;
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
	}

	.hero-button i {
		font-size: 1.2em;
	}

	.primary-button {
		background-color: var(--accent-primary);
		color: white;
		border: 2px solid var(--accent-primary);
	}

	.primary-button:hover {
		background-color: var(--bg-primary);
		color: var(--accent-primary);
		transform: translateY(-3px);
		box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
	}

	.secondary-button {
		background-color: transparent;
		color: var(--accent-secondary);
		border: 2px solid var(--accent-secondary);
	}

	.secondary-button:hover {
		background-color: var(--accent-secondary);
		color: var(--bg-primary); /* Contrast text */
		transform: translateY(-3px);
		box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
	}

	@media (max-width: 900px) {
		.hero-section {
			grid-template-columns: 1fr;
			text-align: center;
			min-height: auto;
			padding-top: 4rem;
		}
		.hero-text {
			order: 2;
			text-align: center;
			align-items: center;
			margin: 0 auto;
		}
		.hero-buttons {
			justify-content: center;
		}
		.profile-image-wrapper {
			order: 1;
			width: 250px;
			height: 250px;
		}
		.name {
			font-size: 2.5rem;
		}
		.title {
			font-size: 1.5rem;
		}
	}

	@media (max-width: 480px) {
		.hero-buttons {
			flex-direction: column;
			align-items: center;
			width: 100%;
		}
		.hero-button {
			width: 100%;
			justify-content: center;
			box-sizing: border-box;
		}
		.name {
			font-size: 1.7rem;
		}
		.profile-image-wrapper {
			width: 200px;
			height: 200px;
		}
	}

	/* Modal Styles */
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.7);
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		animation: fadeIn 0.3s ease-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.modal-content {
		background: linear-gradient(145deg, rgba(30, 30, 40, 0.95), rgba(20, 20, 30, 0.98));
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 24px;
		padding: 3rem;
		max-width: 450px;
		width: 90%;
		text-align: center;
		position: relative;
		box-shadow:
			0 25px 50px -12px rgba(0, 0, 0, 0.5),
			0 0 0 1px rgba(255, 255, 255, 0.05),
			inset 0 1px 0 rgba(255, 255, 255, 0.1);
		animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
	}

	@keyframes slideUp {
		from {
			opacity: 0;
			transform: translateY(30px) scale(0.95);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	.modal-close {
		position: absolute;
		top: 1rem;
		right: 1rem;
		background: rgba(255, 255, 255, 0.1);
		border: none;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		cursor: pointer;
		color: var(--text-muted);
		font-size: 1.1rem;
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.modal-close:hover {
		background: rgba(255, 255, 255, 0.2);
		color: var(--text-primary);
		transform: rotate(90deg);
	}

	.modal-icon {
		width: 80px;
		height: 80px;
		margin: 0 auto 1.5rem;
		background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 2rem;
		color: white;
		box-shadow: 0 10px 30px rgba(99, 102, 241, 0.3);
		animation: pulse 2s infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			box-shadow: 0 10px 30px rgba(99, 102, 241, 0.3);
		}
		50% {
			box-shadow: 0 10px 40px rgba(99, 102, 241, 0.5);
		}
	}

	.modal-title {
		font-size: 1.8rem;
		font-weight: 700;
		color: white;
		margin-bottom: 1rem;
		background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.modal-message {
		color: white;
		font-size: 1rem;
		line-height: 1.7;
		margin-bottom: 2rem;
	}

	.modal-buttons {
		display: flex;
		gap: 1rem;
		justify-content: center;
		flex-wrap: wrap;
	}

	.modal-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.8rem 1.5rem;
		border-radius: 50px;
		font-weight: 600;
		font-size: 0.95rem;
		text-decoration: none;
		transition: all 0.3s ease;
		cursor: pointer;
	}

	.modal-btn.primary {
		background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
		color: white;
		border: none;
		box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
	}

	.modal-btn.primary:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
	}

	.modal-btn.secondary {
		background: rgba(255, 255, 255, 0.1);
		color: white;
		border: 1px solid rgba(255, 255, 255, 0.2);
	}

	.modal-btn.secondary:hover {
		background: rgba(255, 255, 255, 0.15);
		transform: translateY(-2px);
	}

	@media (max-width: 480px) {
		.modal-content {
			padding: 2rem 1.5rem;
		}

		.modal-buttons {
			flex-direction: column;
		}

		.modal-btn {
			width: 100%;
			justify-content: center;
		}
	}
</style>
