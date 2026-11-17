// Bulunamayan Rotalar (404 Not Found)
const notFound = (req, res, next) => {
  const error = new Error(`Bulunamayan Endpoint - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Genel Hata Yakalayıcı (Global Error Handler)
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Sunucu kaynaklı bir hata oluştu.',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

module.exports = { notFound, errorHandler };