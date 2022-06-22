window.CG.Populate = window.CG.Populate || function(MAIN, TAB, GITHUB_REPOS) {
    "use strict";

    MAIN = "#" + MAIN;

    const
        SEARCH = MAIN + ' input.prompt',
        ITEMS = MAIN + ' .item[data-repo]',
        PRODUCT_PAGE = "#product-details",
        SHOP_CONTAINER = '#shop-container',
        LOADING = MAIN + ' div.ui.search',
        TWITTER_CHANGELOG = "https://twitter.com/search?q=(%23{hashname}%20AND%20%23changelog)%20(from%3A%40cTraderGuru)&src=typed_query&f=live",
        POPULATE_STEP = 5

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

        const
            $TMP_LOADING = $("<div class='ui text container center aligned load more'><button class='ui button tiny blue'>Load More</button></div>"),
            $ACTIVE_TAB = $(SHOP_CONTAINER + ' .tab.active .description.product');

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

        // --> Item loader
        $TMP_LOADING.on('click', (evt) => {

            $ACTIVE_TAB.find('.item:hidden').slice(0, POPULATE_STEP).show(0, () => {

                if ($ACTIVE_TAB.find('.item:hidden').length == 0) $TMP_LOADING.remove();

            });

        });
        if ($ACTIVE_TAB.find('.item:hidden').length > 0) $TMP_LOADING.appendTo($ACTIVE_TAB);

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

    }, POPULATE_STEP);

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

                        // --> Try to edit description for Googlebot
                        $("meta[name='description']").attr('content', success[0].short_description);
                        $("title").html("cTrader Guru | " + success[0].name);

                        $("meta[property='og:type']").attr('content', "og:product");
                        $("meta[property='og:url']").attr('content', 'https://ctrader.guru/' + MyQueryString);
                        $("meta[property='og:title']").attr('content', "cTrader Guru | " + success[0].name);
                        $("meta[property='og:description']").attr('content', success[0].short_description);
                        $("meta[property='og:image']").attr('content', 'https://ctrader.guru' + success[0].image_box);

                        $(PRODUCT_PAGE + ' a.togithub').attr('href', "https://github.com/cTrader-Guru/" + unique);

                        $(PRODUCT_PAGE + ' .3d.box').attr("src", success[0].image_box);
                        $(PRODUCT_PAGE + ' .repo.name').text(success[0].name);
                        $(PRODUCT_PAGE + ' .short.description').html(success[0].short_description);

                        $(PRODUCT_PAGE + ' .images.list').html("");
                        success[0].screenshots.forEach((src, i) => {

                            $('<a>', {
                                href: success[0].path + src,
                                class: 'ui small image glightbox',
                                "data-gallery": "imagesandvideos"
                            }).append($('<img>', {
                                src: success[0].path + src,
                                alt: "Product description " + i
                            })).appendTo(PRODUCT_PAGE + ' .images.list');

                        });
                        success[0].youtube.forEach((video_code, i) => {

                            $('<a>', {
                                href: "https://www.youtube.com/watch?v=" + video_code,
                                class: 'ui small image glightbox',
                                "data-gallery": "imagesandvideos"
                            }).append($('<img>', {
                                src: "https://i3.ytimg.com/vi/[video_code]/maxresdefault.jpg".replace("[video_code]", video_code),
                                alt: "Product description " + i
                            })).appendTo(PRODUCT_PAGE + ' .images.list');

                        });

                        const lightbox = GLightbox();

                        $(PRODUCT_PAGE + ' .row.tags').html("");
                        success[0].tags.forEach(tag => {

                            $("<span class='ui label mini'>" + tag + "</span>").appendTo(PRODUCT_PAGE + ' .row.tags');

                        });

                        _installComments();
                        _installAdSenseRepo();
                        _installAdSenseRepo2();

                        $('#sJZ3vntth').html('');

                        if (success[0].params && success[0].params.length > 0) {

                            success[0].params.forEach(param => {

                                if (param.content.length == 0) {

                                    $("<h5 class='ui text'>" + param.title + "</h5>").appendTo('#sJZ3vntth');

                                } else {

                                    $("<div class='title'><i class='dropdown icon'></i>" + param.title + "</div>").appendTo('#sJZ3vntth');
                                    $("<div class='content'><p>" + param.content + "</p></div>").appendTo('#sJZ3vntth');

                                }

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

                    $("meta[name='description']").attr('content', 'All our cBot, indicators and tools are free and open source. We are the community where learning trading becomes easy, fun and automatic.');
                    $("title").html("cTrader Guru | cBots, indicatos and tools for cTrader");

                    $("meta[property='og:type']").attr('content', "website");
                    $("meta[property='og:url']").attr('content', 'https://ctrader.guru/');
                    $("meta[property='og:title']").attr('content', "All our cBot, indicators and tools are free and open source.");
                    $("meta[property='og:description']").attr('content', "We are the community where learning trading becomes easy, fun and automatic.");
                    $("meta[property='og:image']").attr('content', 'https://ctrader.guru/assets/images/ctrader.guru.png');

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

    function _installAdSenseRepo() {

        var $adsense_repo = $(PRODUCT_PAGE + " .ui.ad.repo");
        $adsense_repo.html('');

        $.ajax({
            url: "/assets/frames/adsense-repo",
            cache: true,
            async: true,
            dataType: 'html',
            success: (data) => {

                if (typeof(data) == 'undefined' || data.length < 1) return;

                setTimeout(() => { $adsense_repo.html(data); }, 1000);

            }
        });

    }

    function _installAdSenseRepo2() {

        var $adsense_repo = $(PRODUCT_PAGE + " .ui.ad.repo2");
        $adsense_repo.html('');

        $.ajax({
            url: "/assets/frames/adsense-repo-2",
            cache: true,
            async: true,
            dataType: 'html',
            success: (data) => {

                if (typeof(data) == 'undefined' || data.length < 1) return;

                setTimeout(() => { $adsense_repo.html(data); }, 1000);

            }
        });

    }

};