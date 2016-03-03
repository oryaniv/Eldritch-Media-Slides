
var inAnimationsrep = inAnimationsrep || [];
var outAnimationsrep = outAnimationsrep || [];
var coldAnimationsrep = coldAnimationsrep || [];
var coldStatesrep = coldStatesrep || [];
var textStylesrep = textStylesrep || [];
var textAnimesrep = textAnimesrep || [];

var slideShowObject = slideShowObject || {};

var typingObject = {
    minimum: 100,
    maximum: 1200,
    minFont: 14,
    maxFont: 80,
    fontRatio: 15
}


/*var typingObject = {
    minimum: 200,
    maximum: 1200,
    minFont: 20,
    maxFont: 80,
    fontRatio: 12
}*/

var Run = function () {
    var sd = slideShowObject;
    //music
    if (sd.AudioObject) {
        sd.AudioObject.play();
    }
    if (sd.Poster) {
        $(".Poster").hide();
    }
    
    //backgrounds
    var backgrounds = sd.Backgrounds.map(function (e) { return e.path; });
    if (sd.backgroundbetween) {
        $("body").css("background-size", "100% 100%");
    }
    //consts
    var StandardIntervalLifeTime = 8000;
    var StandardAnimationTime = 2000;
    // filter animation and style lists
    var inAnimations = filterByLevel(inAnimationsrep, sd.Animations);
    var outAnimations = filterByLevel(outAnimationsrep, sd.Animations);
    var coldAnimations = filterByLevel(coldAnimationsrep, sd.Filters);
    var coldStates = filterByLevel(coldStatesrep, sd.Filters);
    var textStyles = filterByLevel(textStylesrep, sd.TextStyles);
    var textAnimes = filterByLevel(textAnimesrep, sd.TextAnimes);
    //animation and style lists   
    var backgrounsimages = $('.background').toArray();
    var len = backgrounsimages.length;
    backgrounsimages.reverse();
    var timeOuts = [];
    //welcome to the new mechanism!!
    var slides = sd.SlideSegments;
    if (backgrounsimages.length > 0)
    {
        var SlideFunction = function (index, slides)
        {
            var current = slides[index];
            var time = current.lifetime ? current.lifetime * 1000 : StandardIntervalLifeTime;

            if (current.text) {
                var textStyle = textStyles.length > 0 ? textStyles[randArr(textStyles)] : "";
                var textAnimation = textAnimes.length > 0 ? textAnimes[randArr(textAnimes)]: "";
                $("#textForSlides").html(current.text).addClass("subtitles").addClass(textStyle).addClass(textAnimation);
                $('#allContent').flowtype(typingObject);
            }
            //the setTimeout is meant to remove current slide and call the next
            setTimeout(function () {
                var inAnimation; 
                var outAnimation;
                //remove this slide
                if (outAnimations.length == 0 && coldAnimations.length == 0) {
                    $(backgrounsimages[index]).removeClass("visible");
                    $("#textForSlides").removeClass().html("");
                }
                else if (outAnimations.length == 0 && coldAnimations.length != 0) {
                    var random = randArr(coldAnimations);
                    var coldAnimation = coldAnimations[random];
                    var coldState = coldStates[random];
                    coldState = coldState === undefined ? "" : coldState;
                    var filterDelay = StandardAnimationTime;
                    $(backgrounsimages[index]).removeClass(formerInAnimation).addClass(coldAnimation);
                    if (sd.backgroundbetween) {
                        var url = backgrounds[randArr(backgrounds)];
                        $("body").css("background-image", "url(" + url + ")");
                    }
                    setTimeout(function () {
                        $(backgrounsimages[index]).removeClass(coldAnimations[random]).addClass(coldStates[random]);
                        $("#textForSlides").removeClass().html("");
                        $(backgrounsimages[index]).removeClass("visible");
                    }, filterDelay);
                }
                else {
                    outAnimation = outAnimations[randArr(outAnimations)];
                    var formerInAnimation = index > 0 ? slides[index].animation : "";
                    var filterDelay = 0;
                    var random = randArr(coldAnimations);
                    if (sd.Filters > 0) {
                        filterDelay += StandardAnimationTime;                        
                        var coldAnimation = coldAnimations[random];
                        var coldState = coldStates[random];
                        $(backgrounsimages[index]).removeClass(formerInAnimation).addClass(coldAnimation);
                    }
                    if (sd.backgroundbetween)
                    {
                        var url = backgrounds[randArr(backgrounds)];
                        $("body").css("background-image", "url(" + url + ")");
                    }
                    setTimeout(function () {
                        if (sd.Filters > 0) {
                            $(backgrounsimages[index]).removeClass(coldAnimations[random]).addClass(coldStates[random]);
                        }
                        $("#textForSlides").removeClass().html("");
                        $(backgrounsimages[index]).removeClass(formerInAnimation).addClass(outAnimation);
                    }, filterDelay);
                    
                    
                }

                //termination
                if (index >= backgrounsimages.length-1/*slides.length - 1*/) {
                    if (sd.CallBack.Function) {
                        window.parent[sd.CallBack.Function].apply(this, sd.CallBack.Params);                        
                    }                    
                    if (sd.Loop) {
                        Replay();
                    }
                    else {
                        Stop();
                    }
                    return;
                }
                if (inAnimations.length == 0) {
                    $(backgrounsimages[index + 1]).addClass("visible");
                    SlideFunction(index + 1, slides);
                }
                else {
                    inAnimation = inAnimations[randArr(inAnimations)];
                    slides[index + 1].animation = inAnimation;
                    var wait = StandardAnimationTime;
                    wait = sd.backgroundbetween ? wait + StandardAnimationTime : wait;
                    wait = sd.Filters > 0 ? wait + StandardAnimationTime : wait;
                    setTimeout(function () {
                        $(backgrounsimages[index + 1]).addClass("visible").addClass(inAnimation);
                        setTimeout(function () {
                            SlideFunction(index + 1, slides);
                        }, StandardAnimationTime);                        
                    }, wait);
                }                               
            }, time);            
        }
        SlideFunction(0, slides);
    }

    //handle texts
    var texts = sd.SlideTexts;
    var bounds = getSizes();
    if (texts.length > 0) {
        var textFunction = function (index, texts) {
            var current = texts[index];
            var textElement = $("#freeTexts");
            textElement.html(current.text);
            textElement.removeClass();
            textElement.attr("style", '');
            if (current.style) {
                var newStyle = "";
                Object.keys(current.style).forEach(function (e) { newStyle += e + ":" + current.style[e] + ";" });
                textElement.attr("style", newStyle);
            }
            else {
                var textStyle = textStyles.length > 0 ? textStyles[randArr(textStyles)] : "";
                textElement.addClass("freeTexts "+ textStyle);
                $('#allContent').flowtype(typingObject);
            }            
            var time = current.lifetime ? current.lifetime * 1000 : 2000;
            setTimeout(function () {
                $("#freeTexts").html("");
                if (index < texts.length - 1) {
                    textFunction(index + 1, texts);
                }
            }, time)
        }
        textFunction(0, texts);
    }
    
};

