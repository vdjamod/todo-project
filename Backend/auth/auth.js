import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import CryptoJS from "crypto-js";
const secretKey = process.env.SECRET
  ? process.env.SECRET
  : "b34f5d09e1a7c8f2296df15d2f9e1b3e56d4a8c29cf8235aa7b6e40a1f8b2c3d";

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
