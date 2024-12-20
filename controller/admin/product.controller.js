

const systemConfig = require('../../config/system');
const products = require('../../models/product.model');
const productCategory = require('../../models/product-category.model');
const paginationHelper =  require('../../helpers/pagination.helper');
const createTree =  require('../../helpers/createTree.helper');

// [GET] admin/products
module.exports.index = async (req, res) => {
    if(res.locals.role.permissions.includes('product_view')){
        // tính năng lọc
        const find = {
            deleted : false,
        };
        if(req.query.status){
            find.status = req.query.status;
        };
        // end tính năng lọc

        // mảng thông tin của button-status
        const filterStatus = [
            {
                status : "",
                label : 'tất cả'
            },
            {
                status : "active",
                label : 'hoạt động'
            },
            {
                status : "inactive",
                label : 'dừng hoạt động'
            }
        ]
        // end mảng thông tin của button-status

        // tính năng tìm kiếm 
        let keyword = '';
        if(req.query.keyword) {
            const regex = new RegExp(req.query.keyword, "i");  // tìm kiếm tương đối, nghĩa là chỉ cần giống 1 phần nội dung của title => vẫn kiếm đc
                                                            // kiếm iphone 9 nhưng nhập iphone vẫn kiếm được ra mấy máy có title = iphone
            find.title = regex;
            keyword = req.query.keyword;
        }
        // end tính năng tìm kiếm

        // phan trang
        const pagination = await paginationHelper(req, find, products); // dùng await để đợi async, đại khái là async ở đầu hàm thôi
        // end phân trang

        // sap xep
        const sort = {};
        if(req.query.sortValue && req.query.sortKey){
            sort[req.query.sortKey]=req.query.sortValue;
        } else {
            sort['position'] = 'desc';
        }
        // end sap xep

        const productList = await products
            .find(find)
            .limit(pagination.limitProduct)
            .skip(pagination.skipProduct)
            .sort(sort);

        res.render('admin/pages/products/index', {
            pageTitle : "trang san pham",
            productList: productList,
            keyword : keyword,    // để khi kiếm thì đề xuất mấy cái mình đã từng kiếm trước đó rồi
            filterStatus : filterStatus,
            pagination : pagination,
        });
    } else {
        res.redirect(`/${systemConfig.prefixAdmin}/auth/login`)
    }
    
}


// [PATCH] /admin/products/change-status/:statusChange/:id

// tính nănng thay đổi trạng thái sản phẩm - phương thức patch

module.exports.changeStatus = async (req, res) => {
    try {
        if(res.locals.role.permissions.includes('product_edit')){
            const {statusChange, id} = req.params;
            const product = await products.findOneAndUpdate(
                {_id : id},
                {status : statusChange}
            );
            
            // update cache
            myCache.del(`productDetail:${product.slug}`)

            // show alert
            req.flash('success', 'thanh cong');
            // end show alert
            res.json({
                code : 200
            });
        } else {
            res.json({
                code : 300 // k có quyền
            })
        }
    } catch (error) {
        res.redirect('back')
    }
    
}

// end thay đổi trang thái sản phẩm

// [PATCH] /admin/products/change-multi-status
module.exports.changeMultiStatus = async (req, res) => {
    if(res.locals.role.permissions.includes('product_edit')){
        const {status, ids} = req.body;
        switch (status) {
            case "active":
            case "inactive":
                await products.updateMany({
                    _id : ids
                },
                {
                    status : status
                });
                // show alert
                req.flash('success', 'thanh cong');
                // end show alert
                res.json({
                    code : 200
                })
                break;
            case 'deleteItem':
                await products.updateMany({
                    _id : ids
                },
                {
                    deletedBy : res.locals.account.id, // tài khoản xóa sản phẩm
                    deleted : true
                });
                // show alert
                req.flash('success', 'thanh cong');
                // end show alert
                res.json({
                    code : 200
                })
                break;
            case 'restore':
                await products.updateMany({
                    _id : ids
                },
                {
                    deleted : false
                });
                // show alert
                req.flash('success', 'thanh cong');
                // end show alert
                res.json({
                    code : 200
                })
                break;
            case 'delete':
                await products.deleteMany({
                    _id : ids
                });
                // show alert
                req.flash('success', 'thanh cong');
                // end show alert
                res.json({
                    code : 200
                })
                break;
            default:
                console.log('box-action is not running');
        }
    } else {
        res.json({
            code : 300 
        })
    }
    
   
}

