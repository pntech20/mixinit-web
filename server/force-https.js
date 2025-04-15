function requireHTTPS(req, res, next) {
  if (req.get("X-Forwarded-Proto")?.indexOf("https") === -1) {
    return res.redirect("https://" + req.headers.host + req.url);
  }
  next();
}
module.exports = requireHTTPS;
