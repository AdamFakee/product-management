
// [GET] admin/products
const systemConfig = require('../../config/system');
const products = require('../../models/product.model');
const paginationHelper =  require('../../helpers/pagination.helper');
module.exports.index = async (req, res) => {
    
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
    const pagination = await paginationHelper(req, find); // dùng await để đợi async, đại khái là async ở đầu hàm thôi
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
}


// [PATCH] /admin/products/change-status/:statusChange/:id

// tính nănng thay đổi trạng thái sản phẩm - phương thức patch

module.exports.changeStatus = async (req, res) => {
    const {statusChange, id} = req.params;
    await products.updateOne(
        {_id : id},
        {status : statusChange}
    );
    // show alert
    req.flash('success', 'thanh cong');
    // end show alert
    res.json({
        code : 200
    });
}

// end thay đổi trang thái sản phẩm

// [PATCH] /admin/products/change-multi-status
module.exports.changeMultiStatus = async (req, res) => {
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
   
}

// [DELETE] /admin/products/delete-item/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;
    await products.updateOne({
        _id : id
    },{
        deleted : true,
    }
    );
    // show alert
    req.flash('success', 'thanh cong');
    // end show alert
    res.json({
        code : 200,
    })
}

// [GET]  /admin/products/create
module.exports.create = async (req, res) => {
    res.render('admin/pages/products/create', {
        pageTitle: "Thêm mới sản phẩm"
      });
}
// [POST]  /admin/products/create
module.exports.createPost = async (req, res) => {
    if(req.file){
        req.body.thumbnail = `/uploads/${req.file.filename}`;
    }
    req.body.price = parseInt(req.body.price);
    req.body.stock = parseInt(req.body.stock);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    const countProduct = await products.countDocuments({});
    if(req.body.position){
        req.body.position = parseInt(req.body.position);
    } else {
        req.body.position = countProduct + 1;
    }
    console.log(req.body)
    const newProduct = new products(req.body);
    // newProduct.save().then(() => console.log('meow'));  // .then(function) tương tự :  await newProduct.save() + try catch
    await newProduct.save()


    res.redirect(`/${systemConfig.prefixAdmin}/products`)
}

// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await products.findOne({
        _id : id,
        deleted : false,
        })
    res.render('admin/pages/products/edit.pug', {
        pageTitle : 'trang chinh sua san pham',
        product : product,
    })
    } catch (error) {
        res.redirect('back')
    }
}

// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
    try {
        const id = req.params.id;
        if(req.file){
            req.body.thumbnail = `/uploads/${req.file.filename}`;
        }
        req.body.price = parseInt(req.body.price);
        req.body.discountPercentage = parseInt(req.body.discountPercentage);
        req.body.stock = parseInt(req.body.stock);
        req.body.position = parseInt(req.body.position);
        
        await products.updateOne({
            _id : id,
            deleted : false,
        }, req.body)
        req.flash('success', 'update thanh cong');  // do cái flash ở default nên khi back về chỗ nào cũng có thông báo :))
        res.redirect(`/${systemConfig.prefixAdmin}/products`);
    } catch (error) {
        req.flash('error', 'id k hop le');
        res.redirect('/admin/products');
    }
}