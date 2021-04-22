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
    
    /*
     * sends clicks on buttons with .copy class as a Google Analytics event
     */

    $(".copy").on("click", function() {
        const pageURL = document.location.pathname + document.location.search;

        if (typeof ga === "function") {
          ga('send','event','Clipboard','Code copied',pageURL);
        }
    });
})(document, Clipboard);
