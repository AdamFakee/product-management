const products = require('../../models/product.model'); 
const paginationHelper = require('../../helpers/pagination.helper');

//[GET] admin/trash
module.exports.index = async (req, res) => {
    if(res.locals.role.permissions.includes('trash_view')){
        const pagination = await paginationHelper(req, {deleted : true});
        const productList = await products
            .find({deleted : true})
            .limit(pagination.limitProduct)
            .skip(pagination.skipProduct);
        
        res.render('./admin/pages/trash/index.pug', {
            productList : productList,
            pagination : pagination
        })
    } else {
        res.redirect(`/${systemConfig.prefixAdmin}/auth/login`)
    }
    
}

// [PATCH]  admin/trash/restore-item
module.exports.restoreItem = async (req, res) => {
    if(res.locals.role.permissions.includes('trash_view')){
        const id = req.params.id;
        await products.updateOne({_id : id}, {deleted : false})
        res.json({
            code : 200
        })
    } else {
        res.json({
            code : 300
        })
    }
    
}

// [DELETE]  admin/trash/delete-permanently
module.exports.deleteItem = async (req, res) => {
    if(res.locals.role.permissions.includes('trash_view')){
        const id = req.params.id;
        await products.deleteOne({_id : id});
        res.json({
            code : 200
        })
    } else {
        res.json({
            code : 300 // k có quyền
        })
    }
    
}