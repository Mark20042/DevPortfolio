<script lang="ts">
  import { projectsData, type ProjectItem } from '$lib/data/projects';
  import { onMount, tick } from 'svelte';
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  // --- State for Modal ---
  let selectedProject: ProjectItem | null = null;
  let currentImageIndex = 0;
  let modalBackdrop: HTMLDivElement;
  let modalContent: HTMLDivElement;
  let isFullscreen = false;

  // --- State for Thumbnail Cycling ---
  let currentThumbnails: number[] = projectsData.map(() => 0);
  let thumbnailIntervals: ReturnType<typeof setInterval>[] = [];

  // --- Bindings for Animatons ---
  let projectsSection: HTMLElement;
  let projectsTrack: HTMLElement;
  let projectCards: HTMLElement[] = [];

  onMount(async () => {
    gsap.registerPlugin(ScrollTrigger);
    await tick();

    if (!projectsTrack || !projectsSection || projectCards.length === 0) {
      console.error('GSAP target elements not found');
      return;
    }

    // --- GSAP Horizontal Scroll Animation (Desktop) ---
    ScrollTrigger.matchMedia({
      // Desktop: Horizontal Scroll
      "(min-width: 769px)": function() {
        const horizontalScroll = gsap.to(projectsTrack, {
          x: () => `-${projectsTrack.scrollWidth - window.innerWidth}px`,
          ease: 'none',
          scrollTrigger: {
            trigger: projectsSection,
            pin: true,
            scrub: 1,
            start: 'top top',
            end: () => `+=${projectsTrack.scrollWidth - window.innerWidth}`,
            invalidateOnRefresh: true,
          }
        });

        // Card animations (Desktop)
        projectCards.forEach((card) => {
          gsap.from(card, {
            scale: 0.9,
            opacity: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              containerAnimation: horizontalScroll,
              start: 'left 80%',
              end: 'left 50%',
              toggleActions: 'play none none reset',
            }
          });
        });
      },

      // Mobile: Simple Vertical Fade
      "(max-width: 768px)": function() {
        projectCards.forEach((card) => {
          gsap.from(card, {
            opacity: 0,
            y: 50,
            duration: 0.6,
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          });
        });
      }
    });

    // Hover effect (Universal)
    projectCards.forEach((card) => {
      const hoverTimeline = gsap.timeline({ paused: true })
        .to(card, {
          y: -15,
          scale: 1.03,
          duration: 0.3,
          ease: 'power2.out'
        });

      card.addEventListener('mouseenter', () => hoverTimeline.play());
      card.addEventListener('mouseleave', () => hoverTimeline.reverse());
    });

    // --- Thumbnail Cycling Logic ---
    projectsData.forEach((project, index) => {
      if (project.images && project.images.length > 1) {
        // Random interval between 2000ms and 3000ms
        const intervalTime = Math.floor(Math.random() * 1000) + 2000;
        
        const intervalId = setInterval(() => {
          currentThumbnails[index] = (currentThumbnails[index] + 1) % project.images.length;
        }, intervalTime);
        
        thumbnailIntervals.push(intervalId);
      }
    });

    return () => {
      // Cleanup intervals
      thumbnailIntervals.forEach(clearInterval);
    };
  });

  // --- Modal Functions ---
  async function openProjectModal(project: ProjectItem): Promise<void> {
    selectedProject = project;
    currentImageIndex = 0;
    isFullscreen = false;
    // Lock body scroll
    document.body.style.overflow = 'hidden';
    await tick();
    modalContent.focus();
    gsap.timeline()
      .to(modalBackdrop, { opacity: 1, duration: 0.3, ease: 'power2.inOut' })
      .from(modalContent, { opacity: 0, y: 50, scale: 0.95, duration: 0.4, ease: 'power3.out' }, '-=0.2');
  }

  function closeProjectModal(): void {
    // Unlock body scroll
    document.body.style.overflow = '';
    isFullscreen = false;
    gsap.timeline({ onComplete: () => { selectedProject = null; currentImageIndex = 0; } })
      .to(modalContent, { opacity: 0, y: 50, scale: 0.95, duration: 0.3, ease: 'power3.in' })
      .to(modalBackdrop, { opacity: 0, duration: 0.3, ease: 'power2.inOut' }, '-=0.2');
  }

  function handleModalKeydown(e: KeyboardEvent): void {
    if (e.key === 'Escape') {
      if (isFullscreen) {
        toggleFullscreen();
      } else {
        closeProjectModal();
      }
    }
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'ArrowRight') nextImage();
  }

  // --- Image Gallery Navigation ---
  function nextImage(): void {
    if (selectedProject && selectedProject.images.length > 1) {
      currentImageIndex = (currentImageIndex + 1) % selectedProject.images.length;
    }
  }

  function prevImage(): void {
    if (selectedProject && selectedProject.images.length > 1) {
      currentImageIndex = (currentImageIndex - 1 + selectedProject.images.length) % selectedProject.images.length;
    }
  }

  function goToImage(index: number): void {
    currentImageIndex = index;
  }

  function toggleFullscreen(): void {
    isFullscreen = !isFullscreen;
  }
