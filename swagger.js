const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
      openapi: '3.1.0',
      info: {
        title: 'Project Management System API',
        description: "API endpoints for a Project Management System services documented on swagger",
        contact: {
          name: "Ricardo Retamal Guerrero",
          email: "ricardoretamal10@gmail.com",
          url: "https://github.com/RicardoRG96/project_management_system"
        },
        version: '1.0.0',
      },
      servers: [
        {
          url: "http://localhost:3000/",
          description: "Local server"
        },
        {
          url: "<your live url here>",
          description: "Live server"
        },
      ]
    },
    apis: ['./src/*/routes/*/*-routes.js'],
}
const swaggerSpec = swaggerJsdoc(options)
function swaggerDocs(app, port) {
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
    app.get('/docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json')
        res.send(swaggerSpec)
    })
}
module.exports = swaggerDocs