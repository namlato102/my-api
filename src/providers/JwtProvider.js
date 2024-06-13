// https://www.npmjs.com/package/jsonwebtoken
import JWT from 'jsonwebtoken'

/**
 * function generate new Token - 3 params
 * @param {*} userInfo
 * @param {*} secretSignature
 * @param {*} tokenLife
 */
const generateToken = async (userInfo, secretSignature, tokenLife) => {
  try {
    // use sign() method to get the token - default algorithm is HS256, no need to put it in the code
    return JWT.sign(userInfo, secretSignature, { algorithm: 'HS256', expiresIn: tokenLife })
  } catch (error) { throw error }
}

/**
 * Function verifyToken - 2 params
 * @param {*} token
 * @param {*} secretSignature
 */
const verifyToken = async (token, secretSignature) => {
  try {
    // use verify() method from Jwt library to verify the token
    return JWT.verify(token, secretSignature)
  } catch (error) { throw error }
}

export const JwtProvider = {
  generateToken,
  verifyToken
}