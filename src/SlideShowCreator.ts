/// <reference path="typings/jquery/jquery.d.ts" />
module EldritchSlideShow {

    /**********************    data      *************************/

    declare var Howl: any;

    export var configOptions = { scriptPath: "", stylePath: "" };

    export var Config = (property: string, value: string) => {
        if (!(property in EldritchSlideShow.configOptions)) {
            console.error("property " + property + " does not exist in Eldritch Slide Show configuration");
            return;
        }
        EldritchSlideShow.configOptions[property] = value; 
    }

    var documentationPath = "http://";

    
    export class SlideShow
    {

        //public input properties
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
        CallBack: {} = { Function: "", Params: [] };
        Poster: string = "";
        AllowUnsafe: boolean = false;

        //private
        SlideSegments: Array<Object> = [];
        AudioObject: Object;
        ConstructionSuccessful: boolean = true;

        

        checkArray = (name, object) => {
            if (!Array.isArray(object)) {
                console.error(name + " should be an array, instead it is " + typeof (object) + " check your input or look at documentation at "+documentationPath);
                return false;
            }  
            return true;
        } 

        fixRange = (min, max, value, name) => {
            if (isNaN(value)) {
                console.error(name + " should be a number, instead it is " + typeof (value) + " please check the documentation at " + documentationPath);
                return false;
            }
            if (value < min || value > max) {
                console.error(name + " is out of range should be between " + min + " to" + max + "please check the documentation at " + documentationPath);
                return false;
            }
            return true;
        }

        checkBool = (input, name) => {
            var success = true;
            if (typeof (input) != "boolean") {
                console.error(name + " should be only true/false, instead it is " + typeof (input) + " please read documentation at " + documentationPath);
                success = false;
            }
            return success;
        }

        checkObject = (input, name) => {
            var success = true;
            if (typeof (input) != "object") {
                console.error(name + " should be and object of the proper type, instead it is " + typeof (input) + " please read documentation at " + documentationPath);
                success = false;
            }
            return success;
        }

        checkString = (input,name) => {
            var success = true;
            if (typeof (input) != "string") {
                console.error(name + " should be a string of characters, instead it is " + typeof (input)+ " please read documentation at " + documentationPath);
                success = false;
            }
            return success;
        }

        checkCallBack = (input) => {
            if (!this.checkObject(input, "CallBack"))
                return false;
            if (typeof (input.Function) !== "string") {
                console.error("CallBack.Function should be a string name of a function, instead it is " + typeof (input.Function) + " please read documentation at " + documentationPath);
                return false;
            }
            if (!this.checkArray("Params",input.Params)) {
                return false;
            }
            return true;
        }

        Properties: Array<string> = ["Images", "Slides", "SlideTexts", "Backgrounds", "Animations", "Filters",
                                     "TextStyles", "TextAnimes", "Size", "Audio", "Loop", "Controls"
                                     , "backgroundbetween", "CssClass", "CallBack","Poster"];

        inputValidationHandlers = {
            Images: (input: Array<string>) => { return this.checkArray("Images", input) && input.every(e => this.checkString(e, e)); },
            Slides: (input: Array<Slide>) => { return this.checkArray("Slides", input) && input.every(e => this.checkObject(e, e)); },            
            SlideTexts: (input) => { return this.checkArray("SlideTexts", input) && input.every(e => this.checkObject(e, e)); },
            Backgrounds: (input) => { return this.checkArray("Backgrounds", input) && input.every(e => this.checkObject(e, e)); },
            Animations: (input) => { return this.fixRange(0, 4, input, "Animations"); },
            TextStyles: (input) => { return this.fixRange(0, 4, input, "TextStyles"); },
            TextAnimes: (input) => { return this.fixRange(0, 3, input, "TextAnimes"); },
            Size: (input) => { return this.fixRange(0, 4, input, "Size"); },
            Filters: (input) => { return this.fixRange(0, 3, input, "Filters"); },
            Controls: (input) => { return this.fixRange(0, 2, input, "Controls"); },
            CallBack: (input) => {return this.checkCallBack(input);},
            Audio: (input) => { return this.checkString(input, "Audio"); },
            Loop: (input) => { return this.checkBool(input,"Loop"); },
            CssClass: (input) => { return this.checkString(input, "CssClass"); },
            backgroundbetween: (input) => { return this.checkBool(input, "backgroundbetween"); },
            Poster: (input) => { return this.checkString(input, "Poster"); }
        }

