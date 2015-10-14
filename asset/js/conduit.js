/*!
 * Conduit v1.0.1
 * Copyright 2015 Nikos Grammatikos. https://goo.gl/GhQOPn
 * Licensed under the MIT license
 */
$.addHash = function(key, value) {
  var hashs = $.allHash();

  hashs[key] = value;

  $.setHash(hashs);
}

$.remHash = function(key) {
  if ($.exsHash(key)) {
    var hashs = $.allHash();

    delete hashs[key];

    $.setHash(hashs);
  }
}

$.clrHash = function() {
  window.location.hash = '#';
}

$.exsHash = function(key) {
  var hashs = $.allHash();

  return hashs[key] != undefined;
}

$.getHash = function(key) {
  if ($.exsHash(key)) {
    var hashs = $.allHash();

    return hashs[key];
  }
}

$.setHash = function(hashs) {
  var hash = '#';

  for (variable in hashs) {
    hash = hash + variable + '=' + hashs[variable] + '&';
  }

  window.location.hash = hash.replace(/&$/, '');
}

$.allHash = function() {
  var hashs = [];

  if (window.location.hash != null) {
    var hash = window.location.hash.replace(/#/g, '').split('&');
    $.each(hash, function() {
      var splited = this.split('=');
      if (splited.length >= 2) {
        hashs[splited[0].toLowerCase()] = splited[1];
      }
    });
  }
  return hashs;
}

$(function() {
  $(document).on('ready', function() {
    window.location.hash = window.location.hash;
    window.onhashchange(true);
  });

  $(document).on('input', 'input[type=search]', function() {
    var element = this;
    var value = this.value;
    if (!element.value.trim()) {
      if (!$('.search').hasClass('vertical-center')) {
        $('.search').addClass('vertical-center');
      }
    } else {
      if ($('.search').hasClass('vertical-center')) {
        $('.search').removeClass('vertical-center');
      }
    }
    setTimeout(function() {
      if (element.value == value) {
        if (!value.trim()) {
          $.remHash('search');
        } else {
          $.addHash('search', value.trim().replace(/ /g, '+'));
        }
      }
    }, 500);
  });

  window.onhashchange = function(startup) {
    if ($.exsHash('search')) {
      if (startup) {
        $('input[type=search]').val($.getHash('search').replace(/\+/g, ' '));
        if ($('.search').hasClass('vertical-center')) {
          $('.search').removeClass('vertical-center');
        }
      }


    }
  }
});
