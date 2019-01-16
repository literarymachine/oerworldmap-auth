const { Issuer } = require('openid-client')
Issuer.discover('http://localhost:3000') // => Promise
  .then(function (issuer) {
    console.log('Discovered issuer', issuer.issuer, issuer.metadata)
    const client = new issuer.Client({
      client_id: 'foo',
      client_secret: 'bar',
      //token_endpoint_auth_method: 'client_secret_jwt'
    })

    var express = require('express')
    var app = express()

    app.get('/cb', function (req, res) {
      client.authorizationCallback('http://localhost:4000/cb', req.query)
      .then(function (tokenSet) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(tokenSet, null, 2))
      })
    })

    app.get('/', function (req, res) {
      const form = client.authorizationPost({
        redirect_uri: 'http://localhost:4000/cb',
        scope: 'openid email',
      })
      console.log(form)
      res.send(form)
    })

    app.listen(4000, function () {
      console.log('Callback listening on port 4000!')
    })
  })
