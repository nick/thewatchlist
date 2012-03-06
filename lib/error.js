exports.handleError = function(msg, err, req, res, next) {
    if (req.session) {
        req.session.destroy();
    }
    console.log(msg, err);
    res.json({ success: false, error: err });
}
