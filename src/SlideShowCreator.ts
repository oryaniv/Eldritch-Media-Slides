/// <reference path="typings/jquery/jquery.d.ts" />
module EldritchSlideShow {

    /**********************    data      *************************/


    class SlideShow
    {

        Images: Array<string> = [];
        Slides: Array<Slide> = [];
        SlideTexts: Array<SlideTitles> = [];
        Backgrounds: Array<BackGround> = [];
        Animations: AnimationLevel = AnimationLevel.None;
        Filters: FilteringLevel = FilteringLevel.None;
        TextStyles: TextStyleOptions = TextStyleOptions.Normal;
        TextAnimes: TextAnimationsLevel = TextAnimationsLevel.None;
        Size: FixedSize = FixedSize.None;
        Audio: string = "";
        Loop: boolean = false;
        Controls: ControlStyle = ControlStyle.None;
        backgroundbetween: boolean = false;
        CssClass: string = "";
        CallBack: {} = {Function:"",Params:[]};
        AllowUnsafe: boolean = false;

        constructor(slideshow: SlideShow) {
            for (var prop in slideshow) {
                this[prop] = slideshow[prop];
            }
        }

        

    }

    class SlideShowRemote {
        slideShow: SlideShow;
        targetFrame: HTMLIFrameElement;

        constructor(sd: SlideShow, frame: HTMLIFrameElement) {
            this.slideShow = sd;
            this.targetFrame = frame;
        }

        Start = () => {
            var frameWindow = this.targetFrame.contentWindow
            if (frameWindow.document.readyState === "complete") {
                frameWindow["Play"]();
            }
            else {
                frameWindow.document.addEventListener("DOMContentLoaded",() => {
                    frameWindow["Play"]();
                });
            }
            return this;
        }

        Stop = () => {
            this.targetFrame.contentWindow["Stop"]();
            return this;
        }

        Replay = () => {
            var frameWindow = this.targetFrame.contentWindow
            if (frameWindow.document.readyState === "complete") {
                frameWindow["Replay"]();
            }
            else {
                frameWindow.document.addEventListener("DOMContentLoaded",() => {
                    frameWindow["Replay"]();
                });
            }
            return this;
        }

        AddImages = (images: Array<string>) => {
            images.forEach(e => this.slideShow.Images.push(e));
            this.targetFrame.contentWindow["AddImages"](images);
        }

        AddSlides = (slides: Array<Slide>) => {
            slides.forEach(e => this.slideShow.Slides.push(e));
            this.targetFrame.contentWindow["AddSlides"](slides);
        }

        AddSlideTexts = (texts: Array<SlideTitles>) => {
            texts.forEach(e => this.slideShow.SlideTexts.push(e));
            this.targetFrame.contentWindow["AddSlideTexts"](texts);
        }


        AddBackGrounds = (backGrounds: Array<BackGround>) => {
            backGrounds.forEach(e => this.slideShow.Backgrounds.push(e));
            this.targetFrame.contentWindow["AddBackGrounds"](backGrounds);
        }

        SetAnimationLevel = (level: AnimationLevel) => {
            this.slideShow.Animations = level;
            this.targetFrame.contentWindow["SetAnimationLevel"](level);
        }

        SetFilters = (level: FilteringLevel) => {
            this.slideShow.Filters = level;
            this.targetFrame.contentWindow["SetFilters"](level);
        }

        SetTextStyles = (level: TextStyleOptions) => {
            this.slideShow.TextStyles = level;
            this.targetFrame.contentWindow["SetTextStyles"](level);
        }

        SetTextAnimes = (level: TextAnimationsLevel) => {
            this.slideShow.TextAnimes = level;
            this.targetFrame.contentWindow["SetTextAnimes"](level);
        }

        SetSize = (size: FixedSize) => {
            var sizeStyle = getSizeStyle(size);
            $(this.targetFrame).attr("style", sizeStyle);
        }

        SetAudio = (audio: string) => {
            this.slideShow.Audio = audio;
            this.targetFrame.contentWindow["SetAudio"](audio);
        }

        SetCallBack = (CallBackObject: Object) => {
            this.slideShow.CallBack = CallBackObject;
            this.targetFrame.contentWindow["SetCallBack"](CallBackObject);
        }

        SetLoop = (loop: boolean) => {
            this.slideShow.Loop = loop;
            this.targetFrame.contentWindow["SetLoop"](loop);
        }

        SetBackgroundBetween = (showBackground: boolean) => {
            this.slideShow.backgroundbetween = showBackground;
            this.targetFrame.contentWindow["SetBackgroundBetween"](showBackground);
        }


        SetCssClass = (CssClass: string) => {
            $(this.targetFrame).removeClass().addClass(CssClass);
        }

    }


