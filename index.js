const Provider = require('oidc-provider')
const configuration = {
  features: {
    discovery: true,
    registration: { initialAccessToken: true },
  },
  format: { default: 'opaque' }
}
const clients = [{
  client_id: 'foo',
  client_secret: 'bar',
  redirect_uris: ['http://localhost:4000/cb']
}]

const oidc = new Provider('http://localhost:3000', configuration)

let server
(async () => {
  await oidc.initialize({ clients })
  server = oidc.listen(3000, () => {
    console.log('oidc-provider listening on port 3000, check http://localhost:3000/.well-known/openid-configuration')
  })
})().catch((err) => {
  if (server && server.listening) server.close()
  console.error(err)
  process.exitCode = 1
})
