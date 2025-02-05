// Filter Projects
function filterProjects(status) {
    const projects = document.querySelectorAll('.project');
    projects.forEach(project => {
        if (status === 'all' || project.getAttribute('data-status') === status) {
            project.style.display = 'block';
        } else {
            project.style.display = 'none';
        }
    });
}

// Open Modal with image, title, and description
function openModal(title, description, imageSrc) {
    document.getElementById('modal').style.display = 'block';
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-description').textContent = description;
    document.getElementById('modal-image').src = imageSrc;
}

// Close Modal
function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

// Close modal if clicked outside the modal content
window.onclick = function(event) {
    if (event.target === document.getElementById('modal')) {
        closeModal();
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-links .navtab");

    function updateActiveTab() {
        let currentSection = "";

        sections.forEach((section) => {
            const sectionTop = section.offsetTop - 100; // Adjust for fixed nav
            if (window.scrollY >= sectionTop) {
                currentSection = section.getAttribute("id");
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href").includes(currentSection)) {
                link.classList.add("active");
            }
        });
    }

    window.addEventListener("scroll", updateActiveTab);
    updateActiveTab();
});

// Shrink header on scroll effect
window.addEventListener("scroll", function () {
    let header = document.querySelector("header");
    if (window.scrollY > 250) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
});