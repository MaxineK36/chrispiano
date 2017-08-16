console.log("10:32")

var note0on=0;
var note1on=0
var note2on=0
var note3on=0
var note4on=0
var note5on=0
var note6on=0
var note7on=0
var note8on=0
var note9on=0
var note10on=0
var note11on=0
var note12on=0

var notes = ["A","Bb","B","C","Db","D","Eb","E","F","Gb","G","Ab"]
var onOff = [note0on,note1on,note2on,note3on,note4on,note5on,note6on,note7on,note8on,note9on,note10on,note11on,note12on]
var freqs = [440,466.164,493.883,523.251,554.365,587.33,622.254,659.255,698.456,739.989, 783.991,830.609,880]
var colors = ["219,85,73","241,150,51","247,194,56","255,231,78","194,213,62","137,176,58","21,151,144","61,132,181","91,83,143","146,79,143","214,84,129","221,69,90"]
var chrisColors = ["20,20,20","50,50,50","0, 102, 255","255,0,255","0,204,0","102,51,0","102,0,255","255,0,0","255, 102, 0","255,255,255","220,220,220","255,255,0"]
var notesPlayed = [];

var colorMethod = 'notes';
var currentKeyChange = 0;



var recVar
function record(){
    recVar = setInterval(function(){ recordNotes(); }, 100);
    document.getElementById("recordingTable").style.color = "white"


}

function unRecord(){
    clearInterval(recVar);
    console.log(notesPlayed)
}

function recordNotes(){
    var row = document.createElement("tr")
    var theseNotes = []
    for (var i =0; i<13; i++){
        var cell = document.createElement("td")
        cell.classList.add('recCell');
        if (onOff[i]==1){
            theseNotes.push(1)
            cell.style.border = "solid 0.5px white"

            // cell.style.backgroundColor = "white"
            if (colorMethod=='intervals'){
                cell.style.backgroundColor = colorMe(chrisColors[i],1)
            }
            else{
                cell.style.backgroundColor = colorMe(document.getElementById("note"+i).value,1)
            }
        }
        else if (onOff[i]==0){
            theseNotes.push(0)
        }
        row.appendChild(cell)
    }
    notesPlayed.push(theseNotes)
    document.getElementById("recordingTable").appendChild(row)
}

function playback(){
    var counter = 0
    var length = notesPlayed.length
    playVar = setInterval(function(){ 
        recordNotes(); 
        for (var j = 0; j<13; j++){
            if (notesPlayed[counter][j]==1){
                eval("note"+j).play()
            }
            else{
                eval("note"+j).stop();
            }
        }
        counter++
        console.log(counter)
        if (counter==length){
            console.log('clearing')
            clearInterval(playVar);
        }
    }, 100);    
}


//keydown functions (make the notes start playing, allow for arrow keys to be used for octaves up or down)
document.addEventListener("keydown", function(event) {
	var tempKey = String.fromCharCode(event.keyCode)
    console.log(tempKey)
    var key = event.keyCode
    if ((key==189)||(key==45)){
        notePressed("note11")
    }
    else if ((key==187)||(key==61)){
        notePressed("note12")
    }
    else if (key==192){
        notePressed("note0")
    }
    else if (key==48){
        notePressed("note10")
    }
    else if (key==38){
        changeOctave(1)
    }
    else if (key==40){
        changeOctave(-1)
    }
    else if (key==37){
        changeKey(-7,1)
        //left arrow key
    }
    else if (key==39){
        changeKey(7,1)
        //right arrow key
    }
    if((isNaN(tempKey)==false)&&(Number(tempKey)>0)){
       notePressed("note"+tempKey)
     }
})

//keyup functions (they make the notes stop playing)
document.addEventListener("keyup", function(event) {
    var tempKey = String.fromCharCode(event.keyCode)
    var key = event.keyCode
    if (key==189){
        noteUnpressed("note11")
    }
    else if (key==187){
        noteUnpressed("note12")
    }
    else if (key==192){
        noteUnpressed("note0")
    }
    else if (tempKey==0){
        noteUnpressed("note10")
    }
    if((isNaN(tempKey)==false)&&(Number(tempKey)>0)){
        noteUnpressed("note"+tempKey)
     }
})



//add in notes
for (var i=0; i<13; i++){
	var button = document.createElement("button");
	button.innerHTML = i
	button.title = i
	button.id = "note"+i
	button.classList.add('note');
    //value is being used for color
    button.addEventListener("mousedown", function(event) {
        notePressed(this.id)
    })
    button.addEventListener("mouseup", function(event) {
        noteUnpressed(this.id)
    })
	document.getElementById("keys").appendChild(button)
}

//add in key change buttons
for (var i=0; i<12; i++){
	 var button = document.createElement("button");
	 button.innerHTML = notes[i]
	 button.id = "key" + i
     button.value = i
	 button.classList.add('key');
 	 button.onclick = function(){
 	 	changeKey(this.value,0)
 	 } 
	 document.getElementById("keyChanges").appendChild(button)
}

