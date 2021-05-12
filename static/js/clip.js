
/*
 * clipboard for hugo
 */

(function(document, Clipboard) {

    var $codes = document.querySelectorAll('pre');

    function addCopy(element) {
        var copy = document.createElement("button");
        copy.className = "copy";
        element.append(copy);
    }

    for (var i = 0, len = $codes.length; i < len; i++) {
        addCopy($codes[i]);
    }


    var clipboard = new ClipboardJS('.copy', {
        target: function(trigger) {
            return trigger.previousElementSibling;
        }
    });
})(document, Clipboard);


/*
* sends clicks on clipboard buttons with .copy class as Google Analytics events
*/

(function() {
    var pageURL = document.location.pathname + document.location.search;

    var buttonSet = document.querySelectorAll("pre");
    buttonSet.forEach(function (btn) {
      btn.addEventListener("click", function() {
        // noop if google analytics isn't initialized
        if (typeof ga !== "function") {
          return;
        }
        ga('send','event','Pre test','Testing pre query selector',pageURL);
       });
     });
})();
