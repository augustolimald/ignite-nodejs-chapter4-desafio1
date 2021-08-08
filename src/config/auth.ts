export default {
  jwt: {
    secret: process.env.JWT_SECRET as string || 'blablabla',
    expiresIn: '1d'
  }
}
