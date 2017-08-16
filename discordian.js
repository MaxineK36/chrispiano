console.log("10:32")

//value (1/0) determines whether or not a note is being played
var note0on=0
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
var onOff = [note0on,note1on,note2on,note3on,note4on,note5on,note6on,note7on,note8on,note9on,note10on,note11on,note12on]

//this is literally just used to create the buttons with key names
var notes = ["A","Bb","B","C","Db","D","Eb","E","F","Gb","G","Ab"]

//base frequencies (with A as default note0)
var freqs = [440,466.164,493.883,523.251,554.365,587.33,622.254,659.255,698.456,739.989, 783.991,830.609,880]

//base colors if they're note-based, where colors[0] is A
var colors = ["219,85,73","241,150,51","247,194,56","255,231,78","194,213,62","137,176,58","21,151,144","61,132,181","91,83,143","146,79,143","214,84,129","221,69,90"]

//colors if they're interval-based, where 0 is the base note, etc.
var chrisColors = ["20,20,20","50,50,50","0, 102, 255","255,0,255","0,204,0","102,51,0","102,0,255","255,0,0","255, 102, 0","255,255,255","220,220,220","255,255,0"]

//array is filled when recording
var notesPlayed = [];

//global variables to keep track of color method and current key 
var colorMethod = 'notes';
var currentKeyChange = 0;

//frequency of recordings
var recFreq = 100

//hide things
document.getElementById("clipping").style.display = "none"

//when the record button is pressed
var recVar
var playVar
var currentTime = 0;

function record(){
    //the record button turns red as you're recording and has a built-in timer
    document.getElementById("recordButton").style.backgroundColor="red"
    document.getElementById("recordButton").innerHTML="Record: "+currentTime+"s"

    //every 100 milliseconds, call the recordNotes function
    recVar = setInterval(function(){ recordNotes(); }, recFreq);
    
    //make the table visible by making the text white
    document.getElementById("recordingTable").style.color = "white"

    document.getElementById("clipping").style.display = "block"
}

function unRecord(){
    console.log(notesPlayed)
    //make the record button white again
    document.getElementById("recordButton").style.backgroundColor="white"

    //stop the loop
    clearInterval(recVar); 
}

function recordNotes(){
    //have the new timer show up
    document.getElementById("recordButton").innerHTML="Record: "+(currentTime/1000)+"s"
   
    //sets up the line of notes for the visualiation
    var row = document.createElement("tr")
    row.id = "row"+(currentTime/100)
    // console.log("row id "+row.id)

    //labels it
    var firstCell = document.createElement("td")
    firstCell.innerHTML = currentTime/1000
    firstCell.classList.add("recCell")
    firstCell.style.color = "white"
    row.appendChild(firstCell)

    var tempArray=[];
    for (var i =0; i<13; i++){
        var cell = document.createElement("td")
        cell.classList.add('recCell');
        if (onOff[i]==1){
            tempArray.push(1)
            cell.style.border = "solid 0.5px white"
            if (colorMethod=='intervals'){
                cell.style.backgroundColor = colorMe(chrisColors[i],1)
            }
            else{
                cell.style.backgroundColor = colorMe(document.getElementById("note"+i).value,1)
            }
        }
        else{
            tempArray.push(0)
        }
        row.appendChild(cell)
    }

    notesPlayed.push(tempArray)
    
    document.getElementById("recordingTable").appendChild(row)

    //increases the timer
    currentTime = currentTime+recFreq;
}


function playback(){
    document.getElementById("playbackButton").style.backgroundColor="rgb(110,110,110)"
    var counter = 0
    var length = notesPlayed.length

    playVar = setInterval(function(){ 
        for (var j = 0; j<13; j++){
            if (notesPlayed[counter][j]==1){
                notePressed("note"+j)
            }
            else{
                noteUnpressed("note"+j)
            }
        }
        counter++
        if (counter==length){
            document.getElementById("playbackButton").style.backgroundColor="white"
            console.log('clearing')
            clearInterval(playVar);
        }
    }, recFreq);  
    stopAll();  
}


