function generateUID() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

async function saveToMongoDB(data, userID) {
    try {
        const response = await fetch('https://istc-cnr.github.io/experiment_danger_rating/save-data', {
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

async function checkPassword(password) {
    try {
        const response = await fetch('/verify-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ password })
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Server returned ${response.status}: ${errorText}`);
        }
        
        const result = await response.json();
        return result.valid;
    } catch (error) {
        console.error('Error checking password:', error);
        throw new Error('Failed to verify password. Please try again.');
    }
}
