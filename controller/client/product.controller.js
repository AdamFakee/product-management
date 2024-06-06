module.exports.index = (req, res) => {
    res.render("client/pages/products/index", {
      pageTitle: 'trang danh sach san pham'
    });
  }
