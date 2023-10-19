var wordIndex = 0;
var global_words = [];
var isPaused = false;
var utterance = new SpeechSynthesisUtterance();
utterance.lang = 'en-US';

var speedRange = document.getElementById('speedRange');
var speedValue = document.getElementById('speedValue');

function startSpeech() {
    var text = document.getElementById('textarea').value;
    var words = text.split(" ");
    global_words = words;
    drawTextInPanel(words);
    spokenTextArray = words;
    utterance.text = text;

    // Get the selected speed from the range input
    var speed = speedRange.value;
    utterance.rate = parseFloat(speed);

    speechSynthesis.speak(utterance);
}

function pauseSpeech() {
    speechSynthesis.pause();
    isPaused = true;
}

function resumeSpeech() {
    speechSynthesis.resume();
    isPaused = false;
}

document.getElementById('playbtn').onclick = function(){
    if(isPaused){
        resumeSpeech();
    } else {
        startSpeech();
    }
};

document.getElementById('stopbtn').onclick = function(){
    pauseSpeech();
};

document.getElementById('resumebtn').onclick = function(){
    resumeSpeech();
};

utterance.onboundary = function(event){
    var e = document.getElementById('textarea');
    var word = getWordAt(e.value,event.charIndex);
    document.getElementById("word").innerHTML = word;
    
    try{
        document.getElementById("word_span_"+wordIndex).style.color = "blue";
    }catch(e){}
    
    wordIndex++;
};

utterance.onend = function(){
    document.getElementById("word").innerHTML = "";
    wordIndex = 0;
    document.getElementById("panel").innerHTML = "";
};

speedRange.addEventListener('input', function() {
    speedValue.innerText = this.value + 'x';
});

speedRange.addEventListener('change', function() {
    utterance.rate = parseFloat(this.value);
    speechSynthesis.cancel(); // Cancel current speech
    startSpeech(); // Start new speech with updated speed
});
window.addEventListener('beforeunload', function() {
    pauseSpeech(); 
})
function getWordAt(str, pos) {
    str = String(str);
    pos = Number(pos) >>> 0;
    var left = str.slice(0, pos + 1).search(/\S+$/),
        right = str.slice(pos).search(/\s/);

    if (right < 0) {
        return str.slice(left);
    }
    return str.slice(left, right + pos);
}

function drawTextInPanel(words_array){
    var panel = document.getElementById("panel");
    panel.innerHTML = "";
    for(var i = 0; i < words_array.length; i++){
        var html = '<span id="word_span_'+i+'">'+words_array[i]+'</span>&nbsp;';
        panel.innerHTML += html;
    }
    
}
