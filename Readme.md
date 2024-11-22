# chú ý : thêm đuôi "/admin/dashboard" để vào trang admin
# tài khoản admin : 
* email : buidinhtuan04@gmail.com
* password : tuan1234
# Cài đặt project
**1.** git clone https://github.com/AdamFakee/product-management.git <br>
**2.** npm install <br>
**3.** npm start <br>
**4.** turn on brower, go to "http://localhost:3000" 

## Mô tả
* Web có đầy đủ các tính năng của một trang web thương mại điện tử
* Backend : Node.JS (Express), SSR.
* Frontend : HTML, CSS, Bootstrap, Pug
* Libaries : md5, express-rate-limit, passport, express-flash, method-override, moment, mongoose-slug-updater, node-cache, socket.io, tinymce, passport-google-oauth20, nodemailer, express-session, dotenv, connect-redis, ioredis, jsonwebtoken, nodemailer, multer, express, body-parser, mongoose.
* Database : MongoDB
* Mô hình cấu trúc thư mục : MVC
  
### Các chức năng chính 
* CRUD 
* Xác thực người dùng bằng JWT và sử dụng whiteList-token để chứa những Token hợp lệ.
* Đăng nhập đăng kí bằng Google. Có thể sử dụng cùng 1 tài khoản google đồng bộ cùng tài khỏan đăng kí bằng email và password thủ công
* Tích hợp CSP để tránh các tấn công về XSS.
* Sử dụng express-rate-limit để bảo vệ 1 số router tránh việc spam liên tục.
* Tối ưu hiệu suất load web bằng node-cache ( xác thực người dùng, data phần header).
* Phần quyền, tìm kiếm (kết hợp với regex), bộ lọc, thay đổi trạng thái, phân trang ở bên phần Admin.
*  Danh mục phân cấp bên trang client.
*  Cấu hình địa chỉ nhận hàng.
*  Xây dựng tính năng chat RealTime bằng socket.io giữa Admin và Client ( Admin có thể chọn người dùng để chat, phân trang tin nhắn).
