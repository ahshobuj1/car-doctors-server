/**
 * ---------------------------
 *     MAKE API SECURE
 * ---------------------------
 * The person who should have
 *
 * concept
 * 1. assign two tokens for each person(access token, refresh token)
 * 2. access token contains : user identification (email,role,etc) valid for sorter duration
 * 3. refresh token is used: to recreate an access token that was expired
 * 4. if refresh is invalid then logout the user
 *
 */
/**
 *
 *
 * 1. jwt---> json web token
 * 2. generate a token using jwt.sign()
 * 3. create secret key : Node -> require('crypto').randomBytes(64).toString('hex')
 * 4. create api set to cookie. http only,secure, sameSite
 * 5. from client side : axios with credentials: true
 * 6. cors setup: origin and credentials: true
 *
 *
 */
