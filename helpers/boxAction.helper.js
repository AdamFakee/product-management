// xoá toàn bộ, khôi phục toàn bộ....
module.exports = async (req, res, model) => {
    const {status, ids} = req.body;
    switch (status) {
        case 'restore' : 
            await model.updateMany({
                _id : ids,
                deleted : true,
            }, {
                deleted : false,
            })
            res.json({
                code : 200,
            });
            break;
        case 'delete' : 
            await model.deleteMany({
                _id : ids,
                deleted : true,
            })
            res.json({
                code : 200,
            });
            break;
    }
}