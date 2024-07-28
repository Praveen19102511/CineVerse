/**
 * Media Controller
 * 
 * Handles media-related requests, including retrieving lists, genres, searching, and details.
 * 
 * @module media.controller
 */

import responseHandler from "../handlers/response.handler.js";
import tmdbApi from "../tmdb/tmdb.api.js";
import userModel from "../models/user.model.js";
import favoriteModel from "../models/favorite.model.js";
import reviewModel from "../models/review.model.js";
import tokenMiddlerware from "../middlewares/token.middleware.js";

/**
 * Retrieves a list of media items based on the provided parameters.
 * 
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {string} req.params.mediaType - Type of media (e.g., "movie", "tv")
 * @param {string} req.params.mediaCategory - Category of media (e.g., "popular", "top_rated")
 * @param {number} req.query.page - Page number for pagination
 * @returns {Promise<void>}
 * @example
 * GET /media/movie/popular?page=1
 */
const getList = async (req, res) => {
  try {
    const { page } = req.query;
    const { mediaType, mediaCategory } = req.params;

    const response = await tmdbApi.mediaList({ mediaType, mediaCategory, page });

    return responseHandler.ok(res, response);
  } catch {
    responseHandler.error(res);
  }
};

/**
 * Retrieves a list of genres for the specified media type.
 * 
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {string} req.params.mediaType - Type of media (e.g., "movie", "tv")
 * @returns {Promise<void>}
 * @example
 * GET /media/movie/genres
 */
const getGenres = async (req, res) => {
  try {
    const { mediaType } = req.params;

    const response = await tmdbApi.mediaGenres({ mediaType });

    return responseHandler.ok(res, response);
  } catch {
    responseHandler.error(res);
  }
};

/**
 * Searches for media items based on the provided query and parameters.
 * 
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {string} req.params.mediaType - Type of media (e.g., "movie", "tv", "person")
 * @param {string} req.query.query - Search query
 * @param {number} req.query.page - Page number for pagination
 * @returns {Promise<void>}
 * @example
 * GET /media/movie/search?query=star+wars&page=1
 */
const search = async (req, res) => {
  try {
    const { mediaType } = req.params;
    const { query, page } = req.query;

    const response = await tmdbApi.mediaSearch({
      query,
      page,
      mediaType: mediaType === "people" ? "person" : mediaType
    });

    responseHandler.ok(res, response);
  } catch {
    responseHandler.error(res);
  }
};

/**
 * Retrieves detailed information about a specific media item.
 * 
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {string} req.params.mediaType - Type of media (e.g., "movie", "tv")
 * @param {number} req.params.mediaId - ID of the media item
 * @returns {Promise<void>}
 * @example
 * GET /media/movie/12345
 */
const getDetail = async (req, res) => {
  try {
    const { mediaType, mediaId } = req.params;

    const params = { mediaType, mediaId };

    const media = await tmdbApi.mediaDetail(params);

    media.credits = await tmdbApi.mediaCredits(params);

    const videos = await tmdbApi.mediaVideos(params);

    media.videos = videos;

    const recommend = await tmdbApi.mediaRecommend(params);

    media.recommend = recommend.results;

    media.images = await tmdbApi.mediaImages(params);

    const tokenDecoded = tokenMiddlerware.tokenDecode(req);

    if (tokenDecoded) {
      const user = await userModel.findById(tokenDecoded.data);

      if (user) {
        const isFavorite = await favoriteModel.findOne({ user: user.id, mediaId });
        media.isFavorite = isFavorite !== null;
      }
    }

    media.reviews = await reviewModel.find({ mediaId }).populate("user").sort("-createdAt");

    responseHandler.ok(res, media);
  } catch (e) {
    console.log(e);
    responseHandler.error(res);
  }
};

export default { getList, getGenres, search, getDetail };