const products = require('../../models/product.model'); 
const paginationHelper = require('../../helpers/pagination.helper');

//[GET] admin/trash
module.exports.index = async (req, res) => {
    const pagination = await paginationHelper(req, {deleted : true});
    const productList = await products
        .find({deleted : true})
        .limit(pagination.limitProduct)
        .skip(pagination.skipProduct);
    
    res.render('./admin/pages/trash/index.pug', {
        productList : productList,
        pagination : pagination
    })
}

// [PATCH]  admin/trash/restore-item
module.exports.restoreItem = async (req, res) => {
    const id = req.params.id;
    await products.updateOne({_id : id}, {deleted : false})
    res.json({
        code : 200
    })
}

// [PATCH]  admin/trash/delete-permanently
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;
    await products.deleteOne({_id : id});
    res.json({
        code : 200
    })
}