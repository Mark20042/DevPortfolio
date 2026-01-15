<script>
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';

	
	import {
		languagesFrameworksTech,
		databasesToolsTech,
		ideExtensionsTech
	} from '$lib/data/techStack';

	
	let aboutSection;
	let techStackContent;

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger);

		gsap.from(techStackContent.children, {
			opacity: 0,
			y: 30,
			duration: 0.6,
			ease: 'power3.out',
			stagger: 0.2,
			scrollTrigger: {
				trigger: aboutSection,
				start: 'top 80%',
				toggleActions: 'play none none reverse'
			}
		});
	});
</script>

<section class="tech-stack-section" id="about" bind:this={aboutSection}>
	<div class="tech-stack-content" bind:this={techStackContent}>
		<h2>Tech Stack</h2>

		<h3 class="tech-category-heading">Languages & Frameworks</h3>
		<div class="scroller" data-direction="left">
			<div class="scroller-inner">
				{#each languagesFrameworksTech as tech}
					<div class="tech-item">
						<img src={tech.icon} alt={tech.name} />
						<span>{tech.name}</span>
					</div>
				{/each}
	
			</div>
		</div>

		<h3 class="tech-category-heading">Databases & Tools</h3>
		<div class="scroller" data-direction="right">
			<div class="scroller-inner">
				{#each databasesToolsTech as tech}
					<div class="tech-item">
						<img src={tech.icon} alt={tech.name} />
						<span>{tech.name}</span>
					</div>
				{/each}
				
			</div>
		</div>

		<h3 class="tech-category-heading">IDEs & Extensions</h3>
		<div class="scroller" data-direction="left" data-speed="slow">
			<div class="scroller-inner">
				{#each ideExtensionsTech as tech}
					<div class="tech-item">
						<img src={tech.icon} alt={tech.name} />
						<span>{tech.name}</span>
					</div>
				{/each}
				
			</div>
		</div>
	</div>
</section>

<style>

	.tech-stack-section {
		display: grid;
		place-items: center;
		min-height: 100vh;
		padding: 4rem 5%;
		box-sizing: border-box;
		font-family: 'Poppins', sans-serif;
		text-align: center;
		background-color: transparent;
	}

	.tech-stack-content {
		width: 100%;
		max-width: 100%;
	}

	.tech-stack-content h2 {
		font-size: 2.5rem;
		font-weight: 700;
		color: var(--accent-primary);
		margin-bottom: 2.5rem;
	}

	.tech-category-heading {
		font-size: 1.8rem;
		font-weight: 600;
		color: var(--text-primary);
		margin-top: 3rem;
		margin-bottom: 1.5rem;
		text-align: center;
	}

	.scroller {
		max-width: 1000px;
		margin: 1.5rem auto;
		overflow: hidden;
		-webkit-mask: linear-gradient(90deg, transparent, white 20%, white 80%, transparent);
		mask: linear-gradient(90deg, transparent, white 20%, white 80%, transparent);
	}

	.scroller-inner {
		display: flex;
		width: max-content;
		gap: 1.5rem;
		animation: scroll-left var(--scroll-speed, 20s) linear infinite;
	}

	.scroller-inner:hover {
		cursor: pointer;
		animation-play-state: paused;
	}

	.scroller[data-speed='slow'] .scroller-inner {
		animation-duration: 20s;
	}

	.scroller[data-direction='right'] .scroller-inner {
		animation-direction: reverse;
	}

	.tech-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		color: var(--text-primary);
		font-weight: 500;
		font-size: 1rem;
		flex-shrink: 0;
		padding: 0.5rem 1rem;
		background-color: var(--bg-card);
		border-radius: 8px;
		border: 1px solid var(--border-light);
		transition: transform 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
		box-shadow: var(--shadow-card);
	}

	.tech-item:hover {
		transform: translateY(-5px);
		background-color: var(--bg-card-hover);
		box-shadow: var(--shadow-hover);
		border-color: var(--accent-tertiary);
	}

	.tech-item img {
		width: 40px;
		height: 40px;
		margin-bottom: 0;
		filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
	}

	@keyframes scroll-left {
		to {
			transform: translateX(calc(-50% - 0.75rem));
		}
	}


	@media (max-width: 900px) {
		.tech-category-heading {
			font-size: 1.5rem;
		}
		.tech-item {
			gap: 0.5rem;
			font-size: 0.9rem;
			padding: 0.4rem 0.8rem;
		}
		.tech-item img {
			width: 30px;
			height: 30px;
		}
		.tech-stack-content h2 {
			font-size: 2rem;
		}
	}
	
	@media (max-width: 480px) {
		.tech-stack-section {
			padding: 2rem 5%;
		}
		.scroller {
			-webkit-mask: none;
			mask: none;
			overflow: visible;
			max-width: 100%;
		}
		.scroller-inner {
			animation: none !important;
			flex-wrap: wrap;
			justify-content: center;
			width: 100%;
			gap: 0.75rem;
			transform: none !important;
		}
		.tech-item {
			box-shadow: 0 2px 5px rgba(0,0,0,0.1); /* Lighter shadow for static grid */
		}
	}
</style>