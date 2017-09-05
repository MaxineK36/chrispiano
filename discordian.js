console.log("10:04")

// var database = firebase.database();
// var d = new Date();
// var mili = Date.UTC(d.getFullYear(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds());
// console.log(mili)


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
var recFreq = 25

//hide things
document.getElementById("clipping").style.display = "none"

//temp 
var tracksToPlay = [];
var currentName = null;

// var currentName = prompt("pick a name");


var loopNum = 0;
var trackNum = 0;
var loopLength;
var loopGoing = 0;
//is going = 1
//isn't going = 0


//when the record button is pressed
var recVar
var playVar
var currentTime = 0;
var currentLoopTime = 0;
var globalLoopOnOff



function record(loopOnOff){
    // globalLoopOnOff = loopOnOff
    // if (loopOnOff==1){
    //     currentTime = 0;
    // }

    //the record button turns red as you're recording and has a built-in timer
    document.getElementById("recordButton").style.backgroundColor="red"
    document.getElementById("recordButton").innerHTML="Record: "+currentTime+"s"

    //every recFreq milliseconds, call the recordNotes function
    recVar = setInterval(function(){ 
        recordNotes(); 
    }, recFreq);
    
    //make the table visible by making the text white, show the clipping options
    document.getElementById("recordingTable").style.color = "white"
    document.getElementById("clipping").style.display = "block"
}

function pickName(){
    currenName = prompt("pick a name")
}

function unRecord(loopOnOff){
    //temporarily store the recording, unless you're looping
    // if (loopOnOff==0){
    updateData("temp/0",notesPlayed)
    // }
    //make the record button white again
    document.getElementById("recordButton").style.backgroundColor="white"

    //stop the loop
    clearInterval(recVar); 
}

function recordNotes(){
    //have the new timer show up
    document.getElementById("recordButton").innerHTML="Record: "+(currentTime/1000)+"s"
    var rowExists = document.getElementById("row"+currentTime/recFreq)

    //sets up the line of notes for the visualiation
    if (rowExists==null){
        var row = document.createElement("tr")
        row.id = "row"+(currentTime/recFreq)

        //labels it
        var firstCell = document.createElement("td")
        firstCell.innerHTML = currentTime/(1000)
        firstCell.classList.add("recCell")
        firstCell.style.color = "white"
        row.appendChild(firstCell)
    }

    //sets the temp string to empty
    var tempStr = ","
    for (var i =0; i<13; i++){
        var cell
        if (rowExists==null){
            //creates the cell (if there is none)
            cell = document.createElement("td")
            cell.id=row.id+"cell"+i
            cell.value = 1
            cell.classList.add('recCell');
            row.appendChild(cell)

        }
        else{
            //if there is one, still use it to define the variable 'cell'
            cell=document.getElementById("row"+currentTime/recFreq+"cell"+i)
        }
        
        //if the note is being played, 
        if (onOff[i]==1){
            tempStr=tempStr+i+","+'p'
            // tempArray.push(1)
            cell.style.border = "solid 0.5px white"
            cell.style.backgroundColor = colorMe(document.getElementById("note"+i).value,1)
        }
    }
    // console.log('notes played is')
    // console.log(notesPlayed)

    // if (tempStr != ","){
        if (loopNum == 0){
            notesPlayed[currentTime/recFreq] = tempStr  
            // console.log("loop number :" + loopNum)          
        }
        else{
            notesPlayed[currentTime/recFreq].push(tempStr)
            // console.log("loop number :" + loopNum)
        }
    // }
    // else {
    //     if (loopNum == 0){
    //         notesPlayed[currentTime/recFreq] = "no"  
    //     }
    //     // notesPlayed[currentTime/recFreq] = "no"
    // }

    if (rowExists==null){
        document.getElementById("recordingTable").appendChild(row)
    }
    //increases the timer
    currentTime = currentTime+recFreq;
    currentLoopTime = currentLoopTime + 1;
}


function loop(){
    if (loopGoing==0){
        loopNum = 0;
        if (trackNum != 0){
            // alert(loopLength)
        }
        recVar = setInterval(function(){ 
            loopGoing=1
            recordNotes(); 
            if (currentLoopTime==loopLength){
                loopNum = loopNum + 1;
                currentTime = 0;
                currentLoopTime = 0;
                console.log('time to stop' + currentTime)
            }
    
        }, recFreq);

    }
    else{
        tracksToPlay.push(trackNum)
        console.log(tracksToPlay)
        clearInterval(recVar);
        save(1)
        trackNum = trackNum + 1;
        loopGoing=0
        
    }
    
}


