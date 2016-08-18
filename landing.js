var bpath = "images/";

function startNext(sd){
    sd.Start();
}

function goHome(){
    location.href="/Eldritch-Media-Slides/home";
}

var slides1 = [6,7,8,9].map(function(e){return {path:bpath+"img"+e+".jpg",lifetime:2}});
var slides2 = [11,12,13,14].map(function(e){return {path:bpath+"img"+e+".jpg",lifetime:2}});
var slides3 = [0,1,2,4].map(function(e){return {path:bpath+"img"+e+".jpg",lifetime:2}});
var slides4 = [16,17,18,19].map(function(e){return {path:bpath+"img"+e+".jpg",lifetime:2}});

var sd1 = EldritchSlideShow.Create("#one",{Slides:slides1,Poster:bpath+"1.PNG",CssClass:"quarter",Animations:3,Filters:3});
var sd2 = EldritchSlideShow.Create("#two",{Slides:slides2,Poster:bpath+"2.PNG",CssClass:"quarter",Animations:3,backgroundbetween:true,BackGrounds:["eldritch.jpg"]});
var sd3 = EldritchSlideShow.Create("#three",{Slides:slides3,Poster:bpath+"3.PNG",CssClass:"quarter",Animations:3,Filters:2});
var sd4 = EldritchSlideShow.Create("#four",{Slides:slides4,Poster:bpath+"4.PNG",CssClass:"quarter",Animations:3});

document.addEventListener("DOMContentLoaded",function(){
    
    document.body.style.display="inline";
    sd1.SetCallBack({Function:"startNext",Params:[sd2]});
    sd2.SetCallBack({Function:"startNext",Params:[sd3]});
    sd3.SetCallBack({Function:"startNext",Params:[sd4]});
    sd4.SetCallBack({Function:"startNext",Params:[sd1]});
    sd1.Start();
});
