// https://www.creare.co.uk/blog/js/js-eu-cookie-law-banner
// Creare's 'Implied Consent' EU Cookie Law Banner v:2.4
// Conceived by Robert Kent, James Bavington & Tom Foyster

var cookieDuration = 365;                   // Number of days before the cookie expires, and the banner reappears
var cookieName = 'EuCookieLawCompliance';   // Name of our cookie
var cookieValue = 'on';                     // Value of cookie

function createBanner() {
    var bodytag = document.getElementsByTagName('body')[0];
    var div = document.createElement('div');
    div.setAttribute('id', 'cookie-law-banner');
    div.innerHTML = '<i class="icon-info-circle distanced"></i>This website uses cookies. We do not use cookies for evil. By continuing we assume your permission to deploy cookies. <button type="button" onclick="createCookie();">Alright</button>';

    bodytag.appendChild(div); // Adds the Cookie Law Banner just before the closing </body> tag
    // or
    // bodytag.insertBefore(div, bodytag.firstChild); // Adds the Cookie Law Banner just after the opening <body> tag

    // document.getElementsByTagName('body')[0].className += ' cookiebanner'; //Adds a class tothe <body> tag when the banner is visible
}

function createCookie() {
    var expires;
    if (window.cookieDuration) {
        var date = new Date();
        date.setTime(date.getTime() + (window.cookieDuration * 24 * 60 * 60 * 1000));
        expires = '; expires=' + date.toGMTString();
    }
    else {
        expires = '';
    }
    
    document.cookie = window.cookieName + '=' + window.cookieValue + expires + '; path=/';
    
    var element = document.getElementById('cookie-law-banner');
    element.parentNode.removeChild(element);
    
}

function checkCookie(name) {
    var nameEQ = name + '=';
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name, '', -1);
}

window.onload = function () {
    if (checkCookie(window.cookieName) != window.cookieValue) {
        createBanner();
    }
};