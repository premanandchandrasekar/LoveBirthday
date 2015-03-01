 
function search() {
    refreshParams();
    $.get(url, {'q': params}).then(function(res){
        var results = res.hits.hits;
        $("#searchform").html("");
        for(var i=0; i<results.length; i++){
            $("#searchform").append(render(results[i]));
        }
    });
}
 

function render(dict){
    var tmpl = _.template($("#template").html());
    return tmpl(dict);
}


var blu = false;
var occupation = "none";
var gender = "female";
var seniorMale = false;
var femalepregnant =false;
var femaledistress = false;
var seniorFemale = false;
var age = 0;
var state = 'karnataka';
var disability = false;
var calamity = false;
var losslife = false;
var lang = "en";

$("#r1, #r2").change(function () {
    if ($("#r1").attr("checked")) {
        blu = true;
    }
    else {
        blu = false;
    }  
    search();
});

$("#occu").change(function () {
    occupation =  $("#occu").val();
    search();
});

$("#lang").change(function () {
    lang =  $("#lang").val();
    search();
});

$("#male, #female").change(function () {
    if ($("#male").attr("checked")) {
       gender = 'male';
    }
    else {
       gender = 'female';
    }
    search();
});

$('#malesenior').change(function() {
    if($(this).is(":checked")) {
        seniorMale = true;
    }
    else{
        seniorMale = "false";
    }
    search();
});

$('#disability, #calamity, #losslife').change(function() {
    if($('#disability').is(":checked")) {
        disability = true;
    }
    else{
        disability = false;
    }
    
    if($('#calamity').is(":checked")) {
        calamity = true;
    }
    else{
        calamity = false;
    }      
         
    if($('#losslife').is(":checked")) {
        losslife = true;
    }
    else{
        losslife = false;
    }    
    search();     
});

$('#femalesenior, #femaledistress, #femalepregnant').change(function() {
    if($('#femalesenior').is(":checked")) {
        seniorFemale = true;
    }
    else{
        seniorFemale = false;
    }
    
    if($('#femaledistress').is(":checked")) {
        femaledistress = true;
    }
    else{
        femaledistress = false;
    }      
         
    if($('#femalepregnant').is(":checked")) {
        femalepregnant = true;
    }
    else{
        femalepregnant = false;
    }    
    search();     
});

$("#age").on('change keyup paste',function () {
    if ( $("#age").val().trim() != "") {
        age =  $("#age").val().trim();
    }
    else{
        age = 0;
    }
    search();
});


var url = '/api/latest/search';
var params = JSON.stringify({'bpl': blu,'occupation':occupation, 'gender':gender, 'state' : state});

function refreshParams(){
    params = [];
    
    if(blu){
        params.push("bpl");
    }
    
    if(gender == "male"){
        params.push("male men man");
        if(seniorMale){
            params.push("elderly");
        }
    }
    else{
        params.push("female women woman");
        if(femalepregnant){
            params.push("pregnant");
        }
        if(femaledistress){
            params.push("distress");
        }
        if(seniorFemale){
            params.push("elderly");
        }
    }
    
    if (occupation != "none"){
        params.push(occupation);
    }

    var qs = "";
    if (disability){
        qs += "disability ";
    }

    if (calamity){
        qs += "calamity ";
    }

    if (losslife){
        qs += "loss ";
    }
    if(qs.length != 0){
        params.push(qs.trim());
    }
    
    
    
    params = JSON.stringify({'terms': params,
                             'lang': lang});

}


function fillform(){
    $("#r2").click();
    $("#occu").val("softwareengineer");
    $("#male").click();
    $("#age").val("65");
    $("#malesenior").click();
}
