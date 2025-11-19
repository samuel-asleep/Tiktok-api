document.addEventListener('DOMContentLoaded', async () => {
    const preElement = document.getElementById('docs-content');

    try {
        const response = await fetch('/api/docs');
        const data = await response.json();
        
        // Format the JSON with 2-space indentation
        const formattedJson = JSON.stringify(data, null, 2);
        
        preElement.textContent = formattedJson;

    } catch (error) {
        console.error('Error fetching API docs:', error);
        preElement.textContent = 'Error loading API documentation.\n\nPlease make sure the server is running and accessible.';
        preElement.style.color = '#f8d7da'; // Error color
    }
});
