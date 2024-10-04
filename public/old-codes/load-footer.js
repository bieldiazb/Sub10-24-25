// Function to load the footer from footer.html
async function loadFooter() {
    const footerContainer = document.createElement('div');
    footerContainer.id = 'footer-container';

    try {
        const response = await fetch('footer.html');
        if (!response.ok) {
            throw new Error('Failed to load footer');
        }
        const footerHTML = await response.text();
        footerContainer.innerHTML = footerHTML;
        document.body.appendChild(footerContainer);
    } catch (error) {
        console.error('Error loading footer:', error);
    }
}

// Load the footer when the page loads
window.onload = loadFooter;
