import { createSwaggerSpec } from 'next-swagger-doc'

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: 'src/docs',
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Master Scraper APIs',
        version: '1.0',
      },
      servers: [
        {
          url: 'http://localhost:8000',
          description: 'HTTP API endpoint',
        },
        {
          url: 'http://127.0.0.1:8000',
          description: 'Local HTTP endpoint',
        },
      ],
      // Add this tags array to control the order
      components: {
        securitySchemes: {
          ScrapingApiToken: {
            type: 'apiKey',
            in: 'header',
            name: 'Validation-Token',
            description: 'Scraping API token in format: Scraper your_token',
          },
        },
      },
    },
  })
  return spec
}
