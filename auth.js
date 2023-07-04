
const users = [
    { id: 1, username: 'admin', password: 'password' },
    // Add more users here as needed
] 

function checkUser(req, res, next) {
    const matchedUser = users.find(u => {
        if (u.username === req.body.username
            && u.password === req.body.password) {
            return true;
        } else {
            return false;
        }
    })
    if (matchedUser == null) {
        return res.sendStatus(401)
    }

    next()
}