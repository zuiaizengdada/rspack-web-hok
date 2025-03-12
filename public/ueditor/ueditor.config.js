!function () {
    var e = window.UEDITOR_HOME_URL || a();
    console.log("window.UEDITOR_HOME_URL", window.UEDITOR_HOME_URL),
        window.UEDITOR_CONFIG = {
            UEDITOR_HOME_URL: e,
            // serverUrl: e + "php/controller.php",
            toolbars: [["undo", "redo", "|", "paragraph", "|", "fontsize", "|", "blockquote", "horizontal", "|", "removeformat", "formatmatch", "|", "directionalityltr", "directionalityrtl", "|", "addimgv2", "addvideov2", "link", "emotion", "spechars", "||", "bold", "italic", "underline", "strikethrough", "forecolor", "backcolor", "|", "indent", "|", "justifyleft", "justifycenter", "justifyright", "justifyjustify", "lineheight", "|", "rowspacingtop", "rowspacingbottom", "|", "insertorderedlist", "insertunorderedlist", "|", "source", "searchreplace", "fullscreen"]],
            labelMap: {
                music: "添加音频",
                insertvideo: "添加视频链接",
                addimgv2: "添加图片",
                addaudiov2: "添加音频",
                addvideov2: "添加视频"
            },
            zIndex: 999,
            initialContent: "",
            autoClearinitialContent: !0,
            initialStyle: "",
            initialFrameWidth: 700,
            initialFrameHeight: 415,
            enableAutoSave: false,
            saveInterval: false,
            imagePopup: !1,
            insertorderedlist: {
                decimal: "",
                "lower-alpha": "",
                "lower-roman": "",
                "upper-alpha": "",
                "upper-roman": "",
                "cjk-ideographic": "一,二,三...",
                "lower-greek": "α,β,γ,δ..."
            },
            insertunorderedlist: {
                circle: "",
                disc: "",
                square: ""
            },
            fontsize: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 24, 36],
            rowspacingtop: ["0", "5", "10", "15", "20", "25"],
            rowspacingbottom: ["0", "5", "10", "15", "20", "25"],
            lineheight: ["0", "1", "1.5", "1.75", "2", "3", "4", "5"],
            enableContextMenu: !0,
            elementPathEnabled: !1,
            wordCount: !1,
            maximumWords: 1e5,
            autoHeightEnabled: !1,
            autoHeightLimit: 500,
            autoFloatEnabled: !1,
            xssFilterRules: !0,
            inputXssFilter: !0,
            outputXssFilter: !0,
            whitList: {
                a: ["target", "href", "title", "class", "style"],
                abbr: ["title", "class", "style"],
                address: ["class", "style"],
                area: ["shape", "coords", "href", "alt"],
                article: ["style"],
                aside: [],
                audio: ["autoplay", "controls", "loop", "preload", "src", "class", "style"],
                b: ["class", "style"],
                bdi: ["dir"],
                bdo: ["dir"],
                big: [],
                blockquote: ["cite", "class", "style"],
                br: [],
                caption: ["class", "style"],
                center: [],
                cite: [],
                code: ["class", "style"],
                col: ["align", "valign", "span", "width", "class", "style"],
                colgroup: ["align", "valign", "span", "width", "class", "style"],
                dd: ["class", "style"],
                del: ["datetime"],
                details: ["open"],
                div: ["class", "style"],
                dl: ["class", "style"],
                dt: ["class", "style"],
                em: ["class", "style"],
                font: ["color", "size", "face"],
                footer: [],
                h1: ["class", "style"],
                h2: ["class", "style"],
                h3: ["class", "style"],
                h4: ["class", "style"],
                h5: ["class", "style"],
                h6: ["class", "style"],
                header: [],
                hr: [],
                i: ["class", "style"],
                img: ["src", "alt", "title", "width", "height", "id", "_src", "_url", "loadingclass", "class", "data-latex", "style", "word_img"],
                ins: ["datetime"],
                li: ["class", "style"],
                mark: [],
                nav: [],
                ol: ["class", "style"],
                p: ["class", "style", "dir"],
                pre: ["class", "style"],
                s: [],
                section: ["style"],
                small: [],
                span: ["class", "style"],
                sub: ["class", "style"],
                sup: ["class", "style"],
                strong: ["class", "style"],
                style: [],
                table: ["width", "border", "align", "valign", "class", "style"],
                tbody: ["align", "valign", "class", "style"],
                td: ["width", "rowspan", "colspan", "align", "valign", "class", "style"],
                tfoot: ["align", "valign", "class", "style"],
                th: ["width", "rowspan", "colspan", "align", "valign", "class", "style"],
                thead: ["align", "valign", "class", "style"],
                tr: ["rowspan", "align", "valign", "class", "style"],
                tt: [],
                u: [],
                ul: ["class", "style"],
                video: ["autoplay", "controls", "loop", "preload", "src", "height", "width", "class", "style"],
                source: ["src", "type"],
                embed: ["type", "class", "pluginspage", "src", "width", "height", "align", "style", "wmode", "play", NaN, "loop", "menu", "allowscriptaccess", "allowfullscreen", "controls", "preload"],
                iframe: ["src", "class", "height", "width", "max-width", "max-height", "align", "frameborder", "allowfullscreen"]
            }
        };
    var t = ["accent-height", "accumulate", "additive", "alignment-baseline", "ascent", "attributename", "attributetype", "azimuth", "basefrequency", "baseline-shift", "begin", "bias", "by", "class", "clip", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cx", "cy", "d", "dx", "dy", "diffuseconstant", "direction", "display", "divisor", "dur", "edgemode", "elevation", "end", "fill", "fill-opacity", "fill-rule", "filter", "filterunits", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "fx", "fy", "g1", "g2", "glyph-name", "glyphref", "gradientunits", "gradienttransform", "height", "href", "id", "image-rendering", "in", "in2", "k", "k1", "k2", "k3", "k4", "kerning", "keypoints", "keysplines", "keytimes", "lang", "lengthadjust", "letter-spacing", "kernelmatrix", "kernelunitlength", "lighting-color", "local", "marker-end", "marker-mid", "marker-start", "markerheight", "markerunits", "markerwidth", "maskcontentunits", "maskunits", "max", "mask", "media", "method", "mode", "min", "name", "numoctaves", "offset", "operator", "opacity", "order", "orient", "orientation", "origin", "overflow", "paint-order", "path", "pathlength", "patterncontentunits", "patterntransform", "patternunits", "points", "preservealpha", "preserveaspectratio", "primitiveunits", "r", "rx", "ry", "radius", "refx", "refy", "repeatcount", "repeatdur", "restart", "result", "rotate", "scale", "seed", "shape-rendering", "specularconstant", "specularexponent", "spreadmethod", "startoffset", "stddeviation", "stitchtiles", "stop-color", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke", "stroke-width", "style", "surfacescale", "tabindex", "targetx", "targety", "transform", "text-anchor", "text-decoration", "text-rendering", "textlength", "type", "u1", "u2", "unicode", "values", "viewbox", "visibility", "version", "vert-adv-y", "vert-origin-x", "vert-origin-y", "width", "word-spacing", "wrap", "writing-mode", "xchannelselector", "ychannelselector", "x", "x1", "x2", "xmlns", "y", "y1", "y2", "z", "zoomandpan"];
    function a(e, t) {
        return function (e, t) {
            var a = t;
            /^(\/|\\\\)/.test(t) ? a = /^.+?\w(\/|\\\\)/.exec(e)[0] + t.replace(/^(\/|\\\\)/, "") : /^[a-z]+:/i.test(t) || (a = (e = e.split("#")[0].split("?")[0].replace(/[^\\\/]+$/, "")) + "" + t);
            return function (e) {
                var t = /^[a-z]+:\/\//.exec(e)[0]
                    , a = null
                    , s = [];
                (e = (e = e.replace(t, "").split("?")[0].split("#")[0]).replace(/\\/g, "/").split(/\//))[e.length - 1] = "";
                for (; e.length;)
                    ".." === (a = e.shift()) ? s.pop() : "." !== a && s.push(a);
                return t + s.join("/")
            }(a)
        }(e || self.document.URL || self.location.href, t || (a = document.getElementsByTagName("script"))[a.length - 1].src);
        var a
    }
    ["svg", "altglyph", "altglyphdef", "altglyphitem", "animatecolor", "animatemotion", "animatetransform", "audio", "canvas", "circle", "clippath", "defs", "desc", "ellipse", "filter", "font", "g", "glyph", "glyphref", "hkern", "image", "line", "lineargradient", "marker", "mask", "metadata", "mpath", "path", "pattern", "polygon", "polyline", "radialgradient", "rect", "stop", "style", "switch", "symbol", "text", "textpath", "title", "tref", "tspan", "video", "view", "vkern"].forEach((function (e) {
        window.UEDITOR_CONFIG.whitList[e] = t
    }
    )),
        window.UE = {
            getUEBasePath: a
        }
}();