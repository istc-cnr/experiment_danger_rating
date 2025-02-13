function generateUID() {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substr(2, 5);
    return `${timestamp}-${randomStr}`;
}

async function saveToMongoDB(data, userID) {
    // Validate input
    if (!data || !userID) {
        throw new Error('Missing required parameters');
    }

    // Validate data structure
    if (!Array.isArray(data.trials) || !data.total_time_ms) {
        throw new Error('Invalid data structure');
    }

    try {
        const response = await fetch('http://localhost:3000/save-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': config.apiKey
            },
            body: JSON.stringify({
                userID: userID,
                timestamp: new Date(),
                ...data
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error saving to MongoDB:', error);
        throw error;
    }
}