        handlePropertyNames = (propObj) => {
            var success = true;
            for (var prop in propObj) {
                if (this.Properties.indexOf(prop) < 0) {
                    console.error(prop + " is not a valid parameter for an Eldritch media slideshow, check your spelling, check that your properties are cased correctly or check" +
                        " the documentation at ");
                    success = false;
                }
            }
            return success;
        }
        
        handlePropertyInputs = (propObj) => {
            var success = true;
            for (var prop in propObj) {
                var result = this.inputValidationHandlers[prop](propObj[prop]);  
                success = success && result;             
            }
            return success;
        }
                                   
        constructor(slideshow: SlideShow) {
            if (this.handlePropertyNames(slideshow) && this.handlePropertyInputs(slideshow)) {
                for (var prop in slideshow) {
                    this[prop] = slideshow[prop];
                }                
            }
            else {
                this.ConstructionSuccessful = false;
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
            if (!this.slideShow.inputValidationHandlers["Images"](images)) {
                return;
            }
            images.forEach(e => this.slideShow.SlideSegments.push(e));
            this.targetFrame.contentWindow["AddImages"](images);
        }

        AddSlides = (slides: Array<Slide>) => {
            if (!this.slideShow.inputValidationHandlers["Slides"](slides)) {
                return;
            }
            slides.forEach(e => this.slideShow.SlideSegments.push(e));
            this.targetFrame.contentWindow["AddSlides"](slides);
        }

        AddSlideTexts = (texts: Array<SlideTitles>) => {
            if (!this.slideShow.inputValidationHandlers["SlideTexts"](texts)) {
                return;
            }
            texts.forEach(e => this.slideShow.SlideTexts.push(e));
            this.targetFrame.contentWindow["AddSlideTexts"](texts);
        }


        AddBackGrounds = (backGrounds: Array<BackGround>) => {
            if (!this.slideShow.inputValidationHandlers["Backgrounds"](backGrounds)) {
                return;
            }
            backGrounds.forEach(e => this.slideShow.Backgrounds.push(e));
            this.targetFrame.contentWindow["AddBackGrounds"](backGrounds);
        }

        SetAnimationLevel = (level: AnimationLevel) => {
            if (!this.slideShow.inputValidationHandlers["Animations"](level)) {
                return;
            }
            this.slideShow.Animations = level;
            this.targetFrame.contentWindow["SetAnimationLevel"](level);
        }

        SetFilters = (level: FilteringLevel) => {
            if (!this.slideShow.inputValidationHandlers["Filters"](level)) {
                return;
            }
            this.slideShow.Filters = level;
            this.targetFrame.contentWindow["SetFilters"](level);
        }

        SetTextStyles = (level: TextStyleOptions) => {
            if (!this.slideShow.inputValidationHandlers["TextStyles"](level)) {
                return;
            }
            this.slideShow.TextStyles = level;
            this.targetFrame.contentWindow["SetTextStyles"](level);
        }

        SetTextAnimes = (level: TextAnimationsLevel) => {
            if (!this.slideShow.inputValidationHandlers["TextAnimes"](level)) {
                return;
            }
            this.slideShow.TextAnimes = level;
            this.targetFrame.contentWindow["SetTextAnimes"](level);
        }

        SetSize = (size: FixedSize) => {
            if (!this.slideShow.inputValidationHandlers["Size"](size)) {
                return;
            }
            var sizeStyle = getSizeStyle(size);
            var style = document.createAttribute("style");
            style.value = getSizeStyle(size);
            this.targetFrame.setAttributeNode(style);
        }

        SetAudio = (audio: string) => {
            if (!this.slideShow.inputValidationHandlers["Audio"](audio)) {
                return;
            }
            this.slideShow.Audio = audio;
            this.targetFrame.contentWindow["SetAudio"](audio);
        }

        SetVolume = (volume: number) => {
            if (isNaN(volume) || volume < 0 || volume > 100 ) {
                console.error("volume should be a number in range 0 - 100. please look at documentatio at" + documentationPath);
                return;
            }
            this.targetFrame.contentWindow["SetVolume"](volume);
        }

        SetCallBack = (CallBackObject: Object) => {
            if (!this.slideShow.inputValidationHandlers["CallBack"](CallBackObject)) {
                return;
            }
            this.slideShow.CallBack = CallBackObject;
            this.targetFrame.contentWindow["SetCallBack"](CallBackObject);
        }

        SetLoop = (loop: boolean) => {
            if (!this.slideShow.inputValidationHandlers["Loop"](loop)) {
                return;
            }
            this.slideShow.Loop = loop;
            this.targetFrame.contentWindow["SetLoop"](loop);
        }

        SetBackgroundBetween = (showBackground: boolean) => {
            if (!this.slideShow.inputValidationHandlers["backgroundbetween"](showBackground)) {
                return;
            }
            this.slideShow.backgroundbetween = showBackground;
            this.targetFrame.contentWindow["SetBackgroundBetween"](showBackground);
        }


        SetCssClass = (CssClass: string) => {
            if (!this.slideShow.inputValidationHandlers["CssClass"](CssClass)) {
                return;
            }
            this.targetFrame.className = CssClass;
        }

    }


