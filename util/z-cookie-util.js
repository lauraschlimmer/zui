zCookieUtil = this.zCookieUtil || {};

zCookieUtil.setCookie = function(cookie) {
  var cookie_str = cookie.name + "=" + cookie.value;

  if (cookie.max_age && cookie.max_age > 0) {
    var d = new Date();
    d.setTime(d.getTime() + cookie.max_age * 1000);
    cookie_str += "; expires=" + d.toUTCString();
  }

  if (cookie.path) {
    cookie_str += "; path=" + cookie.path;
  }

  if (cookie.domain) {
    cookie_str += "; domain=" + cookie.domain;
  }

  document.cookie = cookie_str;
}