// [DELETE] /admin/products/delete-item/:id
module.exports.deleteItem = async (req, res) => {
    try {
        if(res.locals.role.permissions.includes('product_delete')){
            const id = req.params.id;
            await products.updateOne({
                _id : id
            },{
                deletedBy : res.locals.account.id,  // cập nhật tài khoản xóa sp
                deleted : true,
            }
            );
            // show alert
            req.flash('success', 'thanh cong');
            // end show alert
            res.json({
                code : 200,
            })
        } else {
            req.flash('error', 'tài khoản k được cấp quyền');
            res.json({
                code : 300 // k có quyền
            });
        }
    } catch (error) {
        res.redirect('back')
    }
    
}

// [GET]  /admin/products/create
module.exports.create = async (req, res) => {
    if(res.locals.role.permissions.includes('product_create')){
        const records = await productCategory.find({deleted:false});
        const newCategories = createTree(records);
        res.render('admin/pages/products/create', {
            pageTitle: "Thêm mới sản phẩm",
            categories : newCategories
          });
    } else {
        res.redirect(`/${systemConfig.prefixAdmin}/auth/login`)
    }
    
}
// [POST]  /admin/products/create
module.exports.createPost = async (req, res) => {
    if(res.locals.role.permissions.includes('product_create')){
        req.body.price = parseInt(req.body.price);
        req.body.stock = parseInt(req.body.stock);
        req.body.discountPercentage = parseInt(req.body.discountPercentage);
        const countProduct = await products.countDocuments({});
        if(req.body.position){
            req.body.position = parseInt(req.body.position);
        } else {
            req.body.position = countProduct + 1;
        }
        req.body.createdBy = res.locals.account.id; // cập nhật tài khoản tạo sản phẩm
        const newProduct = new products(req.body);
        
        // newProduct.save().then(() => console.log('meow'));  // .then(function) tương tự :  await newProduct.save() + try catch
        await newProduct.save()
    
    
        res.redirect(`/${systemConfig.prefixAdmin}/products`)
    } else {
        res.redirect(`/${systemConfig.prefixAdmin}/auth/login`)
    }
    
}

// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
    if(res.locals.role.permissions.includes('product_edit')){
        try {
            const id = req.params.id;
            const product = await products.findOne({
            _id : id,
            deleted : false,
            })
            const records = await productCategory.find({deleted:false});
            const newCategories = createTree(records);
            res.render('admin/pages/products/edit.pug', {
                pageTitle : 'trang chinh sua san pham',
                product : product,
                categories : newCategories,
            })
        } catch (error) {
            res.redirect('back')
        }
    } else {
        res.redirect(`/${systemConfig.prefixAdmin}/auth/login`)
    }
    
}

// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
    if(res.locals.role.permissions.includes('product_edit')){
        try {
            const id = req.params.id;
    
            req.body.price = parseInt(req.body.price);
            req.body.discountPercentage = parseInt(req.body.discountPercentage);
            req.body.stock = parseInt(req.body.stock);
            req.body.position = parseInt(req.body.position);
            req.body.updatedBy = res.locals.account.id; // cập nhật tài khoản update sản phẩm
            await products.updateOne({
                _id : id,
                deleted : false,
            }, req.body)
            req.flash('success', 'update thanh cong');  // do cái flash ở default nên khi back về chỗ nào cũng có thông báo :))
            res.redirect(`back`);
        } catch (error) {
            req.flash('error', 'id k hop le');
            res.redirect('/admin/products');
        }
    } else {
        res.redirect(`/${systemConfig.prefixAdmin}/auth/login`)
    }
    
}