<script lang="ts">
	// Import the data and the new types
	import {
		achievementGroups,
		type AchievementItem
	} from '$lib/data/achievements';
	import { onMount, tick } from 'svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';

	// --- Bindings for Animations (Typed) ---
	let modalBackdrop: HTMLDivElement;
	let modalContent: HTMLDivElement;
	let achievementSection: HTMLElement;

	// --- State Variables (Typed) ---
	let selectedAchievement: AchievementItem | null = null;
	let isFullscreen: boolean = false;

	// --- Helper Function (Typed) ---
	/** Creates a CSS-friendly class name from a string */
	function slugify(text: string): string {
		return text
			.toLowerCase()
			.replace(/\s+/g, '-') // Replace spaces with -
			.replace(/[^\w-]+/g, ''); // Remove all non-word chars
	}

	// --- Lifecycle ---
	onMount(async () => {
		gsap.registerPlugin(ScrollTrigger);

		await tick();

		// Type the items array
		const items: HTMLElement[] = gsap.utils.toArray('.shelf-item');

		// --- GSAP MatchMedia for Responsive Animations ---
		ScrollTrigger.matchMedia({
			// Desktop: Fancy Scatter & Hover
			"(min-width: 769px)": function() {
				// Setup Hover Effects
				items.forEach((item, index) => {
					gsap.set(item, { zIndex: items.length - index });
					const hoverTimeline = gsap.timeline({ paused: true })
						.to(item, {
							rotation: 0,
							x: 0,
							y: -40,
							scale: 1.1,
							zIndex: 999,
							duration: 0.3,
							ease: 'power2.out'
						})
						.to(item.querySelector('.item-frame'), {
							boxShadow: '0 25px 30px rgba(0,0,0,0.4)',
							duration: 0.3,
							ease: 'power2.out'
						}, 0);
					
					item.addEventListener('mouseenter', () => hoverTimeline.play());
					item.addEventListener('mouseleave', () => hoverTimeline.reverse());
				});

				// Scatter Entrance
				gsap.from(items, {
					opacity: 0,
					scale: 0.5,
					y: () => 100 + gsap.utils.random(-50, 50),
					rotation: () => gsap.utils.random(-25, 25),
					x: () => gsap.utils.random(-50, 50),
					duration: 0.8,
					ease: 'back.out(1.4)',
					stagger: 0.05,
					scrollTrigger: {
						trigger: '.all-shelves-container',
						start: 'top 80%',
						toggleActions: 'play none none none'
					}
				});
			},

			// Mobile: Simple Grid Fade In (Organized)
			"(max-width: 768px)": function() {
				gsap.from(items, {
					opacity: 0,
					y: 30, // Simply slide up
					duration: 0.5,
					stagger: 0.1,
					scale: 0.9,
					ease: 'power2.out',
					scrollTrigger: {
						trigger: '.all-shelves-container',
						start: 'top 85%',
						toggleActions: 'play none none reverse'
					}
				});
			}
		});
	});

	// --- Modal Functions (Typed) ---
	async function openModal(item: AchievementItem): Promise<void> {
		selectedAchievement = item;
		// Lock body scroll
		document.body.style.overflow = 'hidden';
		await tick();
		modalContent.focus(); // Focus the modal content
		gsap.timeline()
			.to(modalBackdrop, {
				opacity: 1,
				duration: 0.3,
				ease: 'power2.inOut'
			})
			.from(
				modalContent,
				{
					opacity: 0,
					y: 50,
					scale: 0.95,
					duration: 0.4,
					ease: 'power3.out'
				},
				'-=0.2'
			);
	}

	function closeModal(): void {
		isFullscreen = false;
		// Unlock body scroll
		document.body.style.overflow = '';
		gsap.timeline({
			onComplete: () => {
				selectedAchievement = null;
			}
		})
			.to(modalContent, {
				opacity: 0,
				y: 50,
				scale: 0.95,
				duration: 0.3,
				ease: 'power3.in'
			})
			.to(
				modalBackdrop,
				{
					opacity: 0,
					duration: 0.3,
					ease: 'power2.inOut'
				},
				'-=0.2'
			);
	}

	function toggleFullscreen(): void {
		isFullscreen = !isFullscreen;
	}

	function handleModalKeydown(e: KeyboardEvent): void {
		if (e.key === 'Escape') {
			if (isFullscreen) {
				toggleFullscreen();
			} else {
				closeModal();
			}
		}
	}
</script>

