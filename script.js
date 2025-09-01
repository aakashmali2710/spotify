


let currentSong = new Audio();
let songs;
let currFolder;

function convertSecondsToMinSec(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(secs).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}








async function getsongs(folder) {
  currFolder = folder;


  let a = await fetch(`http://127.0.0.1:3000/${folder}/`)
  let response = await a.text();
  console.log(response)
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a")

  songs = []
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1])

    }

  }
// play the first song

  let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0]
  songul.innerHTML = ""
  for (const song of songs) {
    songul.innerHTML = songul.innerHTML + `<li><img width="32px" class="invert" src="music.svg" alt="">
                  <div class="info">
                    <div>${song.replaceAll("%20", "  ")}</div>
                    <div>Aakash</div>
                  </div>
                  <img width="30px"  class="invert" src="playb.svg" alt="">
                </li>`;

  }
  Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
    e.addEventListener("click", element => {
      console.log(e.querySelector(".info").firstElementChild.innerHTML)
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

    })


  })
  return songs
}


const playMusic = (track, pause = false) => {
  // let audio = new Audio("/songs/" + track)
  currentSong.src = `/${currFolder}/` + track
  if (!pause) {

    currentSong.play()
    play.src = "pause.svg"
  }



  document.querySelector(".songinfo").innerHTML = decodeURI(track)
  document.querySelector(".songtime").innerHTML = "0:0/0:0"
}


async function displayAlbums() {
  let a = await fetch(`http://127.0.0.1:3000/songs/`)
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a")
  let cardConatiner = document.querySelector(".cardconatiner")
  let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
      const e = array[index];
      
    
    if (e.href.includes("/songs")) {
      let folder = e.href.split("/").slice(-2)[0]

      //get the metadata of the folder
      let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`)
      let response = await a.json();
      console.log(response)
      cardConatiner.innerHTML = cardConatiner.innerHTML + `<div data-folder="${folder}"  class="card">
          <div class="play">
            <img width="10px" src="—Pngtree—vector play button icon_4184109.png" alt="">
          </div>
          <img src="/songs/${folder}/cover.jpg.jpg" alt="">
          <h2>${response.title}</h2>
          <p>${response.description}</p>
        </div>`
    }
  }
  
   // load playlist when card i clicked

   Array.from(document.getElementsByClassName("card")).forEach(e => {
    e.addEventListener("click", async item => {
      songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)
      playMusic(songs[0])

    })
  })
}
async function main() {


  // get the list of songs
  await getsongs("songs/ncs")
  playMusic(songs[0], true)

  //add albums of songs
  displayAlbums()

  // add event on play 
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play()
      play.src = "pause.svg"


    }
    else {
      currentSong.pause()
      play.src = "playb.svg"
    }

  })

  // listen to update a time
  currentSong.addEventListener("timeupdate", () => {
    console.log(currentSong.currenTime, currentSong.duration);
    document.querySelector(".songtime").innerHTML = `${convertSecondsToMinSec(currentSong.currentTime)}:${convertSecondsToMinSec(currentSong.duration)}`
    document.querySelector(".circle").style.left = (currentSong.currenTime / currentSong.duration) * 100 + "%";
  })

  // add sekkbar
  document.querySelector(".seekbar").addEventListener("click", e => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currenTime = ((currentSong.duration) * percent) / 100

  })

  // add humburger
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  })

  // add cancle button
  document.querySelector(".cancle").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-100%";
  })

  //add event on privious
  document.getElementById("previous").addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    if ((index - 1) > length) {
      playMusic(songs[index + 1])
    }
  })
  //add event on next
  document.getElementById("next").addEventListener("click", () => {
    currentSong.pause()

    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    if ((index + 1) < songs.length) {
      playMusic(songs[index + 1])
    }


  })

  // add event to volume
  document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
    console.log(e, e.target, e.target.value)
    currentSong.volume = (e.target.value) / 100
  })

 








}
main()

