/**
 * Person API Controller
 *
 * Handles requests related to person details and medias.
 *
 * @module PersonController
 */

import responseHandler from "../handlers/response.handler.js";
import tmdbApi from "../tmdb/tmdb.api.js";

/**
 * Retrieves person details by ID.
 *
 * @async
 * @param {Object} req - Express request object
 * @param {string} req.params.personId - Person ID
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 * @example
 * GET /person/123
 * {
 *   "id": 123,
 *   "name": "John Doe",
 *   "birthday": "1990-01-01",
 *   ...
 * }
 */
const personDetail = async (req, res) => {
  try {
    const { personId } = req.params;

    const person = await tmdbApi.personDetail({ personId });

    responseHandler.ok(res, person);
  } catch {
    responseHandler.error(res);
  }
};

/**
 * Retrieves medias (movies and TV shows) associated with a person by ID.
 *
 * @async
 * @param {Object} req - Express request object
 * @param {string} req.params.personId - Person ID
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 * @example
 * GET /person/123/medias
 * [
 *   {
 *     "id": 456,
 *     "title": "Movie Title",
 *     "release_date": "2020-01-01",
 *     ...
 *   },
 *   {
 *     "id": 789,
 *     "name": "TV Show Name",
 *     "first_air_date": "2010-01-01",
 *     ...
 *   }
 * ]
 */
const personMedias = async (req, res) => {
  try {
    const { personId } = req.params;

    const medias = await tmdbApi.personMedias({ personId });

    responseHandler.ok(res, medias);
  } catch {
    responseHandler.error(res);
  }
};

export default { personDetail, personMedias };