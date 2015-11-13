$(function() {
  var _ID = ['AIzaSyD2OyY85uKKWhHQpveTUwDC8ITbMglJ4ts'];
  var _SCOPE = ['https://www.googleapis.com/youtube/v3/'];
  var results = $('[data-results]');
  var search = $('[data-search]');

  var canceled = false;

  function updateHashList() {
    canceled = false;
    results.empty();

    if ($.exsHash('search')) {

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

      $.getJSON(_SCOPE[0] + 'search?maxResults=10&part=snippet&type=channel&q=' + $.getHash('search') + '&key=' + _ID[0], function(returned) {
        if (canceled) {
          return;
        }

        if (returned.items.length) {
          $.each(returned.items, function() {
            var item = this;
            $.getJSON(_SCOPE[0] + 'channels?part=brandingSettings&id=' + this.id.channelId + '&key=' + _ID[0], function(branding) {
              if (canceled) {
                return;
              }

              var channel = item.id.channelId;

              if (item.snippet.channelTitle.trim().length) {
                channel = item.snippet.channelTitle;
              }

              var back = -1;

              var background = '';
              if (branding.items[0].brandingSettings.image.bannerMobileImageUrl) {
                back = 0;
                background = 'style="background-image: url(\'' + branding.items[0].brandingSettings.image.bannerMobileImageUrl + '\')"';
              }

              if (back != -1) {
                if (item.snippet.description.trim().length) {
                  back = 0;
                } else {
                  back = 1;
                }
              }

              $('[data-loading]').parent().empty();

              results.append(
                '<div class="col-md-12 channel-item" data-channel="' + channel + '">' +
                '<div class="panel panel-default channel-item" ' + background + '>' +
                '<div class="panel-body">' +
                '<div class="media">' +
                '<div class="media-left">' +
                '<img class="media-object" src="' + item.snippet.thumbnails.default.url + '" alt="' + item.snippet.title + '">' +
                '</div>' +
                '<div class="media-body ' + (back == 0 ? 'texted' : '') + '">' +
                '<h4 class="media-heading ' + (back == 1 ? 'texted' : '') + '">' + item.snippet.title + '</h4>' +
                item.snippet.description +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>'
              );
            });
          });
          results.fadeIn('slow');
        }
      });
    }
  }

  $(document).on('click', '[data-channel]', function() {
    var element = $(this);
    var channel = element.attr('data-channel');

    $('body').fadeOut('slow', function() {
      window.location.href = '/channel/#youtube=' + channel;
    });
  });

  results.bind("DOMSubtreeModified", function() {
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

  search.on('input', function() {
    var element = this;
    var value = this.value;
    setTimeout(function() {
      if (element.value == value) {
        if (!value.trim()) {
          $.remHash('search');
        } else {
          $.addHash('search', value.trim().replace(/ /g, '+'));
        }
      }
    }, 350);
  });

  $(window).on('hashchange', function() {
    updateHashList();
  });

  updateHashList();
});
