# Sentence Danger Rating Experiment

A web-based experiment for collecting danger ratings of English-Italian sentence pairs using jsPsych library.

## Overview

This application presents participants with English-Italian sentence pairs and asks them to rate the perceived danger level of each sentence on a scale from 0 (Very Safe) to 9 (Very Dangerous). The responses are collected and stored in MongoDB.

## Features

- Responsive web interface for sentence presentation
- 0-9 danger rating scale
- Progress bar tracking
- Data persistence using MongoDB

## Prerequisites

- Node.js (v12 or higher)
- MongoDB instance
- Modern web browser
- npm or yarn package manager

## Installation

1. Clone the repository:

```bash
git clone [repository-url]
cd experiment_danger_rating
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with your MongoDB connection string:

```
MONGODB_URI=your_mongodb_connection_string
API_KEY=...
API_URL=https://istc-cnr.github.io/experiment_danger_rating
NODE_ENV=development
```

## Project Structure

```
experiment_danger_rating/
├── src/
│   ├── index.html        # Main experiment interface
│   ├── instructions.html # Experiment instructions
│   ├── styles.css       # Styling for the experiment
│   ├── utils.js         # Utility functions
│   └── server.js        # Express server for data handling
├── data/
│   └── randomized_sentences.json  # Sentence pairs data
└── README.md
```

## Running the Experiment

1. Start the server:

```bash
node src/server.js
```

2. Open your web browser and navigate to:

```
http://localhost:3000
```

## Data Structure

Responses are stored in MongoDB with the following structure:

```javascript
{
    userID: string,
    timestamp: Date,
    trials: [{
        english: string,
        italian: string,
        danger_rating: number,
        response_time_ms: number,
        trial_number: number
    }],
    total_time_ms: number
}
```

## Technology Stack

- Frontend: HTML5, CSS3, JavaScript
- Backend: Node.js, Express
- Database: MongoDB
- Libraries: jsPsych, Font Awesome

## Deploying to GitHub Pages

To deploy the `main` branch of this repository to GitHub Pages, follow these steps:

1. Create a new file `.github/workflows/deploy.yml` with the following content:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v2

      - name: Install dependencies
        run: npm install

      - name: Build project
        run: npm run build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

2. Commit and push your changes to the `main` branch.

3. Go to the repository settings on GitHub, scroll down to the "GitHub Pages" section, and select the `gh-pages` branch as the source.

4. Your site should be available at `https://<username>.github.io/experiment_danger_rating`.

## License

GPL-3.0 license
