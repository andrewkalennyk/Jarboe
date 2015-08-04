CKEDITOR.plugins.add('ImageManager', {
    icons: '',
    init: function(editor) {
        editor.addCommand('openStorage', {
            exec: function(editor) {
                $('body').prepend('<div><div><input id="wysiwyg-redactor-image-id" type="hidden"></div></div>');
                var $input = $('#wysiwyg-redactor-image-id');

                Superbox.redactor = editor;
                TableBuilder.openImageStorageModal($input, 'ckeditor_image');
            }
        });
        editor.ui.addButton('Templates', {
            label: 'Изображение из фотохранилища',
            command: 'openStorage',
            toolbar: 'insert'
        });
    }
});
