const config = {
    development: {
        apiUrl: 'http://localhost:3000',
        apiKey: process.env.API_KEY || 'your-dev-api-key'
    },
    production: {
        apiUrl: 'https://istc-cnr.github.io/experiment_danger_rating',
        apiKey: process.env.API_KEY
    }
};

const environment = process.env.NODE_ENV || 'development';
export default config[environment];