//creating note objects, originally set to 0 = A
var note0 = new Pizzicato.Sound({ 
    source: 'wave', 
    options: {
        frequency: 440,
    }
	});

var note1 = new Pizzicato.Sound({ 
    source: 'wave', 
    options: {
        frequency: 466.164,
    }
	});

var note2 = new Pizzicato.Sound({ 
    source: 'wave', 
    options: {
        frequency: 493.883,
    }
	});

var note3 = new Pizzicato.Sound({ 
    source: 'wave', 
    options: {
        frequency: 	523.251
    }
	});

var note4 = new Pizzicato.Sound({ 
    source: 'wave', 
    options: {
        frequency: 554.365
    }
	});

var note5 = new Pizzicato.Sound({ 
    source: 'wave', 
    options: {
        frequency: 587.33
    }
	});

var note6 = new Pizzicato.Sound({ 
    source: 'wave', 
    options: {
        frequency: 622.254	
    }
	});

var note7 = new Pizzicato.Sound({ 
    source: 'wave', 
    options: {
        frequency: 659.255	
    }
	});

var note8 = new Pizzicato.Sound({ 
    source: 'wave', 
    options: {
        frequency: 698.456	
    }
	});

var note9 = new Pizzicato.Sound({ 
    source: 'wave', 
    options: {
        frequency: 739.989		
    }
	});

var note10 = new Pizzicato.Sound({ 
    source: 'wave', 
    options: {
        frequency: 783.991	
    }
	});

var note11 = new Pizzicato.Sound({ 
    source: 'wave', 
    options: {
        frequency: 830.609	
    }
	});

var note12 = new Pizzicato.Sound({ 
    source: 'wave', 
    options: {
        frequency: 880
    }
	});

//sets the colors as intervals (grey notes, change to chris's colors) or notes (A is always red, etc.)

setColors('notes');

function setColors(method){
    if (method=="notes"){
        colorMethod = "notes"
        for (var i=0; i<13; i++){
            var tempColor = colors[(i%12)]
            document.getElementById("note"+i).value = tempColor
            document.getElementById("note"+i).style.backgroundColor = colorMe(tempColor,0.4)
        }
    }
    else if (method=="intervals"){
        colorMethod = "intervals"
        for (var i=0; i<13; i++){
            var tempColor = chrisColors[(i%12)]
           document.getElementById("note"+i).value = tempColor
           document.getElementById("note"+i).style.backgroundColor = colorMe("190, 190, 190",1)
        }
    }
}

//increase or decrease the octave by changing frequencies
function changeOctave(value){
    checkFrequencies()
	if (value==1){
		for (var i =0; i<13; i++){
			eval("note"+i).frequency = eval("note"+i).frequency*2
		}
	}
	else if (value==-1){
		for (var i =0; i<13; i++){
			eval("note"+i).frequency = eval("note"+i).frequency*0.5
		}
	}
}

function notePressed(noteName){
    var num = (noteName.split("e").pop());
    onOff[num] = 1
    eval(noteName).play();
    var currentColor = document.getElementById(noteName).value
    document.getElementById(noteName).style.backgroundColor = colorMe(currentColor,1)
}

function noteUnpressed(noteName){
    var num = (noteName.split("e").pop());
    onOff[num] = 0
    eval(noteName).stop();
    var currentColor = document.getElementById(noteName).value
    document.getElementById(noteName).style.backgroundColor = colorMe(currentColor,0.4)
    if (colorMethod=="intervals"){
         document.getElementById(noteName).style.backgroundColor = colorMe("190,190,190",1)
    }
}

function colorMe(color,transparency){
    var array = String(color).split(",")
    var newColor = String("rgba("+array[0]+","+array[1]+","+array[2]+","+transparency+")")
    return newColor;
}

//increases or decreases the key
function changeKey(multiplierStr,noteless){
    checkFrequencies()
    var multiplier = Number(multiplierStr)+(currentKeyChange*noteless)
    for (var i=0; i<13; i++){
        var color = Math.abs(Number((2400+i+multiplier))%12);
        if (colorMethod=='notes'){
            document.getElementById("note"+i).style.backgroundColor = colorMe(colors[color],0.4)
            document.getElementById("note"+i).value = colors[color]
        }
        
        eval("note"+i).frequency = freqs[i]*Math.pow(1.05946, multiplier);
        document.getElementById("key"+(i%12)).style.backgroundColor = "white";  
    }
    currentKeyChange = multiplier
    document.getElementById('key'+((currentKeyChange+2400)%12)).style.backgroundColor = "rgb(110,110,110)";
}

//makes sure frequencies are within human range
function checkFrequencies(){
    if ((note0.frequency<20)||(note12.frequency>20000)){
        confirm("You've gone outside the frequency range of the human ear. This message will continue to pop up until you are back within the normal hearing range. To get there, click on any of the key buttons, or use the arrow keys (left/down = lower, right/up = higher).")
    }

}
