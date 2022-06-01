(function($) {


    "use strict";

    $("#version").html(CG.Version);

    $('#shop-container .menu .item')
        .tab({

            cache: true,
            evaluateScripts: true,
            context: 'parent',
            auto: true,
            alwaysRefresh: false,
            path: '/assets/frames/'

        });

    $('[data-tab="indicators"]').trigger('click');

    $('.open-main-menu').click(function() {

        $('#main-menu')
            .modal({
                closeIcon: true
            })
            .modal('show');

    });

    // --> Search with case insensitive
    jQuery.expr[':'].contains = function(a, i, m) {
        return jQuery(a).text().toUpperCase()
            .indexOf(m[3].toUpperCase()) >= 0;
    };

    if (location.hostname != '127.0.0.1' && location.hostname != 'localhost')
        $("<script src='https://code.jivo.ru/widget/2YQxqNiaXk' async></script>").appendTo('body');

})(jQuery);