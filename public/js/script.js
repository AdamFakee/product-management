// search : nhập nội dung => được click nút submit
const searchProduct = document.querySelector('[search-product]');
if(searchProduct){
    const input = searchProduct.querySelector('input');
    input.addEventListener('change', () => {
        const button = searchProduct.querySelector('button');
        button.removeAttribute('disabled');
    })
}

// end search

// cập nhật số lượng sản phẩm
const quantityItemInCart = document.querySelectorAll('[quantity-item-in-cart]');
if(quantityItemInCart.length){
    quantityItemInCart.forEach(input => {
        input.addEventListener('change', () => {
            const quantity = input.value;
            const productId = input.getAttribute('item-id');
            window.location.href = `/cart/update/${productId}/${quantity}`;
        })
    })
}
// end cập nhật số lượng sản phẩm