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
