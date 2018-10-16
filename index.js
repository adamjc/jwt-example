const app = require('express')()
const jwt = require('jsonwebtoken')
const upload = require('multer')()
const cookieParser = require('cookie-parser')

const secret = 'topsecretcode'

const makeIndex = (username) => {
  const welcomeText = username
    ? `Welcome back, ${username}`
    : `Register to login`

  return `
    <html>
      <head>
      </head>
      <body>
        ${welcomeText}
        <form action="/register" method="POST" enctype="multipart/form-data">
          <input type="text" name="username" placeholder="username">
          <input type="password" name="password" placeholder="password">
          <button type="submit">Register</button>
        </form>
      </body>
    </html>
  `
}

app.use(cookieParser())

function tokenHandler (req, res, next) {
  if (req.cookies.token) {
    req.user = jwt.verify(req.cookies.token, secret)
  }

  next()
}

app.get('/', tokenHandler, (req, res) => {
  let index = req.user
    ? makeIndex(req.user.username)
    : makeIndex()
  
  res.send(index)
})

app.post('/register', upload.none(), (req, res) => {
  const username = req.body.username
  const token = jwt.sign({ username }, secret)

  res.cookie('token', token)
  res.redirect('/')
})

app.listen(8080, () => {
  console.log('Server started...')
})