const products = require('../../models/product.model');
const Roles = require('../../models/role.model');
const Accounts = require('../../models/account.model');
const productCategories = require('../../models/product-category.model'); 
const paginationHelper = require('../../helpers/pagination.helper');
const boxActionHelper = require('../../helpers/boxAction.helper');

//[GET] admin/trash
module.exports.index = async (req, res) => {
    if(res.locals.role.permissions.includes('trash_view')){
        res.render('./admin/pages/trash/index.pug')
    } else {
        res.redirect(`/${systemConfig.prefixAdmin}/auth/login`)
    }
    
}

// [GET] admin/trash/products
module.exports.product = async (req, res) => {
    if(res.locals.role.permissions.includes('trash_view')){
        const pagination = await paginationHelper(req, {deleted : true}, products);
        const productList = await products
            .find({deleted : true})
            .limit(pagination.limitProduct)
            .skip(pagination.skipProduct);
        
        res.render('./admin/pages/trash/product.pug', {
            productList : productList,
            pagination : pagination
    })
    } else {
        res.redirect(`/${systemConfig.prefixAdmin}/auth/login`)
    }
    
}

// [GET] admin/trash/roles
module.exports.role = async (req, res) => {
    if(res.locals.role.permissions.includes('trash_view')){
        const pagination = await paginationHelper(req, {deleted : true}, Roles);
        const roles = await Roles
            .find({deleted : true})
            .limit(pagination.limitProduct)
            .skip(pagination.skipProduct);
        
        res.render('./admin/pages/trash/role.pug', {
            roles : roles,
            pagination : pagination
        })
    } else {
        res.redirect(`/${systemConfig.prefixAdmin}/auth/login`)
    }
   
}
// [GET] admin/trash/accounts
module.exports.account = async (req, res) => {
    if(res.locals.role.permissions.includes('trash_view')){
        const pagination = await paginationHelper(req, {deleted : true}, Accounts);
        const accounts = await Accounts
            .find({deleted : true})
            .limit(pagination.limitProduct)
            .skip(pagination.skipProduct);
        
        res.render('./admin/pages/trash/account.pug', {
            accounts : accounts,
            pagination : pagination
        })
    } else {
        res.redirect(`/${systemConfig.prefixAdmin}/auth/login`)
    }
    
}
// [GET] admin/trash/product-category
module.exports.productCategory = async (req, res) => {
    if(res.locals.role.permissions.includes('trash_view')){
        const pagination = await paginationHelper(req, {deleted : true}, productCategories);
        const productCategory = await productCategories
            .find({deleted : true})
            .limit(pagination.limitProduct)
            .skip(pagination.skipProduct);
        
        res.render('./admin/pages/trash/product-category.pug', {
            productCategory : productCategory,
            pagination : pagination
        })
    } else {
        res.redirect(`/${systemConfig.prefixAdmin}/auth/login`)
    }
    
}

// [PATCH]  admin/trash/restore-item/:model/:id
module.exports.restoreItem = async (req, res) => {
    try {
        if(res.locals.role.permissions.includes('trash_delete')){
            const {model, id} = req.params;
            switch(model) {
                case 'account':
                    await Accounts.updateOne({_id : id}, {deleted : false})
                    res.json({
                        code : 200
                    })
                    break;
                case 'product':
                    await products.updateOne({_id : id}, {deleted : false})
                    res.json({
                        code : 200
                    })
                    break;
                case 'role':
                    await Roles.updateOne({_id : id}, {deleted : false})
                    res.json({
                        code : 200
                    })
                    break;
                case 'product-category':
                    await productCategories.updateOne({_id : id}, {deleted : false})
                    res.json({
                        code : 200
                    })
                    break;
            }
            
        } else {
            res.json({
                code : 300
            })
        }
    } catch (error) {
        res.redirect('back')
    }
    
}

// [DELETE]  admin/trash/delete-permanently
module.exports.deleteItem = async (req, res) => {
    if(res.locals.role.permissions.includes('trash_delete')){
        const {model, id} = req.params;
        switch(model) {
            case 'account':
                await Accounts.deleteOne({_id : id});
                res.json({
                    code : 200
                })
                break;
            case 'product':
                await products.deleteOne({_id : id});
                res.json({
                    code : 200
                })
                break;
            case 'role':
                await Roles.deleteOne({_id : id});
                res.json({
                    code : 200
                })
                break;
            case 'product-category':
                await productCategories.deleteOne({_id : id});
                res.json({
                    code : 200
                })
                break;
        }
        
    } else {
        res.json({
            code : 300 // k có quyền
        })
    }
    
}

// [PATCH] admin/trash/change-multi-status/:model
module.exports.changeMultiStatus = async (req, res) => {
    if(res.locals.role.permissions.includes('trash_delete')){
        const model = req.params.model;
        switch (model){
            case 'product':
                boxActionHelper(req, res, products);
                break;
            case 'account':
                boxActionHelper(req, res, Accounts);
                break;
            case 'role' :
                boxActionHelper(req, res, Roles);
                break;
            case 'product-category':
                boxActionHelper(req, res, productCategories);
                break;
        }
    } else {
        res.json({
            code : 300, // k co quyen
        })
    }
    
}