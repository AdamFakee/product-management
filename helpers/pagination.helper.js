
module.exports = async (req, find, modelName) => {
    const countProduct = await modelName.countDocuments(find);
    const pagination = {
        limitProduct : 4,
        currentPage :  1,
        totalPage : Math.ceil(countProduct/4),
    };
    if(req.query.page) {
        pagination.currentPage = parseInt(req.query.page);
    }
    pagination.skipProduct = (pagination.currentPage-1) * pagination.limitProduct;

    return pagination;
}