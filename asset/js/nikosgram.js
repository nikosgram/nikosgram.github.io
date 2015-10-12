$(function() {
  var _ID = ['AIzaSyD2OyY85uKKWhHQpveTUwDC8ITbMglJ4ts'];
  var _SCOPE = ['https://www.googleapis.com/youtube/v3/', 'https://api.twitch.tv/kraken/'];
  var _USERNAME = ['nikosgram13', 'nikosgram13'];

  if (window.location.hash != null) {
    var hashs = window.location.hash.replace(/#/g, '').split('&');
    $.each(hashs, function() {
      var splited = this.split('=');
      if (splited.length >= 2) {
        switch (splited[0].toLowerCase()) {
          case 'youtube':
            _USERNAME[0] = splited[1];
            break;
          case 'twitch':
            _USERNAME[1] = splited[1];
            break;
        }
      }
    });
  }

  $(window).on('hashchange', function() {
    location.reload();
  });

  $.getJSON(_SCOPE[1] + 'streams/' + _USERNAME[1], function(live) {
    if (live.error != undefined) {
      alert('I can\'t find this channel in twitch.tv.');
      return;
    }

    if (live.stream != null) {
      var stream = live.stream;
      $('html').css('background-image', 'url("' + stream.preview.template.replace('{width}x{height}', '1920x1080') + '")');

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
          alert('I can\'t find this channel in twitch.tv.');
          return;
        }

        var upload = object.items[0].contentDetails.relatedPlaylists.uploads;
        var channelID = object.items[0].id;

        $.getJSON(_SCOPE[0] + 'channels?part=brandingSettings&id=' + channelID + '&key=' + _ID[0], function(brandingSettings) {
          var brandingSettings = brandingSettings.items[0].brandingSettings;
          $('html').css('background-image', 'url("' + brandingSettings.image.bannerTvHighImageUrl + '")');
        });
        $.getJSON(_SCOPE[0] + 'channels?part=snippet&forUsername=' + _USERNAME[0] + '&key=' + _ID[0], function(channel) {
          var snippet = channel.items[0].snippet;

          $('title').html(snippet.title);
          $('[data-icon]').attr('href', snippet.thumbnails.default.url);
        });

        $.getJSON(_SCOPE[0] + 'playlistItems?part=snippet&maxResults=3&playlistId=' + upload + '&key=' + _ID[0], function(object) {
          var lvpi = $('[data-lvpi]');
          var lvpc = $('[data-lvpc]');
          var player = $('[data-player]');
          var prototype = $('[data-lvpo]');

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

          var latest_video = videos[0].snippet.resourceId.videoId;

          player.append('<iframe class="embed-responsive-item" src="https://www.youtube.com/embed/' + latest_video + '?rel=0&controls=0" frameborder="0" allowfullscreen>');
          $('#latest_video').focus();
          lvpc.hide();
          lvpc.removeClass('sr-only');
          $('[data-loading]').fadeOut('slow', function() {
            lvpc.fadeIn('slow');
          });
        });
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
});
