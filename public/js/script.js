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

// checkAll : dùng chỗ chọn tất cả sản phẩm trong giỏ hàng
const checkAllCart = document.querySelector('[checkAll-cart]');
if(checkAllCart){
    checkAllCart.addEventListener('click', () => {
        const check = checkAllCart.checked;
        const checkItemCart = document.querySelectorAll('[check-item-cart]');
        if(check){ // chọn tất cả sản phẩm ở trang cart
            const ids = []; // mảng id sản phẩm trong cart
            checkItemCart.forEach(button => {
                button.checked = check;
                const id = button.getAttribute('item-id'); // id sản phẩm
                ids.push(id);
            });
            fetch('/cart/2', {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    productId : ids,
                }),
            })
                .then(res => res.json())
                .then(data => {
                    if(data.code == 200){
                        window.location.reload();
                    }
                });
        } else { // hủy chọn tất cả sản phẩm ở trang cart
            const ids = [];
            checkItemCart.forEach(button => {
                button.checked = check;
                const id = button.getAttribute('item-id'); // id sản phẩm
                ids.push(id);
            });
            fetch('/cart/3', {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    productId : ids,
                }),
            })
                .then(res => res.json())
                .then(data => {
                    if(data.code == 200){
                        window.location.reload();
                    }
                });
        }
    })
}
// end checkAll

// check-item-cart (checkOne) : như check all
const checkItemCart = document.querySelectorAll('[check-item-cart]');
if(checkItemCart.length){
    checkItemCart.forEach(button => {
        button.addEventListener('click', () => {
            const countChecked = document.querySelectorAll('input[check-item-cart]:checked').length;
            if(checkItemCart.length == countChecked){
                checkAllCart.checked = true;
            } else {
                checkAllCart.checked = false;
            }

            if(button.checked){ // chọn sản phẩm trong giỏ hàng để tiến hành thanh toán
                const id = button.getAttribute('item-id'); // id sản phẩm
                const data = {productId : id}
                fetch('/cart/1', {
                    method: 'PATCH',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                })
                    .then(res => res.json())
                    .then(data => {
                        if(data.code == 200){
                            window.location.reload();
                        }
                    });
            } else { // hủy chọn sản phẩm
                const id = button.getAttribute('item-id');
                const data = {productId : id}
                fetch('/cart/0', {
                    method: 'PATCH',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                })
                    .then(res => res.json())
                    .then(data => {
                        if(data.code == 200){
                            window.location.reload();
                        }
                    });
            }
        })
    })
}
// end check-item-cart

// pagination
const paginationButton = document.querySelectorAll('[button-pagination]');
if(paginationButton.length){
    const url = new URL(window.location.href);
    paginationButton.forEach(button => {
        button.addEventListener('click', () => {
            const page = button.getAttribute('button-pagination');
            if(page){
                url.searchParams.set('page', page);
            } else {
                url.searchParams.delete('page');
            }
            window.location.href = url;
        })
    })
}
// end pagination

// address default 
const addressDefaultCheck = document.querySelectorAll('[address-default-checkbox]');
if(addressDefaultCheck.length){
    addressDefaultCheck.forEach(button => {
        button.addEventListener('click', () => {
            const id = button.getAttribute('id');
            fetch('/address/default', {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id : id,
                    default : button.checked,
                }),
            })
                .then(res => res.json())
                .then(data => {
                    if(data.code == 200){
                        window.location.reload();
                    }
                });
        })
    })
}
// end address default

// show alert 
const showAlert = document.querySelector('[show-alert]');
if(showAlert){
    const time = showAlert.getAttribute('show-alert') || 3000;
    setTimeout(() => {
        showAlert.classList.add('hidden');
    }, time)
}
// end show alert 

// your order
function showTab(tabId) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => {
        tab.style.display = 'none';
    });
    document.getElementById(tabId).style.display = 'block';
}

// Hiển thị tab đầu tiên khi tải trang
document.addEventListener('DOMContentLoaded', () => {
    showTab('all');
});
// end your order