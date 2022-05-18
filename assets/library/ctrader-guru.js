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
                cache: true,
                async: true,
                dataType: 'html',
                success: success,
                error: error
            });

        },
        LoadConfig: (url, success, error) => {

            $.ajax({
                url: url,
                cache: true,
                async: true,
                dataType: 'json',
                success: success,
                error: error
            });

        },
        LoadRepos: (GITHUB_REPOS, tabname, item_template = "/assets/frames/item-template", item_config = "/repositories/{repo_name}/config.json") => {

            var $shop_items = $("#" + tabname + "-items");

            CG.LoadTemplate(item_template, (template) => {

                GITHUB_REPOS.forEach(repo => {

                    CG.LoadConfig(item_config.replace(/\{repo_name\}/g, repo), (config) => {

                        let $tmp = $(template).clone();

                        $tmp.attr("data-repo", config.unique);
                        $tmp.find(".image img").attr("src", config.img_3d_box);
                        $tmp.find(".content .header").html(config.name);
                        $tmp.find(".content .description").html("<p>" + config.short_description + "</p>");

                        let $tags = $tmp.find(".content .extra");

                        config.tags.forEach(tag => {

                            $tags.append("<a class=\"ui label mini\">" + tag + "</a>");

                        });

                        $shop_items.append($tmp);

                    }, (jqXHR, textStatus, errorThrown) => {

                        console.log("Load config : " + errorThrown);

                    });

                });

            }, (jqXHR, textStatus, errorThrown) => {

                console.log("Load template : " + errorThrown);

            });

        }

    };

})(jQuery);