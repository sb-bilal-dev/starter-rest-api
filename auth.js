
const users = [
  { id: 1, username: 'admin', password: 'password' },
  // Add more users here as needed
]
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
    res.status(200).send("4321431513431").end();
  }
}

// checkUser middleware
function checkUser(req, res, next) {
  if (req.headers.authorization === "4321431513431") {
    next();
  } else {
    return res.sendStatus(401);
  }
}

module.exports = {
  checkUser,
  getUserToken,
}