
/*
 * clipboard for hugo
 */

(function(document, Clipboard) {

    var $codes = document.querySelectorAll('pre');
    function addCopy(element) {
      const codelangtext = element.querySelectorAll('.language-text');
      if (codelangtext.length > 0) {
        return;
      }
        var copy = document.createElement("button");
        copy.className = "copy";
        copy.innerText = "Copy";
        element.append(copy);
        if (codelangtext = true) {
            button.style.visibility="hidden";
        }
    }

    for (var i = 0, len = $codes.length; i < len; i++) {
        addCopy($codes[i]);
    }

    var clipboard = new ClipboardJS('.copy', {
        target: function(trigger) {
            return trigger.previousElementSibling;
        }
    });

    clipboard.on('success', function(e) {
        e.trigger.textContent = 'Copied!';
        setTimeout(function () {
            e.trigger.textContent = "Copy";
            }, 2000);
    });

})(document, Clipboard);


/*
* sends clicks anywhere in code examples (identified by <pre> tags) as Google Analytics events
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
        ga('send','event','Code examples','Clicks in code examples',pageURL);
       });
     });
})();