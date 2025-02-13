function generateUID() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

async function saveToMongoDB(data, userID) {
    try {
        const response = await fetch('http://localhost:3000/save-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userID: userID,
                timestamp: new Date(),
                ...data
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error saving to MongoDB:', error);
        throw error;
    }
}
