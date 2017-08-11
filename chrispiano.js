
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








