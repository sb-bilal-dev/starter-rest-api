const jwt = require('jsonwebtoken');

const users = [
  { id: 1, username: 'admin', password: 'password' },
  { id: 2, username: 'demodemo', password: 'demodemo' },
  // Add more users here as needed
];

const SECRET_KEY = "MY_RANDOM_SECRET_KEY_";

// Function to generate a JWT token
function generateToken(user) {
  const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' });
  return token;
}

// getUserToken function
function getUserToken(req, res) {
  const matchedUser = users.find(u => {
    if (req.body && u.username === req.body.username && u.password === req.body.password) {
      return true;
    } else {
      return false;
    }
  });
  
  if (!matchedUser) {
    return res.sendStatus(401);
  } else {
    const token = generateToken(matchedUser);
    res.status(200).send(token).end();
  }
}

// checkUser middleware
function checkUser(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', "*");

  const token = req.headers.authorization;
  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.sendStatus(401);
    }
    console.log("decoded", decoded);
    req.userID = !!decoded && decoded.userId;
    // Here, you can use the decoded.userId to perform further actions, like fetching the user or checking user roles, etc.
    next();
  });
}

module.exports = {
  checkUser,
  getUserToken,
};
