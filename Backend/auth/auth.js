import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const sendToken = (id, email) => {
  const token = jwt.sign(
    {
      id: id,
      email: email,
    },
    process.env.SECRET,
    { expiresIn: 24 * 60 * 60 * 1000 }
  );

  return token;
};

export const verifyToken = (req, res, next) => {
  const token = req.headers.token;
  // console.log(token);
  
  if (!token) {
    res.status(500).send("TOKEN NOT FOUND");
  } else {
    const result = jwt.verify(token, process.env.SECRET);
    // console.log(result);
    req.id = result.id;
    req.email = result.email;
    next();
  }
};

export const encryptPassword = async (password) => {
  const res = await bcrypt.hash(password, 5);
  return res;
};

export const comparePassword = async (password, hashedPassword) => {
  const result = await bcrypt.compare(password, hashedPassword);
  console.log(result);
};
