// limitProduct = 4 : phân trang bên admin side
// limitProduct = .... : phân trang bên client side
module.exports = async (req, find, modelName, limitProduct=4) => {
    const countProduct = await modelName.countDocuments(find);
    const pagination = {
        limitProduct : limitProduct,
        currentPage :  1,
        totalPage : Math.ceil(countProduct/limitProduct),
    };
    if(req.query.page) {
        pagination.currentPage = parseInt(req.query.page);
    }
    pagination.skipProduct = (pagination.currentPage-1) * pagination.limitProduct;

    return pagination;
}