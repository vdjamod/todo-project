import jwt from "jsonwebtoken";
import CryptoJS from "crypto-js";
import dotenv from "dotenv";
dotenv.config();
const secretKey = process.env.SECRET;

export function encryptPassword(password) {
  console.log(secretKey);
  const encryptedPassword = CryptoJS.AES.encrypt(password, secretKey);
  return encryptedPassword.toString();
}

export function decryptPassword(encryptedPassword) {
  const password = CryptoJS.AES.decrypt(encryptedPassword, secretKey);
  return password.toString(CryptoJS.enc.Utf8);
}

export function comparePassword(password, encryptedPassword) {
  const decryptedPassword = decryptPassword(encryptedPassword, secretKey);
  if (password === decryptedPassword) return true;
  return false;
}

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
