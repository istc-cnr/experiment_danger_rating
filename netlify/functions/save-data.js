const { MongoClient } = require('mongodb');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is not defined');
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Database configuration error' })
    };
  }

  let client;
  try {
    client = new MongoClient(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });

    await client.connect();
    console.log('Connected to MongoDB');
    
    const data = JSON.parse(event.body);
    const db = client.db('CNR_Size_Rating');
    const collection = db.collection('user_responses');
    
    const result = await collection.insertOne(data);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, id: result.insertedId })
    };
  } catch (error) {
    console.error('Database error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Database operation failed',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    };
  } finally {
    if (client) {
      await client.close();
    }
  }
};
