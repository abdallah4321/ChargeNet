export const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        status: 'fail',
        errors: error.details.map((err) => err.message),
      });
    }
    next();
  };
};

export const validateParam = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.params, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        status: 'fail',
        errors: error.details.map((err) => err.message),
      });
    }
    next();
  };
};

export const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.query, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        status: 'fail',
        errors: error.details.map((err) => err.message),
      });
    }
    next();
  };
};
