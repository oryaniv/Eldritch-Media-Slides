var inAnimationsrep = [{ name: "normalsize", level: 2 /* Standard */ }, { name: "background-fade-in", level: 1 /* Basic */ }, { name: "rotatex-in", level: 2 /* Standard */ }, { name: "rotateY-in", level: 2 /* Standard */ }];
var outAnimationsrep = [{ name: "shrink", level: 2 /* Standard */ }, { name: "background-fade-out", level: 1 /* Basic */ }, { name: "rotatex-out", level: 2 /* Standard */ }, { name: "rotateY-out", level: 2 /* Standard */ }];
var coldAnimationsrep = [{ name: "gray-in", level: 1 /* Basic */ }, { name: "sepia-in", level: 1 /* Basic */ }, { name: "contrast-in", level: 2 /* All */ }, { name: "hue-rotate-in", level: 2 /* All */ }, { name: "invert-in", level: 2 /* All */ }, { name: "blur-in", level: 2 /* All */ }, { name: "saturate-in", level: 2 /* All */ }];
var coldStatesrep = [{ name: "grayscale", level: 1 /* Basic */ }, { name: "sepia", level: 1 /* Basic */ }, { name: "contrast", level: 2 /* All */ }, { name: "hue-rotate", level: 2 /* All */ }, { name: "invert", level: 2 /* All */ }, { name: "blur", level: 2 /* All */ }, { name: "saturate", level: 2 /* All */ }];
var textStylesrep = [{ name: "rainbow", level: 2 /* All */ }, { name: "retro", level: 2 /* All */ }, { name: "text-style1", level: 1 /* Basic */ }, { name: "inset", level: 1 /* Basic */ }, { name: "tri-dimension", level: 1 /* Basic */ }];
var textAnimesrep = [{ name: "neon-glow", level: 1 /* Basic */ }, { name: "spin-around", level: 1 /* Basic */ }, { name: "space-in-out", level: 1 /* Basic */ }, { name: "pass-by", level: 2 /* All */ }, { name: "skew-in", level: 2 /* All */ }];



var Run = function () {
    var sd = slideShowObject;
    //music
    $("#music").trigger('play');
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
    var slides = sd.Images.map(function (e) { return { path: e }; }).concat(sd.Slides);
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
            }
            //the setTimeout is meant to remove current slide and call the next
            setTimeout(function () {
                var inAnimation; 
                var outAnimation;
                console.log("index is " + index);
                //remove this slide
                if (outAnimations.length == 0) {
                    $(backgrounsimages[index]).removeClass("visible");
                    $("#textForSlides").removeClass().html("");
                }
                else {
                    outAnimation = outAnimations[randArr(outAnimations)];
                    var formerInAnimation = index > 0 ? slides[index].animation : "";
                    console.log("former animation was " + formerInAnimation);
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
                if (index >= slides.length - 1) {
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
                    console.log(slides);
                    console.log("attached animation is " + slides[index + 1].animation);
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
                textElement.addClass("freeTexts");
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
    var play=$('#play');
    if (play) {
        play.css('color', 'red').attr('disabled', 'disabled');
    };
    Run();
};

var Stop = function () {
    var play = $('#play');
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
    if (slideShowObject.Audio !== "") {
        document.querySelector('#music').pause();
        document.querySelector('#music').currentTime = 0
    }
    
    clearAllTimeouts();
    var backgroundimages = $('.background').toArray();
    backgroundimages.reverse();
    backgroundimages.forEach(function (e) {
        $(e).removeClass().addClass("background");
    })
    $(backgroundimages[0]).addClass("visible");
    var freeTexts=$("#freeTexts");
    if (freeTexts) { freeTexts.html("").removeClass("").addClass("freeTexts"); }
    var textForSlides = $("#textForSlides");
    if (textForSlides) { textForSlides.html("").removeClass("").addClass("subtitles"); }
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


AddImages = function (images) {
    var containerDiv = $("#containerDiv")
    images.forEach(function (e) {
        slideShowObject.Images.push(e);
        var image = document.createElement("img");
        image.src = e;
        image.className = "background";
        containerDiv.append(image);
    });
}

AddSlides = function (slides) {
    var containerDiv = $("#containerDiv")
    slides.forEach(function (e) {
        slideShowObject.Slides.push(e);
        var slide = document.createElement("img");
        slide.src = item.path;
        slide.className = "background";
        containerDiv.append(slide);
    });
}

AddSlideTexts = function (texts) {
    texts.forEach(function (e) { slideShowObject.SlideTexts.push(e); });
    //TODO do add the free text div if not exists!
}


AddBackGrounds = function (backGrounds) {
    backGrounds.forEach(function (e) { slideShowObject.Backgrounds.push(e); })
}

SetAnimationLevel = function (level) {
    slideShowObject.Animations = level;
}

SetFilters = function (level) {
    slideShowObject.Filters = level;
}

SetTextStyles = function (level) {
    slideShowObject.TextStyles = level;
}

SetTextAnimes = function (level) {
    slideShowObject.TextAnimes = level;
}

SetAudio = function (audio) {
    slideShowObject.Audio = audio;
    if ($("audio").length == 0) {
        $("#containterDiv").append("<audio id='music'><source src=' " + slideShowObject.Audio + "' type='audio/mpeg' /></audio>");
        document.querySelector("source").addEventListener('load', function () {
            document.querySelector('#music').pause();
            document.querySelector('#music').currentTime = 0;
            document.querySelector('#music').play();
        });
        /*$("#music").on("load", function () {
            
        }).each(function () {
            if (this.complete) $(this).load();
        });*/
        
    }
    else {
        $("#music source").attr("src", slideShowObject.Audio);
        $("#music").on("load", function () {
            document.querySelector('#music').pause();
            document.querySelector('#music').currentTime = 0;
            document.querySelector('#music').play();
        }).each(function () {
            if (this.complete) $(this).load();
        });
    }

}

SetCallBack = function (CallBackObject) {
    slideShowObject.CallBack = CallBackObject;
}

SetLoop = function (loop) {
    slideShowObject.Loop = loop;
}

SetBackgroundBetween = function (showBackground) {
    slideShowObject.backgroundbetween = showBackground;
    if (showBackground === false) {
        $("body").css("background-image", "");
    }
}
