/**
 * Standardized API response utility
 * Ensures consistent response format across all endpoints
 */

class ApiResponse {
  /**
   * Success response
   * @param {import('express').Response} res
   * @param {*} data - Response payload
   * @param {string} message - Success message
   * @param {number} statusCode - HTTP status code (default 200)
   * @param {object} meta - Optional metadata (pagination, etc.)
   */
  static success(res, data, message = 'Success', statusCode = 200, meta = null) {
    const response = {
      success: true,
      message,
      data,
    };
    if (meta) response.meta = meta;
    return res.status(statusCode).json(response);
  }

  /**
   * Created response (201)
   */
  static created(res, data, message = 'Resource created') {
    return ApiResponse.success(res, data, message, 201);
  }

  /**
   * Paginated response
   */
  static paginated(res, data, page, limit, total, message = 'Success') {
    return ApiResponse.success(res, data, message, 200, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  }

  /**
   * Error response
   */
  static error(res, message = 'Internal Server Error', statusCode = 500, errors = null) {
    const response = {
      success: false,
      message,
    };
    if (errors) response.errors = errors;
    return res.status(statusCode).json(response);
  }

  /**
   * Validation error (400)
   */
  static validationError(res, errors) {
    return ApiResponse.error(res, 'Validation failed', 400, errors);
  }

  /**
   * Not found (404)
   */
  static notFound(res, message = 'Resource not found') {
    return ApiResponse.error(res, message, 404);
  }

  /**
   * Unauthorized (401)
   */
  static unauthorized(res, message = 'Unauthorized') {
    return ApiResponse.error(res, message, 401);
  }

  /**
   * Forbidden (403)
   */
  static forbidden(res, message = 'Forbidden') {
    return ApiResponse.error(res, message, 403);
  }
}

module.exports = ApiResponse;