function playSelected(){
    console.log('playing selected')
    console.log(tracksToPlay)
    firebase.database().ref(currentName).once('value').then(function(snapshot) {
        array = snapshot.val();
        var newArray = [];
        var size = tracksToPlay.length
        var tempSize = 0;
        // console.log(array)
        //find the longest size
        for (var i = 0; i<size; i++){
            var newtempSize = Object.size(array[i])
            if (newtempSize>tempSize){
                tempSize=newtempSize
            }
        }
        for (var j =0; j<tempSize; j++){
            var tempStr = ","
            for (var i =0; i<size; i++){
                // console.log("read this "+tracksToPlay.indexOf(array[i]))
                if (array[tracksToPlay[i]][j]!==undefined){
                    tempStr = tempStr + array[tracksToPlay[i]][j]
                }
            }
            newArray[j]=tempStr
        }
        console.log(newArray)
        updateData('tempComb',newArray)
        console.log('data updated')
        playback(recFreq,'tempComb',1)

    })

    
}

function stopAll(resetOnOff){
    
    for (var i=0; i<13; i++){
        noteUnpressed("note"+i)
        eval("note"+i).stop()
    }
    clearInterval(playVar)
    for (var i=0; i<tracksToPlay.length; i++){
        document.getElementById(currentName + '/'+tracksToPlay[i]).style.backgroundColor = 'white'
    }
    if (resetOnOff == 1){
        tracksToPlay = []
        updateData('tempComb',[])
    }
    console.log('stopping all')
    console.log(tracksToPlay)
}

function playback(recordingFrequency,noteArrayKey,loopOnOff){
    console.log('playback time')
    //length determines how long the counter should go, counter increases each time the function occurs
    var length;
    var counter = 0

    //to store if each note is already on or off at any given point in time
    var tempNotes = [0,0,0,0,0,0,0,0,0,0,0,0,0]

    //get the array
    firebase.database().ref(noteArrayKey).once('value').then(function(snapshot) {
        
        realArray = snapshot.val();
        console.log(realArray)
        length = realArray.length

        //happens every recordingFrequency milliseconds
        playVar = setInterval(function(){
            //if the counter gets to the end, set the playback button to white, clear the tempNotes array, and then either reset the counter or end the interval
            if (counter==length){
                document.getElementById("playbackButton").style.backgroundColor="white"
                console.log('clearing')
                for (var j = 0; j<13; j++){
                    if (tempNotes[j]==1){
                        noteUnpressed("note"+j)
                    }
                }
                if (loopOnOff==1){
                    // console.log("loop on off = "+loopOnOff)
                    counter = 0
                    currentTime = 0;
                    currentLoopTime = 0;
                    tempNotes = [0,0,0,0,0,0,0,0,0,0,0,0,0]
                }
                else {
                    // console.log('really clearing')
                    clearInterval(playVar);
                    stopAll(1);
                }
            } 
            //if notes were played at this time...
            if (realArray[counter].indexOf("p")!=-1){
                            // console.log('again')

                //For each note, check to see if it's there and wasn't playing before (in which case turn it on, or that it's missing and *was* playing before, in whcih case turn it off). Adjust the tempNotes array to reflect its new state.
                for (var j = 0; j<13; j++){
                    if ((realArray[counter].indexOf(","+j+",")!=-1)&&(tempNotes[j]==0)){
                        // console.log('note '+j+" on")
                        notePressed("note"+j)
                        tempNotes[j]=1
                    }
                    else if ((realArray[counter].indexOf(","+j+",")==-1)&&(tempNotes[j]==1)){
                        // console.log('note '+j + ' off')
                        noteUnpressed("note"+j)

                        tempNotes[j]=0
                    }
                }
            }
            //if it is 0, turn off every note that is currently playing
            else{
               for (var j = 0; j<13; j++){
                    if (tempNotes[j]==1){
                        noteUnpressed("note"+j)
                        tempNotes[j]=0
                    }
                } 
            }
            //increase the counter
            counter++
        }, recordingFrequency);  
    })
}

function resetRec(){
    //reset the current name, the notesplayed array, and the recording table
    currentTime = 0;
    currentLoopTime = 0;
    notesPlayed = [];
    document.getElementById("recordingTable").innerHTML = "<tr> <th> </th> <th>0</th> <th>1</th> <th>2</th> <th>3</th> <th>4</th> <th>5</th> <th>6</th> <th>7</th> <th>8</th> <th>9</th> <th>10</th> <th>11</th> <th>12</th> </tr>"

    //set the recording table text to black, get rid of the time on the record button
    document.getElementById("recordingTable").style.color = 'black'
    document.getElementById("recordButton").innerHTML = "Record"

    //hide the clipping again
    document.getElementById("clipping").style.display = "none"

}

function clip(){
    console.log(notesPlayed)
    //get the start and end values from the input boxes
    var start = (document.getElementById("startClip").value)*(1000/recFreq)
    var end = (document.getElementById("endClip").value)*(1000/recFreq)
    console.log('start '+start+' end '+end)

    //cut up the array
    notesPlayed = notesPlayed.slice(start, end+1);
    console.log(notesPlayed)
    console.log('global '+globalLoopOnOff)
    if (globalLoopOnOff==0){
        console.log('test')
        updateData('temp/0',notesPlayed)
    }

    //hide the rows that you chopped
    for (var i=0; i<currentTime/recFreq; i++){
        if ((i<start)||(i>end)){
            document.getElementById("row"+i).style.display = "none"
        }
    }
    //empty the boxes
    document.getElementById("startClip").value = null
    document.getElementById("endClip").value = null
}

