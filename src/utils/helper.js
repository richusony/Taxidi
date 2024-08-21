import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";

export async function generatePassword() {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";

  const allChars = uppercase + lowercase + numbers;
  let password = "";

  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * allChars.length);
    password += allChars[randomIndex];
  }

  return password;
}

export const generateRefreshToken = (userId, email) => {
  const refreshToken = jwt.sign(
    { id: userId, email },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY },
  );
  // console.log("Refresh Token :: ",refreshToken);
  return refreshToken;
};

export const generateAccessToken = (userId, email) => {
  const accessToken = jwt.sign(
    { id: userId, email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY },
  );
  // console.log("Access Token :: ",accessToken);
  return accessToken;
};

export const generatePaymentIdString = (prefix, length) => {
  // Define characters to use for generating the random string
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = prefix;
  
  // Generate random characters and append them to the result string
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }

  return result;
};
