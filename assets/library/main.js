(function() {

    $('#shop-container .menu .item').tab()
        /*.tab({

                evaluateScripts: 'once',
                context: 'parent',
                auto: true,
                path: '/assets/frames/'

            })*/
    ;

    $('.open-main-menu').click(function() {

        $('#main-menu')
            .modal({
                closeIcon: true
            })
            .modal('show');

    });

    $('.faq.accordion')
        .accordion({
            selector: {
                trigger: '.title'
            }
        });

})();