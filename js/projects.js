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