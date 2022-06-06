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

    const
        IsNotLocalhost = location.hostname != '127.0.0.1' && location.hostname != 'localhost',
        RomeTZ = CG.ConvertTZ(new Date, "Europe/Rome"),
        RomeH = RomeTZ.getHours(),
        RomeM = RomeTZ.getMinutes(),
        CurrentRomeTime = RomeH + ":" + RomeM,
        OperatorStart = "09:00",
        OperatorStop = "17:00",
        OperatorDayWork = [1, 2, 3, 4, 5],
        IsOperatorTimeWork = (CurrentRomeTime >= OperatorStart && CurrentRomeTime <= OperatorStop),
        IsOperatorDayWork = OperatorDayWork.indexOf(RomeTZ.getDay()) > -1;

    if (IsNotLocalhost && IsOperatorDayWork && IsOperatorTimeWork)
        $("<script src='https://code.jivo.ru/widget/vJVgRN5kgV' async></script>").appendTo('body');

    console.log("Today in Rome is the " + RomeTZ.getDay() + "° day of the week and now is " + CurrentRomeTime + ", the operator work in days " + OperatorDayWork.join('/') + " from " + OperatorStart + " to " + OperatorStop + ", then now is " + (IsOperatorDayWork && IsOperatorTimeWork ? "active." : "inactive."));

})(jQuery);