<section class="achievements-section" id="achievements" bind:this={achievementSection}>
	<h2>Achievements</h2>

<div class="all-shelves-container">
    {#each achievementGroups as group (group.category)}
        <div class="shelf-unit {slugify(group.category)}">
            
            <div class="achievement-shelf">
                {#each group.items as item (item.title)}
                    <!-- svelte-ignore a11y_consider_explicit_label -->
                    <button
                        type="button"
                        class="shelf-item"
                        on:click={() => openModal(item)}
                    >
                        <div class="item-frame">
                            <div
                                class="item-thumbnail"
                                style="background-image: url({item.image})"
                                title="View {item.title}"
                            ></div>
                        </div>
                    </button>
                {/each}
            </div>

            <div class="shelf-base">
                <span class="shelf-label">{group.category}</span>
            </div>
        </div>
    {/each}
</div>
</section>

{#if selectedAchievement}
	<!-- svelte-ignore a11y_interactive_supports_focus -->
	<div
		class="modal-backdrop"
		bind:this={modalBackdrop}
		on:click={closeModal}
		role="dialog"
		aria-modal="true"
		on:keydown={handleModalKeydown}
	>
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div
			class="modal-content"
			bind:this={modalContent}
			on:click|stopPropagation
			role="document"
			tabindex="-1"
		>
			<div class="modal-header-sticky">
				<button class="close-btn" on:click={closeModal} title="Close"> &times; </button>
			</div>

			<div class="modal-body">
				<!-- svelte-ignore a11y_click_events_have_key_events -->
  				<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
				<img
					src={selectedAchievement.image}
					alt="Certificate for {selectedAchievement.title}"
					on:click={toggleFullscreen}
					style="cursor: zoom-in;"
				/>

				<h3>{selectedAchievement.title}</h3>
				<p><strong>Issuer:</strong> {selectedAchievement.issuer}</p>
				<p><strong>Date:</strong> {selectedAchievement.date}</p>
			</div>
		</div>
	</div>

	{#if isFullscreen}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<div 
		class="code-fullscreen-backdrop" 
		on:click={toggleFullscreen}
		role="dialog"
		aria-modal="true"
		tabindex="-1"
		>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<div class="fullscreen-image-container" on:click|stopPropagation role="document">
			<img 
			src={selectedAchievement.image} 
			alt="Fullscreen Certificate" 
			class="fullscreen-image"
			/>
			<button class="fullscreen-close" on:click={toggleFullscreen}>&times;</button>
		</div>
		</div>
	{/if}
{/if}

<style>
	.achievements-section {
		min-height: 100vh;
		padding: 5rem 5%;
		box-sizing: border-box;
		font-family: 'Poppins', sans-serif;
		text-align: center;
		display: flex;
		flex-direction: column;
		justify-content: center;
		overflow: hidden; /* Prevent items from overlapping other sections */
		background-color: transparent;
	}

	h2 {
		font-size: 2.5rem;
		font-weight: 700;
		color: var(--accent-primary);
		margin-bottom: 3.5rem;
	}

	.all-shelves-container {
		width: 100%;
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 3rem;
	}

	.shelf-unit {
		position: relative;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: 3rem; /* Space for label */
	}

	.achievement-shelf {
		display: flex;
		justify-content: center;
		align-items: flex-end; /* Align items to bottom so they sit on shelf */
		flex-wrap: wrap;
		gap: 1.5rem;
		padding: 0 1rem;
		padding-bottom: 0px; /* Sit directly on shelf */
		min-height: auto; /* Remove fixed height on mobile/responsive */
		padding-bottom: 2rem;
		transform-style: preserve-3d;
		perspective: 1000px;
		position: relative;
		width: 100%;
		z-index: 2;
	}

	.shelf-base {
		height: 20px;
		width: 95%;
		max-width: 900px;
		margin: 0 auto;
		background: linear-gradient(to top, #202020, #bbb); /* Keep realistic shelf look */
		border-radius: 4px;
		box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5);
		border-top: 2px solid #444;
		border-bottom: 2px solid #111;
		position: relative;
		z-index: 1;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	/* --- Shelf Label --- */
	.shelf-label {
		position: absolute;
		top: -2.5rem; /* Relative to shelf base now? No, relative to shelf-unit if moved */
		/* Actually, let's position it above the whole unit or relative to shelf base */
		top: -40px; 
		font-size: 1.3rem;
		font-weight: 600;
		color: var(--text-primary);
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
		background: rgba(0,0,0,0.5);
		padding: 0.2rem 1rem;
		border-radius: 12px;
		pointer-events: none;
	}

	/* Use specific colors for shelves but adapt text if needed */
	.software-development .shelf-base {
		background: linear-gradient(to top, #1a2a3a, #a0c4e0);
		border-top-color: #c0e0ff;
	}
	.software-development .shelf-label {
		color: #e0f0ff;
	}

	.networking-cybersecurity .shelf-base {
		background: linear-gradient(to top, #1a3a1a, #a0e0a0);
		border-top-color: #c0ffc0;
	}
	.networking-cybersecurity .shelf-label {
		color: #e0ffe0;
	}

	.scholastic-extracurricular .shelf-base {
		background: linear-gradient(to top, #3a2a1a, #e0c4a0);
		border-top-color: #ffebc0;
	}
	.scholastic-extracurricular .shelf-label {
		color: #fff0d0;
	}

	.shelf-item {
		background: none;
		border: none;
		padding: 0;
		margin: 0;
		font: inherit;
		color: inherit;
		cursor: pointer;
		position: relative;
		transition: transform 0.3s ease, z-index 0.3s ease;
		will-change: transform, z-index, box-shadow;
	}

	.item-frame {
		width: 300px;
		height: 250px; /* Slightly smaller for better fit */
		background: var(--bg-card);
		padding: 10px;
		border-radius: 8px;
		box-shadow: 0 5px 15px rgba(0, 0, 0, 0.4);
		border: 1px solid var(--border-light);
		box-sizing: border-box;
		transition: box-shadow 0.3s ease;
	}

	.item-thumbnail {
		width: 100%;
		height: 100%;
		background-size: cover;
		background-position: center;
		border-radius: 4px;
		border: 1px solid rgba(0,0,0,0.2);
	}

	.shelf-item:focus {
		outline: none;
	}

	/* --- MODAL STYLES --- */
	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.85);
		backdrop-filter: blur(5px);
		display: grid;
		place-items: center;
		z-index: 1000;
		opacity: 0;
		transition: background 0.3s ease;
		padding: 1rem;
		box-sizing: border-box;
	}

	.modal-content {
		position: relative;
		border-radius: 12px;
		width: 100%;
		max-width: 700px;
		max-height: 90vh;
		overflow-y: auto;
		padding: 0;
		text-align: left;
		opacity: 1;
		background: var(--bg-modal);
		box-shadow: var(--shadow-card);
		border: 1px solid var(--border-light);
		color: var(--text-primary);
		display: flex;
		flex-direction: column;
	}

	.modal-header-sticky {
		position: sticky;
		top: 0;
		right: 0;
		width: 100%;
		height: 0;
		z-index: 1005;
		display: flex;
		justify-content: flex-end;
	}

	.modal-body {
		padding: 2.5rem;
		display: flex;
		flex-direction: column;
	}

	.modal-content:focus {
		outline: none;
	}

	.close-btn {
		margin: 15px 15px 0 0;
		background: var(--bg-card);
		border: 1px solid var(--border-light);
		width: 35px;
		height: 35px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.5rem;
		color: var(--text-primary);
		cursor: pointer;
		transition: all 0.3s ease;
		box-shadow: 0 4px 10px rgba(0,0,0,0.3);
	}

	.close-btn:hover {
		color: var(--accent-primary);
		background: var(--bg-card-hover);
		transform: rotate(90deg);
	}

	/* --- Fullscreen Styles --- */
	.code-fullscreen-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: rgba(0, 0, 0, 0.95);
		z-index: 2000;
		display: flex;
		justify-content: center;
		align-items: center;
		backdrop-filter: blur(5px);
	}

	.fullscreen-image-container {
		position: relative;
		max-width: 95vw;
		max-height: 95vh;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.fullscreen-image {
		max-width: 100%;
		max-height: 90vh;
		object-fit: contain;
		border-radius: 8px;
		box-shadow: 0 0 20px rgba(0,0,0,0.5);
	}

	.fullscreen-close {
		position: absolute;
		top: -40px;
		right: -40px;
		background: transparent;
		border: none;
		color: white;
		font-size: 2rem;
		cursor: pointer;
		z-index: 2001;
		transition: transform 0.2s;
	}

	.fullscreen-close:hover {
		transform: scale(1.1);
		color: var(--accent-primary);
	}

	@media (max-width: 768px) {
		.fullscreen-close {
			top: 10px;
			right: 10px;
			position: fixed;
		}
	}
</style>