var Play = function () {
    var play=$('#play .fa');
    if (play) {
        play.css('color', 'rgba(95, 142, 236, 0.3)').attr('disabled', 'disabled');
    };
    Run();
};

var Stop = function () {
    var play = $('#play .fa');
    if (play) {
        play.css('color','').removeAttr('disabled');;        
    };
    cleanUp();
};


var Replay = function () {
    Stop();
    Play();
};

var randArr = function (arr) {
    return randInt(arr.length);
};
var randInt = function (range) {
    return Math.floor(Math.random() * (range));
};
var filterByLevel = function (ds, level) {
    return ds.filter(function (e) {
        return e.level <= level;
    }).map(function (e) { return e.name; });
}

var cleanUp = function () {
    if (slideShowObject.Poster) {
        $(".Poster").show();
    }
    if (slideShowObject.AudioObject) {
        slideShowObject.AudioObject.stop();
    }
    
    clearAllTimeouts();
    var backgroundimages = $('.background').toArray();
    backgroundimages.reverse();
    backgroundimages.forEach(function (e) {
        $(e).removeClass().addClass("background");
    })
    $(backgroundimages[0]).addClass("visible");
    var freeTexts=$("#freeTexts");
    if (freeTexts.length > 0 ) { freeTexts.html("").removeClass("").addClass("freeTexts"); }
    var textForSlides = $("#textForSlides");
    if (textForSlides.length > 0) { textForSlides.html("").removeClass("").addClass("subtitles"); }
}


var changeAnimDuration = function (element,duration){
    var vendors = ["-webkit-", "-moz-", "-o-", ""];
    vendors.forEach(function (ven) { $(element).css(ven + "animation-duration", duration + "s"); });
}


//http://www.howtocreate.co.uk/tutorials/javascript/browserwindow
var getSizes= function () {
        var myWidth = 0, myHeight = 0;
        if( typeof( window.innerWidth ) == 'number' ) {
            //Non-IE
            myWidth = window.innerWidth;
            myHeight = window.innerHeight;
        } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
            //IE 6+ in 'standards compliant mode'
            myWidth = document.documentElement.clientWidth;
            myHeight = document.documentElement.clientHeight;
        } 
        return myWidth;//{'width':myWidth , 'height':myHeight};
}

