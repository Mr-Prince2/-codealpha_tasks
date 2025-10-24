const songs = [
  { title: "Blinding Lights", artist: "The Weeknd", src: "songs/blinding-lights.mp3" },
  { title: "Levitating", artist: "Dua Lipa", src: "songs/levitating.mp3" },
  { title: "Senorita", artist: "Shawn Mendes & Camila Cabello", src: "songs/senorita.mp3" },
  { title: "Shape of You", artist: "Ed Sheeran", src: "songs/shape-of-you.mp3" },
  { title: "Circles", artist: "Post Malone", src: "songs/circles.mp3" },
  { title: "Heat Waves", artist: "Glass Animals", src: "songs/heat-waves.mp3" },
  { title: "Stay", artist: "The Kid LAROI & Justin Bieber", src: "songs/stay.mp3" },
  { title: "Drivers License", artist: "Olivia Rodrigo", src: "songs/drivers-license.mp3" },
  { title: "Peaches", artist: "Justin Bieber ft. Daniel Caesar & Giveon", src: "songs/peaches.mp3" },
  { title: "Bad Guy", artist: "Billie Eilish", src: "songs/bad-guy.mp3" }
];

let songIndex = 0;

const audio = document.getElementById("audio");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const progress = document.getElementById("progress");
const progressContainer = document.getElementById("progress-container");
const volumeControl = document.getElementById("volume");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");
const playlistEl = document.getElementById("playlist");

// --- Load Song ---
function loadSong(song) {
  title.textContent = song.title;
  artist.textContent = song.artist;
  audio.src = song.src;
  highlightPlaylist();
}

// --- Play / Pause ---
function playSong() { audio.play(); playBtn.textContent = "⏸"; }
function pauseSong() { audio.pause(); playBtn.textContent = "▶"; }

// --- Next / Previous ---
function nextSong() { songIndex = (songIndex + 1) % songs.length; loadSong(songs[songIndex]); playSong(); }
function prevSong() { songIndex = (songIndex - 1 + songs.length) % songs.length; loadSong(songs[songIndex]); playSong(); }

// --- Progress ---
function updateProgress(e) {
  const { currentTime, duration } = e.srcElement;
  if (!duration) return;
  const progressPercent = (currentTime / duration) * 100;
  progress.style.width = `${progressPercent}%`;

  const currentMin = Math.floor(currentTime / 60);
  const currentSec = Math.floor(currentTime % 60);
  const durationMin = Math.floor(duration / 60);
  const durationSec = Math.floor(duration % 60);

  currentTimeEl.textContent = `${currentMin}:${currentSec < 10 ? "0"+currentSec : currentSec}`;
  durationEl.textContent = `${durationMin}:${durationSec < 10 ? "0"+durationSec : durationSec}`;
}
function setProgress(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  audio.currentTime = (clickX / width) * audio.duration;
}

// --- Volume ---
function changeVolume() { audio.volume = volumeControl.value; }

// --- Playlist ---
function buildPlaylist() {
  songs.forEach((song, index) => {
    const li = document.createElement("li");
    li.textContent = `${song.title} - ${song.artist}`;
    li.addEventListener("click", () => { songIndex = index; loadSong(songs[songIndex]); playSong(); });
    playlistEl.appendChild(li);
  });
}
function highlightPlaylist() {
  Array.from(playlistEl.children).forEach((li, index) => li.classList.toggle("active", index === songIndex));
}

// --- Keyboard Controls ---
document.addEventListener("keydown", e => {
  if (e.code === "Space") { e.preventDefault(); audio.paused ? playSong() : pauseSong(); }
  if (e.code === "ArrowRight") nextSong();
  if (e.code === "ArrowLeft") prevSong();
  if (e.code === "ArrowUp") volumeControl.value = Math.min(1, +volumeControl.value + 0.05), changeVolume();
  if (e.code === "ArrowDown") volumeControl.value = Math.max(0, +volumeControl.value - 0.05), changeVolume();
});

// --- Event Listeners ---
playBtn.addEventListener("click", () => audio.paused ? playSong() : pauseSong());
nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);
audio.addEventListener("timeupdate", updateProgress);
progressContainer.addEventListener("click", setProgress);
volumeControl.addEventListener("input", changeVolume);
audio.addEventListener("ended", nextSong);

// --- Init ---
buildPlaylist();
loadSong(songs[songIndex]);
