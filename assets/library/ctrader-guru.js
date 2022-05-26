(($) => {

    "use strict";

    // --> cTrader Guru object
    window.CG = {

        Version: "1.057",
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
        LoadRepos: (GITHUB_REPOS, tabname, onLoaded, show_first = 5) => {

            var
                $shop_items = $("#" + tabname + "-items"),
                item_path = "/repositories/{folder}/{repo_name}/",
                item_template = "/assets/frames/item-template";

            CG.LoadTemplate(item_template, (template) => {

                var
                    count = 0,
                    search_list = [];

                GITHUB_REPOS.forEach(repo => {

                    var path = item_path.replace(/\{folder\}/g, tabname).replace(/\{repo_name\}/g, repo);
                    var item_config = path + "config.json";

                    CG.LoadConfig(item_config, (config) => {

                        let
                            $tmp = $(template).clone(),
                            item_image = path + config.img_3d_box,
                            new_record = {

                                unique: config.unique,
                                tabname: tabname,
                                category: config.tags.join(", "),
                                tags: config.tags,
                                name: config.name,
                                image_box: item_image,
                                short_description: config.short_description,
                                screenshots: config.screenshots || [],
                                path: path,
                                params: config.params,
                                twitter_changelog: config.twitter_changelog

                            };

                        if ($shop_items.find("[data-repo='" + config.unique + "'][data-cat='" + tabname + "']").length == 0) {

                            $tmp.attr("data-repo", config.unique);
                            $tmp.attr("data-cat", tabname);
                            $tmp.find(".image img").attr("src", item_image);
                            $tmp.find(".content .header").html(config.name);
                            $tmp.find(".content .description").html("<p>" + config.short_description + "</p>");

                            let $tags = $tmp.find(".content .extra");

                            config.tags.forEach(tag => {

                                $tags.append("<a class=\"ui label mini\">" + tag + "</a>");

                            });

                            $shop_items.append($tmp);
                            if (count < show_first) $tmp.show();

                        }



                        search_list.push(new_record);
                        count++;

                        if (count == GITHUB_REPOS.length) onLoaded(search_list);

                    }, (jqXHR, textStatus, errorThrown) => {

                        console.log("Load config : " + errorThrown);

                    });

                });

            }, (jqXHR, textStatus, errorThrown) => {

                onLoaded([]);
                console.log("Load template : " + errorThrown);

            });

        },
        RandomString: (length) => {

            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for (var i = 0; i < length; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            return text;

        }

    };

})(jQuery);