module.exports = (err, req, res, next) => {
  console.error(err);
  const error = {
    message: err.message,
    status: err.status || 500,
    stack: err.stack,
  };
  res.status(error.status).json({ error: 'Something went wrong!' });
};
