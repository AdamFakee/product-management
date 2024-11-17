// limitProduct = 4 : phân trang bên admin side
// limitProduct = .... : phân trang bên client side
module.exports = async (req, find, modelName, limitProduct=4) => {
    const countProduct = await modelName.countDocuments(find);
    const pagination = {
        limitProduct : limitProduct,
        currentPage :  1,
        totalPage : Math.ceil(countProduct/limitProduct),
        number : countProduct,
    };
    const page = parseInt(req.query.page);
    if(page) {
        pagination.currentPage = (page > pagination.totalPage) ? 1 : page; // greater than totalPage => showing data is like page = 1 
    }
    pagination.skipProduct = (pagination.currentPage-1) * pagination.limitProduct;

    return pagination;
}