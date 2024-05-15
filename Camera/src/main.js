var constraints = { video: { facingMode: "environment", width: { ideal: 1920 }, height: { ideal: 1080 }, frameRate: { ideal: 60 } }, audio: false };

const videoElement = document.getElementById('video');
const startRecordButton = document.getElementById('startRecord');
const stopRecordButton = document.getElementById('stopRecord');
const downloadLink = document.getElementById('downloadLink');

var currentdate = new Date(); 
var datetime = currentdate.getDate().toString() + (currentdate.getMonth()+1) + "_" + currentdate.getHours() + currentdate.getMinutes();

let timer = document.getElementById('timer');
let startTime, timerInterval;
let mediaRecorder;
let chunks = [];

navigator.mediaDevices.getUserMedia(constraints, { video: true })

.then(stream => {
    videoElement.srcObject = stream;
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0) {
            chunks.push(event.data);
        }
    };

    mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm;codecs=vp9' });
        chunks = [];
        const videoURL = URL.createObjectURL(blob);
        downloadLink.href = videoURL;
        downloadLink.style.display = 'block';
        downloadLink.download = `${datetime}.webm`;
    };

    startRecordButton.addEventListener('click', () => {
        mediaRecorder.start();
        startRecordButton.disabled = true;
        stopRecordButton.disabled = false;
        startTime = Date.now();
        timerInterval = setInterval(updateTimer, 1000);
    });

    stopRecordButton.addEventListener('click', () => {
        mediaRecorder.stop();
        startRecordButton.disabled = false;
        stopRecordButton.disabled = true;
        clearInterval(timerInterval);
        timer.textContent = '00:00';
    });
})
.catch(error => console.error('Error accessing the webcam:', error));

function updateTimer() {
    let currentTime = Date.now();
    let elapsedTime = Math.floor((currentTime - startTime) / 1000);
    let minutes = Math.floor(elapsedTime / 60).toString().padStart(2, '0');
    let seconds = (elapsedTime % 60).toString().padStart(2, '0');

    timer.textContent = `${minutes}:${seconds}`;
}