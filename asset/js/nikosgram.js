/*!
 *  License - http://nikosgram13.github.io/LICENSE
 */
$(function () {
    var _ID = ['AIzaSyD2OyY85uKKWhHQpveTUwDC8ITbMglJ4ts', 'WnuWViECtdeuK7hS4qZwbRDxBAU9Kz6pQSxRMpoD'];
    var _SCOPE = ['https://www.googleapis.com/youtube/v3/'];
    var results = $('[data-results]');
    var search = $('[data-search]');

    var canceled = false;

    function updateHashList() {
        canceled = false;
        results.empty();

        if (exsHash('search')) {
            var a = getHash('search');

            results.html(
                '<div class="col-md-12 channel-item" data-loading>' +
                '<div class="panel panel-default channel-item">' +
                '<div class="panel-body">' +
                '<div class="loading-cube-grid step">' +
                '<div class="loading-cube loading-cube1"></div>' +
                '<div class="loading-cube loading-cube2"></div>' +
                '<div class="loading-cube loading-cube3"></div>' +
                '<div class="loading-cube loading-cube4"></div>' +
                '<div class="loading-cube loading-cube5"></div>' +
                '<div class="loading-cube loading-cube6"></div>' +
                '<div class="loading-cube loading-cube7"></div>' +
                '<div class="loading-cube loading-cube8"></div>' +
                '<div class="loading-cube loading-cube9"></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>'
            );

            $.getJSON(_SCOPE[0] + 'search?maxResults=10&part=snippet&type=channel&q=' + a + '&key=' + _ID[0], function (returned) {
                if (canceled) {
                    return;
                }

                if (returned.items.length) {
                    var items = [];

                    returned['items'].forEach(function (item) {
                        var snippet = item['snippet'];

                        items.push({
                            id: item['id']['channelId'],
                            title: snippet['title'],
                            desc: snippet['description'],
                            logo: snippet['thumbnails']['default']['url']
                        });
                        $('[data-loading]').parent().empty();
                    });

                    items.forEach(function (channel) {
                        results.append(
                            '<div class="col-md-12 channel-item" data-channel="' + channel.id + '">' +
                            '<div class="panel panel-default channel-item">' +
                            '<div class="panel-body">' +
                            '<div class="media">' +
                            '<div class="media-left">' +
                            '<img class="media-object" src="' + channel.logo + '" alt="' + channel.title + '">' +
                            '</div>' +
                            '<div class="media-body">' +
                            '<h4 class="media-heading">' + channel.title + '</h4>' +
                            channel.desc +
                            '</div>' +
                            '</div>' +
                            '</div>' +
                            '</div>' +
                            '</div>'
                        );

                        $.getJSON(_SCOPE[0] + 'channels?part=brandingSettings&id=' + channel.id + '&key=' + _ID[0], function (branding) {
                            if (canceled) {
                                return;
                            }

                            var back = -1;

                            var brand = branding['items'][0]['brandingSettings'];

                            var background = '';
                            if (brand['image']['bannerMobileImageUrl']) {
                                back = 0;
                                background = 'background-image: url(\'' + brand['image']['bannerMobileImageUrl'] + '\')';
                            }

                            if (back != -1) {
                                if (channel.desc.trim().length) {
                                    back = 0;
                                } else {
                                    back = 1;
                                }
                            }

                            var chan = $('[data-channel="' + channel.id + '"]');

                            chan.find('.channel-item').attr('style', background);

                            if (back == 0) {
                                chan.find('.media-body').addClass('texted');
                            } else {
                                chan.find('.media-heading').addClass('texted');
                            }
                        });
                    });
                    results.fadeIn('slow');
                }
            });
            search.val(a);
        }
    }

    $(document).on('click', '[data-channel]', function () {
        var element = $(this);
        var channel = element.attr('data-channel');

        $('body').fadeOut('slow', function () {
            window.location.href = 'channel/#youtube=' + channel;
        });
    });

    results.bind("DOMSubtreeModified", function () {
        if ($.trim($(this).html()).length) {
            if (search.hasClass('search-vec')) {
                search.removeClass('search-vec');
            }
        } else {
            if (!search.hasClass('search-vec')) {
                search.addClass('search-vec');
            }
        }
    });

    search.on('input', function () {
        var element = this;
        var value = this.value;
        setTimeout(function () {
            if (element.value == value) {
                if (!value.trim()) {
                    remHash('search');
                } else {
                    addHash('search', value.trim().replace(/ /g, '+'));
                }
            }
        }, 350);
    });

    $(window).on('hashchange', function () {
        updateHashList();
    });

    updateHashList();
});
