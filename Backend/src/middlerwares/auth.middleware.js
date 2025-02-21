import jwt from "jsonwebtoken";

const authenticateUser = async (req, res, next) => {
  const accessToken = req.cookies.access_token;

  if (!accessToken) {
    return res.status(401).json({ message: "No access token provided" });
  }

  try {
    const user = jwt.verify(accessToken, process.env.ACCESS_TOKEN);
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired access token" });
  }
};

const authenticateAdmin = async (req, res, next) => {
  const accessToken = req.cookies.access_token;

  if (!accessToken) {
    return res.status(401).json({ message: "No access token provided" });
  }

  try {
    const user = jwt.verify(accessToken, process.env.ACCESS_TOKEN);
    req.user = user;

    if (user.isAdmin !== "admin") {
      return res
        .status(403)
        .json({ message: "Access denied. You are not an admin." });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired access token" });
  }
};

export { authenticateUser, authenticateAdmin };
