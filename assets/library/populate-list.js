window.CG.Populate = window.CG.Populate || function(MAIN, TAB, GITHUB_REPOS) {
    "use strict";

    MAIN = "#" + MAIN;

    const
        SEARCH = MAIN + ' input.prompt',
        ITEMS = MAIN + ' .item[data-repo]',
        PRODUCT_PAGE = "#product-details",
        LOADING = MAIN + ' div.ui.search',
        TWITTER_CHANGELOG = "https://twitter.com/search?q=(%23{hashname}%20AND%20%23changelog)%20(from%3A%40cTraderGuru)&src=typed_query&f=live"

    // --> Search params to open request product
    const
        queryString = window.location.search,
        urlParams = new URLSearchParams(queryString),
        repo = urlParams.get('repository'),
        cat = urlParams.get('category');

    if (repo && repo.length > 0 && cat && cat.length > 0) _openProductDetails(repo, cat);

    /*// --> Initialising the search function */
    $(SEARCH).on('keyup', function(e) {

        let myvalue = this.value.trim();

        if (!$(LOADING).hasClass("loading"))
            $(LOADING).addClass("loading");

        /* --> Filter for list elements
        if (myvalue.length < 3) {

            $(ITEMS).show();

        } else {

            $(ITEMS).hide();
            $(ITEMS + " .header:contains('" + myvalue + "')").closest(".item[data-repo]").show();
            $(ITEMS + " .description:contains('" + myvalue + "')").closest(".item[data-repo]").show();
            $(ITEMS + " .extra:contains('" + myvalue + "')").closest(".item[data-repo]").show();

        }
        */
        _toggleSearchIcon(myvalue);

        setTimeout(() => {
            $(LOADING).removeClass("loading");
        }, 300);

        e.preventDefault();

    });

    $(SEARCH).on('paste focus', function(e) {

        setTimeout(function() {

            _toggleSearchIcon(e.target.value.trim());

        }, 10);
        // --> e.preventDefault();
    });

    $(LOADING).find(".cleanall").on('click', () => {

        $(SEARCH).val("");
        _toggleSearchIcon("");

    });

    // --> Adding all available repositories
    CG.LoadRepos(GITHUB_REPOS, TAB, (success) => {

        if (!success || success.length < 1)
            return;

        // --> Hashtags events
        $(ITEMS + " .extra .ui.label").on("click", function() {

            $(SEARCH).val($(this).html());
            $(SEARCH).blur(); // -->.trigger('keyup');

            setTimeout(() => {

                $(SEARCH).trigger('focus');

            }, 300);

        });

        // --> Modal Details events
        $(ITEMS + " .open.details").click(function() {

            _openProductDetails($(this).closest(".item").attr("data-repo"), $(this).closest(".item").attr("data-cat"));

        });

        // --> Initialize search
        $('.ui.search')
            .search({
                type: 'category',
                minCharacters: 3,
                source: success,
                fields: {
                    title: 'name',
                    description: 'short_description',
                },
                searchFields: [
                    'name',
                    'category',
                    'short_description'
                ],
                onSelect: (result, response) => {

                    _openProductDetails(result.unique, result.tabname);

                    return false;

                }
            });

    });

    function _toggleSearchIcon(vv) {

        if (vv.length == 0) {

            $(LOADING).find(".cleanall").hide();

        } else {

            $(LOADING).find(".cleanall").show();

        }

    };

    function _openProductDetails(unique, tabname) {

        $(PRODUCT_PAGE + ' .container.content').hide();
        $(PRODUCT_PAGE + ' .main.loader.active').show();

        $(PRODUCT_PAGE)
            .modal({

                closeIcon: true,
                onVisible: () => {

                    const MyQueryString = "?repository=" + unique + "&category=" + tabname;

                    window.history.pushState({}, "", MyQueryString);

                    // --> LoadConfig data
                    CG.LoadRepos([unique], tabname, (success) => {

                        if (!success || success.length < 1)
                            return;

                        $(PRODUCT_PAGE + ' a.togithub').attr('href', "https://github.com/cTrader-Guru/" + unique);

                        $(PRODUCT_PAGE + ' .3d.box').attr("src", success[0].image_box);
                        $(PRODUCT_PAGE + ' .repo.name').text(success[0].name);
                        $(PRODUCT_PAGE + ' .short.description').html(success[0].short_description);

                        $(PRODUCT_PAGE + ' .images.list').html("");
                        success[0].screenshots.forEach((src, i) => {

                            $('<a>', {
                                href: success[0].path + src,
                                target: '_blank',
                                class: 'ui small image',
                                "data-lightbox": "light"
                            }).append($('<img>', {
                                src: success[0].path + src,
                                alt: "Product description " + i
                            })).appendTo(PRODUCT_PAGE + ' .images.list');

                        });

                        $(PRODUCT_PAGE + ' .row.tags').html("");
                        success[0].tags.forEach(tag => {

                            $("<span class='ui label mini'>" + tag + "</span>").appendTo(PRODUCT_PAGE + ' .row.tags');

                        });

                        _installComments();

                        $('#sJZ3vntth').html('');

                        if (success[0].params && success[0].params.length > 0) {

                            success[0].params.forEach(param => {

                                if (!param.title || !param.content) return;

                                $("<div class='title'><i class='dropdown icon'></i>" + param.title + "</div>").appendTo('#sJZ3vntth');
                                $("<div class='content'><p>" + param.content + "</p></div>").appendTo('#sJZ3vntth');

                            });

                            $('#sJZ3vntth')
                                .accordion({
                                    selector: {
                                        trigger: '.title'
                                    }
                                });

                        } else {

                            $("<span class='ui text'>There are no params for this tool</span>").appendTo("#sJZ3vntth");

                        }

                        $.ajax({
                            url: "https://api.github.com/repos/cTrader-Guru/" + unique + "/releases/latest",
                            cache: true,
                            async: true,
                            dataType: 'json',
                            success: (data) => {

                                if (!data) return;

                                let
                                    version = data.name || "",
                                    relesed = data.published_at.split("T")[0] || "";

                                $(PRODUCT_PAGE + " .ui.version em").text("Version " + data.name + " (" + relesed.replace(/-/g, ".") + ")");
                                $(PRODUCT_PAGE + " .ui.version a").attr("href", TWITTER_CHANGELOG.replace("{hashname}", success[0].twitter_changelog));

                                let downloadlink = data.zipball_url || "javascript:alert('Problems finding the download');";
                                $(PRODUCT_PAGE + ' a.todownload').attr('href', downloadlink);

                                setTimeout(() => {
                                    $(PRODUCT_PAGE + ' .container.content').show();
                                    $(PRODUCT_PAGE + ' .main.loader.active').hide();
                                }, 100);

                            }
                        });

                    });

                },
                onHidden: () => {

                    window.history.pushState({}, "", "/");

                }

            })
            .modal('show');

    }

    function _installComments() {

        $(PRODUCT_PAGE + " .comments").html("<span class='ui text'>Loading comments...</span>");

        $.ajax({
            url: "/assets/frames/disqus",
            cache: true,
            async: true,
            dataType: 'html',
            success: (data) => {

                if (typeof(data) == 'undefined' || data.length < 1) return;

                let disqus = data.replace(/PAGE_URL/g, "'" + location.href + "'").replace(/PAGE_IDENTIFIER/g, "'" + location.href + "'");

                $(PRODUCT_PAGE + " .comments").html(disqus);

            }
        });

    }

};