function resetRec(){
    //reset the current name, the notesplayed array, and the recording table
    currentTime = 0;
    notesPlayed = [];
    document.getElementById("recordingTable").innerHTML = "<tr> <th> </th> <th>0</th> <th>1</th> <th>2</th> <th>3</th> <th>4</th> <th>5</th> <th>6</th> <th>7</th> <th>8</th> <th>9</th> <th>10</th> <th>11</th> <th>12</th> </tr>"

    //set the recording table text to black, get rid of the time on the record button
    document.getElementById("recordingTable").style.color = 'black'
    document.getElementById("recordButton").innerHTML = "Record"
}


function clip(){
    var start = (document.getElementById("startClip").value)*10
    var end = (document.getElementById("endClip").value)*10
    notesPlayed = notesPlayed.slice(start, end);

    for (var i=0; i<=currentTime/100; i++){
        if ((i<start)||(i>end)){
            document.getElementById("row"+i).style.display = "none"
        }
    }
    document.getElementById("startClip").value = null
    document.getElementById("endClip").value = null
}


//keydown functions (make the notes start playing, allow for arrow keys to be used for octaves up or down)
document.addEventListener("keydown", function(event) {
	var tempKey = String.fromCharCode(event.keyCode)
    console.log(tempKey)
    var key = event.keyCode
    if ((key==189)||(key==45)){
        notePressed("note11")
        //minus key
    }
    else if ((key==187)||(key==61)){
        notePressed("note12")
        //equals key
    }
    else if (key==192){
        notePressed("note0")
        //` key
    }

    //temp
    else if (key==77){
        console.log(notesPlayed)
        //` key
    }

    else if (key==48){
        notePressed("note10")
        //0 key
    }
    else if (key==38){
        changeOctave(1)
        //up arrow
    }
    else if (key==40){
        changeOctave(-1)
        //down arrow
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
       //number keys
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
    //label them with numbers, title them with numbers, add id's (note0, etc.), make them clickable, make them "note" class, add them to the keys div
    //note: the "value" attribute is used in the coloring function to store color values
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
    //creates buttons A-Ab that have the id key0, etc., have numbered values, are classified as keys, and change the key when clicked. 
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

//style the "A" button to be greyed out initially, as we are in the default key of A
document.getElementById("key0").style.backgroundColor="rgb(110,110,110)"


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

//set the colors as notes initially
setColors('notes');

//sets the colors as intervals (grey notes, change to chris's colors) or notes (A is always red, etc.)
function setColors(method){
    if (method=="notes"){
        //set the selected key to be greyed out
        document.getElementById('notes').style.backgroundColor = "rgb(110,110,110)";
        document.getElementById('intervals').style.backgroundColor = "rgb(255,255,255)";
        
        //adjusts the global colormethod variable
        colorMethod = "notes"

        //for each note, set the value and the background color to be the appropriate index of the colors array
        for (var i=0; i<13; i++){
            var tempColor = colors[(i%12)]
            document.getElementById("note"+i).value = tempColor
            document.getElementById("note"+i).style.backgroundColor = colorMe(tempColor,0.4)
        }
    }
    else if (method=="intervals"){
        //set the selected key to be greyed out
        document.getElementById('intervals').style.backgroundColor = "rgb(110,110,110)";
        document.getElementById('notes').style.backgroundColor = "rgb(255,255,255)";
        
        //adjusts the global colormethod variable
        colorMethod = "intervals"

        //for each note, set the value the appropriate index of the chris-colors array and the background color to be grey
        for (var i=0; i<13; i++){
            var tempColor = chrisColors[(i%12)]
           document.getElementById("note"+i).value = tempColor
           document.getElementById("note"+i).style.backgroundColor = colorMe("190, 190, 190",1)
        }
    }
}

//increase or decrease the octave by changing frequencies
function changeOctave(value){
    //calls the check freqeuencies function to make sure you're within normal human hearing ranges
    checkFrequencies()

    //increase the octave by doubling all the frequencies
	if (value==1){
		for (var i =0; i<13; i++){
			eval("note"+i).frequency = eval("note"+i).frequency*2
		}
	}
    //increase the octave by halving all the frequencies
	else if (value==-1){
		for (var i =0; i<13; i++){
			eval("note"+i).frequency = eval("note"+i).frequency*0.5
		}
	}
}

function notePressed(noteName){
    //get the number of the note
    var num = (noteName.split("e").pop());

    //set the note's on/off variable to be 1
    onOff[num] = 1

    //play the note
    eval(noteName).play();

    //set it to be its current color, but with full opacity
    var currentColor = document.getElementById(noteName).value
    document.getElementById(noteName).style.backgroundColor = colorMe(currentColor,1)
}

function noteUnpressed(noteName){
    //get the number of the note
    var num = (noteName.split("e").pop());

    //set the note's on/off variable to be 1
    onOff[num] = 0

    //stop the note
    eval(noteName).stop();

    //set it to be its current color, but with partial opacity, or (for interval-based), to be grey
    var currentColor = document.getElementById(noteName).value
    document.getElementById(noteName).style.backgroundColor = colorMe(currentColor,0.4)
    if (colorMethod=="intervals"){
         document.getElementById(noteName).style.backgroundColor = colorMe("190,190,190",1)
    }
}

//turns a string, like "230,130,30" and a transparency value, like 0.6, into a color, like rgba(230,130,30,0,6)
function colorMe(color,transparency){
    var array = String(color).split(",")
    var newColor = String("rgba("+array[0]+","+array[1]+","+array[2]+","+transparency+")")
    return newColor;
}

//increases or decreases the key
function changeKey(multiplierStr,noteless){
    //make sure the frequencies are within a normal hearing range
    checkFrequencies()
    //find by how much you have shifted. If the key buttons were used, "noteless" = 0, so it's just the multiplier, but if you used the arrow keys it's the multiplier plus the current shift
    var multiplier = Number(multiplierStr)+(currentKeyChange*noteless)

    for (var i=0; i<13; i++){
        //shift the colors by doing i+multiplier, plus 2400 to avoid negatives, setting both the value and the background color
        var color = Math.abs(Number((2400+i+multiplier))%12);
        if (colorMethod=='notes'){
            document.getElementById("note"+i).style.backgroundColor = colorMe(colors[color],0.4)
            document.getElementById("note"+i).value = colors[color]
        }
        //multiply the base frequencies by 1.05946 by however many times necessary based on the multiplier
        eval("note"+i).frequency = freqs[i]*Math.pow(1.05946, multiplier);

        //reset all the other key buttons to white
        document.getElementById("key"+(i%12)).style.backgroundColor = "white";  
    }

    //adjust the global current key change variable
    currentKeyChange = multiplier

    //make the currently used key button grey
    document.getElementById('key'+((currentKeyChange+2400)%12)).style.backgroundColor = "rgb(110,110,110)";
}

//makes sure frequencies are within human range
function checkFrequencies(){
    if ((note0.frequency<20)||(note12.frequency>20000)){
        confirm("You've gone outside the frequency range of the human ear. This message will continue to pop up until you are back within the normal hearing range. To get there, click on any of the key buttons, or use the arrow keys (left/down = lower, right/up = higher).")
    }

}

function stopAll(){
    console.log('stopping')
    for (var i=0; i<13; i++){
        noteUnpressed("note"+i)
    }
}


//Dad's way:
// function playback(){
//     document.getElementById("playbackButton").style.backgroundColor="rgb(110,110,110)"
//     var counter = 0
//     var newStart = 0
//     var length = currentTime-100
//     console.log(length)
//     playVar = setInterval(function(){ 
//         // recordNotes(); 
//         for (var i = newStart; i<notesPlayed.length; i++){
//             if (notesPlayed[i][0]==(counter)){
//                 console.log("current note number " + notesPlayed[i][0])
//                 console.log("got 'em")
//                 var playEm = notesPlayed[i][1].split(",");
//                 //more efficient way to do that?
//                 for (var j=0; j<playEm.length; j++){
//                     notePressed()
//                 }
//                 // notePressed("note"+j)
//             }
//             else{
//                 // noteUnpressed("note"+j)
//             }
//         }
//         counter+=100
//         console.log(counter)
//         if (counter==length){
//             document.getElementById("playbackButton").style.backgroundColor="white"
//             console.log('clearing')
//             clearInterval(playVar);
//         }
//     }, recFreq);    
// }
