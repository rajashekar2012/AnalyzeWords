/*function analyze(e){

    var text=document.getElementById("txtData").value;
    var counter=text.length-1; //no of charecters
    var arr=[]; //array to hold all
    var baseChar=97; //char code for a
    var t1="";


    //create array
    for(var i=0;i<26;i++){
            arr[i]=new Object({char:String.fromCharCode(baseChar+i) ,frquency:0});
        }


    while(counter>=0)
        {
            t1= text[counter].charCodeAt(0)-baseChar; 

            if(t1<0 || t1>25) // neglect other than alphabets
                ;
            else
                arr[t1].frquency=arr[t1].frquency+1;

            counter--;
        }

}
*/

//global variables
window.analyzer=window.analyzer||{};

//default initializations
$(function(){

    $("#cb_OnlyAlpha").checkbox("check");
    $("#cb_CombineCase").checkbox("check");

    updateConfiguration();
})



function updateConfiguration () {
    //wa:word analyzer

    window.analyzer.waConfig={
        combineCase:$("#cb_CombineCase").checkbox("is checked"),
        onlyAlpha:$("#cb_OnlyAlpha").checkbox("is checked"),
    }
}
function analyze (e) {

    //check if text entered 
    if(document.getElementById("txtData").value==""){
        alert("place your text and click on analyze (:)");
        return;
    }

    cleanOld();

    var data=$("#txtData").val();
    var words=extractWords(data);
    var chars=extractCharecters(data);

    //bind counts to labels
    $("#spnTotalWordsCount").html(words.totalWCount);
    $("#spnTotalCharsCount").html(chars.totalCharCount);

    //convert to arrays
    var charsArray=[];
    for(var i in chars.charFreq){
        charsArray.push(chars.charFreq[i]);
    }

    window.analyzer.data={
        words:words.wordsFreq,
        chars:charsArray
    };

    //binding functions
    bind_wordCount(words.wordsFreq);

    bind_CharecterCount(charsArray);
    draw_CharecterFrequency(charsArray);


}

//:>> word analysis
function extractWords (text) {
    //:>> words (separated by space or . or by ,)
    var words=text.split(" ").join(",")
    .split(".").join(",")
    .split(",");

    var wordObj= {};//[words.length];
    var totalWCount=words.length;

    for(var i=0;i<words.length;i++){

        var cw=words[i].toLowerCase();

        //:>> exclude spaces
        if(cw.trim()==""){
            totalWCount=totalWCount-1;
            continue;
        }


        //:>>if word already exists increment count else create new 
        if(wordObj[cw])
            wordObj[cw].count=wordObj[cw].count+1;
        else
            wordObj[cw]={ value:cw,count:1 }
    }

    return {
        totalWCount:totalWCount,
        wordsFreq:wordObj
    }; 
}

function extractCharecters (text) {

    //eliminate non alphabets
    var charObj={},totalCharCount=0;
    for(var i=0;i<=text.length-1;i++){

        var ch=text[i].toLowerCase();


        //:>> exclude spaces
        if(ch.trim()=="")
            continue;


        //apply rules
        if(window.analyzer.waConfig.onlyAlpha)
            if(!isAlpha(ch))continue;

        totalCharCount++;
        if(charObj[ch])
            charObj[ch].count=charObj[ch].count+1;
        else
            charObj[ch]={ value:ch,count:1 }
    }

    return {
        totalCharCount:totalCharCount,
        charFreq:charObj
    };
}

//:>>binding functions==> data binding functions
function bind_wordCount(data){

    var html="";

    for(var i in data){

        html=html+ '<div class="ui label">'
            + data[i].value 
            + '<div class="detail">'+ data[i].count 
            + '</div></div>'

        html=html.trim();
    }

    $("#divWordCount").html(html);

}

function bind_CharecterCount (data) {

    //clear old if rebind
    $("#divCharCount").html("");

    var html="";

    for(var i=0;i<data.length;i++){

        html=html+ '<a class="ui label" onclick="showSelectChar(this)">'
            + data[i].value 
            + '<div class="detail">'+ data[i].count 
            + '</div> </a>'

        html=html.trim();
    }

    html='<div class="ui blue labels">'+html+'</div>';

    $("#divCharCount").html(html);

}

function draw_CharecterFrequency (data) {

    var graphData=[{
        key:"charecter frequency",
        values:data
    }];

    nv.addGraph(function() {
        var chart = nv.models.discreteBarChart()
        .x(function(d) { return d.value })    //Specify the data accessors.
        .y(function(d) { return d.count })
        .showValues(true).valueFormat(d3.format(",f"));
        //.staggerLabels(true)    //Too many bars and not enough room? Try staggering labels.
        //.tooltips(false)        //Don't show tooltips
        //.showValues(true)       //...instead, show the bar value right on top of each bar.
        //.transitionDuration(350);

        chart.yAxis.tickFormat(d3.format(',f'));

        d3.select('#divCharFreqGraph svg')
            .datum(graphData)
            .call(chart);

        nv.utils.windowResize(chart.update);

        return chart;
    });
}


function showSelectChar (el) {
    debugger;

    $(el).popup('show')
}
//:>> --------------------------- utils function  ------------------------------------------

//return weather the charecter is an alphbet or not
function isAlpha (ch) {

    var isChar=false;
    var charcode;

    if(ch){
        charcode = ch.charCodeAt(0);
        if((charcode>=65 && charcode<=90)||(charcode>=97 && charcode<=122))
            isChar=true;
    }
    return isChar;
}

//:>> --------------------------- utils function  ------------------------------------------



function cleanOld(){
    $("#divWordCount").html("");
    $("#divCharCount").html("");
}