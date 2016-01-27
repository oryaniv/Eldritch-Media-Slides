/// <reference path="typings/jquery/jquery.d.ts" />
var EldritchSlideShow;
(function (EldritchSlideShow) {
    /**********************    data      *************************/
    var SlideShow = (function () {
        function SlideShow(slideshow) {
            this.Images = [];
            this.Slides = [];
            this.SlideTexts = [];
            this.Backgrounds = [];
            this.Animations = 0 /* None */;
            this.Filters = 0 /* None */;
            this.TextStyles = 0 /* Normal */;
            this.TextAnimes = 0 /* None */;
            this.Size = 0 /* None */;
            this.Audio = "";
            this.Loop = false;
            this.Controls = 0 /* None */;
            this.backgroundbetween = false;
            this.CssClass = "";
            this.CallBack = { Function: "", Params: [] };
            this.AllowUnsafe = false;
            for (var prop in slideshow) {
                this[prop] = slideshow[prop];
            }
        }
        return SlideShow;
    })();
    var SlideShowRemote = (function () {
        function SlideShowRemote(sd, frame) {
            var _this = this;
            this.Start = function () {
                var frameWindow = _this.targetFrame.contentWindow;
                if (frameWindow.document.readyState === "complete") {
                    frameWindow["Play"]();
                }
                else {
                    frameWindow.document.addEventListener("DOMContentLoaded", function () {
                        frameWindow["Play"]();
                    });
                }
                return _this;
            };
            this.Stop = function () {
                _this.targetFrame.contentWindow["Stop"]();
                return _this;
            };
            this.Replay = function () {
                var frameWindow = _this.targetFrame.contentWindow;
                if (frameWindow.document.readyState === "complete") {
                    frameWindow["Replay"]();
                }
                else {
                    frameWindow.document.addEventListener("DOMContentLoaded", function () {
                        frameWindow["Replay"]();
                    });
                }
                return _this;
            };
            this.AddImages = function (images) {
                images.forEach(function (e) { return _this.slideShow.Images.push(e); });
                _this.targetFrame.contentWindow["AddImages"](images);
            };
            this.AddSlides = function (slides) {
                slides.forEach(function (e) { return _this.slideShow.Slides.push(e); });
                _this.targetFrame.contentWindow["AddSlides"](slides);
            };
            this.AddSlideTexts = function (texts) {
                texts.forEach(function (e) { return _this.slideShow.SlideTexts.push(e); });
                _this.targetFrame.contentWindow["AddSlideTexts"](texts);
            };
            this.AddBackGrounds = function (backGrounds) {
                backGrounds.forEach(function (e) { return _this.slideShow.Backgrounds.push(e); });
                _this.targetFrame.contentWindow["AddBackGrounds"](backGrounds);
            };
            this.SetAnimationLevel = function (level) {
                _this.slideShow.Animations = level;
                _this.targetFrame.contentWindow["SetAnimationLevel"](level);
            };
            this.SetFilters = function (level) {
                _this.slideShow.Filters = level;
                _this.targetFrame.contentWindow["SetFilters"](level);
            };
            this.SetTextStyles = function (level) {
                _this.slideShow.TextStyles = level;
                _this.targetFrame.contentWindow["SetTextStyles"](level);
            };
            this.SetTextAnimes = function (level) {
                _this.slideShow.TextAnimes = level;
                _this.targetFrame.contentWindow["SetTextAnimes"](level);
            };
            this.SetSize = function (size) {
                var sizeStyle = getSizeStyle(size);
                $(_this.targetFrame).attr("style", sizeStyle);
            };
            this.SetAudio = function (audio) {
                _this.slideShow.Audio = audio;
                _this.targetFrame.contentWindow["SetAudio"](audio);
            };
            this.SetCallBack = function (CallBackObject) {
                _this.slideShow.CallBack = CallBackObject;
                _this.targetFrame.contentWindow["SetCallBack"](CallBackObject);
            };
            this.SetLoop = function (loop) {
                _this.slideShow.Loop = loop;
                _this.targetFrame.contentWindow["SetLoop"](loop);
            };
            this.SetBackgroundBetween = function (showBackground) {
                _this.slideShow.backgroundbetween = showBackground;
                _this.targetFrame.contentWindow["SetBackgroundBetween"](showBackground);
            };
            this.SetCssClass = function (CssClass) {
                $(_this.targetFrame).removeClass().addClass(CssClass);
            };
            this.slideShow = sd;
            this.targetFrame = frame;
        }
        return SlideShowRemote;
    })();
    var AnimationLevel;
    (function (AnimationLevel) {
        AnimationLevel[AnimationLevel["None"] = 0] = "None";
        AnimationLevel[AnimationLevel["Basic"] = 1] = "Basic";
        AnimationLevel[AnimationLevel["Standard"] = 2] = "Standard";
        AnimationLevel[AnimationLevel["All"] = 3] = "All";
    })(AnimationLevel || (AnimationLevel = {}));
    var FilteringLevel;
    (function (FilteringLevel) {
        FilteringLevel[FilteringLevel["None"] = 0] = "None";
        FilteringLevel[FilteringLevel["Basic"] = 1] = "Basic";
        FilteringLevel[FilteringLevel["All"] = 2] = "All";
    })(FilteringLevel || (FilteringLevel = {}));
    var TextStyleOptions;
    (function (TextStyleOptions) {
        TextStyleOptions[TextStyleOptions["Normal"] = 0] = "Normal";
        TextStyleOptions[TextStyleOptions["Basic"] = 1] = "Basic";
        TextStyleOptions[TextStyleOptions["All"] = 2] = "All";
    })(TextStyleOptions || (TextStyleOptions = {}));
    var TextAnimationsLevel;
    (function (TextAnimationsLevel) {
        TextAnimationsLevel[TextAnimationsLevel["None"] = 0] = "None";
        TextAnimationsLevel[TextAnimationsLevel["Basic"] = 1] = "Basic";
        TextAnimationsLevel[TextAnimationsLevel["All"] = 2] = "All";
    })(TextAnimationsLevel || (TextAnimationsLevel = {}));
    var FixedSize;
    (function (FixedSize) {
        FixedSize[FixedSize["None"] = 0] = "None";
        FixedSize[FixedSize["Small"] = 1] = "Small";
        FixedSize[FixedSize["Medium"] = 2] = "Medium";
        FixedSize[FixedSize["Large"] = 3] = "Large";
        FixedSize[FixedSize["Fullscreen"] = 4] = "Fullscreen";
    })(FixedSize || (FixedSize = {}));
    var MediaType;
    (function (MediaType) {
        MediaType[MediaType["image"] = 0] = "image";
        MediaType[MediaType["video"] = 1] = "video";
    })(MediaType || (MediaType = {}));
    var ControlStyle;
    (function (ControlStyle) {
        ControlStyle[ControlStyle["None"] = 0] = "None";
        ControlStyle[ControlStyle["Hover"] = 1] = "Hover";
        ControlStyle[ControlStyle["Always"] = 2] = "Always";
    })(ControlStyle || (ControlStyle = {}));
    var Slide = (function () {
        function Slide(slide) {
            for (var prop in slide) {
                this[prop] = slide[prop];
            }
        }
        return Slide;
    })();
    var BackGround = (function () {
        function BackGround() {
        }
        return BackGround;
    })();
    var SlideTitles = (function () {
        function SlideTitles() {
        }
        return SlideTitles;
    })();
    EldritchSlideShow.Create = function (containerString, sd) {
        var container = document.querySelector(containerString);
        var slideshow = new SlideShow(sd);
        var slides = [];
        //add Images
        slideshow.Images.forEach(function (e) {
            var image = document.createElement("img");
            image.src = e;
            image.className = "background";
            slides.push(image);
        });
        //add Slides
        slideshow.Slides.forEach(function (e) {
            var item = createMedia(e);
            slides.push(item);
        });
        slides[0].className += " visible";
        var content = "";
        //add slides
        var containerDiv = document.createElement("div");
        containerDiv.id = "containterDiv";
        //slides.reverse().forEach((e) => { content += e.outerHTML; });
        slides.reverse().forEach(function (e) {
            $(containerDiv).append(e);
        });
        content += containerDiv.outerHTML;
        //add Texts
        if (slideshow.Slides.some(function (e) {
            return !!e.text;
        })) {
            content += "<span id='textForSlides' class='subtitles'></span>";
        }
        if (slideshow.SlideTexts.length > 0) {
            content += "<div id='freeTexts' class='freeTexts'></div>";
        }
        //add audio
        if (slideshow.Audio !== "") {
            content += "<audio id='music'><source src=' " + slideshow.Audio + "' type='audio/mpeg' /></audio>";
        }
        //add controls
        if (slideshow.Controls != 0 /* None */) {
            content += addControls();
        }
        //create frame
        var frame = document.createElement("iframe");
        if (slideshow.CssClass === "" && slideshow.Size === 0 /* None */) {
            slideshow.Size = 1 /* Small */;
        }
        frame.className = slideshow.CssClass;
        var style = document.createAttribute("style");
        style.value = getSizeStyle(slideshow.Size);
        frame.setAttributeNode(style);
        container.appendChild(frame);
        // var script = "<script src='https://rawgit.com/oryaniv/Slideshow-widget/master/SlideRun.js'></script>";
        var SlidShowscript = "<script src='../Scripts/SlideRun.js'></script>";
        var CustomScript = buildCustomScript(slideshow);
        var jquery = "<script type='text/javascript' src='https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js'></script>";
        // var stylesheet = "<link rel='stylesheet' href='https://rawgit.com/oryaniv/Slideshow-widget/master/SlideShow.css'  />"
        var stylesheet = "<link rel='stylesheet' href='../Content/CSS/SlideShow.css'  />";
        var fonts = (slideshow.Controls != 0 /* None */) ? "<link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css'>" : "";
        frame.contentWindow.document.open('text/html', 'replace');
        frame.contentWindow.document.write(stylesheet + fonts + content + jquery + SlidShowscript + CustomScript);
        frame.contentWindow.document.close();
        return new SlideShowRemote(slideshow, frame);
    };
    var createMedia = function (item) {
        if (item.Type !== 1 /* video */) {
            var image = document.createElement("img");
            image.src = item.path;
            image.className = "background";
            /*var text = document.createAttribute("data-subtitle");
             text.value = item.text;
             image.setAttributeNode(text);
             var time = document.createAttribute("data-lifetime");
             time.value = item.lifetime.toString();
             image.setAttributeNode(time);*/
            return image;
        }
        var vid = document.createElement("video");
        vid.className = "background";
        var source = document.createElement("source");
        source.src = item.path;
        source.type = "mp4";
        vid.appendChild(source);
        var text = document.createAttribute("data-subtitle");
        text.value = item.text;
        vid.setAttributeNode(text);
        var time = document.createAttribute("data-lifetime");
        time.value = item.lifetime.toString();
        image.setAttributeNode(time);
        return vid;
    };
    var getSizeStyle = function (size) {
        switch (size) {
            case 1 /* Small */:
                return "height:200px;width:300px";
            case 2 /* Medium */:
                return "height:350px;width:500px";
            case 3 /* Large */:
                return "height:550px;width:900px";
            case 4 /* Fullscreen */:
                return "position: fixed;top: 0;left: 0;width: 100%;height: 100%;";
            default:
                return "";
        }
    };
    var addControls = function () {
        var controlsString = '<div id="controlBar" >' + '<button id="play" class="control-button" title= "play" > <i class="fa fa-play" > </i></button>' + '<button id="stop" class="control-button" title= "stop" >' + '<i class="fa fa-stop" > </i> </button>' + '<button id="replay" class="control-button" title= "replay">' + '<i class="fa fa-repeat" > </i>' + '</button>' + '</div>';
        return controlsString;
    };
    var buildCustomScript = function (sd) {
        var scriptStartTag = "<script type='text/javascript'>";
        var sdObj = "var slideShowObject =" + JSON.stringify(sd) + ";" + "\n\n\n";
        var controlsBehavior = sd.Controls == 0 /* None */ ? "" : "$('#play').click(function(){Play(slideShowObject);});" + "$('#stop').click(function(){Stop(slideShowObject);});" + "$('#replay').click(function(){Replay(slideShowObject);});";
        controlsBehavior += sd.Controls != 1 /* Hover */ ? "" : "$('#controlBar').css('bottom','-5%');" + "$('body').on('mouseover',function(){$('#controlBar').css('bottom', '0');});" + "$('body').on('mouseout',function(){$('#controlBar').css('bottom', '-5%');});";
        var scriptEndTag = "</script>";
        return scriptStartTag + sdObj + controlsBehavior + scriptEndTag;
    };
})(EldritchSlideShow || (EldritchSlideShow = {}));
//# sourceMappingURL=SlideShowCreator.js.map
