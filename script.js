const songs = [
    { title: "Jaatta ka chhora", artist: "Mika Singh", cover: "images/jaatta-ka-chhora.jpg", src: "songs/jaatta-ka-chhora.mp3" },
    { title: "Paradox", artist: "Danda Nyoliwala", cover: "images/paradox.jpg", src: "songs/Paradox.mp3" },
    { title: "Panamera", artist: "Danda Nyoliwala", cover: "images/panamera.jpg", src: "songs/Panamera.mp3" },
    { title: "Maruti", artist: "Danda Nyoliwala", cover: "images/maruti.jpg", src: "songs/Maruti.mp3" },
    { title: "Gaddafi", artist: "Danda Nyoliwala", cover: "images/panamera.jpg", src: "songs/Gaddafi.mp3" },
    { title: "Not Guilty", artist: "Danda Nyoliwala", cover: "images/not guilty.jpg", src: "songs/Not Guilty.mp3" },
    { title: "Tension", artist: "Danda Nyoliwala", cover: "images/tension.jpg", src: "songs/Tension.mp3" },
    { title: "Deadly Zone", artist: "Danda Nyoliwala", cover: "images/deadly zone.jpg", src: "songs/Deadly Zone.mp3" },
    { title: "Boom Shaka", artist: "Danda Nyoliwala & Krsna", cover: "images/boom-shaka.jpg", src: "songs/Boom Shaka.mp3" },
    { title: "Knife Brows", artist: "Danda Nyoliwala", cover: "images/knife brows.jpg", src: "songs/Knife Brows.mp3" },
    { title: "Underground", artist: "Danda Nyoliwala", cover: "images/underground.jpg", src: "songs/Underground.mp3" },
    { title: "Vomit On Paper", artist: "Danda Nyoliwala", cover: "images/vomit on paper.jpg", src: "songs/Vomit On Paper.mp3" },
    { title: "Up to you", artist: "Danda Nyoliwala", cover: "images/up to you.jpg", src: "songs/Up To You.mp3" },
    { title: "Chora baba ka", artist: "Danda Nyoliwala & Raftaar", cover: "images/chora baba ka.jpg", src: "songs/Chora baba ka.mp3" },

];

const audio = new Audio();
const grid = document.querySelector(".browse-title");
const searchInput = document.querySelector(".search-bar input");
const playBtn = document.getElementById("play-btn")
const playerTitle = document.getElementById("player-title")
const playerCover = document.querySelector(".player-cover")



let currentIndex = 0;
let currentUrl = null;
let currentTitle = null;

if ("mediaSession" in navigator) {
    navigator.mediaSession.setActionHandler("play", function () { audio.play(); });
    navigator.mediaSession.setActionHandler("pause", function () { audio.pause(); });
    navigator.mediaSession.setActionHandler("nexttrack", function () { nextBtn.click(); });
    navigator.mediaSession.setActionHandler("previoustrack", function () { previousBtn.click(); });
}

function playSong(song) {
    currentIndex = songs.indexOf(song);
    currentTitle = song.title;

    if ("mediaSession" in navigator) {
        navigator.mediaSession.setActionHandler("play", function () { audio.play(); });
        navigator.mediaSession.setActionHandler("pause", function () { audio.pause(); });
        navigator.mediaSession.setActionHandler("nexttrack", function () { nextBtn.click(); });
        navigator.mediaSession.setActionHandler("previoustrack", function () { previousBtn.click(); });
    }

    playerTitle.textContent = song.title;
    playerCover.src = song.cover;
    document.getElementById("player-artist").textContent = song.artist;
    document.querySelectorAll(".box").forEach(function (box) {
        box.classList.toggle("playing", box.dataset.title === song.title);          // Green border
    });

    fetch(song.src)
        .then(function (res) { return res.blob(); })
        .then(function (blob) {
            if (currentUrl) URL.revokeObjectURL(currentUrl);   // free the old song
            currentUrl = URL.createObjectURL(blob);
            audio.src = currentUrl;
            audio.play().catch(console.log);
        });

}


audio.addEventListener("ended", function () {
    const nextIndex = (currentIndex + 1) % songs.length;
    playSong(songs[nextIndex]);
})

const previousBtn = document.getElementById("prev-btn")
const nextBtn = document.getElementById("next-btn")

previousBtn.addEventListener("click", function () {
    if (currentIndex == 0) {
        playSong(songs[currentIndex])
    }
    else {
        playSong(songs[currentIndex - 1]);
    }

})
nextBtn.addEventListener("click", function () {
    const nextIndex = (currentIndex + 1) % songs.length;
    playSong(songs[nextIndex]);
})

const volumeBar = document.getElementById("volume-bar")

volumeBar.addEventListener("input", function () {
    audio.volume = volumeBar.value
})


function renderSongs(list) {
    grid.innerHTML = "";


    list.forEach(function (song) {

        const card = document.createElement("div");
        card.classList.add("box");
        card.dataset.title = song.title;
        grid.appendChild(card);

        card.innerHTML = `
        <img src="${song.cover}" alt="${song.title}">
        <h3>${song.title}</h3>
        <p>${song.artist}</p>
    `;

        card.classList.toggle("playing", song.title === currentTitle);

        card.addEventListener("click", function () {
            playSong(song);
        });
    });


}
renderSongs(songs);





searchInput.addEventListener("input", function () {
    const text = searchInput.value.toLowerCase()

    const filtered = songs.filter(function (song) {
        return song.title.toLowerCase().includes(text) ||
            song.artist.toLowerCase().includes(text);
    });
    renderSongs(filtered);

});



playBtn.addEventListener("click", function () {
    if (audio.paused) {
        audio.play();
    }
    else {
        audio.pause();
    }
    playBtn.blur();
});

audio.addEventListener("play", function () {
    playBtn.textContent = "⏸"
})

audio.addEventListener("pause", function () {
    playBtn.textContent = "▶"
})

document.getElementById("back-btn").addEventListener("click", function () {
    audio.currentTime -= 10;
});

document.getElementById("forward-btn").addEventListener("click", function () {
    audio.currentTime += 10;
});

const seekBar = document.getElementById("seek-bar");
const currentTimeEl = document.getElementById("current-time");
const totalTimeEl = document.getElementById("total-time");

function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return min + ":" + (sec < 10 ? "0" + sec : sec);
}

audio.addEventListener("loadedmetadata", function () {
    seekBar.max = audio.duration;
    totalTimeEl.textContent = formatTime(audio.duration);
});


audio.addEventListener("timeupdate", function () {
    seekBar.value = audio.currentTime;
    currentTimeEl.textContent = formatTime(audio.currentTime);
    const percent = (audio.currentTime / audio.duration) * 100;
    seekBar.style.background = `linear-gradient(to right, var(--text-bright-accent) ${percent}%, var(--essential-subdued) ${percent}%)`;
});

seekBar.addEventListener("input", function () {
    audio.currentTime = seekBar.value;
});


document.addEventListener("keydown", function (event) {
    if (event.code !== "Space") return;
    if (event.target.tagName === "INPUT") return;

    if (!audio.src) return;

    event.preventDefault();

    if (audio.paused) {
        audio.play().catch(console.log);
    } else {
        audio.pause();
    }
})