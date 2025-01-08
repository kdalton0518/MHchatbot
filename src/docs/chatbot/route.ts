/**
 * @swagger
 * paths:
 *   /api/v1/chatbot:
 *     post:
 *       summary: Send message to Mental Health Counseling Chatbot
 *       tags:
 *         - Mental Health Chatbot
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 user_message:
 *                   description: User's message to the chatbot
 *                   example: "I've been feeling anxious lately"
 *                 user_id:
 *                   description: Unique identifier for the user
 *                   example: "user123"
 *       responses:
 *         '200':
 *           description: Successfully processed chat message
 *           content:
 *             application/json:
 *               schema:
 *                 properties:
 *                   response:
 *                     type: string
 *                     description: Chatbot's response message
 *         '400':
 *           description: Missing or invalid request parameters
 *         '500':
 *           description: Internal server error during processing
 *
 *   /api/v1/chathistory:
 *     post:
 *       summary: Retrieve chat history for a user
 *       tags:
 *         - Mental Health Chatbot
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 user_id:
 *                   description: User ID to fetch chat history
 *                   example: "user123"
 *       responses:
 *         '200':
 *           description: Successfully retrieved chat history
 *         '404':
 *           description: No chat history found
 *         '500':
 *           description: Internal server error
 */
