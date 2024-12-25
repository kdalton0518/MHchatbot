/**
 * @swagger
 * paths:
 *   /api/v1/scraperapi/facebookprofile:
 *     post:
 *       security:
 *         - ScrapingApiToken: []
 *       summary: Scrape Facebook company profile
 *       tags:
 *         - Facebook Scraper
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 company_name:
 *                   description: Select your scraping API token
 *                   example: "Mikes Electrical And Handy Services"
 *                 company_address:
 *                   description: Query to scrape
 *                   example: "4024 Moro Bay HwyEl DoradoArkansas"
 *       responses:
 *         '200':
 *           description: Successfully scraped Facebook company profile
 *         '401':
 *           description: Validation token is missing in request header
 *         '403':
 *           description: Invalid token or insufficient permissions for Facebook scraping
 *         '404':
 *           description: Invalid API endpoint
 *         '400':
 *           description: Missing or invalid request parameters
 *         '500':
 *           description: Internal server error during scraping process
 */
