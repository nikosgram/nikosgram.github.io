$(function() {
  var _ID = ['AIzaSyD2OyY85uKKWhHQpveTUwDC8ITbMglJ4ts'];
  var _SCOPE = ['https://www.googleapis.com/youtube/v3/', 'https://api.twitch.tv/kraken/'];
  var _USERNAME = ['nikosgram13', 'nikosgram13'];
  var _PAGE = null;
  var _HASH = [];
  var _UPLOAD = [];

  updateHashList();

  function updateHashList() {
    if (window.location.hash != null) {
      var hashs = window.location.hash.replace(/#/g, '').split('&');
      $.each(hashs, function() {
        var splited = this.split('=');
        if (splited.length >= 2) {
          _HASH[splited[0].toLowerCase()] = splited[1];
          switch (splited[0].toLowerCase()) {
            case 'youtube':
              _USERNAME[0] = splited[1];
              break;
            case 'twitch':
              _USERNAME[1] = splited[1];
              break;
            case 'page':
              _PAGE = splited[1];
          }
        }
      });
    }
  }

  function updateVideoList(updatePlayer) {
    if (_UPLOAD.length <= 0) return;
    var lvpi = $('[data-lvpi]');

    lvpi.fadeOut('slow', function() {
      lvpi.html('');

      var page = _PAGE != null ? '&pageToken=' + _PAGE : '';

      $.getJSON(_SCOPE[0] + 'playlistItems?part=snippet&maxResults=3&playlistId=' + _UPLOAD[0] + '&key=' + _ID[0] + page, function(object) {
        var lvpc = $('[data-lvpc]');
        var player = $('[data-player]');
        var prototype = $('[data-lvpo]');


        if (object.prevPageToken != undefined) {
          lvpi.append('<div class="col-md-12 up-arr"><i class="fa fa-chevron-up" style="display: none;" data-page="' + object.prevPageToken + '"></i></div>');
        }

        var videos = object.items;
        $.each(videos, function() {
          var video = this;
          var lvpo = prototype.clone();
          lvpo.removeAttr('data-lvpo');
          var img = lvpo.find('img');
          img.addClass('b-lazy');
          img.attr('data-video', ' ');
          img.attr('id', video.snippet.resourceId.videoId);
          img.attr('src', video.snippet.thumbnails.medium.url);
          img.attr('alt', video.snippet.title);

          lvpi.append(lvpo);

          lvpo.removeClass('sr-only');
        });

        if (object.nextPageToken != undefined) {
          lvpi.append('<div class="col-md-12 down-arr"><i class="fa fa-chevron-down" style="display: none;" data-page="' + object.nextPageToken + '"></i></div>');
        }

        if (updatePlayer) {
          var latest_video = videos[0].snippet.resourceId.videoId;

          player.append('<iframe class="embed-responsive-item" src="https://www.youtube.com/embed/' + latest_video + '?rel=0&controls=0" frameborder="0" allowfullscreen>');
          $('#latest_video').focus();
          lvpc.hide();
          lvpc.removeClass('sr-only');
          $('[data-loading]').fadeOut('slow', function() {
            lvpc.fadeIn('slow');
          });
        }

        lvpi.fadeIn('slow');
      });
    });
  }

  $(window).on('hashchange', function() {
    var oldYoutube = _USERNAME[0];
    var oldTwitch = _USERNAME[1];
    updateHashList();

    if (_USERNAME[0] != oldYoutube || _USERNAME[1] != oldTwitch) {
      location.reload();
    }
  });

  $.getJSON(_SCOPE[1] + 'streams/' + _USERNAME[1], function(live) {
    if (live.error != undefined) {
      alert('I can\'t find this channel in twitch.tv.');
      return;
    }

    if (live.stream != null) {
      var stream = live.stream;
      $('body').css('background-image', 'url("' + stream.preview.template.replace('{width}x{height}', '1920x1080') + '")');

      var lvpi = $('[data-lvpi]');
      var lvpc = $('[data-lvpc]');
      var player = $('[data-player]');
      var prototype = $('[data-lvpo]');

      lvpi.addClass('twitch-header');
      lvpi.append('<iframe class="embed-responsive-item" src="' + stream.channel.url + '/chat?popout=" frameborder="0" scrolling="no" height="476" width="290"></iframe>');

      player.append('<iframe class="embed-responsive-item" src="' + stream.channel.url + '/embed" frameborder="0" scrolling="no" height="378" width="620"></iframe>');

      $('#latest_video').focus();
      lvpc.hide();
      lvpc.removeClass('sr-only');
      $('[data-loading]').fadeOut('slow', function() {
        lvpc.fadeIn('slow');
        $('title').html(stream.channel.status);

        $('[data-icon]').attr('href', stream.channel.logo);
      });
    } else {
      $.getJSON(_SCOPE[0] + 'channels?part=contentDetails&forUsername=' + _USERNAME[0] + '&key=' + _ID[0], function(object) {
        if (object.items.length <= 0) {
          $.getJSON(_SCOPE[0] + 'channels?part=contentDetails&id=' + _USERNAME[0] + '&key=' + _ID[0], function(new) {
            if (new.items.length <= 0) {
              alert('I can\'t find this channel in youtube.com.');
              return;
            }

            _UPLOAD[0] = new.items[0].contentDetails.relatedPlaylists.uploads;
            var channelID = new.items[0].id;

            $.getJSON(_SCOPE[0] + 'channels?part=brandingSettings&id=' + channelID + '&key=' + _ID[0], function(brandingSettings) {
              var brandingSettings = brandingSettings.items[0].brandingSettings;
              $('body').css('background-image', 'url("' + brandingSettings.image.bannerTvHighImageUrl + '")');
            });
            $.getJSON(_SCOPE[0] + 'channels?part=snippet&forUsername=' + _USERNAME[0] + '&key=' + _ID[0], function(channel) {
              var snippet = channel.items[0].snippet;

              $('title').html(snippet.title);
              $('[data-icon]').attr('href', snippet.thumbnails.default.url);
            });

            updateVideoList(true);
          });
          return;
        }

        _UPLOAD[0] = object.items[0].contentDetails.relatedPlaylists.uploads;
        var channelID = object.items[0].id;

        $.getJSON(_SCOPE[0] + 'channels?part=brandingSettings&id=' + channelID + '&key=' + _ID[0], function(brandingSettings) {
          var brandingSettings = brandingSettings.items[0].brandingSettings;
          $('body').css('background-image', 'url("' + brandingSettings.image.bannerTvHighImageUrl + '")');
        });
        $.getJSON(_SCOPE[0] + 'channels?part=snippet&forUsername=' + _USERNAME[0] + '&key=' + _ID[0], function(channel) {
          var snippet = channel.items[0].snippet;

          $('title').html(snippet.title);
          $('[data-icon]').attr('href', snippet.thumbnails.default.url);
        });

        updateVideoList(true);
      });
    }
  });

  $(document).on('click', '[data-video]', function() {
    var element = $(this);
    var video = element.attr('id');
    var player = $('[data-player]');

    element.focus();

    player.find('iframe').fadeOut('slow', function() {
      player.empty();
      player.append('<iframe class="embed-responsive-item" src="https://www.youtube.com/embed/' + video + '?rel=0&controls=0&autoplay=1" frameborder="0" allowfullscreen>');
    });
  });

  $(document).on("mouseenter", '[data-lvpi]', function() {
    $.each($('[data-page]'), function() {
      $(this).fadeIn('fast');
    });
  });

  $(document).on("mouseleave", '[data-lvpi]', function() {
    $.each($('[data-page]'), function() {
      $(this).fadeOut('fast');
    });
  });

  $(document).on('click', '[data-page]', function() {
    var element = $(this);

    _HASH['page'] = element.attr('data-page');

    var hash = '#';

    for (variable in _HASH) {
      hash = hash + variable + '=' + _HASH[variable] + '&';
    }

    window.location.hash = hash.replace(/&$/, '');

    updateVideoList(false);
  });
});
