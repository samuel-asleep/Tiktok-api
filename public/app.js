document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('download-form');
    const urlInput = document.getElementById('tiktok-url');
    const messageContainer = document.getElementById('message-container');
    const resultsContainer = document.getElementById('results-container');
    const submitBtn = document.getElementById('submit-btn');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const url = urlInput.value;

        if (!url) {
            showMessage('Please enter a TikTok URL', 'error');
            return;
        }

        // Disable button and show loading
        submitBtn.disabled = true;
        submitBtn.textContent = 'Downloading...';
        showMessage('Fetching video data, please wait...', 'loading');
        resultsContainer.innerHTML = '';

        try {
            const response = await fetch('/api/download', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url: url, version: 'v1' }) // Default to v1
            });

            const data = await response.json();

            if (data.status === 'error') {
                showMessage(data.message, 'error');
            } else {
                // Success
                messageContainer.style.display = 'none'; // Hide message box
                displayResults(data.data);
            }

        } catch (error) {
            console.error('Fetch Error:', error);
            showMessage('Failed to connect to the server. Is it running?', 'error');
        } finally {
            // Re-enable button
            submitBtn.disabled = false;
            submitBtn.textContent = 'Download';
        }
    });

    function showMessage(message, type = 'loading') {
        messageContainer.textContent = message;
        messageContainer.className = type; // 'loading' or 'error'
    }

    function displayResults(data) {
        let html = '';

        html += `
            <div class="video-result">
                <h3>${data.description || 'No description'}</h3>
                <p>By: ${data.author.nickname} (@${data.author.username})</p>
        `;

        // Handle video type
        if (data.type === 'video' && data.video) {
            html += `
                <video controls poster="${data.video.cover}" src="${data.video.video_hd}">
                    Your browser does not support the video tag.
                </video>
                <div class="download-links">
                    <a href="${data.video.video_hd}" target="_blank" download>Download HD Video</a>
                    <a href="${data.video.video_sd}" target="_blank" download>Download SD Video</a>
                </div>
            `;
        }
        // Handle image type
        else if (data.type === 'image' && data.images) {
             html += `<p>This is an image slideshow. Download images below:</p>`;
             data.images.forEach((imgUrl, index) => {
                html += `<img src="${imgUrl}" alt="Slide ${index + 1}">`;
             });
             html += '<div class="download-links">';
             data.images.forEach((imgUrl, index) => {
                html += `<a href="${imgUrl}" target="_blank" download="slide-${index + 1}.jpg">Download Image ${index + 1}</a>`;
             });
             html += '</div>';
        } else {
            html += `<p>Could not find video or image download links.</p>`;
        }

        // Add music info
        if (data.music) {
            html += `
                <h4>Music: ${data.music.title} - ${data.music.author}</h4>
                <audio controls src="${data.music.playUrl[0]}"></audio>
            `;
        }

        html += '</div>';
        resultsContainer.innerHTML = html;
    }
});
