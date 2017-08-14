console.log("12:03")

var notes = ["A","Bb","B","C","Db","D","Eb","E","F","Gb","G","Ab","A2"]
var freqs = [440,466.164,493.883,523.251,554.365,587.33,622.254,659.255,698.456,739.989, 783.991,830.609,880]

var colors = ["219,85,73","241,150,51","247,194,56","255,231,78","194,213,62","137,176,58","21,151,144","61,132,181","91,83,143","146,79,143","214,84,129","221,69,90"]
var chrisColors = ["0,0,0","50,50,50","0, 102, 255","255,0,255","0,204,0","102,51,0","102,0,255","255,0,0","255, 102, 0","255,255,255","210,210,210","255,255,0"]

var test = 5%12
var colorMethod;


document.addEventListener("keydown", function(event) {
	var tempKey = String.fromCharCode(event.keyCode)
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
    if((isNaN(tempKey)==false)&&(Number(tempKey)>0)){
       notePressed("note"+tempKey)
     }
})


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


document.getElementById('keyText').innerHTML = "A"

//add in notes
for (var i=0; i<notes.length; i++){
	 var button = document.createElement("button");
	 button.innerHTML = i
	 button.title = i
     // button.value = colors[(i%12)];
	 button.id = "note"+i
	 button.classList.add('note');
 	 button.onclick = function(){
 	 	change(this.id)
 	 } 
    button.addEventListener("mousedown", function(event) {
        notePressed(this.id)
    })
    button.addEventListener("mouseup", function(event) {
        noteUnpressed(this.id)
    })

     // button.style.backgroundColor = chrisColors[i]
	 document.getElementById("test").appendChild(button)

}

//add in key change buttons
for (var i=0; i<notes.length; i++){
	 var button = document.createElement("button");
	 button.innerHTML = notes[i]
	 button.value = i
	 button.classList.add('key');
 	 button.onclick = function(){
 	 	changeKey(this.value)
 	 } 
	 document.getElementById("test").appendChild(button)
}

setColors('notes');


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

function setColors(method){
    if (method=="notes"){
        console.log('notes')
        colorMethod = "notes"
        for (var i=0; i<notes.length; i++){
            var tempColor = colors[(i%12)]
           document.getElementById("note"+i).value = tempColor
           document.getElementById("note"+i).style.backgroundColor = colorMe(tempColor,0.4)
        }
    }
    else if (method=="intervals"){
        colorMethod = "intervals"
        console.log('intervals')
        for (var i=0; i<notes.length; i++){
            var tempColor = chrisColors[(i%12)]
           document.getElementById("note"+i).value = tempColor
           document.getElementById("note"+i).style.backgroundColor = colorMe("242, 242, 242",1)
        }

    }
}

function changeOctave(value){
	if (value==1){
		for (var i =0; i<notes.length; i++){
			eval("note"+i).frequency = eval("note"+i).frequency*2
		}
	}
	else if (value==-1){
		
		for (var i =0; i<notes.length; i++){
			eval("note"+i).frequency = eval("note"+i).frequency*0.5
		}
	}
}


// function change(note){
// 	var tempNote = eval("note" + document.getElementById(note).innerHTML)
// 	var on = document.getElementById(note).value
// 	if (on==1){
// 		tempNote.stop()
// 		document.getElementById(note).value=0;
// 	}
// 	else if (on==0){
// 		tempNote.play()
// 		document.getElementById(note).value=1;
// 	}
// }

function stopAll(){
	for (var i =0; i<notes.length; i++){
		var tempNote = eval("note"+i)
		tempNote.stop();
	}
}

function notePressed(noteName){
    eval(noteName).play();
    var currentColor = document.getElementById(noteName).value
    document.getElementById(noteName).style.backgroundColor = colorMe(currentColor,1)

}

function noteUnpressed(noteName){
    eval(noteName).stop();
    var currentColor = document.getElementById(noteName).value
    document.getElementById(noteName).style.backgroundColor = colorMe(currentColor,0.4)
    if (colorMethod=="intervals"){
         document.getElementById(noteName).style.backgroundColor = colorMe("242,242,242",1)
    }
}

function colorMe(color,transparency){
    var array = String(color).split(",")
    var newColor = String("rgba("+array[0]+","+array[1]+","+array[2]+","+transparency+")")
    return newColor;
}


function changeKey(multiplierStr){
    var multiplier = Number(multiplierStr)
    console.log("m" + multiplier)
    for (var i=0; i<notes.length; i++){
        var color = Number((i+multiplier))%12
        document.getElementById("note"+i).style.backgroundColor = colorMe(colors[color],0.6)
        document.getElementById("note"+i).value = colors[color]
        console.log("current f "+i+" "+eval("note"+i).frequency)
        eval("note"+i).frequency = freqs[i]*Math.pow(1.05946, multiplier);
        console.log("new f "+i+" "+eval("note"+i).frequency)
        
    }
    console.log('keychanged')
    document.getElementById('keyText').innerHTML = notes[multiplier]
}

