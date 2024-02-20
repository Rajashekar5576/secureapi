const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const morgan = require('morgan');

const app = express();

// Secret key for signing the JWT
const secretKey = 'secret_key_for_signing_jwt';

// Middleware to parse the request body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware function to log incoming requests
app.use(morgan('combined'));

// Function to validate the JWT
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader
    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

// Authorization
const authorize = (req, res, next) => {
    const userId = req.body.userId;
    const requiredRoles = [1, 2];

    if (!requiredRoles.includes(userId)) {
        return res.status(401).json({ message: 'Unauthorized.' });
    }

    next();
};

// Route to authenticate the user and get a JWT
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send({ error: 'username and password are required' });
  }

  // User authentication logic
  if (username === 'admin' && password === 'secret') {
    const user = { name: 'Admin' };
    const token = jwt.sign(user, secretKey, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).send({ error: 'invalid credentilas' });
  }
});

// Protect the API routes using the JWT middleware
app.get('/api/data', authenticateJWT, authorize, (req, res) => {
  res.json({ data: 'This is some secret data' });
});


app.listen(3000, () => console.log("server is listening on port"));
