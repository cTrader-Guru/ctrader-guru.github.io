(($) => {

    "use strict";

    const GITHUB_API = {

        repo: {

            info: "https://api.github.com/repos/cTrader-Guru/Box-Info",
            release: "https://api.github.com/repos/cTrader-Guru/Box-Info/releases/latest"

        }

    };

    // --> cTrader Guru object
    window.CG = {

        LoadTemplate: (url, success, error) => {

            $.ajax({
                url: url,
                async: true,
                dataType: 'html',
                success: success,
                error: error
            });

        },
        LoadConfig: (url, success, error) => {

            $.ajax({
                url: url,
                async: true,
                dataType: 'json',
                success: success,
                error: error
            });

        }

    };

})(jQuery);