//http://stackoverflow.com/questions/3141064/how-to-stop-all-timeouts-and-intervals-using-javascript
window.timeoutList = new Array();
window.intervalList = new Array();

window.oldSetTimeout = window.setTimeout;
window.oldSetInterval = window.setInterval;
window.oldClearTimeout = window.clearTimeout;
window.oldClearInterval = window.clearInterval;

window.setTimeout = function (code, delay) {
    var retval = window.oldSetTimeout(code, delay);
    window.timeoutList.push(retval);
    return retval;
};
window.clearTimeout = function (id) {
    var ind = window.timeoutList.indexOf(id);
    if (ind >= 0) {
        window.timeoutList.splice(ind, 1);
    }
    var retval = window.oldClearTimeout(id);
    return retval;
};
window.setInterval = function (code, delay) {
    var retval = window.oldSetInterval(code, delay);
    window.intervalList.push(retval);
    return retval;
};
window.clearInterval = function (id) {
    var ind = window.intervalList.indexOf(id);
    if (ind >= 0) {
        window.intervalList.splice(ind, 1);
    }
    var retval = window.oldClearInterval(id);
    return retval;
};
window.clearAllTimeouts = function () {
    for (var i in window.timeoutList) {
        window.oldClearTimeout(window.timeoutList[i]);
    }
    window.timeoutList = new Array();
};
window.clearAllIntervals = function () {
    for (var i in window.intervalList) {
        window.oldClearInterval(window.intervalList[i]);
    }
    window.intervalList = new Array();
};


/*******************  set functions   **************************/


var AddImages = function (images) {
    var containerDiv = $("#containerDiv")
    images.forEach(function (e) {
        slideShowObject.SlideSegments.push({ path: e });
        var image = document.createElement("img");
        image.src = e;
        image.className = "background";
        containerDiv.prepend(image);
    });
}

var AddSlides = function (slides) {
    var containerDiv = $("#containerDiv");
    slides.forEach(function (e) {
        slideShowObject.SlideSegments.push(e);
        var slide = document.createElement("img");
        slide.src = e.path;
        slide.className = "background";
        containerDiv.prepend(slide);
    });
    if (slides.some(function(e) { return !!e.text; })) {
        $("body").append("<span id='textForSlides' class='subtitles'></span>");
    }
}

var AddSlideTexts = function (texts) {
    texts.forEach(function (e) { slideShowObject.SlideTexts.push(e); });
    if ($('#freeTexts').length == 0) {
        $("body").append("<div id='freeTexts' class='freeTexts'></div>");
    }
}


var AddBackGrounds = function (backGrounds) {
    backGrounds.forEach(function (e) { slideShowObject.Backgrounds.push(e); })
}

var SetAnimationLevel = function (level) {
    slideShowObject.Animations = level;
}

var SetFilters = function (level) {
    slideShowObject.Filters = level;
}

var SetTextStyles = function (level) {
    slideShowObject.TextStyles = level;
}

var SetTextAnimes = function (level) {
    slideShowObject.TextAnimes = level;
}


var SetAudio = function (audio) {
    if(slideShowObject.AudioObject){
        slideShowObject.AudioObject.stop();
    }   
    if (!audio) {
        slideShowObject.AudioObject = null;
        $("#volume").remove();
        $(".rangeslider").remove();
        $("#range").remove();
    }
    else {
        slideShowObject.AudioObject = new Howl({ urls: [audio] });
        slideShowObject.AudioObject.play();
        if ($("#volume").length == 0) {
            $("#controlBar").append('<span id="volume"   onmouseover= "showVolumeSlider();" onmouseout= "hideVolumeSlider();" > <i class="fa fa-volume-up"> </i></span>' +
            '<input type="range" id="range" min="0"  max="100" step="5" data-orientation="vertical"  />');
        }       
        setTimeout(fixRangeSlider,100);
    }
}

var SetVolume = function (volume) {
    if (slideShowObject.AudioObject) {
        slideShowObject.AudioObject.volume(volume / 100);
        $("#volume i").removeClass().addClass(setVolumeIcon(volume));
        $("#range").val(volume).rangeslider('update', true);
    }
    else
    {
        console.warn("do not try to set the volume of a slideshow with no audio porperty");
    }
}

var SetCallBack = function (CallBackObject) {
    slideShowObject.CallBack = CallBackObject;
}

var SetLoop = function (loop) {
    slideShowObject.Loop = loop;
}

var SetBackgroundBetween = function (showBackground) {
    slideShowObject.backgroundbetween = showBackground;
    if (showBackground === false) {
        $("body").css("background-image", "");
    }
}
