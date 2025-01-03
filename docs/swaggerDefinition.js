// docs/swaggerDefinition.js
const swaggerDefinition = {
  openapi: "3.0.0", // OpenAPI specification version
  info: {
    title: "API Documentation", // Title of your API
    version: "1.0.0", // Version of your API
    description: "A simple API documentation", // Short description of your API
  },
  servers: [
    {
      url: "http://server.ntcreservation.me/api/v1", // Base URL of your API
      description: "Development server",
    },
  ],
};

module.exports = swaggerDefinition;
