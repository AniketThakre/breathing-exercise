// Get input elements and button
const inhaleInput = document.getElementById('inhale');
const holdInput = document.getElementById('hold');
const exhaleInput = document.getElementById('exhale');
const message = document.getElementById('message');
const startButton = document.getElementById('startButton');
const voiceSelect = "Microsoft David - English (United States)";

let repetition = 0; // To track the loop to suggest the break 
let isBreathing = false; // To track if the breathing cycle is active
let voices = [];
let speechSynthesis = window.speechSynthesis;

// Function to vibrate the system
function vibrate() {
    if ('vibrate' in navigator) {
        navigator.vibrate(500); // Vibrates for 500 milliseconds
    }
}
function loadVoices() {
  voices = speechSynthesis.getVoices();
  voices.forEach(voice => {
      const option = document.createElement('option');
      option.value = voice.name;
      option.textContent = `${voice.name} (${voice.lang})`;
      voiceSelect.appendChild(option);
  });
}

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  const selectedVoice = voiceSelect.value;
  utterance.voice = voices.find(voice => voice.name === selectedVoice);

  speechSynthesis.speak(utterance);
}

// Function to perform the breathing cycle
async function startBreathingCycle(inhaleTime, holdTime, exhaleTime) {
    isBreathing = true; // Set the breathing state to true

    speak("Starting your breathing excercise in");
    message.textContent = "Starting your breathing excercise in 3 sec...";
    await delay(2900);
    for(let i=3;i>0;i--){
      message.textContent = "Starting your breathing excercise in "+ i + " sec...";
      speak(i);
      await delay(1000);
    }
    await delay(800);

    while (repetition < 20 && isBreathing) {
      let cycle = 0;
      while (cycle < 5 && isBreathing) {
        message.textContent = "Inhale for "+ inhaleTime +" seconds";
        speak("Inhale for "+ inhaleTime +" seconds");
        await delay(inhaleTime * 1000);
        if (!isBreathing) return; // Stop if breathing is not active
        vibrate();
        
        message.textContent = "Now hold your breath for "+ holdTime + " seconds";
        speak("Now hold your breath for "+ holdTime + " seconds");
        await delay(holdTime * 1000);
        if (!isBreathing) return; // Stop if breathing is not active
        vibrate();
        
        message.textContent = "Exhale for "+ exhaleTime +" seconds";
        speak("Exhale for "+ exhaleTime +" seconds")
        await delay(exhaleTime * 1000);
        if (!isBreathing) return; // Stop if breathing is not active
        vibrate();
        
        cycle++;
      }
      repetition += 5; // Loop for the entire duration of inhale + hold + exhale
  }
}

function stop() {
  speechSynthesis.cancel();
}

// Delay function
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Start button listener
startButton.addEventListener('click', () => {
    if (startButton.textContent === "Start Exercise") {
        startButton.textContent = "Stop";
        let inhaleTime = parseInt(inhaleInput.value);
        let holdTime = parseInt(holdInput.value);
        let exhaleTime = parseInt(exhaleInput.value);
        // Start the breathing cycle
        startBreathingCycle(inhaleTime, holdTime, exhaleTime);
    } else {
        console.log("Stopping the breathing cycle...");
        stop();
        startButton.textContent = "Start Exercise";
        isBreathing = false; // Set the breathing state to false
        repetition = 0; // Reset the repetition counter if needed
        message.textContent = 'Stopped.'; // Optional: Update message to indicate stopped state
    }
});