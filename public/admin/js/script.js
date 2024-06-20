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

// tính năng thay đổi trạng thái sản phầm - phương thức patch
const listButtonStatusChange = document.querySelectorAll('[button-status-change]');
if(listButtonStatusChange.length > 0) {
    listButtonStatusChange.forEach(button => {
        button.addEventListener("click", () => {
            const link = button.getAttribute('link');     
            fetch(link, {  // vô link => produc.router => product.controller => data = 200 => reload
                method: "PATCH",  // thống nhất phương thức
                headers: {
                  "Content-Type": "application/json",
                },
              })
                .then(res => res.json())
                .then(data => {
                    if(data.code == 200){
                        window.location.reload();
                    }
                })
        })
    })
}


// tính năng thay đổi trạng thái nhiều sản phẩm

// check item
const checkAll = document.querySelector("[name='checkAll']");
if(checkAll){

    // check all
    const listCheckItem = document.querySelectorAll("[name='checkItem']");
    checkAll.addEventListener('click', () => {
        listCheckItem.forEach(check => {
            check.checked = checkAll.checked;
        })
    })
    // end check all

    // check item
    
    listCheckItem.forEach(check => {
        check.addEventListener('click', () => {
            const countCheckItemChecked = document.querySelectorAll("[name='checkItem']:checked");
            if(countCheckItemChecked.length == listCheckItem.length){
                checkAll.checked = true;
            } else {
                checkAll.checked = false;
            }
        })
    })
}
// end check item

//
const boxAction = document.querySelector('[box-actions]');
if(boxAction){
    const button = boxAction.querySelector('button');
    button.addEventListener('click', () => {
        const select = boxAction.querySelector('select');
        const status = select.value;
        const listInputChecked = document.querySelectorAll("[name='checkItem']:checked"); // nút đã chọn
        const ids = [];
        listInputChecked.forEach(checkBox => {
            ids.push(checkBox.id);
        })
        if(status && ids.length > 0){
            const dataChangeMulti  = {
                status : status,
                ids : ids
            }
            
            fetch("/admin/products/change-multi-status", {
                method : "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataChangeMulti),
            })
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                })
        }
    })
}
//

// end tính năng thay đổi trạng thái nhiều sản phẩm