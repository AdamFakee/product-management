
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

// đổi trạng thái 
const boxAction = document.querySelector('[box-actions]');
if(boxAction){
    const button = boxAction.querySelector('button');
    const link = boxAction.getAttribute('box-actions');
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
            
            fetch(link, {
                method : "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataChangeMulti),
            })
                .then(res => res.json())
                .then(data => {
                    if(data.code == 200){
                        window.location.reload();
                    }
                })
        } else {
            alert("ap dung va chon sp")
        }
    })
}
// end đổi trạng thái

// end tính năng thay đổi trạng thái nhiều sản phẩm

// xóa mềm 1 sản phẩm
const listButtonDelete = document.querySelectorAll('[button-delete]');
if(listButtonDelete.length > 0){
    listButtonDelete.forEach(button => {
        button.addEventListener('click', () => {
            const link = button.getAttribute('button-delete');
            fetch(link, {
                method : "DELETE",
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
// end xóa mềm 1 sản phẩm

// khôi phục sản phẩm 
const listRestoreButton = document.querySelectorAll('[button-restore]')
if(listRestoreButton.length){
    listRestoreButton.forEach(button => {
        button.addEventListener('click', () => {
            const link = button.getAttribute('button-restore');
            console.log(link)
            fetch(link, {
                method : "PATCH",
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
// end khôi phục sản phẩm

// xóa vĩnh viễn 
const listDeletePermanentlyButton = document.querySelectorAll('[button-delete-permanently]');
if(listDeletePermanentlyButton.length){
    listDeletePermanentlyButton.forEach(button => {
        button.addEventListener('click', () => {
            const link = button.getAttribute('button-delete-permanently');
            fetch(link, {
                method : 'DELETE',
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
// end xóa vĩnh viễn

// show alert
const alert = document.querySelector('[show-alert]');
if(alert){
    const time = alert.getAttribute('show-alert') || 3000;
    setTimeout(() => {
        alert.classList.add('hidden');
    }, time);
}
// end show alert

// preview image
const uploadImage = document.querySelector('[upload-image]');
if(uploadImage) {
    const input = uploadImage.querySelector('[upload-image-input]');
    const imagePreview = uploadImage.querySelector('[upload-image-preview]');
    input.addEventListener('change', () => {   
        const file = input.files[0];
        console.log(file)
        if(file){
            imagePreview.src = URL.createObjectURL(file);
            imagePreview.classList.remove('hidden');
        }
    })
}
// end preview imgae

// sap xep theo nhieu tieu chi
const sort = document.querySelector('[sort]');
if(sort){
    const sortSelect = sort.querySelector('[sort-select]');
    const url = new URL(window.location.href);
    sortSelect.addEventListener('change', () => {
        const [sortKey, sortValue] = sortSelect.value.split('-');
        if(sortKey && sortValue){
            url.searchParams.set('sortKey', sortKey);
            url.searchParams.set('sortValue', sortValue);
        }
        window.location.href = url.href;
    })
    // Thêm selected mặc định cho option
    const defaultSortKey = url.searchParams.get("sortKey");
    const defaultSortValue = url.searchParams.get("sortValue");

    if(defaultSortKey && defaultSortValue) {
        const optionSelected = select.querySelector(`option[value="${defaultSortKey}-${defaultSortValue}"]`);
        optionSelected.selected = true;
        // optionSelected.setAttribute("selected", true);
    }

    // Tính năng clear
    const buttonClear = sort.querySelector("[sort-clear]");
    if(buttonClear) {
        buttonClear.addEventListener("click", () => {
        url.searchParams.delete("sortKey");
        url.searchParams.delete("sortValue");

        window.location.href = url.href;
        })
    }
}
// end sap xep theo nhieu tieu chi


// permission
const tablePermissions = document.querySelector("[table-permissions]");
if(tablePermissions){
    const buttonSubmit = document.querySelector('[button-submit]');
    buttonSubmit.addEventListener('click', () => {
        const listPermissions = tablePermissions.querySelectorAll('[role-id]');
        const roles = [];
        listPermissions.forEach(permission => {
            const id = permission.getAttribute('role-id');
            const listInputChecked  = tablePermissions.querySelectorAll(`input[data-id="${id}"]:checked`);
            
            const role = {
                id : id,
                permissions : [],
            }
            listInputChecked.forEach( checked => {
                const dataName = checked.getAttribute('data-name')
                role.permissions.push(dataName);
            });
            roles.push(role);
        });

        const link = buttonSubmit.getAttribute('button-submit');
        fetch(link, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                },
            body : JSON.stringify(roles)
        })
            .then(res => res.json())
            .then(data => {
                if(data.code == 200){
                    window.location.reload();
                }
            })
    })
}
// end permission

// jwt-decoded
function isTokenExpired(token) {
    if(!token){
        return;
    }
    const arrayToken = token.split('.');
    const tokenPayload = JSON.parse(atob(arrayToken[1]));  // decode Token
    return Math.floor(new Date().getTime()) >= tokenPayload.exp*1000;
}

const getCookie = (cookiName) => {
    let cookieValue = document.cookie.split("; ");
    cookieValue = cookieValue.map(value => {
        const arrValue = value.split("=");
        return {
            name: arrValue[0],
            value: arrValue[1],
        }
    })
    const cookie = cookieValue.find(value => {
        return value.name == cookiName;
    })
    return cookie ? cookie.value : null;
}

// người dùng load web thì check xem đã qua 20p tính từ thời gian tạo mới token chưa, qua rồi thì reset luôn
setTimeout(() => {
    const accessToken = getCookie('accessToken');
    const refreshToken = getCookie('refreshToken');
    if(refreshToken && accessToken) {
        const refreshTokenExpired = isTokenExpired(refreshToken);
        const accessTokenExpired = isTokenExpired(accessToken);
        if(refreshTokenExpired == false && accessTokenExpired == true) {
            const bearer = 'Bearer ' + refreshToken;
            
            fetch('/admin/reset-token', {
                method : 'POST',
                headers : {
                    'Authorization': bearer,
                    // 'X-FP-API-KEY': 'iphone', //it can be iPhone or your any other attribute
                    'Content-Type': 'application/json'
                },
            })
                .then (res => res.json())
                .then (data => {
                    if(data.code == 401) {
                        const url = new URL(window.location.href);
                        window.location.href = url.origin + `/admin/auth/login`;
                    }
                })
        }
    }
}, 0);


// End jwt-decoded