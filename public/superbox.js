'use strict';

var Superbox =
{

    redactor: null,
    is_images_loading: false,
    images_page: 1,
    input: null,
    type_select: null,

    fields: {
        image: {},
        gallery: {},
        tag: {},
        storage: {},
    },

    init: function()
    {
        $('.superbox').SuperBox();
    }, // end init

    openCatalog: function(id)
    {
    }, // end openCatalog

    showGalleryPreloader: function()
    {
        $('.j-galleries-preloader').show();
    }, // end showGalleryPreloader

    hideGalleryPreloader: function()
    {
        $('.j-galleries-preloader').hide();
    }, // end hideGalleryPreloader

    onGalleryImagesPriorityChange: function(idGallery, order)
    {
        var data = {
            query_type: 'image_storage',
            storage_type: 'change_gallery_images_priority',
            images: order,
            id_gallery: idGallery,
            '__node': TableBuilder.getUrlParameter('node')
        };

        jQuery.ajax({
            type: "POST",
            url: TableBuilder.getActionUrl(),
            data: data,
            dataType: 'json',
            success: function(response) {
                if (response.status) {
                    TableBuilder.showSuccessNotification('Порядок следования изменен');
                } else {
                    TableBuilder.showErrorNotification('Что-то пошло не так');
                }
            }
        });
    }, // end onGalleryImagesPriorityChange

    deleteGalleryImageRelation: function(context, idImage, idGallery)
    {
        jQuery.SmartMessageBox({
            title : "Удалить изображение из галереи?",
            content : "Эту операцию нельзя будет отменить.",
            buttons : '[Нет][Да]'
        }, function(ButtonPressed) {
            if (ButtonPressed === "Да") {
                Superbox.showGalleryPreloader();
                var data = {
                    query_type: 'image_storage',
                    storage_type: 'delete_image_from_gallery',
                    id_image: idImage,
                    id_gallery: idGallery,
                    '__node': TableBuilder.getUrlParameter('node')
                };

                jQuery.ajax({
                    type: "POST",
                    url: TableBuilder.getActionUrl(),
                    data: data,
                    dataType: 'json',
                    success: function(response) {
                        if (response.status) {
                            $(context).parent().remove();
                            $("#sortable").sortable("refresh");
                            Superbox.hideGalleryPreloader();

                            TableBuilder.showSuccessNotification('Изображение удалено из галереи');
                        } else {
                            TableBuilder.showErrorNotification('Что-то пошло не так');
                        }
                    }
                });
            }
        });
    }, // end deleteGalleryImageRelation

    editGalleryContent: function(context, idGallery)
    {
        Superbox.showGalleryPreloader();
        Superbox.closeGalleryContentForm();

        var data = {
            query_type: 'image_storage',
            storage_type: 'show_edit_gallery_content',
            id: idGallery,
            '__node': TableBuilder.getUrlParameter('node')
        };
        jQuery.ajax({
            data: data,
            type: "POST",
            url: TableBuilder.getActionUrl(),
            dataType: 'json',
            success: function(response) {
                Superbox.hideGalleryPreloader();
                if (response.status) {
                    var $tr = $(context).closest('tr');
                    $tr.after(response.html);
                } else {
                    TableBuilder.showErrorNotification("Ошибка");
                }
            }
        });
    }, // end editGalleryContent

    closeGalleryContentForm: function()
    {
        $('.image-storage-edit-gallery-tr').remove();
    }, // end closeEditForm

    uploadSingleImage: function(context, type, idImage)
    {
        var data = new FormData();
        data.append("image", context.files[0]);
        data.append('query_type', 'image_storage');
        data.append('storage_type', 'upload_single_image');
        data.append('__node', TableBuilder.getUrlParameter('node'));
        data.append('type', type);
        data.append('id', idImage);

        jQuery.ajax({
            data: data,
            type: "POST",
            url: TableBuilder.getActionUrl(),
            cache: false,
            contentType: false,
            processData: false,
            success: function(response) {
                if (response.status) {
                    $(context).parent().parent().parent().parent().find('.superbox-current-img').prop('src', response.src);
                } else {
                    TableBuilder.showErrorNotification("Ошибка при загрузке изображения");
                }
            }
        });
    }, // end uploadSingleImage

    showGalleryEditInput: function(context)
    {
        var $td = $(context).closest('td');

        $td.find('.b-value').hide();
        $td.find('.b-input').show();
    }, // end showGalleryEditInput

    closeGalleryEditInput: function(context)
    {
        var $td = $(context).closest('td');

        var value = $td.find('.b-value').show().find('a').text().trim();
        $td.find('.b-input').hide().find('input').val(value);
    }, // end closeGalleryEditInput

    saveGalleryEditInput: function(context, idGallery)
    {
        var $td = $(context).closest('td');
        var value = $td.find('.b-input').hide().find('input').val();

        jQuery.ajax({
            type: "POST",
            url: TableBuilder.getActionUrl(),
            data: { query_type: 'image_storage', storage_type: 'rename_gallery', title: value, id: idGallery, '__node': TableBuilder.getUrlParameter('node') },
            dataType: 'json',
            success: function(response) {
                if (response.status) {
                    $td.find('.b-value').show().find('a').text(value);
                } else {
                    TableBuilder.showErrorNotification('Что-то пошло не так');
                }
            }
        });
    }, // end saveGalleryEditInput

    showTagEditInput: function(context)
    {
        var $td = $(context).closest('td');

        $td.find('.b-value').hide();
        $td.find('.b-input').show();
    }, // end showGalleryEditInput

    closeTagEditInput: function(context)
    {
        var $td = $(context).closest('td');

        var value = $td.find('.b-value').show().find('a').text().trim();
        $td.find('.b-input').hide().find('input').val(value);
    }, // end closeTagEditInput

    saveTagEditInput: function(context, idTag)
    {
        var $td = $(context).closest('td');
        var value = $td.find('.b-input').hide().find('input').val();

        jQuery.ajax({
            type: "POST",
            url: TableBuilder.getActionUrl(),
            data: { query_type: 'image_storage', storage_type: 'rename_tag', title: value, id: idTag, '__node': TableBuilder.getUrlParameter('node') },
            dataType: 'json',
            success: function(response) {
                if (response.status) {
                    $td.find('.b-value').show().find('a').text(value);
                } else {
                    TableBuilder.showErrorNotification('Что-то пошло не так');
                }
            }
        });
    }, // end saveTagEditInput

    editTagContent: function(context, idTag)
    {
        Superbox.showTagsPreloader();

        //Superbox.closeGalleryContentForm();

        var data = {
            query_type: 'image_storage',
            storage_type: 'show_edit_tags_content',
            id: idTag,
            '__node': TableBuilder.getUrlParameter('node')
        };

        jQuery.ajax({
            data: data,
            type: "POST",
            url: TableBuilder.getActionUrl(),
            dataType: 'json',
            success: function(response) {
                Superbox.hideTagsPreloader();
                if (response.status) {
                    var $tr = $(context).closest('tr');
                    $tr.after(response.html);
                } else {
                    TableBuilder.showErrorNotification("Ошибка");
                }
            }
        });
    }, // end editTagContent

    showTagsPreloader: function()
    {
        $('.j-tags-preloader').show();
    }, // end showTagsPreloader

    hideTagsPreloader: function()
    {
        $('.j-tags-preloader').hide();
    }, // end hideTagsPreloader

    deleteTagImageRelation: function(context, idImage, idTag)
    {
        jQuery.SmartMessageBox({
            title : "Отвязать изображение от тега?",
            content : "Эту операцию нельзя будет отменить.",
            buttons : '[Нет][Да]'
        }, function(ButtonPressed) {
            if (ButtonPressed === "Да") {
                Superbox.showTagsPreloader();

                var data = {
                    query_type: 'image_storage',
                    storage_type: 'delete_image_from_tag',
                    id_image: idImage,
                    id_tag: idTag,
                    '__node': TableBuilder.getUrlParameter('node')
                };

                jQuery.ajax({
                    type: "POST",
                    url: TableBuilder.getActionUrl(),
                    data: data,
                    dataType: 'json',
                    success: function(response) {
                        if (response.status) {
                            $(context).parent().remove();

                            Superbox.hideTagsPreloader();

                            TableBuilder.showSuccessNotification('Изображение отвязано от тега');
                        } else {
                            TableBuilder.showErrorNotification('Что-то пошло не так');
                        }
                    }
                });
            }
        });
    }, // end deleteTagImageRelation

    deleteImage: function(context, idImage)
    {
        jQuery.SmartMessageBox({
            title : "Удалить изображение?",
            content : "Эту операцию нельзя будет отменить.",
            buttons : '[Нет][Да]'
        }, function(ButtonPressed) {
            if (ButtonPressed === "Да") {
                jQuery.ajax({
                    type: "POST",
                    url: TableBuilder.getActionUrl(),
                    data: { query_type: 'image_storage', storage_type: 'delete_image', id: idImage, '__node': TableBuilder.getUrlParameter('node') },
                    dataType: 'json',
                    success: function(response) {
                        if (response.status) {
                            $('.superbox .superbox-show', '.b-j-images').remove();
                            $('.superbox .superbox-list.active', '.b-j-images').remove();

                            Superbox.init();
                            TableBuilder.showSuccessNotification('Изображение удалено');
                        } else {
                            TableBuilder.showErrorNotification('Что-то пошло не так');
                        }
                    }
                });
            }
        });
    }, // end deleteImage

    selectTag: function(context, idTag)
    {
        Superbox.input.val(idTag);
        TableBuilder.closeImageStorageModal();
    }, // end selectTag

    selectGallery: function(context, idGallery)
    {
        Superbox.input.val(idGallery);
        TableBuilder.closeImageStorageModal();
    }, // end selectTag

    uploadImage: function(context)
    {
        var imgTotal = context.files.length;
        var imgCount        = 0;
        var imgFailCount    = 0;
        var imgSuccessCount = 0;
        var percentageMod     = 100 / imgTotal;
        var failPercentage    = 0;
        var successPercentage = 0;
        var $fog = $('.j-images-smoke').show();
        $fog.find('.j-images-upload-total').text(imgTotal);

        var $titleInput = $(context).parent().parent().find('.j-image-title');

        var data = new FormData();
        for (var x = 0; x < imgTotal; x++) {
            var data = new FormData();
            data.append("images[]", context.files[x]);
            console.log(context.files[x]);

            data.append('query_type', 'image_storage');
            data.append('storage_type', 'upload_image');
            data.append('title', $titleInput.val());
            data.append('__node', TableBuilder.getUrlParameter('node'));
            // FIXME: catalog
            data.append('id_catalog', 1);

            jQuery.ajax({
                data: data,
                type: "POST",
                url: TableBuilder.getActionUrl(),
                cache: false,
                contentType: false,
                processData: false,
                success: function(response) {
                    imgCount = imgCount + 1;

                    if (response.status) {
                        $titleInput.val('');
                        $('.superbox').prepend(response.html);
                        Superbox.init();

                        imgSuccessCount = imgSuccessCount + 1;
                        successPercentage = successPercentage + percentageMod;

                        $fog.find('.j-images-upload-upload').text(imgCount);
                        $fog.find('.j-images-upload-success').text(imgSuccessCount);
                        $fog.find('.j-images-progress-success').css('width', successPercentage +'%');
                    } else {
                        imgFailCount = imgFailCount + 1;
                        failPercentage = successPercentage + failPercentage;
                        var failWidth  = successPercentage + failPercentage;
                        $fog.find('.j-images-progress-fail').css('width', failWidth +'%');
                        $fog.find('.j-images-upload-fail').text(imgFailCount);
                        //TableBuilder.showErrorNotification("Ошибка при загрузке изображения");
                    }

                    if (imgCount == imgTotal) {
                        $fog.find('.j-images-upload-finish-btn').show();
                    }
                }
            });
        }
    }, // end uploadFile

    saveImageInfo: function(context, idImage)
    {
        var $context = $(context);
        var data = $context.parent().parent().parent().find('form').serializeArray();
        data.push({ name: 'id', value: idImage });
        data.push({ name: 'query_type', value: 'image_storage' });
        data.push({ name: 'storage_type', value: 'save_image_info' });
        data.push({ name: '__node', value: TableBuilder.getUrlParameter('node') });

        jQuery.ajax({
            type: "POST",
            url: TableBuilder.getActionUrl(),
            data: data,
            dataType: 'json',
            success: function(response) {
                console.log(response);
                if (response.status) {
                    $('.superbox .superbox-list.active .superbox-img', '.b-j-images').data('info', JSON.stringify(response.info).replace(/"/g, '~'));
                    TableBuilder.showSuccessNotification('Сохранено');
                } else {
                    TableBuilder.showErrorNotification('Что-то пошло не так');
                }
            }
        });

        console.table(data);
    }, // end saveImageInfo

    selectImage: function(context, idImage)
    {
        Superbox.input.val(idImage);
        TableBuilder.closeImageStorageModal();
    }, // end selectImage

    selectImageForRedactor: function(idImage)
    {
        Superbox.input.val(idImage);

        jQuery.ajax({
            type: "POST",
            url: TableBuilder.getActionUrl(),
            data: {
                query_type:     'image_storage',
                storage_type:   'fetch_image_by_id',
                id:             idImage,
                '__node':       TableBuilder.getUrlParameter('node')
            },
            dataType: 'json',
            success: function(response) {
                if (response.status) {
                    TableBuilder.closeImageStorageModal();

                    Superbox.redactor.image.insert(response.html);
                } else {
                    TableBuilder.showErrorNotification('Что-то пошло не так');
                }
            }
        });
    }, // end selectImageForRedactor

    selectImageForCKEditor: function(idImage)
    {
        Superbox.input.val(idImage);

        jQuery.ajax({
            type: "POST",
            url: TableBuilder.getActionUrl(),
            data: {
                query_type:     'image_storage',
                storage_type:   'fetch_image_by_id',
                id:             idImage,
                '__node':       TableBuilder.getUrlParameter('node')
            },
            dataType: 'json',
            success: function(response) {
                if (response.status) {
                    TableBuilder.closeImageStorageModal();

                    Superbox.redactor.insertHtml(response.html);
                } else {
                    TableBuilder.showErrorNotification('Что-то пошло не так');
                }
            }
        });
    }, // end selectImageForRedactor

    showGalleries: function(context)
    {
        var $context = $(context);
        if ($context.hasClass('active')) {
            return;
        }

        $('.b-j-galleries').show();
        $('.b-j-images').hide();
        $('.b-j-tags').hide();

        $context.parent().find('.active').removeClass('active');
        $context.addClass('active');
    }, // end showGalleries

    showImages: function(context)
    {
        var $context = $(context);
        if ($context.hasClass('active')) {
            return;
        }

        $('.b-j-galleries').hide();
        $('.b-j-images').show();
        $('.b-j-tags').hide();

        $context.parent().find('.active').removeClass('active');
        $context.addClass('active');
    }, // end showImages

    showTags: function(context)
    {
        var $context = $(context);
        if ($context.hasClass('active')) {
            return;
        }

        $('.b-j-galleries').hide();
        $('.b-j-images').hide();
        $('.b-j-tags').show();

        $context.parent().find('.active').removeClass('active');
        $context.addClass('active');
    }, // end showTags

    addTag: function(context)
    {
        var $input = $(context).parent().parent().find('input');

        jQuery.ajax({
            type: "POST",
            url: TableBuilder.getActionUrl(),
            data: { query_type: 'image_storage', storage_type: 'add_tag', type: Superbox.type_select, title: $input.val(), '__node': TableBuilder.getUrlParameter('node') },
            dataType: 'json',
            success: function(response) {
                console.log(response);
                if (response.status) {
                    $('tbody', '.j-tags-table').prepend(response.html);
                    $input.val('');
                } else {
                    TableBuilder.showErrorNotification('Что-то пошло не так');
                }
            }
        });
    }, // end addTag

    deleteTag: function(id, context)
    {
        jQuery.SmartMessageBox({
            title : "Удалить тег?",
            content : "Эту операцию нельзя будет отменить.",
            buttons : '[Нет][Да]'
        }, function(ButtonPressed) {
            if (ButtonPressed === "Да") {
                jQuery.ajax({
                    type: "POST",
                    url: TableBuilder.getActionUrl(),
                    data: { query_type: 'image_storage', storage_type: 'delete_tag', id: id, '__node': TableBuilder.getUrlParameter('node') },
                    dataType: 'json',
                    success: function(response) {
                        console.log(response);
                        if (response.status) {
                            $(context).parent().parent().remove();
                        } else {
                            TableBuilder.showErrorNotification('Что-то пошло не так');
                        }
                    }
                });
            }
        });
    }, // end deleteTag

    addGallery: function(context)
    {
        var $input = $(context).parent().parent().find('input');

        jQuery.ajax({
            type: "POST",
            url: TableBuilder.getActionUrl(),
            data: {
                query_type: 'image_storage',
                storage_type: 'add_gallery',
                type: Superbox.type_select,
                title: $input.val(),
                '__node': TableBuilder.getUrlParameter('node')
            },
            dataType: 'json',
            success: function(response) {
                console.log(response);
                if (response.status) {
                    $('tbody', '.j-galleries-table').prepend(response.html);
                    $input.val('');
                } else {
                    TableBuilder.showErrorNotification('Что-то пошло не так');
                }
            }
        });
    }, // end addGallery

    addGalleryWithImages: function(context)
    {
        var images = $('.superbox-list.selected img'),
            imagesIds = [],
            galleryName = $('input[name="_joperations[gallery_name]"]').val().trim();

        if (!galleryName) {
            TableBuilder.showErrorNotification('Введите название галереи для создания');
            return false;
        }

        images.each(function() {
            imagesIds.push($(this).data('id'));
        });

        jQuery.ajax({
            type: "POST",
            url: TableBuilder.getActionUrl(),
            data: {
                query_type:     'image_storage',
                storage_type:   'add_gallery_with_images',
                type:           Superbox.type_select,
                __node:         TableBuilder.getUrlParameter('node'),
                images_ids:     imagesIds,
                gallery_name:   galleryName
            },
            dataType: 'json',
            success: function(response) {
                if (response.status) {
                    $('tbody', '.j-galleries-table').prepend(response.html);
                    $('input[name="_joperations[gallery_name]"]').val('');

                    TableBuilder.showSuccessNotification('Галерея с изображениями успешно создана');

                    setTimeout(function() {
                        $('.j-images-storage .b-j-catalog-buttons .btn-group-justified a').first().click();
                        $('.j-galleries-table tbody tr').first().find('a.select-gallery').first().click();
                    }, 1000);

                } else {
                    TableBuilder.showErrorNotification('Что-то пошло не так');
                }
            }
        });
    }, // end addGalleryWithImages

    deleteGallery: function(id, context)
    {
        jQuery.SmartMessageBox({
            title : "Удалить галерею?",
            content : "Эту операцию нельзя будет отменить.",
            buttons : '[Нет][Да]'
        }, function(ButtonPressed) {
            if (ButtonPressed === "Да") {
                Superbox.showGalleryPreloader();
                jQuery.ajax({
                    type: "POST",
                    url: TableBuilder.getActionUrl(),
                    data: { query_type: 'image_storage', storage_type: 'delete_gallery', id: id, '__node': TableBuilder.getUrlParameter('node') },
                    dataType: 'json',
                    success: function(response) {
                        Superbox.hideGalleryPreloader();
                        console.log(response);
                        if (response.status) {
                            $(context).parent().parent().remove();
                        } else {
                            TableBuilder.showErrorNotification('Что-то пошло не так');
                        }
                    }
                });
            }
        });
    }, // end deleteGallery

    loadMoreImages: function()
    {
        if (Superbox.is_images_loading) {
            return;
        }

        Superbox.is_images_loading = true;
        var data = {
            query_type: 'image_storage',
            storage_type: 'load_more_images',
            page: Superbox.images_page,
            '__node': TableBuilder.getUrlParameter('node')
        };
        data = $.merge(data, $('#j-images-search-form').serializeArray());
        jQuery.ajax({
            type: "POST",
            url: TableBuilder.getActionUrl(),
            data: data,
            dataType: 'json',
            success: function(response) {
                if (response.status) {
                    Superbox.images_page = Superbox.images_page + 1;

                    $('.superbox').append(response.html);
                    Superbox.init();

                    Superbox.is_images_loading = false;
                } else {
                    TableBuilder.showErrorNotification('Что-то пошло не так. Ахахаха!');
                }
            }
        });
    }, // end loadMoreImages

    deleteImageFromGalleryView: function(idImage)
    {
        jQuery.SmartMessageBox({
            title : "Удалить изображение?",
            content : "Эту операцию нельзя будет отменить.",
            buttons : '[Нет][Да]'
        }, function(ButtonPressed) {
            if (ButtonPressed === "Да") {
                jQuery.ajax({
                    type: "POST",
                    url: TableBuilder.getActionUrl(),
                    data: { query_type: 'image_storage', storage_type: 'delete_image', id: idImage, '__node': TableBuilder.getUrlParameter('node') },
                    dataType: 'json',
                    success: function(response) {
                        if (response.status) {
                            $('#'+ idImage).remove();
                            $('#sortable').sortable("refresh");
                            $('.j-images-fuck').remove();
                            TableBuilder.showSuccessNotification('Изображение удалено полностью и с концами');
                        } else {
                            TableBuilder.showErrorNotification('Что-то пошло не так');
                        }
                    }
                });
            }
        });
    }, // end deleteImageFromGalleryView

    showImageFormFromGalleryView: function(context)
    {
        $('.j-images-fuck').remove();
        var idImage = $(context).parent().attr('id');
        jQuery.ajax({
            type: "POST",
            url: TableBuilder.getActionUrl(),
            data: { query_type: 'image_storage', storage_type: 'get_image_form', type_select: 'image_from_gallery', id: idImage, '__node': TableBuilder.getUrlParameter('node') },
            dataType: 'json',
            success: function(response) {
                console.log(response);
                if (response.status) {
                    var html = '<div style="position: relative;padding: 10px;width: 100%;height: 100%;background-color: #222;" class="j-images-fuck">'+ response.html +'</div>';
                    $('form', ".image-storage-edit-gallery-tr").before(html);
                    $('select.select22').select2();
                } else {
                    TableBuilder.showErrorNotification('Что-то пошло не так');
                }
            }
        });
    }, // end showImageFormFromGalleryView

    searchImages: function(context)
    {
        var data = $('#j-images-search-form').serializeArray();
        data.push({ name: 'query_type', value: 'image_storage' });
        data.push({ name: 'storage_type', value: 'search_images' });
        data.push({ name: '__node', value: TableBuilder.getUrlParameter('node') });

        jQuery.ajax({
            type: "POST",
            url: TableBuilder.getActionUrl(),
            data: data,
            dataType: 'json',
            success: function(response) {
                if (response.status) {
                    $('#j-images-container').html(response.html);
                    Superbox.images_page = 1;
                    Superbox.init();
                } else {
                    TableBuilder.showErrorNotification('Что-то пошло не так');
                }
            }
        });
    }, // end searchImages

    searchGalleries: function(context)
    {
        var data = $('#j-galleries-search-form').serializeArray();
        data.push({ name: 'query_type', value: 'image_storage' });
        data.push({ name: 'storage_type', value: 'search_galleries' });
        data.push({ name: '__node', value: TableBuilder.getUrlParameter('node') });

        jQuery.ajax({
            type: "POST",
            url: TableBuilder.getActionUrl(),
            data: data,
            dataType: 'json',
            success: function(response) {
                if (response.status) {
                    $('.b-j-galleries .row').html(response.html);
                } else {
                    TableBuilder.showErrorNotification('Что-то пошло не так');
                }
            }
        });
    }, // end searchGalleries

    checkSelectedImages: function()
    {
        if ($('.superbox-list.selected').length) {
            $('.b-j-search.operations').show();
        } else {
            $('.b-j-search.operations').hide();
        }
    }, // end checkSelectedImages

    saveImagesGalleriesRelations: function()
    {
        var images = $('.superbox-list.selected img'),
            imagesIds = [],
            galleriesIds = $('select[name="_joperations[galleries][]"]').val();

        if (!galleriesIds) {
            TableBuilder.showErrorNotification('Выберите галереи для добавления изображений');
            return false;
        }

        images.each(function() {
            imagesIds.push($(this).data('id'));
        });

        jQuery.ajax({
            type: "POST",
            url: TableBuilder.getActionUrl(),
            data: {
                query_type:     'image_storage',
                storage_type:   'save_images_galleries_relations',
                __node:         TableBuilder.getUrlParameter('node'),
                images_ids:     imagesIds,
                galleries_ids:  galleriesIds
            },
            dataType: 'json',
            success: function(response) {
                if (response.status) {
                    $('.superbox-list.selected').removeClass('selected');

                    Superbox.checkSelectedImages();
                    Superbox.reinitOperationsSelects();

                    TableBuilder.showSuccessNotification('Сохранено');
                } else {
                    TableBuilder.showErrorNotification('Что-то пошло не так');
                }
            }
        });
    }, // end saveImagesGalleriesRelations

    saveImagesTagsRelations: function()
    {
        var images = $('.superbox-list.selected img'),
            imagesIds = [],
            tagsIds = $('select[name="_joperations[tags][]"]').val();

        if (!tagsIds) {
            TableBuilder.showErrorNotification('Выберите теги для добавления изображений');
            return false;
        }

        images.each(function() {
            imagesIds.push($(this).data('id'));
        });

        jQuery.ajax({
            type: "POST",
            url: TableBuilder.getActionUrl(),
            data: {
                query_type:     'image_storage',
                storage_type:   'save_images_tags_relations',
                __node:         TableBuilder.getUrlParameter('node'),
                images_ids:     imagesIds,
                tags_ids:       tagsIds
            },
            dataType: 'json',
            success: function(response) {
                if (response.status) {
                    $('.superbox-list.selected').removeClass('selected');

                    Superbox.checkSelectedImages();
                    Superbox.reinitOperationsSelects();

                    TableBuilder.showSuccessNotification('Сохранено');
                } else {
                    TableBuilder.showErrorNotification('Что-то пошло не так');
                }
            }
        });
    }, // end saveImagesTagsRelations

    reinitOperationsSelects: function()
    {
        var galleriesOperations = jQuery('#galleries-operations'),
            tagsOperations = jQuery('#tags-operations');

        galleriesOperations.select2('destroy');
        //galleriesOperations.prop('selectedIndex', 0);
        galleriesOperations.select2();

        tagsOperations.select2('destroy');
        //tagsOperations.prop('selectedIndex', 0);
        tagsOperations.select2();
    } // end reinitOperationsSelects
};

$(document).ready(function() {
    //Superbox.init();
});
