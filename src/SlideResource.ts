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
            $('#controlBar').css('bottom', '-10%');
        });
    }
    if (slideShowObject.Audio) {
        slideShowObject.AudioObject = new Howl({
            urls: [slideShowObject.Audio],
        });
    }
    switch (slideShowObject.Size) {
        case 3:
            $('#controlBar').css('height', '5%');
            $('control-button').each(function () {
                $(this).css('width', '5%');
            });
            break;
        case 4:
            $('#controlBar').css('height', '5%');
            $('control-button').each(function () {
                $(this).css('width', '5%');
            });
            break;
        default:
    }
});
