
// [GET] admin/product

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

    const productList = await products
        .find(find)
        .limit(pagination.limitProduct)
        .skip(pagination.skipProduct);
    


    
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
            })
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
            })
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
            })
            res.json({
                code : 200
            })
            break;
        case 'delete':
            await products.deleteMany({
                _id : ids
            });
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
    )
    res.json({
        code : 200,
    })
}