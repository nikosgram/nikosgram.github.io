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
