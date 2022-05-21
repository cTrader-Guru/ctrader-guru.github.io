window.CG.Populate = window.CG.Populate || function(MAIN, TAB, GITHUB_REPOS) {
    "use strict";

    MAIN = "#" + MAIN;

    const
        SEARCH = MAIN + ' input.prompt',
        ITEMS = MAIN + ' .item[data-repo]',
        LOADING = MAIN + ' div.ui.search'

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

        $('#product-details .container.content').hide();
        $('#product-details .main.loader.active').show();

        $('#product-details')
            .modal({

                closeIcon: true,
                onVisible: () => {

                    window.history.pushState({}, "", "?repository=" + unique + "&category=" + tabname);

                    // --> LoadConfig data
                    CG.LoadRepos([unique], tabname, (success) => {

                        if (!success || success.length < 1)
                            return;

                        $('#product-details .3d.box').attr("src", success[0].image_box);
                        $('#product-details .repo.name').text(success[0].name);
                        $('#product-details .short.description').html(success[0].short_description);
                        $('#product-details .images.list').html("");
                        success[0].screenshots.forEach(src => {

                            $('<a>', {
                                href: success[0].path + src,
                                target: '_blank',
                                class: 'ui small image',
                                "data-lightbox": "light"
                            }).append($('<img>', {
                                src: success[0].path + src
                            })).appendTo('#product-details .images.list');

                        });

                        $('#sJZ3vntth')
                            .accordion({
                                selector: {
                                    trigger: '.title'
                                }
                            });

                        setTimeout(() => {
                            $('#product-details .container.content').show();
                            $('#product-details .main.loader.active').hide();
                        }, 100);

                    });

                },
                onHidden: () => {

                    window.history.pushState({}, "", "/");

                }

            })
            .modal('show');

    }

};