</script>

<section class="projects-section" id="projects" bind:this={projectsSection}>
  <div class="header-container">
    <h2>PROJECTS</h2>
   <div class="scroll-down-container">
    <div class="mouse">
      <div class="scroller"></div>
    </div>
    <span class="scroll-text">Scroll to explore my work</span>
  </div>
  </div>

  <div class="projects-track-container">
    <div class="projects-track" bind:this={projectsTrack}>
      {#each projectsData as project, index (project.id)}
        <button
          class="project-card"
          bind:this={projectCards[index]}
          on:click={() => openProjectModal(project)}
          aria-label="View details for {project.title}"
        >
          <div class="project-card-inner">
            <img 
              src={project.images && project.images.length > 0 ? project.images[currentThumbnails[index]] : project.image} 
              alt="{project.title} screenshot" 
              class="project-image" 
            />
            <div class="project-info">
              <h3>{project.title}</h3>
              <p class="project-category">{project.category}</p>
              <div class="tech-stack-tags">
                {#each project.techStack as tech}
                  <span class="tech-tag">{tech}</span>
                {/each}
              </div>
            </div>
          </div>
        </button>
      {/each}
    </div>
  </div>
</section>

<svelte:window on:keydown={handleModalKeydown} />

{#if selectedProject}
  <!-- svelte-ignore a11y_interactive_supports_focus -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div
    class="modal-backdrop"
    bind:this={modalBackdrop}
    on:click={closeProjectModal}
    role="dialog"
    aria-modal="true"
  >
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <div
      class="modal-content"
      bind:this={modalContent}
      on:click|stopPropagation
      role="document"
      tabindex="-1"
    >
      <div class="modal-header-sticky">
          <button class="close-btn" on:click={closeProjectModal} title="Close"> &times; </button>
      </div>
      
      <div class="modal-body">
      <!-- Image Gallery Section -->
      <div class="image-gallery">
        <div class="gallery-main">
          {#if selectedProject.images.length > 1}
            <button class="gallery-nav prev" on:click={prevImage} aria-label="Previous image">
              <i class="fas fa-chevron-left"></i>
            </button>
          {/if}
          
          <img 
            src={selectedProject.images[currentImageIndex]} 
            alt="{selectedProject.title} screenshot {currentImageIndex + 1}" 
            class="modal-project-image" 
            on:click={toggleFullscreen}
            style="cursor: zoom-in;"
          />
          
          {#if selectedProject.images.length > 1}
            <button class="gallery-nav next" on:click={nextImage} aria-label="Next image">
              <i class="fas fa-chevron-right"></i>
            </button>
          {/if}
        </div>
        
        <!-- Thumbnail Dots -->
        {#if selectedProject.images.length > 1}
          <div class="gallery-dots">
            {#each selectedProject.images as _, idx}
              <button 
                class="gallery-dot" 
                class:active={currentImageIndex === idx}
                on:click={() => goToImage(idx)}
                aria-label="Go to image {idx + 1}"
              ></button>
            {/each}
          </div>
        {/if}
      </div>

      <h3>{selectedProject.title}</h3>
      <p class="modal-category">{selectedProject.category}</p>
      <div class="tech-stack-tags modal-tech-tags">
        {#each selectedProject.techStack as tech}
          <span class="tech-tag">{tech}</span>
        {/each}
      </div>
      <p class="modal-description">{selectedProject.description}</p>

      <div class="modal-links">
        {#if selectedProject.githubLink}
          <a href={selectedProject.githubLink} target="_blank" rel="noopener noreferrer" class="modal-link github-link">
            <i class="fab fa-github"></i> GitHub
          </a>
        {/if}
        {#if selectedProject.liveDemoLink}
          <a href={selectedProject.liveDemoLink} target="_blank" rel="noopener noreferrer" class="modal-link demo-link">
            <i class="fas fa-external-link-alt"></i> Live Demo
          </a>
        {/if}
      </div>
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
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
      <div class="fullscreen-image-container" on:click|stopPropagation role="document">
        <img 
          src={selectedProject.images[currentImageIndex]} 
          alt="{selectedProject.title} fullscreen" 
          class="fullscreen-image"
        />
        <button class="fullscreen-close" on:click={toggleFullscreen}>&times;</button>
        
        {#if selectedProject.images.length > 1}
          <button class="fullscreen-nav prev" on:click={prevImage} aria-label="Previous image">
            <i class="fas fa-chevron-left"></i>
          </button>
          <button class="fullscreen-nav next" on:click={nextImage} aria-label="Next image">
            <i class="fas fa-chevron-right"></i>
          </button>
        {/if}
      </div>
    </div>
  {/if}
{/if}

<style>
  /* --- Section Styles --- */
  .projects-section {
    min-height: 70vh;
    box-sizing: border-box;
    font-family: 'Poppins', sans-serif;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    overflow: hidden;
    padding-top: 5rem;
    background-color: transparent;
    width: 100%; /* Prevent horizontal overflow */
    max-width: 100%;
  }

  @media (max-width: 768px) {
    .projects-section {
       min-height: auto !important;
       height: auto !important;
       overflow: visible !important;
       padding-bottom: 8rem; /* Extra padding to push Achievements down */
       display: block !important; /* Ensure it takes flow */
    }
  }

  .header-container {
    padding: 0 5%;
    text-align: center;
    width: 100%;
    margin-bottom: 3rem;
  }

  h2 {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--accent-primary);
    margin-bottom: 0.5rem;
    letter-spacing: 0.1em;
  }

  .scroll-down-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    font-family: 'Poppins', sans-serif;
    color: var(--text-muted);
    font-size: 0.7rem;
    margin-top: 1rem;
  }

  .mouse {
    width: 28px;
    height: 38px;
    border: 2px solid var(--text-primary);
    border-radius: 14px;
    display: flex;
    justify-content: center;
    padding-top: 8px;
  }

  .scroller {
    width: 4px;
    height: 8px;
    background-color: var(--text-primary);
    border-radius: 2px;
    animation: scroll 1.5s infinite;
  }

  @keyframes scroll {
    0% {
      opacity: 1;
      transform: translateY(0);
    }
    100% {
      opacity: 0;
      transform: translateY(20px);
    }
  }

  /* --- Horizontal Track Styles --- */
  .projects-track-container {
    width: 100%;
    height: 70vh;
    display: flex;
    align-items: center;
  }

  .projects-track {
    display: flex;
    flex-wrap: nowrap;
    height: 100%;
    padding-left: 10vw;
    padding-right: 10vw;
  }

  /* --- Glassmorphism Project Card Styles --- */
  .project-card {
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    font: inherit;
    color: inherit;
    text-align: left;

    width: 60vw;
    max-width: 600px;
    min-width: 400px;
    height: 100%;
    max-height: 500px;
    margin-right: 4rem;
    flex-shrink: 0;

    /* Glassmorphism effect */
    background: var(--bg-card);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-radius: 16px;
    box-shadow: var(--shadow-card);
    border: 1px solid var(--border-light);
    cursor: pointer;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    will-change: transform, opacity, box-shadow;
    transition: all 0.3s ease;
  }

  .project-card:hover {
    background: var(--bg-card-hover);
    box-shadow: var(--shadow-hover);
    border-color: var(--accent-tertiary);
  }

  .project-card:last-child {
    margin-right: 0;
  }

  .project-card-inner {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    color: var(--text-primary);
  }

  .project-image {
    width: 100%;
    height: 60%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  .project-card:hover .project-image {
    transform: scale(1.05);
  }

  .project-info {
    padding: 1.5rem;
    height: 40%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .project-info h3 {
    font-size: 1.5rem;
    margin-top: 0;
    margin-bottom: 0.5rem;
    color: var(--accent-tertiary);
    transition: color 0.3s ease;
  }

  .project-card:hover .project-info h3 {
    color: var(--accent-primary);
  }

  .project-category {
    font-size: 0.9rem;
    color: var(--text-muted);
    margin-bottom: 1rem;
  }

  .tech-stack-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .tech-tag {
    background: linear-gradient(135deg, rgba(255, 62, 0, 0.2), rgba(137, 155, 255, 0.2));
    color: var(--text-primary);
    padding: 0.3rem 0.7rem;
    border-radius: 20px;
    font-size: 0.75rem;
    white-space: nowrap;
    border: 1px solid var(--border-light);
    transition: all 0.3s ease;
  }

  .tech-tag:hover {
    background: linear-gradient(135deg, rgba(255, 62, 0, 0.4), rgba(137, 155, 255, 0.4));
    transform: translateY(-2px);
  }

  /* --- MODAL STYLES --- */
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(8px);
    display: grid;
    place-items: center;
    z-index: 1000;
    opacity: 0;
    padding: 1rem;
    box-sizing: border-box;
  }

  .modal-content {
    position: relative;
    background: var(--bg-modal);
    backdrop-filter: blur(20px);
    border-radius: 20px;
    width: 100%;
    max-width: 900px;
    max-height: 90vh;
    overflow-y: auto;
    padding: 0; 
    text-align: center;
    color: var(--text-primary);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
    border: 1px solid var(--border-light);
    display: flex;
    flex-direction: column;
  }

  .modal-header-sticky {
      position: sticky;
      top: 0;
      right: 0;
      width: 100%;
      height: 0; /* Don't take up layout space, just anchor the button */
      z-index: 1005;
      display: flex;
      justify-content: flex-end;
  }

  /* Inner content wrapper for padding */
  .modal-body {
     padding: 2.5rem;
  }

  .modal-content:focus {
    outline: none;
  }

  .close-btn {
    margin: 15px 20px 0 0; /* Positioning via margin since sticky container is 0 height */
    background: var(--bg-card);
    border: 1px solid var(--border-light);
    font-size: 1.5rem;
    color: var(--text-primary);
    cursor: pointer;
    line-height: 1;
    transition: all 0.3s ease;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  }

  .close-btn:hover {
    color: var(--accent-primary);
    background: var(--bg-card-hover);
    transform: rotate(90deg);
  }

  /* --- Image Gallery Styles --- */
  .image-gallery {
    margin-bottom: 2rem;
  }

  .gallery-main {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
  }

  .gallery-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: var(--bg-card);
    border: 1px solid var(--border-light);
    color: var(--text-primary);
    width: 45px;
    height: 45px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    transition: all 0.3s ease;
    z-index: 10;
  }

  .gallery-nav:hover {
    background: var(--accent-primary);
    color: white;
    transform: translateY(-50%) scale(1.1);
  }

  .gallery-nav.prev {
    left: 10px;
  }

  .gallery-nav.next {
    right: 10px;
  }

  .modal-project-image {
    width: 100%;
    max-height: 400px;
    object-fit: contain;
    border-radius: 12px;
    transition: opacity 0.3s ease;
  }

  .gallery-dots {
    display: flex;
    justify-content: center;
    gap: 10px;
  }

  .gallery-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--border-color);
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .gallery-dot:hover {
    background: var(--text-muted);
    transform: scale(1.2);
  }

  .gallery-dot.active {
    background: var(--accent-primary);
    transform: scale(1.3);
  }

  .modal-content h3 {
    font-size: 2rem;
    font-weight: 700;
    color: var(--accent-primary);
    margin: 0 0 0.5rem 0;
  }

  .modal-category {
    font-size: 1.1rem;
    color: var(--text-muted);
    margin-bottom: 1.5rem;
  }

  .modal-tech-tags {
    justify-content: center;
    margin-bottom: 2rem;
  }

  .modal-description {
    font-size: 1rem;
    line-height: 1.8;
    color: var(--text-secondary);
    text-align: left;
    margin-bottom: 2rem;
    padding: 1.5rem;
    background: var(--bg-card);
    border-radius: 12px;
    border: 1px solid var(--border-light);
  }

  .modal-links {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    flex-wrap: wrap;
  }

  .modal-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.9rem 1.8rem;
    background: linear-gradient(135deg, var(--accent-primary), #e03500);
    color: white;
    text-decoration: none;
    border-radius: 50px;
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(255, 62, 0, 0.3);
  }

  .modal-link:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(255, 62, 0, 0.4);
  }

  .modal-link.github-link {
    background: linear-gradient(135deg, #333, #555);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  }

  .modal-link.github-link:hover {
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
  }

  /* --- Responsive Adjustments --- */
  @media (max-width: 1024px) {
    .project-card {
      width: 65vw;
      max-width: 550px;
    }
  }

  @media (max-width: 768px) {
    .projects-section {
      padding-top: 3rem;
    }

    .header-container {
      margin-bottom: 2rem;
    }

    h2 {
      font-size: 2rem;
    }

    /* Change to vertical stack on mobile */
    .projects-track-container {
      height: auto !important;
      min-height: auto !important;
      flex-direction: column !important;
      overflow: visible !important;
      display: flex !important;
    }

    .projects-track {
      flex-direction: column !important;
      height: auto !important;
      width: 100% !important;
      padding: 0 1rem;
      box-sizing: border-box;
      gap: 3rem;
      transform: none !important; /* Reset any GSAP transforms */
      display: flex !important;
    }

    .project-card {
      width: 100%;
      min-width: unset;
      max-width: 100%;
      margin-right: 0;
      margin-bottom: 0;
      height: auto;
      max-height: 500px;
    }

    .project-info {
      padding: 1rem;
    }

    .project-info h3 {
      font-size: 1.25rem;
    }

    .modal-content {
      padding: 1.5rem;
      border-radius: 16px;
    }

    .modal-content h3 {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
    }

    .modal-body {
      padding-bottom: 3rem; /* Ensure space for scrolling to bottom buttons */
    }

    .gallery-nav {
      width: 35px;
      height: 35px;
      font-size: 1rem;
    }

    .modal-project-image {
      max-height: 75vh; /* Larger as requested */
      width: 100%;
      object-fit: cover;
    }

    .modal-links {
      gap: 0.5rem;
      margin-top: 0.5rem;
      justify-content: center; /* Center buttons */
    }

    .modal-link {
      padding: 0.4rem 0.6rem; /* Micro buttons */
      font-size: 0.75rem;
    }
    
    .modal-content p, .modal-description {
        font-size: 0.75rem; /* Micro text */
        line-height: 1.3;
        margin-bottom: 0.5rem;
    }
    
    .tech-tag {
        font-size: 0.6rem;
        padding: 0.1rem 0.3rem;
        margin: 0.1rem;
    }
    
    .modal-content h3 {
      font-size: 1.1rem; /* Much smaller title */
      margin-bottom: 0.2rem;
    }
    
    .modal-body {
        padding: 1rem;
        padding-bottom: 4rem; /* Specific body padding for compact layout */
    }
  }

  @media (max-width: 480px) {
    .projects-section {
      padding-top: 2rem;
    }

    h2 {
      font-size: 1.75rem;
    }

    .scroll-down-container {
      font-size: 0.6rem;
    }

    .mouse {
      width: 22px;
      height: 30px;
    }

    .projects-track-container {
      height: 50vh;
    }

    .project-card {
      width: 90vw;
      min-width: unset;
      max-height: 450px; /* Give it some breathing room */
      margin-right: 0;
      margin-bottom: 2rem;
    }

    .project-image {
      height: 55%;
    }

    .project-info {
      height: 45%;
      padding: 0.8rem;
    }

    .project-info h3 {
      font-size: 1.1rem;
    }

    .project-category {
      font-size: 0.8rem;
      margin-bottom: 0.5rem;
    }

    .tech-tag {
      font-size: 0.65rem;
      padding: 0.2rem 0.5rem;
    }

    .modal-content {
      padding: 1rem;
      max-height: 95vh;
    }

    .close-btn {
      top: 10px;
      right: 10px;
      width: 35px;
      height: 35px;
      font-size: 1.2rem;
    }

    .modal-content h3 {
      font-size: 1.3rem;
    }

    .modal-category {
      font-size: 0.95rem;
    }

    .modal-description {
      font-size: 0.9rem;
      padding: 1rem;
    }

    .modal-link {
      width: 100%;
      justify-content: center;
    }
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

  .fullscreen-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    cursor: pointer;
    transition: all 0.3s;
  }

  .fullscreen-nav:hover {
    background: var(--accent-primary);
    transform: translateY(-50%) scale(1.1);
  }

  .fullscreen-nav.prev {
    left: -70px;
  }

  .fullscreen-nav.next {
    right: -70px;
  }

  @media (max-width: 768px) {
    .fullscreen-nav {
      width: 40px;
      height: 40px;
      font-size: 1.2rem;
      background: rgba(0, 0, 0, 0.5);
    }
    
    .fullscreen-nav.prev {
      left: 10px;
    }
    
    .fullscreen-nav.next {
      right: 10px;
    }

    .fullscreen-close {
      top: 10px;
      right: 10px;
      position: fixed;
    }
  }
</style>