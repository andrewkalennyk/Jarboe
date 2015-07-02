'use strict';

var Translator =
{
    lang: 'ua',
    translates: null,
    context: 'messages',

    init: function()
    {

    }, // end init

    t: function(key, context, lang)
    {
        if (context == undefined || context == '') {
            context = 'messages';
        }

        if (lang == undefined || lang == '') {
            lang = Translator.lang;
        }

        var translate = '';
        if (Translator.translates[lang][context][key] != undefined) {
            translate = Translator.translates[lang][context][key].trim();
        }

        return translate;
    } // end t
};

jQuery(document).ready(function() {
    Translator.init();
});