    enum AnimationLevel {
        None, Basic, Standard, All
    }

    enum FilteringLevel {
        None, Basic, Standard ,All
    }

    enum TextStyleOptions {
        Normal, Basic, Advanced,Flamboyant
    }

    enum TextAnimationsLevel {
        None, Basic, All
    }

    export enum FixedSize {
        None,Small, Medium, Large, Fullscreen
    }

    enum MediaType {
        image, video
    }

    export enum ControlStyle {
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


    export var Create = (param1,param2) => {
        var sd: SlideShow;
        var container;
        //1: object
        if (typeof (param1) === "object") {
            container = document.createElement("div");
            document.body.appendChild(container);
            sd = param1;
        }
        // 1: container string 2: object
        else
        {
            var containerString: string = param1;
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
            content += "<img class='Poster'  src='" + slideshow.Poster +"' />"
        }

        content += "<div id='allContent'>";
        //add slides
        var containerDiv = document.createElement("div");
        containerDiv.id = "containerDiv";
        slides.reverse().forEach((e) => { containerDiv.appendChild(e); });

        //add Texts
        content += containerDiv.outerHTML;
        slideshow.SlideSegments = slideshow.Images.map(function (e) { return { path: e }; }).concat(slideshow.Slides);
;
        if (slideshow.Slides.some((e) => { return !!e.text; })) {
            content += "<span id='textForSlides' class='subtitles'></span>";
        }
        if (slideshow.SlideTexts.length > 0) { 
            content += "<span id='freeTexts' class='freeTexts'></span>";
        }
        content += "</div>";

       //add controls
        if (slideshow.Controls != ControlStyle.None) {
            content += addControls(slideshow.Audio);
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
        // var stylesheet = "<link rel='stylesheet' href='https://rawgit.com/oryaniv/Slideshow-widget/master/SlideShow.css'  />"

        var SlidShowscript = "<script src='../Scripts/SlideRun.js'></script>";
        var insertObj = insertSdObject(slideshow);
        var CustomScript = "<script src='../Scripts/SlideResource.js'></script>";

        var jquery = "<script type='text/javascript' src='https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js'></script>";
       
        var flowType = "<script src='../Scripts/flowType.js'></script>";
        var stylesheet = "<link rel='stylesheet' href='../Content/CSS/SlideShow.css'  />";
        var animationRepository = "<script src='../Scripts/AnimationRepository.js'></script>";
        var animatecss = "<link rel='stylesheet' href='../Content/CSS/animate.css'/>";
        var rangeSliderjs = "<script src='../Scripts/rangeslider.min.js'></script>"
        var rangeSliderCss = "<link rel='stylesheet' href='../Content/CSS/rangeslider.css'/>";
        var howler = '<script src="https://cdnjs.cloudflare.com/ajax/libs/howler/1.1.29/howler.min.js" ></script>'
        var fonts = (slideshow.Controls != ControlStyle.None) ? "<link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css'>" : "";

        frame.contentWindow.document.open('text/html', 'replace');
        frame.contentWindow.document.write(
            stylesheet +
            animatecss +
            fonts +
            rangeSliderCss +
            content +
            jquery +
            flowType +
            howler +
            animationRepository +
            SlidShowscript +
            insertObj +
            rangeSliderjs +
            CustomScript
        );
        frame.contentWindow.document.close();
        return new SlideShowRemote(slideshow,frame);
    }

    var createErrorFrame = (container) => {
        var errorDiv = document.createElement("div");
        var errorDivStyle = document.createAttribute("style");
        errorDivStyle.value = "box-sizing: border-box;height:12.5rem;width:19rem;padding: 20px;overflow: hidden; border: 2px solid rgba(247,14,14,1);" +
        " font: normal 12px/1 Arial Black, Gadget, sans-serif;color: rgba(113,4,4,1);background: rgba(255,86,86,0.89);text-align:center;"
        errorDiv.setAttributeNode(errorDivStyle);
        errorDiv.innerHTML = "<h1>Whoops!</h1><br/><div>seems like you have passed bad input, " +
        "and the media slide could not be created. please check developer tools console (F12 => console) for more information</div>"
        container.appendChild(errorDiv);
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
                return "height:12.5rem;width:19rem;";
            case FixedSize.Medium:
                return "height:22rem;width:31rem";
            case FixedSize.Large:
                return "height:38rem;width:56rem";
            case FixedSize.Fullscreen:
                return "position: fixed;top: 0;left: 0;width: 100%;height: 100%;";
            default:
                return "";
        }
    }

