tinymce.init({
  selector: 'textarea[textarea-mce]',
  plugins: 'lists link image table code help wordcount',
  toolbar : "imageupload",
  file_picker_types: 'image',
  images_upload_url: '/admin/upload',
});