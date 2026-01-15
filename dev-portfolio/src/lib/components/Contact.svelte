<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger);

		gsap.from('.contact-content', {
			opacity: 0,
			y: 50,
			duration: 0.8,
			scrollTrigger: {
				trigger: '.contact-section',
				start: 'top 80%',
			}
		});

        // Removed social-link animation to ensure visibility on all devices
        
        gsap.from('.social-link', {
            opacity: 1,
            y: 20,
            duration: 0.5,
            stagger: 0.1,
            delay: 0.3,
            scrollTrigger: {
                trigger: '.contact-section',
                start: 'top 80%',
            }
        });
        
	});

    const currentYear = new Date().getFullYear();
</script>

<section class="contact-section" id="contact">
	<div class="contact-content">
		<h2>Get In Touch</h2>
		<p>
			I'm currently looking for new opportunities. Whether you have a question or just want to say hi,
			I'll try my best to get back to you!
		</p>

		<a href="mailto:markjosephpotot12@gmail.com" class="email-btn">
			<i class="fas fa-envelope"></i> Say Hello
		</a>

		<div class="social-links">
			<a href="https://github.com/Mark20042" target="_blank" rel="noopener noreferrer" class="social-link" title="GitHub">
				<i class="fab fa-github"></i>
			</a>
			<a href="https://www.linkedin.com/in/mark-joseph-potot-7299a9332/" target="_blank" rel="noopener noreferrer" class="social-link" title="LinkedIn">
				<i class="fab fa-linkedin"></i>
			</a>
            <a href="https://www.facebook.com/makoyjoseph.minor/" target="_blank" rel="noopener noreferrer" class="social-link" title="Facebook">
				<i class="fab fa-facebook"></i>
			</a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" class="social-link" title="Instagram">
				<i class="fab fa-instagram"></i>
			</a>
		</div>
	</div>

    <footer class="footer">
        <p>Built with Svelte & GSAP by Mark Joseph Potot</p>
        <p class="copyright">&copy; {currentYear} All Rights Reserved.</p>
    </footer>
</section>

<style>
	.contact-section {
		padding: 5rem 1rem 0; /* Top padding, footer handles bottom */
		text-align: center;
		color: var(--text-primary);
        background: var(--bg-primary); /* Ensure it blends or stands out */
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 3rem;
	}

	.contact-content {
		max-width: 600px;
		margin: 0 auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1.5rem;
	}

	h2 {
		font-size: 2.5rem;
		color: var(--accent-primary);
		margin-bottom: 1rem;
	}

	p {
		color: var(--text-secondary);
		line-height: 1.6;
		font-size: 1.1rem;
	}

	.social-links {
		display: flex;
		gap: 2rem;
		margin-top: 2rem;
        justify-content: center;
        align-items: center;
	}

	.social-link {
		font-size: 2.2rem; /* Bigger icons */
		color: var(--text-secondary);
		transition: all 0.3s ease;
        display: flex; /* Center alignment */
        align-items: center;
        justify-content: center;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: var(--bg-card); /* Add background card circle */
        border: 1px solid var(--border-light);
        box-shadow: 0 4px 10px rgba(0,0,0,0.1);
	}

    .social-link:hover {
        color: var(--accent-primary);
        transform: translateY(-5px);
        box-shadow: 0 8px 20px rgba(var(--accent-primary-rgb), 0.3);
        border-color: var(--accent-primary);
    }
    
    .email-btn {
		display: inline-flex;
        align-items: center;
        gap: 0.8rem;
		padding: 1rem 2.5rem; /* Larger button */
        font-size: 1.1rem;
		border: 2px solid var(--accent-primary); /* Thicker border */
		color: var(--accent-primary);
		border-radius: 50px; /* Rounded pill shape */
		text-decoration: none;
		font-weight: 600;
		transition: all 0.3s ease;
		margin-top: 1rem;
	}

	.email-btn:hover {
        background: var(--accent-primary);
        color: #fff; /* Ensure text is white on hover */
		transform: translateY(-3px);
        box-shadow: 0 5px 15px rgba(var(--accent-primary-rgb), 0.4);
	}

    .footer {
        width: 100%;
        padding: 2rem 0;
        border-top: 1px solid var(--border-light);
        margin-top: 2rem;
        font-size: 0.9rem;
        color: var(--text-secondary);
    }
    
    .footer p {
        font-size: 0.85rem;
        margin: 0.2rem 0;
    }

    @media (max-width: 768px) {
        h2 {
            font-size: 2rem;
        }
        .contact-section {
            padding: 4rem 1rem 0;
        }
    }
</style>
