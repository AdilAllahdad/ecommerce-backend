// const jwt = require('jsonwebtoken');

// const verifyAdmin = (req, res, next) => {
//   const token = req.header('Authorization');

//   if (!token) return res.status(401).json({ message: "Access Denied" });

//   try {
//     const verified = jwt.verify(token, process.env.JWT_SECRET);
//     if (verified.role !== "admin") {
//       return res.status(403).json({ message: "Forbidden: Admins only" });
//     }
//     req.admin = verified;
//     next();
//   } catch (error) {
//     res.status(400).json({ message: "Invalid Token" });
//   }
// };

// module.exports = verifyAdmin;


const jwt = require("jsonwebtoken");

const verifyAdmin = (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");

    if (!token) {
      return res.status(403).json({ message: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.isAdmin) {
      return res.status(403).json({ message: "You are not authorized as an admin." });
    }

    req.user = decoded; // Save admin data to request object
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};


  

const verifyUser = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized. Please log in first." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token." });
  }
};

module.exports = verifyUser;
module.exports = verifyAdmin;


