// button-status
const buttonStatus = document.querySelectorAll('[button-status]');
if(buttonStatus.length > 0) {
    let url = new URL(window.location.href);  // copy link 
    buttonStatus.forEach(button => {
        button.addEventListener('click', () => {
            const status = button.getAttribute("button-status"); // lay noi dung class
            if(status){
                url.searchParams.set("status", status);  // them vao link cap name=value
            } else {
                url.searchParams.delete('status'); // xóa để cập nhật lại link còn nếu k xóa thì khi người dùng k nhập gì
                                                    // => reload nhưng vẫn giữ nguyên link cũ => sai logic dù k lỗi
            }
            window.location.href = url.href;
        })
    })

    // end button status

    // them active mac dinh
    const statusCurrent = url.searchParams.get("status") || "";   // lay value cua key status
    const buttonCurrent = document.querySelector(`[button-status="${statusCurrent}"]`);
    if(buttonCurrent){
        buttonCurrent.classList.add('active');
    }
}

// end tính năng lọc


// tính năng tìm kiếm
let formSeach = document.querySelector('[form-search]');  // lấy form
if(formSeach){
    let url = new URL(window.location.href);
    formSeach.addEventListener('submit', (event) => {
        event.preventDefault();   // sau khi submit thì k cho load lại web
                                // ngăn chặn tính năng mặc định của submit form
        const keyword = event.target.elements.keyword.value;
        if(keyword){
            url.searchParams.set("keyword", keyword);
        } else {
            url.searchParams.delete('keyword');  // k xóa thì link cũ k cập nhật, dù k lỗi gì nhưng sai logic thông thường
        }
        window.location.href = url.href;
    })
}


// tính năng phân trang

const buttonPagination = document.querySelectorAll('[button-pagination]');
if(buttonPagination.length > 0){
    const url = new URL(window.location.href);
    buttonPagination.forEach(button => {
        button.addEventListener('click', () => {
            const page = button.getAttribute('button-pagination');
            url.searchParams.set('page', page);
            window.location.href = url.href;
        })
    })
}
// end tính năng phân trang