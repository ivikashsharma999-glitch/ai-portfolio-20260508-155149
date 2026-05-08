document.addEventListener('DOMContentLoaded', () => {

    /* 1. Theme Toggle */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;
    
    // Check local storage
    const savedTheme = localStorage.getItem('theme') || 'dark';
    htmlEl.setAttribute('data-theme', savedTheme);

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlEl.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        htmlEl.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateChartTheme(newTheme);
    });

    /* Removed deprecated custom cursor, Typed.js, and particles.js */

    /* 5. ScrollReveal */
    if(window.ScrollReveal) {
        const sr = ScrollReveal({
            origin: 'bottom',
            distance: '50px',
            duration: 1000,
            delay: 100,
            reset: false
        });
        sr.reveal('.sr-bottom', { interval: 200 });
    }

    /* 6. Chart.js Radar Chart */
    let skillsChart;
    const initChart = () => {
        const ctx = document.getElementById('skillsRadar');
        if(!ctx) return;
        
        const isLight = htmlEl.getAttribute('data-theme') === 'light';
        const textColor = isLight ? '#4b5563' : 'rgba(255,255,255,0.7)';
        const gridColor = isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)';
        const primaryColor = isLight ? 'rgba(5, 150, 105, 0.5)' : 'rgba(16, 185, 129, 0.5)';
        const primaryBorder = isLight ? '#059669' : '#10b981';

        if(skillsChart) skillsChart.destroy();

        skillsChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Machine Learning', 'Deep Learning', 'Computer Vision', 'NLP', 'Data Eng', 'MLOps'],
                datasets: [{
                    label: 'Skill Level',
                    data: [90, 85, 80, 88, 75, 70],
                    backgroundColor: primaryColor,
                    borderColor: primaryBorder,
                    pointBackgroundColor: primaryBorder,
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: primaryBorder
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: { color: gridColor },
                        grid: { color: gridColor },
                        pointLabels: { color: textColor, font: { family: 'Inter', size: 12 } },
                        ticks: { display: false, max: 100, min: 0 }
                    }
                },
                plugins: { legend: { display: false } }
            }
        });
    };
    initChart();
    
    const updateChartTheme = (theme) => {
        initChart(); // Re-init to update colors
    };

    /* 7. GitHub API Fetch */
    const fetchGitHubProjects = async () => {
        const container = document.getElementById('github-projects-container');
        if(!container) return;
        
        try {
            const username = 'ivikashsharma999-glitch';
            const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
            if(!response.ok) throw new Error('Network response was not ok');
            const repos = await response.json();
            
            container.innerHTML = ''; // Clear loading
            
            if(repos.length === 0) {
                container.innerHTML = '<p>No public repositories found.</p>';
                return;
            }

            repos.forEach(repo => {
                // Determine a fake category based on repo name or language for the filter demo
                const nameLower = repo.name.toLowerCase();
                let category = 'genai';
                if(nameLower.includes('vision') || nameLower.includes('image')) category = 'cv';
                else if(nameLower.includes('nlp') || nameLower.includes('text')) category = 'nlp';

                const card = document.createElement('div');
                card.className = `project-card filter-item ${category}`;
                card.setAttribute('data-tilt', '');

                // Custom override for Email Creator project
                const isEmailCreator = nameLower === 'email-creator';
                const liveDemoUrl = isEmailCreator ? 'https://email-creator-blush.vercel.app/' : repo.homepage;

                card.innerHTML = `
                    <h3>${repo.name}</h3>
                    <p>${repo.description || 'An awesome AI project built with modern technologies.'}</p>
                    <div class="project-tags">
                        <span>${repo.language || 'Python'}</span>
                        <span>⭐ ${repo.stargazers_count}</span>
                    </div>
                    <div class="project-links">
                        <a href="${repo.html_url}" target="_blank"><i class="fab fa-github"></i> Source Code</a>
                        ${liveDemoUrl ? `<a href="${liveDemoUrl}" target="_blank"><i class="fas fa-external-link-alt"></i> Live Demo</a>` : ''}
                    </div>
                `;
                container.appendChild(card);
            });
            
            // Re-init VanillaTilt for new cards
            if(window.VanillaTilt) {
                VanillaTilt.init(document.querySelectorAll(".project-card"), {
                    max: 15,
                    speed: 400,
                    glare: true,
                    "max-glare": 0.2
                });
            }
        } catch (error) {
            console.error('Error fetching GitHub repos:', error);
            container.innerHTML = '<p>Failed to load projects from GitHub. Displaying fallback data.</p>';
        }
    };
    fetchGitHubProjects();

    /* 8. Project Filtering */
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            const projects = document.querySelectorAll('.project-card');
            
            projects.forEach(project => {
                if(filterValue === 'all' || project.classList.contains(filterValue)) {
                    project.style.display = 'flex';
                } else {
                    project.style.display = 'none';
                }
            });
        });
    });

    /* 9. EmailJS Form Handling */
    const contactForm = document.getElementById('contact-form');
    if(contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const statusDiv = document.getElementById('form-status');
            statusDiv.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            statusDiv.style.color = 'var(--text-primary)';
            
            // NOTE: User needs to replace these with actual EmailJS keys
            // emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', this, 'YOUR_PUBLIC_KEY')
            
            // Mock success for now since keys aren't provided
            setTimeout(() => {
                statusDiv.innerHTML = '<i class="fas fa-check-circle"></i> Message sent successfully! (Mock)';
                statusDiv.style.color = 'var(--primary-color)';
                contactForm.reset();
            }, 1500);
        });
    }

});
