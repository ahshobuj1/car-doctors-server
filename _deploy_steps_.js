/**
 *
 * * Deploy setup for backend
 * 1. set cors origin
 * 2. avoid dbCommand checking connection :
 *  2.1 -> //await client.connect();
 *  2.2 -> //await client.db('admin').command({ping: 1});
 * 3. setup cookie options -> behind the scene , vercel make an env variable in .env file, : NODE_ENV=production
 * 4. vercel
 * 5. vercel --prod (to update change)
 *
 */
