
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).render('NotAuth',{user:req.user,layout:'./layouts/main_layout.ejs'});
    }
    next();
  };
};

module.exports = { authorizeRoles };