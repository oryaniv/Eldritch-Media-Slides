!function (n) { n.fn.flowtype = function (i) { var m = n.extend({ maximum: 9999, minimum: 1, maxFont: 9999, minFont: 1, fontRatio: 35 }, i), t = function (i) { var t = n(i), o = t.width(), u = o > m.maximum ? m.maximum : o < m.minimum ? m.minimum : o, a = u / m.fontRatio, f = a > m.maxFont ? m.maxFont : a < m.minFont ? m.minFont : a; t.css("font-size", f + "px") }; return this.each(function () { var i = this; n(window).resize(function () { t(i) }), t(this) }) } }(jQuery);
