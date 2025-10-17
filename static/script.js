async function generate() {
    const prompt = document.getElementById('prompt').value.trim();
    const mode = document.getElementById('mode').value;
    
    if (!prompt) {
        showError('Please enter a prompt!');
        return;
    }

    // Show loading state
    showLoading(mode);

    try {
        if (mode === 'image') {
            // For images, we need to handle differently since it's binary data
            const response = await fetch('/generate_image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: prompt })
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Image generation failed');
            }
            
            // Create image URL from blob
            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob);
            showImageResult(imageUrl);
            
        } else if (mode === 'text') {
            // Your existing text generation code
            const response = await fetch('/generate_text', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: prompt })
            });
            
            const data = await response.json();
            if (data.error) throw new Error(data.error);
            
            showTextResult(data.response);
        }
        
    } catch (error) {
        showError(error.message);
    } finally {
        // Hide loading state
        hideLoading();
    }
}

function showImageResult(imageUrl) {
    const output = document.getElementById('output');
    output.innerHTML = `
        <div class="result">
            <h3>🎨 Generated Image:</h3>
            <img src="${imageUrl}" alt="Generated image" class="result-image">
            <div class="result-actions">
                <button onclick="downloadImage('${imageUrl}')">📥 Download</button>
            </div>
        </div>
    `;
}

function showTextResult(text) {
    const output = document.getElementById('output');
    output.innerHTML = `
        <div class="result">
            <h3>📝 Generated Text:</h3>
            <div class="result-text">${text}</div>
            <div class="result-actions">
                <button onclick="copyText('${text}')">📋 Copy Text</button>
            </div>
        </div>
    `;
}