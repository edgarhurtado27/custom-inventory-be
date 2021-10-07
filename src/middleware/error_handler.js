/* eslint no-underscore-dangle: ["error", { "allow": ["_original"] }] */

const joiHandler = (err, req, res, next) => {
  const joiError = !!(err && err._original);
  const expressJoirErro = !!(err && err.error && err.error.isJoi);
  if (!joiError && !expressJoirErro) return next(err);

  const errors = [];
  const details = joiError ? err.details : err.error.details;
  details.forEach((detail) => {
    let key = String(err.type ? `${err.type}_` : '');
    key += detail.path[0];
    key += `_${detail.type}`;
    key = key.replace(/[.-]/g, '_').toUpperCase();
    errors.push({
      type: detail.type,
      errorKey: key,
      errorMessage: detail.message,
      errorBundle: detail.context.key,
    });
  });

  const response = {
    exception: errors[0],
  };

  res.status(400).json({ ...response });
  return 1;
};

module.exports = [joiHandler];
