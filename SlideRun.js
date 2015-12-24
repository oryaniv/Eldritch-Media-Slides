var inAnimationsrep = [{ name: "normalsize", level: 2 /* Standard */ }, { name: "background-fade-in", level: 1 /* Basic */ }, { name: "rotatex-in", level: 2 /* Standard */ }, { name: "rotateY-in", level: 2 /* Standard */ }];
var outAnimationsrep = [{ name: "shrink", level: 2 /* Standard */ }, { name: "background-fade-out", level: 1 /* Basic */ }, { name: "rotatex-out", level: 2 /* Standard */ }, { name: "rotateY-out", level: 2 /* Standard */ }];
var coldAnimationsrep = [{ name: "gray-in", level: 1 /* Basic */ }, { name: "sepia-in", level: 1 /* Basic */ }, { name: "contrast-in", level: 2 /* All */ }, { name: "hue-rotate-in", level: 2 /* All */ }, { name: "invert-in", level: 2 /* All */ }, { name: "blur-in", level: 2 /* All */ }, { name: "saturate-in", level: 2 /* All */ }];
var coldStatesrep = [{ name: "grayscale", level: 1 /* Basic */ }, { name: "sepia", level: 1 /* Basic */ }, { name: "contrast", level: 2 /* All */ }, { name: "hue-rotate", level: 2 /* All */ }, { name: "invert", level: 2 /* All */ }, { name: "blur", level: 2 /* All */ }, { name: "saturate", level: 2 /* All */ }];
var textStylesrep = [{ name: "rainbow", level: 2 /* All */ }, { name: "retro", level: 2 /* All */ }, { name: "text-style1", level: 1 /* Basic */ }, { name: "inset", level: 1 /* Basic */ }, { name: "tri-dimension", level: 1 /* Basic */ }];
var textAnimesrep = [{ name: "neon-glow", level: 1 /* Basic */ }, { name: "spin-around", level: 1 /* Basic */ }, { name: "space-in-out", level: 1 /* Basic */ }, { name: "pass-by", level: 2 /* All */ }, { name: "skew-in", level: 2 /* All */ }];
    
    Run = function (sd) {
        //music
        $("#music").trigger('play');
        //backgrounds
        var folder = "Images/";
        var backgrounds = [folder + "/heart.jpg", folder + "/heart2.jpg", folder + "/heart3.jpg", folder + "/heart4.jpg", folder + "/heart5.jpg"];
        //interval
        var interval;
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
        var iter = 0;
        var formerOutAnimation = "";
        var formerInAnimation = "";
        var subtitles = $('.subtitles');
        var four = Math.floor(randArr(textStyles));
        var textStyle = textStyles[four].name;
        subtitles.addClass(textStyle);
        var formerTextstyle = textStyle;
        console.log("text style is " + textStyle);
        interval = setInterval(function () {
            if (iter === backgrounsimages.length) {
                clearInterval(interval);
                //afterSlide();
                return;
            }
            //generate next animations
            var one = Math.floor(randArr(inAnimations));
            var two = Math.floor(randArr(outAnimations));
            var three = Math.floor(randArr(coldAnimations));
            var five;
            var textAnime;
            var inAnimation = inAnimations[one].name;
            var outAnimation = outAnimations[two].name;
            var coldAnimation = coldAnimations[three].name;
            var coldState = coldStates[three].name;
            $(backgrounsimages[iter]).removeClass(formerInAnimation).addClass(coldAnimation);
            // attach out animation
            setTimeout(function () {
                $(backgrounsimages[iter]).addClass(coldState).removeClass(coldAnimation).addClass(outAnimation);
                console.log("text style on attach out is " + textStyle);
                subtitles.removeClass().hide();
                var url = backgrounds[randArr(backgrounds)];
                $("body").css("background-image", "url(" + url + ")");
            }, 2000);
            //animation for next segment
            setTimeout(function () {
                four = Math.floor(randArr(textStyles));
                five = Math.floor(randArr(textAnimes));
                textStyle = textStyles[four].name;
                textAnime = textAnimes[five];
                var formerTextstyle = textStyle;
                iter++;
                if (iter === backgrounsimages.length) {
                    return;
                }
                $(backgrounsimages[iter]).addClass("visible").addClass(inAnimation);
                console.log("text style on attach next segment is " + textStyle);
                subtitles.html($(backgrounsimages[iter]).attr("data-subtitle")).show().addClass("subtitles " + " " + textStyle + " " + textAnime);
            }, 4500);
            formerInAnimation = inAnimation;
        }, 9000);
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
        });
    }
