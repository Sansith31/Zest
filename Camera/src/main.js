var constraints = { video: { facingMode: "environment", width: { ideal: 1920 }, height: { ideal: 1080 }, frameRate: { ideal: 60 } }, audio: false };
const videoElement = document.getElementById('video');
const startRecordButton = document.getElementById('startRecord');
const stopRecordButton = document.getElementById('stopRecord');
const downloadLink = document.getElementById('downloadLink');
let mediaRecorder;
let chunks = [];

// Get user media (in this case, the webcam)
navigator.mediaDevices.getUserMedia(constraints, { video: true })
    .then(stream => {
        videoElement.srcObject = stream;
        stopRecordButton.hidden = true;
        mediaRecorder = new MediaRecorder(stream);

        // Handle data available
        mediaRecorder.ondataavailable = event => {
            if (event.data.size > 0) {
                chunks.push(event.data);
            }
        };

        // Handle stop event
        mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'video/webm;codecs=vp9' });
            chunks = [];
            const videoURL = URL.createObjectURL(blob);
            downloadLink.href = videoURL;
            downloadLink.style.display = 'block';
            downloadLink.download = 'recorded-video.mp4';
        };

        // Start recording
        startRecordButton.addEventListener('click', () => {
            mediaRecorder.start();
            startRecordButton.disabled = true;
            startRecordButton.hidden = true;
            stopRecordButton.disabled = false;
        });

        // Stop recording
        stopRecordButton.addEventListener('click', () => {
            mediaRecorder.stop();
            startRecordButton.disabled = false;
            stopRecordButton.disabled = true;
        });
    })
    .catch(error => console.error('Error accessing the webcam:', error));