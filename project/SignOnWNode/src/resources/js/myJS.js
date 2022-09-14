// Global? Vars 
var code = Math.floor(Math.random() * (999999-100000) +100000);
var user; //This will have to be an array



// This wont work!! Generates a different code than below. Need to get from database here instead.
function gameCode(){
    try{
        document.getElementById("dispCode").innerHTML = code;
    } catch(err){
        if(err){
            console.log('oh');
        }
    }
}

function openStart1(evt, userName){
    console.log(evt);
    var keyCode = evt ? (evt.which ? evt.which : evt.keyCode) : evt.keyCode;
        if(keyCode == 13)
        {
            user = userName;
            console.log(user);
            // document.getElementById("codeLink").click();
            window.open('../../views/pages/gameStart1.html', '_self');
            // window.location.href(gameStart.html);
            // alert("The form was submitted");
            // location.href = "gameStart.html";
        }
    
}

function openUser2(evt, userName){
    console.log(evt);
    var keyCode = evt ? (evt.which ? evt.which : evt.keyCode) : evt.keyCode;
        if(keyCode == 13)
        {
            user = userName;
            console.log(user);
            // document.getElementById("codeLink").click();
            window.open('../../views/pages/pickUser2.html', '_self');
            // window.location.href(gameStart.html);
            // alert("The form was submitted");
            // location.href = "gameStart.html";
        }
    
}

function openUser1(){

    // console.log(code)
    // setTimeout(() => {  window.open('pickUser.html','_self'); }, 2000);
    window.open('../../views/pages/pickUser1.html','_self');
    // document.getElementById("dispCode").innerHTML = code;

}

function openCode(){

    // console.log(code)
    // setTimeout(() => {  window.open('pickUser.html','_self'); }, 2000);
    window.open('../../views/pages/enterCode.html','_self');
    // document.getElementById("dispCode").innerHTML = code;

}

