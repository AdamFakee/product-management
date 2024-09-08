
module.exports = async (req, res) => {

    res.json({
        location : req.body.file,
    })
}