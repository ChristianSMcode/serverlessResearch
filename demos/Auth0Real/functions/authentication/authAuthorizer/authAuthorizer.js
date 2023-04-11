const tokenProcessing = require('./tokenProcessing');
let data;

// Lambda function index.handler - thin wrapper around lib.authenticate
exports.lambdaHandler  = async (event, context) => {
  try {
    data = await tokenProcessing.authenticate(event);
  }
  catch (err) {
    throw new Error('Unauthorized')
  }
  return data;
};