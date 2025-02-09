import jwt from "jsonwebtoken";

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.customer_id, isAdmin: user.role },
    process.env.ACCESS_TOKEN,
    { expiresIn: "40m" }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.customer_id, isAdmin: user.role },
    process.env.REFRESH_TOKEN,
    { expiresIn: "40m" }
  );
};

const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refresh_token;
  const accessToken = req.cookies.accessToken;
  console.log("refresh:", refreshToken);
  console.log("acesss", accessToken);

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token not provided" });
  }

  try {
    jwt.verify(refreshToken, "MyRefreshSecretKey", (err, user) => {
      if (err) {
        console.log(err);
        return res.status(403).json({ message: "Invalid refresh token" });
      }

      const newAccessToken = generateAccessToken(user);
      const newRefreshToken = generateRefreshToken(user);

      res.cookie("refresh_token", newRefreshToken, {
        httpOnly: true,
        sameSite: "None",
        maxAge: 3600000,
      });

      res.status(200).json({
        accessToken: newAccessToken,
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { generateAccessToken, generateRefreshToken, refreshToken };
