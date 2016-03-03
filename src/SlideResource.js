/// <reference path="typings/jquery/jquery.d.ts" />
var _this = this;
$(document).ready(function () {
    if (slideShowObject.Controls != 0) {
        $('#play').click(function () {
            Play(slideShowObject);
        });
        $('#stop').click(function () {
            Stop(slideShowObject);
        });
        $('#replay').click(function () {
            Replay(slideShowObject);
        });
    }
    if (slideShowObject.Controls == 1) {
        $('#controlBar').css('bottom', '-10vh');
        $('body').on('mouseover', function () {
            $('#controlBar').css('bottom', '0');
        });
        $('body').on('mouseout', function () {
            $('#controlBar').css('bottom', '-3em');
        });
    }
    if (slideShowObject.Audio) {
        slideShowObject.AudioObject = new Howl({
            urls: [slideShowObject.Audio],
        });
    }
    if ($("#volume").length > 0) {
        fixRangeSlider();
    }
    $("#loading").fadeOut(0, function () {
        $(_this).remove();
    });
});
var fixRangeSlider = function () {
    createRangeSlider();
    positionRangeSlider();
};
var createRangeSlider = function () {
    $("#range")["rangeslider"]({
        polyfill: false,
        onSlide: function (position, value) {
            $("#volume i").removeClass().addClass(setVolumeIcon(value));
            slideShowObject.AudioObject.volume(value / 100);
        }
    });
};
var positionRangeSlider = function () {
    $(".rangeslider").css("position", "absolute").css("top", "-7.5em").css("margin-left", "2em").on("mouseover", showVolumeSlider).on("mouseout", hideVolumeSlider);
    var leftOff = $("#volume").offset().left;
    $(".rangeslider").css("left", leftOff);
};
var setVolumeIcon = function (value) {
    if (value <= 5) {
        return "fa fa-volume-off";
    }
    else if (value < 40) {
        return "fa fa-volume-down";
    }
    return "fa fa-volume-up";
};
var showVolumeSlider = function () {
    $(".rangeslider").css("opacity", 1);
};
var hideVolumeSlider = function () {
    $(".rangeslider").css("opacity", 0);
};
//# sourceMappingURL=SlideResource.js.map