    var addControls = (audio:string) => {
        var volumeControl = !audio ? "" : '<span id="volume"   onmouseover= "showVolumeSlider();" onmouseout= "hideVolumeSlider();" > <i class="fa fa-volume-up"> </i></span>' +
            '<input type="range" id="range" min="0"  max="100" step="5" data-orientation="vertical"  />';
        var controlsString = '<div id="controlBar" >' +
            '<button id="play" class="control-button" title= "play" > <i class="fa fa-play" > </i></button>' +
            '<button id="stop" class="control-button" title= "stop" >' +
            '<i class="fa fa-stop" > </i> </button>' +
            '<button id="replay" class="control-button" title= "replay">' +
            '<i class="fa fa-repeat" > </i>' +
            '</button>' +
             volumeControl+
            '</div>';

        return controlsString;
        
    }


    var insertSdObject = (sd: SlideShow) => {
        var scriptStartTag = "<script type='text/javascript'>";
        var sdObj = "var slideShowObject =" + JSON.stringify(sd) + ";" + "\n\n\n";
        var scriptEndTag = "</script>";
        return scriptStartTag + sdObj + scriptEndTag;
    }
   
    var adjustControlsToSize = (size: FixedSize) => {
        switch (size) {
            case FixedSize.Large:
                return "$('#controlBar').css('height','5%');$('control-button').each(function(){$(this).css('width','5%')};);"
            case FixedSize.Fullscreen:
                return "$('#controlBar').css('height','5%');$('control-button').each(function(){$(this).css('width','5%')};);"
            default:
                return "";
        }
    }

    var CreateLoadingScreen = () => {
        return "<div id='loading'  style='background-color:black; position:fixed;top:0;left:0;width:100%;height:100%;z-index:1500;overflow: hidden;background: radial-gradient(circle, rgba(12,99,21,0.2) 0, rgba(12,99,21,0.2) 7%, rgba(4,12,79,1) 50%, rgba(4,12,79,1) 100%);'>" +
            "<h1 style='color:red;text-align:center;font: normal 2em/2 Comic Sans MS, cursive, sans-serif;letter-spacing: 3px;'>"+
                    "Loading the Awesome!" +
                "</h1>" +
               "</div>";
    }
}


