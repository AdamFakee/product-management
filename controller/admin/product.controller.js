
// [GET] admin/product

const products = require('../../models/product.model');

module.exports = async (req, res) => {
    
    // tính năng lọc
    const find = {};
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

    // phân trang
    const countProduct = await products.countDocuments(find);
    const pagination = {
        limitProduct : 4,
        currentPage :  1,
        totalPage : Math.ceil(countProduct/4),
    };
    if(req.query.page) {
        pagination.currentPage = parseInt(req.query.page);
    }
    pagination.skipProduct = (pagination.currentPage-1) * pagination.limitProduct;

    const productList = await products
        .find(find)
        .limit(pagination.limitProduct)
        .skip(pagination.skipProduct);
    // end phân trang

    
    res.render('admin/pages/products/index', {
        pageTitle : "trang san pham",
        productList: productList,
        keyword : keyword,    // để khi kiếm thì đề xuất mấy cái mình đã từng kiếm trước đó rồi
        filterStatus : filterStatus,
        pagination : pagination,
    });
}