/*!
 *  License - http://nikosgram13.github.io/LICENSE
 */
$(function () {
    var _ID = ['AIzaSyD2OyY85uKKWhHQpveTUwDC8ITbMglJ4ts'];
    var _SCOPE = ['https://www.googleapis.com/youtube/v3/'];
    var _USERNAME = ['nikosgram13', 'nikosgram13'];
    var _PAGE;
    //var _HASH = [];
    var _UPLOAD = [];

    updateHashList();

    function updateHashList() {
        if (exsHash('youtube')) {
            _USERNAME[0] = getHash('youtube');
        }
        if (exsHash('twitch')) {
            _USERNAME[1] = getHash('twitch');
        }
        if (exsHash('page')) {
            _PAGE = getHash('page');
        }
    }

    function updateVideoList(updatePlayer) {
        if (_UPLOAD.length <= 0) return;
        var lvpi = $('[data-lvpi]');

        lvpi.fadeOut('slow', function () {
            lvpi.html('');

            var page = _PAGE ? '&pageToken=' + _PAGE : '';

            $.getJSON(_SCOPE[0] + 'playlistItems?part=snippet&maxResults=3&playlistId=' + _UPLOAD[0] + '&key=' + _ID[0] + page, function (object) {
                var lvpc = $('[data-lvpc]');
                var player = $('[data-player]');
                //var prototype = $('[data-lvpo]');

                if (object['prevPageToken']) {
                    lvpi.append('<div class="col-md-12 up-arr"><i class="arr fa fa-chevron-up" data-page="' + object['prevPageToken'] + '"></i></div>');
                } else {
                    lvpi.append('<div class="col-md-12 up-arr"><i class="arr fa fa-chevron-up" style="color:firebrick;"></i></div>');
                }

                var videos = object['items'];
                videos.forEach(function (video) {
                    var snippet = video['snippet'];

                    lvpi.append(
                        '<div class="col-md-12 video-item" data-video="' + snippet['resourceId']['videoId'] + '">' +
                        '<img class="img-responsive b-lazy" src="' + snippet['thumbnails']['medium']['url'] + '" alt="' + snippet['title'] + '">' +
                        '</div>'
                    );
                });

                if (object["nextPageToken"]) {
                    lvpi.append('<div class="col-md-12 down-arr"><i class="arr fa fa-chevron-down" data-page="' + object['nextPageToken'] + '"></i></div>');
                }

                if (updatePlayer) {
                    var latest_video = videos[0]['snippet']['resourceId']['videoId'];

                    player.append('<iframe class="embed-responsive-item" src="https://www.youtube.com/embed/' + latest_video + '?rel=0&controls=0" frameborder="0" allowfullscreen>');
                    $('#latest_video').focus();
                    lvpc.hide();
                    lvpc.removeClass('sr-only');
                    $('[data-loading]').fadeOut('slow', function () {
                        lvpc.fadeIn('slow');
                    });
                }

                lvpi.fadeIn('slow');
            });
        });
    }

    $(window).on('hashchange', function () {
        var oldYoutube = _USERNAME[0];
        var oldTwitch = _USERNAME[1];
        updateHashList();

        if (_USERNAME[0] != oldYoutube || _USERNAME[1] != oldTwitch) {
            location.reload();
        }
    });

    $.getJSON(_SCOPE[0] + 'channels?part=contentDetails&forUsername=' + _USERNAME[0] + '&key=' + _ID[0], function (object) {
        if (object['items'].length <= 0) {
            $.getJSON(_SCOPE[0] + 'channels?part=contentDetails&id=' + _USERNAME[0] + '&key=' + _ID[0], function (newObject) {
                if (newObject['items'].length <= 0) {
                    alert('I can\'t find this channel in youtube.com.');
                    return;
                }

                var item = newObject['items'][0];

                _UPLOAD[0] = item['contentDetails']['relatedPlaylists']['uploads'];
                var channelID = item['id'];

                $.getJSON(_SCOPE[0] + 'channels?part=brandingSettings&id=' + channelID + '&key=' + _ID[0], function (brandingSettings) {
                    $('body').css('background-image', 'url("' + brandingSettings['items'][0]['brandingSettings']['image']['bannerTvHighImageUrl'] + '")');
                });
                $.getJSON(_SCOPE[0] + 'channels?part=snippet&id=' + channelID + '&key=' + _ID[0], function (channel) {
                    $('title').html(channel['items'][0]['snippet']['title']);
                });

                updateVideoList(true);
            });
            return;
        }

        var item = object['items'][0];

        _UPLOAD[0] = item['contentDetails']['relatedPlaylists']['uploads'];
        var channelID = item['id'];

        $.getJSON(_SCOPE[0] + 'channels?part=brandingSettings&id=' + channelID + '&key=' + _ID[0], function (brandingSettings) {
            $('body').css('background-image', 'url("' + brandingSettings['items'][0]['brandingSettings']['image']['bannerTvHighImageUrl'] + '")');
        });
        $.getJSON(_SCOPE[0] + 'channels?part=snippet&id=' + channelID + '&key=' + _ID[0], function (channel) {
            $('title').html(channel['items'][0]['snippet']['title']);
        });

        updateVideoList(true);
    });

    $(document).on('click', '[data-video]', function () {
        var element = $(this);
        var video = element.attr('data-video');
        var player = $('[data-player]');

        element.focus();

        player.find('iframe').fadeOut('slow', function () {
            player.empty();
            player.append('<iframe class="embed-responsive-item" src="https://www.youtube.com/embed/' + video + '?rel=0&controls=0&autoplay=1" frameborder="0" allowfullscreen>');
        });
    });

    $(document).on('click', '[data-page]', function () {
        addHash('page', $(this).attr('data-page'));

        updateVideoList(false);
    });
});
