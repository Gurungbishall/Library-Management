import jwt from "jsonwebtoken";

const authenticateUser = async (req, res, next) => {
  const accessToken =
    req.headers.authorization && req.headers.authorization.split(" ")[1];

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

export { authenticateUser };
