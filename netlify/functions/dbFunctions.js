const { get } = require('axios');

exports.handler = async (event, context) => {
  try {
    const response = await get('https://your-json-server-url/db.json');
    return {
      statusCode: 200,
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Unable to fetch data from the fake database.' })
    };
  }
};
