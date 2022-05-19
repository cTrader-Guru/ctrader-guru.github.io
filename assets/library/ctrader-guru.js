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

        Version: "1.023",
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
        LoadRepos: (GITHUB_REPOS, tabname, onLoaded, item_path = "/repositories/{folder}/{repo_name}/", item_template = "/assets/frames/item-template") => {

            var $shop_items = $("#" + tabname + "-items");

            CG.LoadTemplate(item_template, (template) => {

                var count = 0;

                GITHUB_REPOS.forEach(repo => {

                    var path = item_path.replace(/\{folder\}/g, tabname).replace(/\{repo_name\}/g, repo);
                    var item_config = path + "config.json";

                    CG.LoadConfig(item_config, (config) => {

                        let $tmp = $(template).clone();

                        var item_image = path + config.img_3d_box;

                        $tmp.attr("data-repo", config.unique);
                        $tmp.find(".image img").attr("src", item_image);
                        $tmp.find(".content .header").html(config.name);
                        $tmp.find(".content .description").html("<p>" + config.short_description + "</p>");

                        let $tags = $tmp.find(".content .extra");

                        config.tags.forEach(tag => {

                            $tags.append("<a class=\"ui label mini\">" + tag + "</a>");

                        });

                        $shop_items.append($tmp);
                        count++;

                        if (count == GITHUB_REPOS.length) onLoaded(true);

                    }, (jqXHR, textStatus, errorThrown) => {

                        console.log("Load config : " + errorThrown);

                    });

                });

            }, (jqXHR, textStatus, errorThrown) => {

                onLoaded(false);
                console.log("Load template : " + errorThrown);

            });

        }

    };

})(jQuery);