function recallSong(){
    var name = prompt("Under what name is the song saved? (case-sensitive)")
    currentName = name
    console.log(name)
    firebase.database().ref(name).once('value').then(function(snapshot) {
        console.log('here')
        var arrayArray = snapshot.val();
        var size = Object.size(arrayArray)
        for (var i=0; i<size; i++){
            var trackButton = document.createElement("button");
            trackButton.classList.add("otherButton");
            trackButton.classList.add("loop");
            trackButton.id = name + "/" + i
            trackButton.value = i  
            trackButton.innerHTML = "Track "+i 
            trackButton.onclick = function(){
                tracksToPlay.push(this.value)
                this.style.backgroundColor = "grey"
                // playback(recFreq, this.id, 1)
            } 
            document.getElementById("loopTracks").appendChild(trackButton)
            console.log('here')
        }
    })
}


//size function used to determine the size of thigns from firebase
Object.size = function(obj){
        var size = 0, key;
        for (key in obj){
            if (obj.hasOwnProperty(key)) size++;}
        return size;
    }

function updateData(refKey,item){
    //updates to firebase
    firebase.database().ref(refKey).set(item);
    resetRec()
}

function save(loopOnOff){
    console.log('saving')
    var name
    if (currentName==null){
        name = prompt("What's your name?")
        currentName = name;
    }
    else{
        name = currentName
    }
    if (trackNum == 0){
                // alert("i'm here")
                loopLength = notesPlayed.length;
                // alert('here '+loopLength)
    }
    var size; //this could be changed to let the user adjust it
    
    
    firebase.database().ref(name).once('value').then(function(snapshot) {
        size = Object.size(snapshot.val());
        var newRefKey = name+"/"+size
        if (loopOnOff==1){

            var trackButton = document.createElement("button");
            trackButton.classList.add("otherButton");
            trackButton.classList.add("loop");
            trackButton.id = newRefKey;
            trackButton.value = size  
            trackButton.innerHTML = "Track "+size 
            trackButton.onclick = function(){
                tracksToPlay.push(this.value)
                this.style.backgroundColor = "grey"
                // playback(recFreq, this.id, 1)
            } 
            document.getElementById("loopTracks").appendChild(trackButton)
        }

        console.log(notesPlayed)
        updateData(newRefKey,notesPlayed)
        console.log('saved')
        if (loopOnOff==1){
            stopAll(0);
            playSelected();
        }
    })

}


//keydown functions (make the notes start playing, allow for arrow keys to be used for octaves up or down)
document.addEventListener("keydown", function(event) {
	var tempKey = String.fromCharCode(event.keyCode)
    var key = event.keyCode
    
    //note: add in more key commands later
    //temporary section    
    if (key==69){
        playback(recFreq,'tempComb',0)
    }
    if (key==82){
        recallSong(prompt("name?"))
    }
    //end temporary section

    if (key==32){
        loop();
    }

    if ((key==189)||(key==45)){
        notePressed("note11",1)
        //minus key
    }
    else if ((key==187)||(key==61)){
        notePressed("note12",1)
        //equals key
    }
    else if (key==192){
        notePressed("note0",1)
        //` key
    }
    else if (key==48){
        notePressed("note10",1)
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
       notePressed("note"+tempKey,1)
       //number keys
     }
})

//keyup functions (they make the notes stop playing)
document.addEventListener("keyup", function(event) {
    var tempKey = String.fromCharCode(event.keyCode)
    var key = event.keyCode
    if (key==189){
        noteUnpressed("note11",1)
    }
    else if (key==187){
        noteUnpressed("note12",1)
    }
    else if (key==192){
        noteUnpressed("note0",1)
    }
    else if (tempKey==0){
        noteUnpressed("note10",1)
    }
    if((isNaN(tempKey)==false)&&(Number(tempKey)>0)){
        noteUnpressed("note"+tempKey,1)
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

function notePressed(noteName,recordOnOff){
    //get the number of the note
    var num = (noteName.split("e").pop());

    if (recordOnOff==1){
        //set the note's on/off variable to be 1
        onOff[num] = 1

        
    }

    //play the note
        eval(noteName).play();

    //set it to be its current color, but with full opacity
    var currentColor = document.getElementById(noteName).value
    document.getElementById(noteName).style.backgroundColor = colorMe(currentColor,1)
}

function noteUnpressed(noteName,recordOnOff){
    //get the number of the note
    var num = (noteName.split("e").pop());

    //set the note's on/off variable to be 1
    if (recordOnOff==1){
        onOff[num] = 0
        
    }
    
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


