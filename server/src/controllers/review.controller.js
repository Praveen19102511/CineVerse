import responseHandler from "../handlers/response.handler.js";
import reviewModel from "../models/review.model.js";

/**
 * Creates a new review for a movie.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {string} req.params.movieId - The ID of the movie to review.
 * @param {Object} req.body - The review data (e.g. rating, comment).
 * @param {Object} req.user - The authenticated user.
 *
 * @example
 * // Create a new review for movie with ID "123"
 * // with rating 4 and comment "Great movie!"
 * POST /reviews/123
 * {
 *   "rating": 4,
 *   "comment": "Great movie!"
 * }
 *
 * @returns {Object} The created review.
 */
const create = async (req, res) => {
  try {
    const { movieId } = req.params;

    const review = new reviewModel({
      user: req.user.id,
      movieId,
      ...req.body
    });

    await review.save();

    responseHandler.created(res, {
      ...review._doc,
      id: review.id,
      user: req.user
    });
  } catch {
    responseHandler.error(res);
  }
};

/**
 * Removes a review by ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {string} req.params.reviewId - The ID of the review to remove.
 * @param {Object} req.user - The authenticated user.
 *
 * @example
 * // Remove review with ID "456"
 * DELETE /reviews/456
 *
 * @returns {Object} An OK response if the review is removed successfully.
 */
const remove = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await reviewModel.findOne({
      _id: reviewId,
      user: req.user.id
    });

    if (!review) return responseHandler.notfound(res);

    await review.remove();

    responseHandler.ok(res);
  } catch {
    responseHandler.error(res);
  }
};

/**
 * Retrieves all reviews made by the authenticated user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Object} req.user - The authenticated user.
 *
 * @example
 * // Get all reviews made by the current user
 * GET /reviews
 *
 * @returns {Array<Object>} An array of reviews made by the user.
 */
const getReviewsOfUser = async (req, res) => {
  try {
    const reviews = await reviewModel.find({
      user: req.user.id
    }).sort("-createdAt");

    responseHandler.ok(res, reviews);
  } catch {
    responseHandler.error(res);
  }
};

export default { create, remove, getReviewsOfUser };