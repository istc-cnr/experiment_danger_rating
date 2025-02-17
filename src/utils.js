function generateUID() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

async function saveToMongoDB(data, userID) {
    try {
        const response = await fetch('/save-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: userID,
                timestamp: new Date().toISOString(),
                ...data
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error saving to MongoDB:', error);
        throw error;
    }
}

function handleLoadError(error) {
    console.error('Error loading experiment resources:', error);
    document.body.innerHTML = `
        <div style="text-align: center; margin-top: 50px; padding: 20px;">
            <h2>Error Loading Experiment</h2>
            <p>There was a problem loading the experiment resources. Please try refreshing the page or contact the administrator.</p>
            <p>Error details: ${error.message}</p>
        </div>
    `;
}
