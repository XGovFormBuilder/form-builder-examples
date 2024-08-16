/**
 * @typedef {Object} Question
 * @property {string} key - The key of the question.
 * @property {string} answer - The answer to the question.
 */

/**
 * @typedef {Object} Category
 * @property {string} [category] - The category (or section name) of the question
 * @property {Array<Question>} fields - The questions in the category.
 */

/**
 * @typedef {Array<Category>} Questions
 */

/**
 * @typedef {Object} InitialisationOptions
 * @property {Object} metadata - The metadata of the session.
 * @property {Questions} questions - The questions for the session.
 * @property {Object} options - The options for the session.
 * @property {string} options.callbackUrl - The callback URL.
 * @property {string} options.redirectPath - The redirect path.
 */

/**
 * @typedef {Object} InitialisationResponseBody
 * @property {string} token - The token used to access the user's data.
 */
