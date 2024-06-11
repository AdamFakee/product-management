const products = require('../../models/product.model');
module.exports = async (req, res) => {
    
    // tính năng lọc
    const find = {
        deleted : false
    }
    if(req.query.status){
        find.status = req.query.status;
    }
    // end tính năng lọc

    // tính năng tìm kiếm 
    let keyword = "";
    if(req.query.keyword) {
        const regex = new RegExp(req.query.keyword, "i");  // tìm kiếm tương đối, nghĩa là chỉ cần giống 1 phần nội dung của title => vẫn kiếm đc
                                                          // kiếm iphone 9 nhưng nhập iphone vẫn kiếm được ra mấy máy có title = iphone
        find.title = regex;
        keyword = req.query.keyword;
    }
    // end tính năng tìm kiếm

    const productList = await products.find(find);
    res.render('admin/pages/products/index', {
        pageTitle : "trang san pham",
        productList: productList,
        keyword : keyword    // để khi kiếm thì đề xuất mấy cái mình đã từng kiếm trước đó rồi
    });
}