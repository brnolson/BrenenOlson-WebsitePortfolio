// Filter Projects
function filterProjects(status) {
    const projects = document.querySelectorAll('.project');
    const buttons = document.querySelectorAll('.filter-btn');

    // Show/hide projects based on filter
    projects.forEach(project => {
        if (status === 'all' || project.getAttribute('data-status') === status) {
            project.classList.remove('hidden');
        } else {
            project.classList.add('hidden');
        }
    });

    // Remove active class from all buttons
    buttons.forEach(button => button.classList.remove('active'));

    // Add active class to the clicked button
    document.querySelector(`.filter-btn[onclick="filterProjects('${status}')"]`).classList.add('active');
}


// Open Modal with image, title, and description
function openModal(title, description, imageSrc, skills = []) {
    document.getElementById('modal').style.display = 'flex';
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-description').innerHTML = description;
    document.getElementById('modal-image').src = imageSrc;

    // Select skills container
    const skillsContainer = document.getElementById('modal-skills');
    skillsContainer.innerHTML = "";

    // Add skills dynamically
    skills.forEach(skill => {
        let skillBox = document.createElement("div");
        skillBox.classList.add("skill-box");
        skillBox.textContent = skill;
        skillsContainer.appendChild(skillBox);
    });
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
};


// Navtab highlight
document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-links .navtab");

    function updateActiveTab() {
        let currentSection = "";

        sections.forEach((section) => {
            const sectionTop = section.offsetTop -300; // Adjust for fixed nav
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