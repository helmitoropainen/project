const jwt = require("jsonwebtoken")

module.exports = function(req, res, next) {
    /* Get token from httpOnly cookie and verify it */
    const token = req.cookies["token"]
    if (token == null) {
        res.status(401)
        return res.json({message: "Unauthorized"})
    }
    console.log("Token found")
    jwt.verify(token, process.env.SECRET, (err, user) => {
        if(err) {
            res.status(403)
            return res.json({message: "Forbidden"})
        }
        req.user = user
        next()
    })   
}
