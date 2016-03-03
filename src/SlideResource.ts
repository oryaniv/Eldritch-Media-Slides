/// <reference path="typings/jquery/jquery.d.ts" />



declare function Play(sd);
declare function Stop(sd);
declare function Replay(sd);

declare var slideShowObject
declare var Howl;

$(document).ready(() => {
    if (slideShowObject.Controls != 0) {
        $('#play').click(function () { Play(slideShowObject); });
        $('#stop').click(function () { Stop(slideShowObject); });
        $('#replay').click(function () { Replay(slideShowObject); });
    }
    if (slideShowObject.Controls == 1) {
        $('#controlBar').css('bottom', '-10vh');
        $('body').on('mouseover', () => { $('#controlBar').css('bottom', '0'); });
        $('body').on('mouseout',() => { $('#controlBar').css('bottom', '-3em'); });
    }

    if (slideShowObject.Audio) {
        slideShowObject.AudioObject = new Howl({
            urls: [slideShowObject.Audio],
        });
    }

    if ($("#volume").length > 0) {
        fixRangeSlider();
    }

    $("#loading").fadeOut(0,() => {
        $(this).remove();
    });
});

var fixRangeSlider = () => {
    createRangeSlider();
    positionRangeSlider();
}

var createRangeSlider = () => {
    $("#range")["rangeslider"]({
        polyfill: false, onSlide: (position, value) => {
            $("#volume i").removeClass().addClass(setVolumeIcon(value));
            slideShowObject.AudioObject.volume(value / 100);
        }
    });
}

var positionRangeSlider = () => {
    $(".rangeslider").css("position", "absolute").css("top", "-7.5em").css("margin-left", "2em").on("mouseover", showVolumeSlider).on("mouseout", hideVolumeSlider);
    var leftOff = $("#volume").offset().left;
    $(".rangeslider").css("left", leftOff);
}

var setVolumeIcon = (value) => {
    if (value <= 5) {
        return "fa fa-volume-off";
    }
    else if (value < 40) {
        return "fa fa-volume-down";
    }
    return "fa fa-volume-up"
}

var showVolumeSlider = () => {
    $(".rangeslider").css("opacity", 1);
}

var hideVolumeSlider = () => {
    $(".rangeslider").css("opacity", 0);
}