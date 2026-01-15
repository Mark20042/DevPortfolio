// src/lib/data/projects.ts

import sipacareer from '$lib/assets/projects/sipacareer.png';
import kapesaamigo from '$lib/assets/projects/kapesaamigo.png';
import ravex from '$lib/assets/projects/ravex.png';
import vortex from '$lib/assets/projects/vortex.png';
import linetracing from '$lib/assets/projects/linetracing.jpg';
import sumobot from '$lib/assets/projects/sumobot.jpg';
import vox from '$lib/assets/projects/vox.png';
import vox1 from '$lib/assets/projects/vox1.png';
import vox2 from '$lib/assets/projects/vox2.png';
import vox3 from '$lib/assets/projects/vox3.png';
import linog from '$lib/assets/projects/linog.png';
import linog1 from '$lib/assets/projects/linog1.png';
import linog2 from '$lib/assets/projects/linog2.png';

export interface ProjectItem {
	id: number;
	title: string;
	category: string;
	description: string;
	image: string;
	images: string[];
	techStack: string[];
	githubLink?: string;
	liveDemoLink?: string;
}

export const projectsData: ProjectItem[] = [
	{
		id: 1,
		title: 'Philippines Linog Tracker',
		category: 'Frontend Development & Data Visualization',
		description:
			'A dynamic earthquake tracking dashboard for the Philippines built with Vue.js. This application utilizes web scraping to fetch real-time data from PHIVOLCS, visualizing seismic events on an interactive map using Leaflet and OpenStreetMap markers. Features include a filterable sidebar list of recent earthquakes showing magnitude, location, date, and depth, along with a summary panel displaying statistical totals for the day, week, and month.',
		image: linog1,
		images: [linog, linog1, linog2],
		techStack: ['Vue.js', 'Web Scraping', 'Leaflet', 'OpenStreetMap', 'CSS'],
		githubLink: undefined,
		liveDemoLink: undefined
	},
	{
		id: 2,
		title: 'VOX - AI Voice Assistant',
		category: 'Full Stack & AI Development',
		description:
			'A modern, AI-powered voice assistant combining a robust Python FastAPI backend with an immersive React and Three.js frontend. This system features real-time speech recognition, text-to-speech, and WebSocket-based communication wrapped in a beautiful 3D animated UI. Capabilities include document processing (PDF, DOCX, Excel) and advanced voice automation to instantly play YouTube videos or query Wikipedia.',
		image: vox3,
		images: [vox, vox1, vox2, vox3],
		techStack: ['React', 'Three.js', 'Python', 'FastAPI', 'WebSockets', 'NLP'],
		githubLink: undefined,
		liveDemoLink: undefined
	},
	{
		id: 3,
		title: 'SipaCareer (MERN Stack Portal)',
		category: 'Web Development',
		description:
			'A comprehensive career portal built with the MERN stack, featuring user authentication, job listings, application tracking, and an admin dashboard.',
		image: sipacareer,
		images: [sipacareer], // Add more images here when available
		techStack: ['MongoDB', 'Express.js', 'React.js', 'Node.js', 'Redux', 'Material-UI'],
		githubLink: undefined,
		liveDemoLink: undefined
	},
	{
		id: 4,
		title: 'Ravex (Django Car Marketplace)',
		category: 'Full-Stack Development',
		description:
			'A complete buy-and-sell platform for vehicles, built entirely with Django. Ravex allows users to create accounts, list cars for sale with detailed specifications, and browse or search for vehicles using advanced filtering.',
		image: ravex,
		images: [ravex], // Add more images here when available
		techStack: ['Django', 'Python', 'SQLite', 'JavaScript', 'Bootstrap', 'HTML/CSS'],
		githubLink: undefined,
		liveDemoLink: undefined
	},
	{
		id: 5,
		title: 'Kape Sa Amigo (Coffee Shop Website)',
		category: 'Full-Stack Development',
		description:
			"A full-featured website for a local coffee shop, 'Kape Sa Amigo.' The site features an elegant landing page, a menu showcase, and an integrated table reservation system. The backend is powered by PHP with PDO for secure database connections and includes PayPal integration for online orders or payments.",
		image: kapesaamigo,
		images: [kapesaamigo], // Add more images here when available
		techStack: ['PHP', 'PDO', 'PayPal', 'JavaScript', 'HTML/CSS'],
		githubLink: undefined,
		liveDemoLink: undefined
	},
	{
		id: 6,
		title: 'Arduino Line-Tracing Robot',
		category: 'Robotics & Hardware',
		description:
			'An autonomous line-following robot built with an Arduino. It uses IR sensors to detect and follow a black line on a white surface, adjusting its motors in real-time to navigate the course. This project demonstrates core concepts in sensor integration, motor control, and embedded C++ programming.',
		image: linetracing,
		images: [linetracing], // Add more images here when available
		techStack: ['Arduino', 'C++', 'IR Sensors', 'Motor Driver', 'Robotics'],
		githubLink: undefined,
		liveDemoLink: undefined
	},
	{
		id: 7,
		title: 'Sumobot (Creative Visionary Award)',
		category: 'Robotics & Hardware',
		description:
			"An autonomous, sensor-driven Sumobot built for the 'InnovaTech Nexus' robotics exhibition. Designed to detect and push opponents out of a ring, this robot won the 'Creative Visionary Award' for its exceptional innovation and practical application of robotics principles.",
		image: sumobot,
		images: [sumobot], // Add more images here when available
		techStack: ['Arduino', 'C++', 'Ultrasonic Sensors', 'Motor Driver', 'Robotics'],
		githubLink: undefined,
		liveDemoLink: undefined
	},
	{
		id: 8,
		title: 'Vortex Vermillion (Esports Static Website)',
		category: 'Frontend Development',
		description:
			"A meticulously designed static website for the 'Vortex Vermillion' esports team, showcasing a clean, modern aesthetic with sharp visuals and responsive layouts built entirely with HTML and CSS. Features include team rosters, upcoming matches, news sections, and a dynamic hero banner.",
		image: vortex,
		images: [vortex], // Add more images here when available
		techStack: ['HTML', 'CSS', 'Responsive Design', 'Web Design'],
		githubLink: undefined,
		liveDemoLink: undefined
	}
];
