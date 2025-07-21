const {registerSchema, loginSchema} = require('./utils/validationSchema')
const jwt = require("jsonwebtoken");


module.exports.validateRegister = (req,res,next) => {
    const { error } = registerSchema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({
            success: false,
            error: error.details.map(detail => detail.message) // returns all errors
        });
    }

    next();
}

module.exports.validateLogin = (req,res,next) => {
    const { error } = loginSchema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({
            success: false,
            error: error.details.map(detail => detail.message) // returns all errors
        });
    }

    next();
}

module.exports.authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
  } else {
    return res.status(401).json({ message: "No token provided" });
  }
};