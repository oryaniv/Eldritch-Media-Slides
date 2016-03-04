/// <reference path="typings/jquery/jquery.d.ts" />
var EldritchSlideShow;
(function (EldritchSlideShow) {
    EldritchSlideShow.configOptions = { scriptPath: "https://rawgit.com/oryaniv/Slideshow-widget/master/production", stylePath: "https://rawgit.com/oryaniv/Slideshow-widget/master/production" };
    EldritchSlideShow.Config = function (property, value) {
        if (!(property in EldritchSlideShow.configOptions)) {
            console.error("property " + property + " does not exist in Eldritch Slide Show configuration");
            return;
        }
        EldritchSlideShow.configOptions[property] = value;
    };
    var documentationPath = "http://";
    var SlideShow = (function () {
        function SlideShow(slideshow) {
            var _this = this;
            //public input properties
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
            this.Poster = "";
            this.AllowUnsafe = false;
            //private
            this.SlideSegments = [];
            this.ConstructionSuccessful = true;
            this.checkArray = function (name, object) {
                if (!Array.isArray(object)) {
                    console.error(name + " should be an array, instead it is " + typeof (object) + " check your input or look at documentation at " + documentationPath);
                    return false;
                }
                return true;
            };
            this.fixRange = function (min, max, value, name) {
                if (isNaN(value)) {
                    console.error(name + " should be a number, instead it is " + typeof (value) + " please check the documentation at " + documentationPath);
                    return false;
                }
                if (value < min || value > max) {
                    console.error(name + " is out of range should be between " + min + " to" + max + "please check the documentation at " + documentationPath);
                    return false;
                }
                return true;
            };
            this.checkBool = function (input, name) {
                var success = true;
                if (typeof (input) != "boolean") {
                    console.error(name + " should be only true/false, instead it is " + typeof (input) + " please read documentation at " + documentationPath);
                    success = false;
                }
                return success;
            };
            this.checkObject = function (input, name) {
                var success = true;
                if (typeof (input) != "object") {
                    console.error(name + " should be and object of the proper type, instead it is " + typeof (input) + " please read documentation at " + documentationPath);
                    success = false;
                }
                return success;
            };
            this.checkString = function (input, name) {
                var success = true;
                if (typeof (input) != "string") {
                    console.error(name + " should be a string of characters, instead it is " + typeof (input) + " please read documentation at " + documentationPath);
                    success = false;
                }
                return success;
            };
            this.checkCallBack = function (input) {
                if (!_this.checkObject(input, "CallBack"))
                    return false;
                if (typeof (input.Function) !== "string") {
                    console.error("CallBack.Function should be a string name of a function, instead it is " + typeof (input.Function) + " please read documentation at " + documentationPath);
                    return false;
                }
                if (!_this.checkArray("Params", input.Params)) {
                    return false;
                }
                return true;
            };
            this.Properties = ["Images", "Slides", "SlideTexts", "Backgrounds", "Animations", "Filters", "TextStyles", "TextAnimes", "Size", "Audio", "Loop", "Controls", "backgroundbetween", "CssClass", "CallBack", "Poster"];
            this.inputValidationHandlers = {
                Images: function (input) {
                    return _this.checkArray("Images", input) && input.every(function (e) { return _this.checkString(e, e); });
                },
                Slides: function (input) {
                    return _this.checkArray("Slides", input) && input.every(function (e) { return _this.checkObject(e, e); });
                },
                SlideTexts: function (input) {
                    return _this.checkArray("SlideTexts", input) && input.every(function (e) { return _this.checkObject(e, e); });
                },
                Backgrounds: function (input) {
                    return _this.checkArray("Backgrounds", input) && input.every(function (e) { return _this.checkObject(e, e); });
                },
                Animations: function (input) {
                    return _this.fixRange(0, 4, input, "Animations");
                },
                TextStyles: function (input) {
                    return _this.fixRange(0, 4, input, "TextStyles");
                },
                TextAnimes: function (input) {
                    return _this.fixRange(0, 3, input, "TextAnimes");
                },
                Size: function (input) {
                    return _this.fixRange(0, 4, input, "Size");
                },
                Filters: function (input) {
                    return _this.fixRange(0, 3, input, "Filters");
                },
                Controls: function (input) {
                    return _this.fixRange(0, 2, input, "Controls");
                },
                CallBack: function (input) {
                    return _this.checkCallBack(input);
                },
                Audio: function (input) {
                    return _this.checkString(input, "Audio");
                },
                Loop: function (input) {
                    return _this.checkBool(input, "Loop");
                },
                CssClass: function (input) {
                    return _this.checkString(input, "CssClass");
                },
                backgroundbetween: function (input) {
                    return _this.checkBool(input, "backgroundbetween");
                },
                Poster: function (input) {
                    return _this.checkString(input, "Poster");
                }
            };
            this.handlePropertyNames = function (propObj) {
                var success = true;
                for (var prop in propObj) {
                    if (_this.Properties.indexOf(prop) < 0) {
                        console.error(prop + " is not a valid parameter for an Eldritch media slideshow, check your spelling, check that your properties are cased correctly or check" + " the documentation at ");
                        success = false;
                    }
                }
                return success;
            };
            this.handlePropertyInputs = function (propObj) {
                var success = true;
                for (var prop in propObj) {
                    var result = _this.inputValidationHandlers[prop](propObj[prop]);
                    success = success && result;
                }
                return success;
            };
            if (this.handlePropertyNames(slideshow) && this.handlePropertyInputs(slideshow)) {
                for (var prop in slideshow) {
                    this[prop] = slideshow[prop];
                }
            }
            else {
                this.ConstructionSuccessful = false;
            }
        }
        return SlideShow;
    })();
    EldritchSlideShow.SlideShow = SlideShow;
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
                if (!_this.slideShow.inputValidationHandlers["Images"](images)) {
                    return;
                }
                images.forEach(function (e) { return _this.slideShow.SlideSegments.push(e); });
                _this.targetFrame.contentWindow["AddImages"](images);
            };
            this.AddSlides = function (slides) {
                if (!_this.slideShow.inputValidationHandlers["Slides"](slides)) {
                    return;
                }
                slides.forEach(function (e) { return _this.slideShow.SlideSegments.push(e); });
                _this.targetFrame.contentWindow["AddSlides"](slides);
            };
            this.AddSlideTexts = function (texts) {
                if (!_this.slideShow.inputValidationHandlers["SlideTexts"](texts)) {
                    return;
                }
                texts.forEach(function (e) { return _this.slideShow.SlideTexts.push(e); });
                _this.targetFrame.contentWindow["AddSlideTexts"](texts);
            };
            this.AddBackGrounds = function (backGrounds) {
                if (!_this.slideShow.inputValidationHandlers["Backgrounds"](backGrounds)) {
                    return;
                }
                backGrounds.forEach(function (e) { return _this.slideShow.Backgrounds.push(e); });
                _this.targetFrame.contentWindow["AddBackGrounds"](backGrounds);
            };
            this.SetAnimationLevel = function (level) {
                if (!_this.slideShow.inputValidationHandlers["Animations"](level)) {
                    return;
                }
                _this.slideShow.Animations = level;
                _this.targetFrame.contentWindow["SetAnimationLevel"](level);
            };
            this.SetFilters = function (level) {
                if (!_this.slideShow.inputValidationHandlers["Filters"](level)) {
                    return;
                }
                _this.slideShow.Filters = level;
                _this.targetFrame.contentWindow["SetFilters"](level);
            };
            this.SetTextStyles = function (level) {
                if (!_this.slideShow.inputValidationHandlers["TextStyles"](level)) {
                    return;
                }
                _this.slideShow.TextStyles = level;
                _this.targetFrame.contentWindow["SetTextStyles"](level);
            };
            this.SetTextAnimes = function (level) {
                if (!_this.slideShow.inputValidationHandlers["TextAnimes"](level)) {
                    return;
                }
                _this.slideShow.TextAnimes = level;
                _this.targetFrame.contentWindow["SetTextAnimes"](level);
            };
            this.SetSize = function (size) {
                if (!_this.slideShow.inputValidationHandlers["Size"](size)) {
                    return;
                }
                var sizeStyle = getSizeStyle(size);
                var style = document.createAttribute("style");
                style.value = getSizeStyle(size);
                _this.targetFrame.setAttributeNode(style);
            };
            this.SetAudio = function (audio) {
                if (!_this.slideShow.inputValidationHandlers["Audio"](audio)) {
                    return;
                }
                _this.slideShow.Audio = audio;
                _this.targetFrame.contentWindow["SetAudio"](audio);
            };
            this.SetVolume = function (volume) {
                if (isNaN(volume) || volume < 0 || volume > 100) {
                    console.error("volume should be a number in range 0 - 100. please look at documentatio at" + documentationPath);
                    return;
                }
                _this.targetFrame.contentWindow["SetVolume"](volume);
            };
            this.SetCallBack = function (CallBackObject) {
                if (!_this.slideShow.inputValidationHandlers["CallBack"](CallBackObject)) {
                    return;
                }
                _this.slideShow.CallBack = CallBackObject;
                _this.targetFrame.contentWindow["SetCallBack"](CallBackObject);
            };
            this.SetLoop = function (loop) {
                if (!_this.slideShow.inputValidationHandlers["Loop"](loop)) {
                    return;
                }
                _this.slideShow.Loop = loop;
                _this.targetFrame.contentWindow["SetLoop"](loop);
            };
            this.SetBackgroundBetween = function (showBackground) {
                if (!_this.slideShow.inputValidationHandlers["backgroundbetween"](showBackground)) {
                    return;
                }
                _this.slideShow.backgroundbetween = showBackground;
                _this.targetFrame.contentWindow["SetBackgroundBetween"](showBackground);
            };
            this.SetCssClass = function (CssClass) {
                if (!_this.slideShow.inputValidationHandlers["CssClass"](CssClass)) {
                    return;
                }
                _this.targetFrame.className = CssClass;
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
        FilteringLevel[FilteringLevel["Standard"] = 2] = "Standard";
        FilteringLevel[FilteringLevel["All"] = 3] = "All";
    })(FilteringLevel || (FilteringLevel = {}));
    var TextStyleOptions;
    (function (TextStyleOptions) {
        TextStyleOptions[TextStyleOptions["Normal"] = 0] = "Normal";
        TextStyleOptions[TextStyleOptions["Basic"] = 1] = "Basic";
        TextStyleOptions[TextStyleOptions["Advanced"] = 2] = "Advanced";
        TextStyleOptions[TextStyleOptions["Flamboyant"] = 3] = "Flamboyant";
    })(TextStyleOptions || (TextStyleOptions = {}));
    var TextAnimationsLevel;
    (function (TextAnimationsLevel) {
        TextAnimationsLevel[TextAnimationsLevel["None"] = 0] = "None";
        TextAnimationsLevel[TextAnimationsLevel["Basic"] = 1] = "Basic";
        TextAnimationsLevel[TextAnimationsLevel["All"] = 2] = "All";
    })(TextAnimationsLevel || (TextAnimationsLevel = {}));
    (function (FixedSize) {
        FixedSize[FixedSize["None"] = 0] = "None";
        FixedSize[FixedSize["Small"] = 1] = "Small";
        FixedSize[FixedSize["Medium"] = 2] = "Medium";
        FixedSize[FixedSize["Large"] = 3] = "Large";
        FixedSize[FixedSize["Fullscreen"] = 4] = "Fullscreen";
    })(EldritchSlideShow.FixedSize || (EldritchSlideShow.FixedSize = {}));
    var FixedSize = EldritchSlideShow.FixedSize;
    var MediaType;
    (function (MediaType) {
        MediaType[MediaType["image"] = 0] = "image";
        MediaType[MediaType["video"] = 1] = "video";
    })(MediaType || (MediaType = {}));
    (function (ControlStyle) {
        ControlStyle[ControlStyle["None"] = 0] = "None";
        ControlStyle[ControlStyle["Hover"] = 1] = "Hover";
        ControlStyle[ControlStyle["Always"] = 2] = "Always";
    })(EldritchSlideShow.ControlStyle || (EldritchSlideShow.ControlStyle = {}));
    var ControlStyle = EldritchSlideShow.ControlStyle;
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
    EldritchSlideShow.Create = function (param1, param2) {
        var sd;
        var container;
        //1: object
        if (typeof (param1) === "object") {
            container = document.createElement("div");
            document.body.appendChild(container);
            sd = param1;
        }
        else {
            var containerString = param1;
            if (typeof (containerString) !== "string") {
                console.error("first parameter must be an object or a character string please check documentation at " + documentationPath);
                return null;
            }
            container = document.querySelector(containerString);
            if (!container) {
                console.error("Eldritch Media slides was not able to find target container. please make sure to send a correct queryString. please look at documentation at: " + documentationPath);
                return null;
            }
            sd = param2;
        }
        if (typeof (sd) !== "object") {
            console.error("Eldrtich Media Slides must take an object as a parameter to the create method. check the documentation at " + documentationPath);
            createErrorFrame(container);
        }
        var slideshow = new SlideShow(sd);
        if (!slideshow.ConstructionSuccessful) {
            createErrorFrame(container);
            return null;
        }
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
        if (slides.length === 0) {
            console.error("no images or slides in input, please fill the 'Images' or 'Slides' property according to " + documentationPath);
            createErrorFrame(container);
            return null;
        }
        slides[0].className += " visible";
        var content = "";
        //add loading screen
        content += CreateLoadingScreen();
        //add Poster
        if (slideshow.Poster) {
            content += "<img class='Poster'  src='" + slideshow.Poster + "' />";
        }
        content += "<div id='allContent'>";
        //add slides
        var containerDiv = document.createElement("div");
        containerDiv.id = "containerDiv";
        slides.reverse().forEach(function (e) {
            containerDiv.appendChild(e);
        });
        //add Texts
        content += containerDiv.outerHTML;
        slideshow.SlideSegments = slideshow.Images.map(function (e) {
            return { path: e };
        }).concat(slideshow.Slides);
        ;
        if (slideshow.Slides.some(function (e) {
            return !!e.text;
        })) {
            content += "<span id='textForSlides' class='subtitles'></span>";
        }
        if (slideshow.SlideTexts.length > 0) {
            content += "<span id='freeTexts' class='freeTexts'></span>";
        }
        content += "</div>";
        //add controls
        if (slideshow.Controls != 0 /* None */) {
            content += addControls(slideshow.Audio);
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
        // var stylesheet = "<link rel='stylesheet' href='https://rawgit.com/oryaniv/Slideshow-widget/master/SlideShow.css'  />"
        // separate scripts
        //  var jquery = "<script type='text/javascript' src='https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js'></script>";
        // var flowType = "<script src='../Scripts/flowType.js'></script>";
        //var howler = '<script src="https://cdnjs.cloudflare.com/ajax/libs/howler/1.1.29/howler.min.js" ></script>'
        //var animationRepository = "<script src='../Scripts/AnimationRepository.js'></script>";
        // var SlidShowscript = "<script src='../Scripts/SlideRun.js'></script>";
        // var rangeSliderjs = "<script src='../Scripts/rangeslider.min.js'></script>"
        // var CustomScript = "<script src='../Scripts/SlideResource.js'></script>";        
        // dynamic script
        var insertObj = CreateSlideScript(slideshow);
        // script bundle
        var scriptBundle = "<script src='" + EldritchSlideShow.configOptions.scriptPath + "/EldritchMediaSlidesRun.min.js'></script>";
        // separate css 
        // var stylesheet = "<link rel='stylesheet' href='../Content/CSS/SlideShow.css'  />";
        //var animatecss = "<link rel='stylesheet' href='../Content/CSS/animate.css'/>";
        var fonts = (slideshow.Controls != 0 /* None */) ? "<link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css'>" : "";
        //var rangeSliderCss = "<link rel='stylesheet' href='../Content/CSS/rangeslider.css'/>";
        //css bundle
        var styleBundle = "<link rel='stylesheet' href='" + EldritchSlideShow.configOptions.stylePath + "/EldritchMediaSlidesStyle.min.css'/>";
        frame.contentWindow.document.open('text/html', 'replace');
        frame.contentWindow.document.write(styleBundle + fonts + content + scriptBundle + insertObj);
        frame.contentWindow.document.close();
        return new SlideShowRemote(slideshow, frame);
    };
    var createErrorFrame = function (container) {
        var errorDiv = document.createElement("div");
        var errorDivStyle = document.createAttribute("style");
        errorDivStyle.value = "box-sizing: border-box;height:12.5rem;width:19rem;padding: 20px;overflow: hidden; border: 2px solid rgba(247,14,14,1);" + " font: normal 12px/1 Arial Black, Gadget, sans-serif;color: rgba(113,4,4,1);background: rgba(255,86,86,0.89);text-align:center;";
        errorDiv.setAttributeNode(errorDivStyle);
        errorDiv.innerHTML = "<h1>Whoops!</h1><br/><div>seems like you have passed bad input, " + "and the media slide could not be created. please check developer tools console (F12 => console) for more information</div>";
        container.appendChild(errorDiv);
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
                return "height:12.5rem;width:19rem;";
            case 2 /* Medium */:
                return "height:22rem;width:31rem";
            case 3 /* Large */:
                return "height:38rem;width:56rem";
            case 4 /* Fullscreen */:
                return "position: fixed;top: 0;left: 0;width: 100%;height: 100%;";
            default:
                return "";
        }
    };
    var addControls = function (audio) {
        var volumeControl = !audio ? "" : '<span id="volume"   onmouseover= "showVolumeSlider();" onmouseout= "hideVolumeSlider();" > <i class="fa fa-volume-up"> </i></span>' + '<input type="range" id="range" min="0"  max="100" step="5" data-orientation="vertical"  />';
        var controlsString = '<div id="controlBar" >' + '<button id="play" class="control-button" title= "play" > <i class="fa fa-play" > </i></button>' + '<button id="stop" class="control-button" title= "stop" >' + '<i class="fa fa-stop" > </i> </button>' + '<button id="replay" class="control-button" title= "replay">' + '<i class="fa fa-repeat" > </i>' + '</button>' + volumeControl + '</div>';
        return controlsString;
    };
    var CreateSlideScript = function (sd) {
        var scriptStartTag = "<script type='text/javascript'>";
        var sdObj = "var slideShowObject =" + JSON.stringify(sd) + ";" + "\n\n\n";
        var scriptEndTag = "</script>";
        return scriptStartTag + sdObj + scriptEndTag;
    };
    var adjustControlsToSize = function (size) {
        switch (size) {
            case 3 /* Large */:
                return "$('#controlBar').css('height','5%');$('control-button').each(function(){$(this).css('width','5%')};);";
            case 4 /* Fullscreen */:
                return "$('#controlBar').css('height','5%');$('control-button').each(function(){$(this).css('width','5%')};);";
            default:
                return "";
        }
    };
    var CreateLoadingScreen = function () {
        return "<div id='loading'  style='background-color:black; position:fixed;top:0;left:0;width:100%;height:100%;z-index:1500;overflow: hidden;background: radial-gradient(circle, rgba(12,99,21,0.2) 0, rgba(12,99,21,0.2) 7%, rgba(4,12,79,1) 50%, rgba(4,12,79,1) 100%);'>" + "<h1 style='color:red;text-align:center;font: normal 2em/2 Comic Sans MS, cursive, sans-serif;letter-spacing: 3px;'>" + "Loading the Awesome!" + "</h1>" + "</div>";
    };
})(EldritchSlideShow || (EldritchSlideShow = {}));
//# sourceMappingURL=SlideShowCreator.js.map
