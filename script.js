// Handle section navigation
document.addEventListener('DOMContentLoaded', () => {
    // Get all navigation links (excluding blog link)
    const navLinks = document.querySelectorAll('.nav-link[data-section]');
    const sections = document.querySelectorAll('.section');

    // Function to show a specific section
    function showSection(targetId) {
        sections.forEach(section => {
            section.classList.remove('active');
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
        });

        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        const activeLink = document.querySelector(`.nav-link[href="${targetId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    // Handle navigation clicks
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            showSection(targetId);

            // Update URL hash
            window.location.hash = targetId;
        });
    });

    // Handle initial load and hash changes
    function handleHashChange() {
        const hash = window.location.hash || '#home';
        showSection(hash);
    }

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
});
