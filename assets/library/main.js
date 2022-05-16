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

})(jQuery);