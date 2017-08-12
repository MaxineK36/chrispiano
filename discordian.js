
console.log('hi')
// var on = false;
var A
var Bb
var B

var notes = ["A","Bb","B","C","Db","D","Eb","E","F","Gb","G","Ab","A2"]
var freqs = [440,466.164,493.883,523.251,554.365,587.33,622.254,659.255,698.456,783.991,830.609,880]

// for (var i=0; i<notes.length; i++){
// 	 notes[i] = new Pizzicato.Sound();
// 	 notes[i].source = 'wave'
// 	 notes[i].options = "{ frequency: "+freqs[i]+",}" 
// 	//  	source: 'wave', 
//  //    	options: {
//  //        	frequency: freqs[i],
//  //    	}
// 	// });
// }
// document.addEventListener("keypress", function(event) {
//     console.log('i')
//     var okey = Number(event.keyCode)
//     console.log(okey-1);
//     if (okey==38){
//         changeOctave(1)
//          console.log('octavechange')
//     }
//     else if (okey==40){
//         changeOctave(-1)
//          console.log('octavechange')
//     }

// })



document.addEventListener("keydown", function(event) {
	var tempKey = String.fromCharCode(event.keyCode)
	console.log(tempKey)
    var key = event.keyCode
    console.log("keycode: "+event.keyCode)
    if ((key==189)||(key==45)){
        console.log("it's a minus!")
        note11.play()
    }
    else if ((key==187)||(key==61)){
        console.log("it's an equals")
        note12.play()
    }
    else if (key==192){
        console.log("its a weird thing!")
        note0.play()
    }
    else if (key==48){
        note10.play()
         console.log(0)
    }
    else if (key==38){
        changeOctave(1)
         console.log('octavechange')
    }
    else if (key==40){
        changeOctave(-1)
         console.log('octavechange')
    }
    if((isNaN(tempKey)==false)&&(Number(tempKey)>0)){
        console.log(tempKey + " is a number bigger than 0");
        eval("note"+tempKey).play()
     }
})


document.addEventListener("keyup", function(event) {
    var tempKey = String.fromCharCode(event.keyCode)
    console.log(tempKey)
    var key = event.keyCode
    console.log("keycode: "+event.keyCode)
    if (key==189){
        console.log("it's a minus!")
        note11.stop()
    }
    else if (key==187){
        console.log("it's an equals")
        note12.stop()
    }
    else if (key==192){
        console.log("its a weird thing!")
        note0.stop()
    }
    else if (tempKey==0){
        note10.stop()
         console.log(0)
    }
    if((isNaN(tempKey)==false)&&(Number(tempKey)>0)){
        console.log(tempKey + " is a number bigger than 0");
        eval("note"+tempKey).stop()
     }
})




document.getElementById('keyText').innerHTML = "A"

for (var i=0; i<notes.length; i++){
	 var button = document.createElement("button");
	 button.innerHTML = i
	 button.value = 0
	 button.id = notes[i]
	 button.classList.add('note');
	 // button.onclick = "change("+notes[i]+")"
 	 button.onclick = function(){
 	 	change(this.id)
 	 } 
	 document.getElementById("test").appendChild(button)
}

for (var i=0; i<notes.length; i++){
	 var button = document.createElement("button");
	 button.innerHTML = notes[i]
	 button.value = i
	 button.classList.add('key');
	 // button.onclick = "change("+notes[i]+")"
 	 button.onclick = function(){
 	 	changeKey(this.value)
 	 } 
	 document.getElementById("test").appendChild(button)
}

var note0 = new Pizzicato.Sound({ 
    source: 'wave', 
    note: notes[0],
    options: {
        frequency: 440,
       
    }
	});

var note1 = new Pizzicato.Sound({ 
    source: 'wave', 
    note: notes[1],
    options: {
        frequency: 466.164,
    }
	});

var note2 = new Pizzicato.Sound({ 
    source: 'wave', 
    note: notes[2],
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


function changeOctave(value){
	if (value==1){
		for (var i =0; i<notes.length; i++){
			eval("note"+i).frequency = eval("note"+i).frequency*2
		}
		// B.frequency = B.frequency*2
	}
	else if (value==-1){
		
		for (var i =0; i<notes.length; i++){
			eval("note"+i).frequency = eval("note"+i).frequency*0.5
		}
	}
}

function changeKey(multiplier){
	for (var i =0; i<notes.length; i++){
		eval("note"+i).frequency = eval("note"+i).frequency*Math.pow(1.05946, multiplier);
	}
	document.getElementById('keyText').innerHTML = notes[multiplier]

}

function change(note){
	var num = document.getElementById(note).innerHTML
	console.log("note number " + num);
	var tempNote = eval("note" + num)
	var on = document.getElementById(note).value
	console.log("is it on? " + on)
	if (on==1){
		tempNote.stop()
		document.getElementById(note).value=0;
	}
	else if (on==0){
		tempNote.play()
		document.getElementById(note).value=1;
	}
}

function stopAll(){
	for (var i =0; i<notes.length; i++){
		var tempNote = eval("note"+i)
		tempNote.stop();
	}
}

function changeColor(note){
    alert(note)
}



//Graveyard:

    
 //    if (tempKey=='M'){
 //     
 //    }
    
 //    else if (tempKey==0){
 //     note10.play()
 //     console.log(10)
 //    }
 //    else if ((tempKey=='-')||(tempKey=="½")){
 //     note11.play()
 //     console.log(11)
 //    }
 //    else if ((tempKey=='=')||(tempKey=="»")){
 //     note12.play()
 //     console.log(12)
 //    }

    // else{
    //  var tempNum = Number(tempKey)
    //  console.log(tempNum)
    //  if (1<=tempNum){
 //     eval("note"+tempKey).play()
 //     console.log("1-10")
 //     }
 //    }



// document.addEventListener("keyup", function(event) {
//  var tempKey = String.fromCharCode(event.keyCode)
//  console.log(tempKey)
    
//     if (tempKey=='M'){
//      note0.stop()
//      console.log(0)
//     }
    
//     else if (tempKey==0){
//      note10.stop()
//      console.log(10)
//     }
//      else if ((tempKey=='-')||(tempKey=="½")){
//      note11.stop()
//      console.log(11)
//     }
//     else if ((tempKey=='=')||(tempKey=="»")){
//      note12.stop()
//      console.log(12)
//     }


//  else{
//      var tempNum = Number(tempKey)
//      console.log(tempNum)
//      if (1<=tempNum){
//      eval("note"+tempKey).stop()
//      console.log("1-10")
//      }
//     }

// })

// document.addEventListener("keyup", function(event) {
//  var tempKey = String.fromCharCode(event.keyCode)
//  console.log(tempKey)
//     if (tempKey=='`'){
//      change(notes[0])
//      console.log(0)
//     }
//     else if (0<tempKey<10){
//      change(notes[tempKey])
//      console.log("1-10")
//     }
//     else if (tempKey=='-'){
//      change(notes[11])
//      console.log(11)
//     }
//     else if (tempKey=='='){
//      change(notes[12])
//      console.log(12)
//     }
// })







