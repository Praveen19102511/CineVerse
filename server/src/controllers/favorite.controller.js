import responseHandler from "../handlers/response.handler.js";
import favoriteModel from "../models/favorite.model.js";

/**
 * Add a favorite media to a user's favorites list.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>}
 * 
 * Example:
 * 
 * Request Body:
 * {
 *   "mediaId": "12345"
 * }
 * 
 * Response:
 * {
 *   "favorite": {
 *     "_id": "67890",
 *     "user": "12345",
 *     "mediaId": "12345",
 *     "createdAt": "2023-02-20T14:30:00.000Z",
 *     "updatedAt": "2023-02-20T14:30:00.000Z"
 *   }
 * }
 */
const addFavorite = async (req, res) => {
  try {
    const isFavorite = await favoriteModel.findOne({
      user: req.user.id,
      mediaId: req.body.mediaId
    });

    if (isFavorite) return responseHandler.ok(res, isFavorite);

    const favorite = new favoriteModel({
      ...req.body,
      user: req.user.id
    });

    await favorite.save();

    responseHandler.created(res, favorite);
  } catch {
    responseHandler.error(res);
  }
};

/**
 * Remove a favorite media from a user's favorites list.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>}
 * 
 * Example:
 * 
 * Request Params:
 * {
 *   "favoriteId": "67890"
 * }
 * 
 * Response:
 * {
 *   "message": "Favorite removed successfully"
 * }
 */
const removeFavorite = async (req, res) => {
  try {
    const { favoriteId } = req.params;

    const favorite = await favoriteModel.findOne({
      user: req.user.id,
      _id: favoriteId
    });

    if (!favorite) return responseHandler.notfound(res);

    await favorite.remove();

    responseHandler.ok(res);
  } catch {
    responseHandler.error(res);
  }
};

/**
 * Get a list of a user's favorite media.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>}
 * 
 * Example:
 * 
 * Response:
 * {
 *   "favorites": [
 *     {
 *       "_id": "67890",
 *       "user": "12345",
 *       "mediaId": "12345",
 *       "createdAt": "2023-02-20T14:30:00.000Z",
 *       "updatedAt": "2023-02-20T14:30:00.000Z"
 *     },
 *     {
 *       "_id": "67891",
 *       "user": "12345",
 *       "mediaId": "12346",
 *       "createdAt": "2023-02-20T14:31:00.000Z",
 *       "updatedAt": "2023-02-20T14:31:00.000Z"
 *     }
 *   ]
 * }
 */
const getFavoritesOfUser = async (req, res) => {
  try {
    const favorite = await favoriteModel.find({ user: req.user.id }).sort("-createdAt");

    responseHandler.ok(res, favorite);
  } catch {
    responseHandler.error(res);
  }
};

export default { addFavorite, removeFavorite, getFavoritesOfUser };