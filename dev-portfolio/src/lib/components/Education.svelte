<script lang="ts">
  import { educationData, type EducationItem } from '$lib/data/education';
  import { onMount, tick } from 'svelte';
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  // --- State for Modal ---
  let selectedEducation: EducationItem | null = null;
  let modalBackdrop: HTMLDivElement;
  let modalContent: HTMLDivElement;

  onMount(() => {
    gsap.registerPlugin(ScrollTrigger);

    const items = gsap.utils.toArray<HTMLElement>('.timeline-item');

    items.forEach((item) => {
      const contentBox = item.querySelector<HTMLElement>('.content-box');
      if (!contentBox) return;

      // --- 1. Hover Effect ---
      const hoverTimeline = gsap
        .timeline({ paused: true })
        .to(contentBox, {
          y: -10,
          scale: 1.05,
          boxShadow: '0 25px 35px rgba(0, 0, 0, 0.4)',
          duration: 0.3,
          ease: 'power2.out'
        });

      item.addEventListener('mouseenter', () => hoverTimeline.play());
      item.addEventListener('mouseleave', () => hoverTimeline.reverse());

      // --- 2. Scroll-in Animation ---
      const isLeft = item.classList.contains('left');
      
      gsap.from(item, {
        x: isLeft ? -100 : 100,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    });
  });

  // --- 3. Modal Click Functions ---
  async function openModal(item: EducationItem): Promise<void> {
    selectedEducation = item;
    await tick(); // Wait for modal to be in DOM
    modalContent.focus();
    
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
    gsap.timeline({
      onComplete: () => {
        selectedEducation = null;
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

  function handleModalKeydown(e: KeyboardEvent): void {
    if (e.key === 'Escape') {
      closeModal();
    }
  }
</script>

<section class="education-container">
  <h2>EDUCATIONAL BACKGROUND</h2>

  <div class="timeline">
    {#each educationData as item, index}
      <div class="timeline-item {index % 2 === 0 ? 'left' : 'right'}">
        <button
          type="button"
          class="content-box"
          on:click={() => openModal(item)}
          aria-label="View details for {item.school}"
        >
          {#if item.image}
            <img src={item.image} alt="{item.school} logo" class="school-logo" />
          {/if}
          <div class="text-content">
            <h3>{item.school}</h3>
            <p>{item.degree}</p>
            <span class="date">{item.years}</span>
          </div>
        </button>
      </div>
    {/each}
  </div>
</section>

{#if selectedEducation}
  <!-- svelte-ignore a11y_interactive_supports_focus -->
  <div
    class="modal-backdrop"
    bind:this={modalBackdrop}
    on:click={closeModal}
    on:keydown={handleModalKeydown}
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
      <button class="close-btn" on:click={closeModal} title="Close"> &times; </button>
      
      {#if selectedEducation.image}
        <img src={selectedEducation.image} alt="{selectedEducation.school} logo" class="modal-school-logo" />
      {/if}
      <h3>{selectedEducation.school}</h3>
      <p class="modal-degree">{selectedEducation.degree}</p>
      <p class="modal-years">{selectedEducation.years}</p>
      <p class="modal-description">{selectedEducation.description}</p>
    </div>
  </div>
{/if}

<style>
  .education-container {
    min-height: 110vh;
	padding: 15rem 5%;
    box-sizing: border-box;
    font-family: 'Poppins', sans-serif;
    overflow-x: hidden;
    background-color: transparent;
  }

  h2 {
    text-align: center;
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--accent-primary);
    margin-bottom: 4rem;
  }

  .timeline {
    position: relative;
    max-width: 1300px;
    margin: 0 auto;
  }

  .timeline::after {
    content: '';
    position: absolute;
    width: 3px;
    background-color: var(--border-color); /* Changed from white for light mode */
    top: 0;
    bottom: 0;
    left: 50%;
    margin-left: -1.5px;
  }

  .timeline-item {
    padding: 20px 50px;
    position: relative;
    width: 50%;
    box-sizing: border-box;
  }

  .timeline-item.left { left: 0; }
  .timeline-item.right { left: 50%; }

  .timeline-item::after {
    content: '';
    position: absolute;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: var(--bg-primary); /* Circle matches bg */
    border: 3px solid var(--accent-primary); /* Colored border */
    top: 60px;
    z-index: 1;
  }

  .timeline-item.left::after { right: -8px; }
  .timeline-item.right::after { left: -8px; }

  /* --- Content Box --- */
  .content-box {
    background: none;
    border: none;
    margin: 0;
    font: inherit;
    color: inherit;
    text-align: left;
    
    display: flex;
    align-items: center;
    padding: 30px 35px;
    background-color: var(--bg-card);
    position: relative;
    border-radius: 12px;
    color: var(--text-primary);
    width: 100%;
    cursor: pointer;
    border: 1px solid var(--border-light);

    will-change: transform, box-shadow;
    transition: box-shadow 0.3s ease, transform 0.3s ease, border-color 0.3s ease;
  }

  .content-box:hover {
      background-color: var(--bg-card-hover);
      border-color: var(--accent-tertiary);
  }

  .content-box::before {
    content: '';
    position: absolute;
    height: 3px;
    width: 42px;
    background-color: var(--border-color); /* Changed from white */
    top: 66px; /* Adjusted to align with new dot centering */
  }

  /* Adjust line connector vertical pos based on dot top 60px + 8px = 68px approx */
  /* .timeline-item::after is at top: 60px height 16px -> center is 68px */
  /* line height 3px -> center 1.5px. top: 66.5px */
  
  .timeline-item.left .content-box::before { right: -42px; }
  .timeline-item.right .content-box::before { left: -42px; }

  .school-logo {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 20px;
    flex-shrink: 0;
    background-color: #fff; /* Logos usually expect white bg */
    padding: 2px;
  }

  .text-content {
    display: flex;
    flex-direction: column;
  }

  .text-content h3 {
    margin-top: 0;
    color: var(--accent-tertiary);
    font-size: 1.4rem;
  }

  .text-content p {
    margin: 5px 0;
    font-size: 1.1rem;
    color: var(--text-primary);
  }

  .text-content .date {
    font-size: 0.9rem;
    color: var(--text-muted);
  }

  /* --- Modal Styles --- */
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
    padding: 1rem;
    box-sizing: border-box;
  }

  .modal-content {
    position: relative;
    background: var(--bg-modal);
    border: 1px solid var(--border-light);
    border-radius: 12px;
    width: 100%;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
    padding: 2.5rem;
    text-align: center;
    color: var(--text-primary);
    box-shadow: var(--shadow-card);
  }

  .modal-content:focus {
    outline: none;
  }

  .close-btn {
    position: absolute;
    top: 15px;
    right: 15px;
    background: var(--bg-card);
    border: 1px solid var(--border-light);
    font-size: 1.5rem;
    color: var(--text-primary);
    cursor: pointer;
    line-height: 1;
    transition: all 0.2s ease;
    width: 35px;
    height: 35px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .close-btn:hover {
    color: var(--accent-primary);
    background: var(--bg-card-hover);
  }

  .modal-school-logo {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: contain;
    margin-bottom: 20px;
    background-color: white;
    padding: 8px;
    border: 2px solid var(--border-light);
  }

  .modal-content h3 {
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--accent-tertiary);
    margin: 0 0 0.5rem 0;
  }

  .modal-content .modal-degree {
    font-size: 1.1rem;
    margin: 0;
    color: var(--text-secondary);
  }
  .modal-content .modal-years {
    font-size: 0.9rem;
    color: var(--text-muted);
    margin: 0.25rem 0 1rem 0;
  }
  .modal-content .modal-description {
    font-size: 1rem;
    line-height: 1.6;
    color: var(--text-secondary);
  }
  
  /* --- RESPONSIVE TIMELINE --- */
  @media (max-width: 768px) {
    .timeline::after {
      left: 31px;
    }
    .timeline-item {
      width: 100%;
      padding-left: 70px;
      padding-right: 25px;
    }
    .timeline-item.right {
      left: 0%;
    }
    
    .timeline-item.left::after, .timeline-item.right::after {
      left: 21px; /* Center circle on 31px line (width 16px/2 = 8, 31-8=23? No. 
                   Line is at 31px. Dot is 16px wide/high + 3px border = ~22px.
                   Wait, border is inside or outside? box-sizing not set on pseudo default but usually content-box.
                   If border 3px, total size 22px. Center 11px.
                   31px - 11px = 20px left. Use 20px. */
      left: 20px;
    }
    
    .timeline-item.left .content-box::before, .timeline-item.right .content-box::before {
      left: -30px; /* Short line to connect to dot */
      width: 30px; 
    }
    
    .content-box {
        padding: 20px;
        flex-direction: column;
        text-align: center;
        gap: 15px;
    }
    .school-logo {
        margin-right: 0;
    }
    .text-content {
        align-items: center;
    }
  }

  @media (max-width: 480px) {
    .education-container {
        padding: 5rem 5%;
    }
    h2 {
        font-size: 1.8rem;
        margin-bottom: 2rem;
    }
    .content-box {
        padding: 15px;
        gap: 10px;
    }
    .text-content h3 {
        font-size: 1.2rem;
    }
    .text-content p {
        font-size: 0.95rem;
    }
    .school-logo {
        width: 50px;
        height: 50px;
    }
  }
</style>