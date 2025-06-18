let audio, marker, timeline, isPlaying = false;
let keyframes = [];
let selectedIndex = -1;
let totalBeats = 128;
let bpm = 120;

window.onload = () => {
  audio = new Audio();
  marker = document.getElementById('timelineMarker');
  timeline = document.getElementById('timeline');

  document.getElementById('audioInput').onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
      audio.src = URL.createObjectURL(file);
    }
  };

  document.getElementById('playBtn').onclick = () => {
    audio.play();
    isPlaying = true;
  };

  document.getElementById('pauseBtn').onclick = () => {
    audio.pause();
    isPlaying = false;
  };

  document.getElementById('addKFBtn').onclick = () => {
    const beat = getCurrentBeat();
    keyframes.push({ beat: beat.toFixed(2), ease: "linear", duration: 1 });
    refreshKeyframeList();
  };

  document.getElementById('removeKFBtn').onclick = () => {
    if (selectedIndex >= 0) {
      keyframes.splice(selectedIndex, 1);
      selectedIndex = -1;
      refreshKeyframeList();
    }
  };

  timeline.onclick = (e) => {
    const percent = e.offsetX / timeline.clientWidth;
    const seconds = (percent * totalBeats) / (bpm / 60);
    audio.currentTime = seconds;
    updateMarkerPosition();
  };

  setInterval(() => {
    if (isPlaying) updateMarkerPosition();
  }, 50);
};

function updateMarkerPosition() {
  const percent = (getCurrentBeat() % totalBeats) / totalBeats;
  marker.style.left = `${percent * timeline.clientWidth}px`;
}

function getCurrentBeat() {
  return (audio.currentTime) * (bpm / 60);
}

function refreshKeyframeList() {
  const list = document.getElementById('keyframeList');
  list.innerHTML = '';
  keyframes.forEach((kf, i) => {
    const div = document.createElement('div');
    div.textContent = `Beat: ${kf.beat}, Ease: ${kf.ease}, Duration: ${kf.duration}`;
    div.style.cursor = 'pointer';
    div.style.background = (i === selectedIndex) ? '#444' : 'transparent';
    div.onclick = () => {
      selectedIndex = i;
      refreshKeyframeList();
    };
    list.appendChild(div);
  });
}
