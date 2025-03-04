const startButton = document.getElementById('start');
const elemQuerying = document.getElementById('querying');
const elemOut = document.getElementById('out');
let mediaRecorder;
let audioChunks = [];
let startTimeout;
let silenceTimeout;
let isRecording = false;
let isEnding = false;
let maxRecordingTime = 30000; // 30 seconds

let querying = false

let qas = []

startButton.addEventListener('click', async () => {
    document.getElementById('recording').style.backgroundColor="#FF0000";
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    const dataArray = new Uint8Array(analyser.fftSize);

    source.connect(analyser);

    mediaRecorder = new MediaRecorder(stream, {
        //mimeType: 'audio/wav; codecs=pcm_s16le',
        mimeType: 'audio/webm; codecs=opus',
    });
    mediaRecorder.ondataavailable = event => {
        audioChunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
        isEnding = false;
        clearTimeout(startTimeout);
        clearTimeout(silenceTimeout);
        document.getElementById('recording').style.backgroundColor="#FF0000";
        //const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm; codecs=opus' });
        audioChunks = [];
        uploadAudio(audioBlob);
    };

    checkForVoice(analyser, dataArray);
});

function checkForVoice(analyser, dataArray) {
    analyser.getByteFrequencyData(dataArray);
    const sum = dataArray.reduce((a, b) => a + b, 0);
    const average = sum / dataArray.length;

    if (average > 45) { // (10) threshold for detecting voice
        if (!isRecording) {
            startRecording();
        }
        isEnding = false;
        clearTimeout(silenceTimeout);
    } else {
        if (isRecording) {
            if (!isEnding) {
                clearTimeout(silenceTimeout);
                silenceTimeout = setTimeout(stopRecording, 3000);
            }
            isEnding = true;
        }
    }

    requestAnimationFrame(() => checkForVoice(analyser, dataArray));
}

function startRecording() {
    if (querying) return;
    document.getElementById('recording').style.backgroundColor="#00FF00";
    isRecording = true;
    audioChunks = [];
    mediaRecorder.start();
    clearTimeout(startTimeout)
    startTimeout = setTimeout(() => {
        if (isRecording) {
            stopRecording();
        }
    }, maxRecordingTime);
}

function stopRecording() {
    if (isRecording) {
        isRecording = false;
        mediaRecorder.stop();
    }
}

async function uploadAudio(audioBlob) {
    const formData = new FormData();
    //formData.append('audio', audioBlob);
    formData.append('audio', audioBlob, 'recording.opus');

    //const arrayBuffer = await audioBlob.arrayBuffer();
    //formData.append('audio', arrayBuffer);

    console.log(audioBlob)

    elemQuerying.style.display = "inline-block"
    querying = true
    try {
        const response = await fetch('/api/ai/voice_query', {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        console.log('Audio uploaded successfully:', result);
        qas.push(result)
        var html = '<table>'
        for (var n=qas.length-1; n>=0; n--) {
            var qa = qas[n]
            html += `<tr><td><pre>${JSON.stringify(qa.query,null,4)}</pre></td><td>${qa.answer}</td></tr>`
        }
        html += '</table>'
        elemOut.innerHTML = html
    } catch (error) {
        console.error('Error uploading audio:', error);
    }
    querying = false
    elemQuerying.style.display = "none"

}
