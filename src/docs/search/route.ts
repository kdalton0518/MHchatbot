/**
 * @swagger
 * paths:
 *   /api/v1/semanticsearch:
 *     post:
 *       summary: Perform semantic search on mental health related content
 *       tags:
 *         - Mental Health SemanticSearch
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 query:
 *                   description: Search query for finding relevant mental health content
 *                   example: "How to deal with anxiety attacks"
 *       responses:
 *         '200':
 *           description: Successfully retrieved semantic search results
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: Unique identifier of the result
 *                     context:
 *                       type: string
 *                       description: Context or question text
 *                     response:
 *                       type: string
 *                       description: Corresponding response or answer
 *                     similarity:
 *                       type: number
 *                       description: Similarity score of the result
 *         '400':
 *           description: Missing or invalid search query
 *         '500':
 *           description: Internal server error during search process
 */