    enum AnimationLevel {
        None, Basic, Standard, All
    }

    enum FilteringLevel {
        None, Basic, All
    }

    enum TextStyleOptions {
        Normal, Basic, All
    }

    enum TextAnimationsLevel {
        None, Basic, All
    }

    enum FixedSize {
        None,Small, Medium, Large, Fullscreen
    }

    enum MediaType {
        image, video
    }

    enum ControlStyle {
        None,Hover,Always
    }

    

    class Slide {
        constructor(slide: Slide) {
            for (var prop in slide) {
                this[prop] = slide[prop];
            }
        }
        path: string;
        text: string;
        Type: MediaType;
        lifetime: number;
    }

    class BackGround {
        path: string;
    }

    class SlideTitles {
        text: string;
        lifetime: number;
        style: string;
    }


    export var Create = (containerString: string, sd: SlideShow) => {
        var container = document.querySelector(containerString);
        var slideshow = new SlideShow(sd);
        var slides = [];

        //add Images
        slideshow.Images.forEach((e) => {
            var image = document.createElement("img");
            image.src = e;
            image.className = "background";
            slides.push(image);
        });

        //add Slides
        slideshow.Slides.forEach((e) => {
            var item = createMedia(e);
            slides.push(item);
        });
        
        slides[0].className += " visible";
        var content = "";

        //add slides
        var containerDiv=document.createElement("div");
        containerDiv.id = "containterDiv";
        //slides.reverse().forEach((e) => { content += e.outerHTML; });
        slides.reverse().forEach((e) => { $(containerDiv).append(e); });
        content += containerDiv.outerHTML;
        //add Texts
        if (slideshow.Slides.some((e) => { return !!e.text; })) {
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
        if (slideshow.Controls != ControlStyle.None) {
            content += addControls();
        }
       

        //create frame
        var frame = document.createElement("iframe");
        if (slideshow.CssClass === "" && slideshow.Size === FixedSize.None) {
            slideshow.Size = FixedSize.Small;
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
        
        var stylesheet = "<link rel='stylesheet' href='../Content/CSS/SlideShow.css'  />"
        var fonts = (slideshow.Controls != ControlStyle.None) ? "<link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css'>" : "";
        frame.contentWindow.document.open('text/html', 'replace');
        frame.contentWindow.document.write(stylesheet + fonts +  content + jquery + SlidShowscript + CustomScript );
        frame.contentWindow.document.close();
        return new SlideShowRemote(slideshow,frame);
    }


    var createMedia = (item: Slide) => {
        if (item.Type !== MediaType.video) {
            var image: any = document.createElement("img");
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

        var vid: any = document.createElement("video");
        vid.className = "background";
        var source: any = document.createElement("source");
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

    }

    var getSizeStyle = (size:FixedSize) => {
        switch (size) {
            case FixedSize.Small:
                return "height:200px;width:300px";
            case FixedSize.Medium:
                return "height:350px;width:500px";
            case FixedSize.Large:
                return "height:550px;width:900px";
            case FixedSize.Fullscreen:
                return "position: fixed;top: 0;left: 0;width: 100%;height: 100%;"
            default:
                return "";
        }
    }

    var addControls = () => {      
        var controlsString = '<div id="controlBar" >' +
            '<button id="play" class="control-button" title= "play" > <i class="fa fa-play" > </i></button>' +
            '<button id="stop" class="control-button" title= "stop" >' +
            '<i class="fa fa-stop" > </i> </button>' +
            '<button id="replay" class="control-button" title= "replay">' +
            '<i class="fa fa-repeat" > </i>' +
            '</button>' +
            '</div>';
        return controlsString;
        
    }

    var buildCustomScript = (sd: SlideShow) => {
        var scriptStartTag = "<script type='text/javascript'>";
        var sdObj = "var slideShowObject =" + JSON.stringify(sd) + ";" + "\n\n\n";
        var controlsBehavior = sd.Controls == ControlStyle.None ? "" :
            "$('#play').click(function(){Play(slideShowObject);});" +
            "$('#stop').click(function(){Stop(slideShowObject);});" +
            "$('#replay').click(function(){Replay(slideShowObject);});"
        controlsBehavior+= sd.Controls != ControlStyle.Hover ? "" :
            "$('#controlBar').css('bottom','-5%');"+
            "$('body').on('mouseover',function(){$('#controlBar').css('bottom', '0');});" +
            "$('body').on('mouseout',function(){$('#controlBar').css('bottom', '-5%');});";
        var scriptEndTag = "</script>";
        return scriptStartTag + sdObj + controlsBehavior + scriptEndTag;
    }   
       
}


