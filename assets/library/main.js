(function($) {


    "use strict";

    $('#shop-container .menu .item')
        .tab({

            cache: true,
            evaluateScripts: true,
            context: 'parent',
            auto: true,
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

})(jQuery);