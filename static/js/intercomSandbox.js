/*
 * code for intercom chat window for https://docs.sensu.io/sensu-go/x.x/learn/learn-sensu-sandbox/
 */

var APP_ID = "abr73apk";

window.intercomSettings = {
    app_id: "abr73apk"
  };
(function () {
    var w = window;
    var ic = w.Intercom;
    if (typeof ic === "function") {
        ic("reattach_activator");
        ic("update", w.intercomSettings);
    } else {
        var d = document;
        var i = function () {
            i.c(arguments);
        };
        i.q = [];
        i.c = function (args) {
            i.q.push(args);
        };
        w.Intercom = i;
        var l = function () {
            var s = d.createElement("script");
            s.type = "text/javascript";
            s.async = true;
            s.src = "https://widget.intercom.io/widget/abr73apk";
            var x = d.getElementsByTagName("script")[0];
            x.parentNode.insertBefore(s, x);
        };
        if (w.attachEvent) {
            w.attachEvent("onload", l);
        } else {
            w.addEventListener("load", l, false);
        }
    }
})();

