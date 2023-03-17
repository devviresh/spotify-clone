import { fetchRequest } from "../api";
import { ENDPOINT, LOADED_TRACKS, logout, SECTIONTYPE, setItemsInLocalStorage } from "../common";
const audio = new Audio();

const onProfileClick = (event) => {
    event.stopPropagation();
    const profileMenu = document.getElementById("profile-menu");
    profileMenu.classList.toggle("hidden");
    if (!profileMenu.classList.contains("hidden")) {
        profileMenu.querySelector("li#logout").addEventListener("click", logout);
    }
};
const loadUserProfile = async () => {
    const profileButton = document.getElementById("profile-btn");
    const defaultImage = document.getElementById("default-image");
    const displayName = document.getElementById("display-name");
    const profileImage = document.getElementById("profile-image");

    const { display_name: Name, images } = await fetchRequest(ENDPOINT.userInfo);
    //   console.log(await fetchRequest(ENDPOINT.userInfo));
    if (images?.length) {
        defaultImage.classList.add("hidden");
        profileImage.classList.remove("hidden");
        profileImage.setAttribute("src", images[0].url);
    } else {
        defaultImage.classList.remove("hidden");
        profileImage.classList.add("hidden");
    }

    displayName.textContent = Name;

    profileButton.addEventListener("click", onProfileClick);
};

// load playlist page on click on playlist item on dashboard
const onPlaylistItemClick = (event, id) => {
    // console.log(event.target);
    const section = { type: SECTIONTYPE.PLAYLIST, playlist: id };
    history.pushState(section, "", `playlist/${id}`);
    loadSection(section);
};

// load playlist in a particular section on dashboard
const loadPlaylist = async (endpoint, playlistId) => {
    //   const sectionName = document.getElementById("section-name");
    const {
        message,
        playlists: { items },
    } = await fetchRequest(endpoint);
    //   sectionName.textContent = message; //section name
    const playlistItemsSection = document.getElementById(`${playlistId}`);

    for (let {
        name,
        description,
        images: [{ url }],
        id,
    } of items) {
        const playlistItem = document.createElement("section");
        playlistItem.className =
            "rounded-md bg-black-secondary p-4 hover:bg-light-black cursor-pointer";
        playlistItem.id = id;
        playlistItem.setAttribute("data-type", "playlist");
        playlistItem.addEventListener("click", (event) => onPlaylistItemClick(event, id));

        playlistItem.innerHTML = `<img class="rounded-md mb-3" src="${url}" alt="${name}">
        <h2 class="text-base font-semibold py-2 truncate">${name}</h2>
        <h3 class="text-sm text-secondary line-clamp-2">${description}</h3>
    `;
        playlistItemsSection.appendChild(playlistItem);
    }
};

// const createPlaylistSection = (playlistId,sectionName) => {
//     const mainContent = document.getElementById("main-content");
//     let section=`<article class="p-4">
//     <h1 class="text-2xl font-bold mb-4 capitalize" id="section-name">Section name</h1>
//     <section id="${sectionName}" class="grid grid-cols-auto-fill-cards gap-6">
//     </section>
//   </article>`;
//     mainContent.appendChild(section);
//     loadPlaylist(ENDPOINT.playlistId, "sectionName");
// }

// create the section for loading playlists on dashboard
const createPlaylistSections = () => {
    const mainContent = document.getElementById("main-content");
    const playlistMap = new Map([
        ["featured", "featured-playlist-items"],
        ["top playlists", "top-playlist-items"],
    ]);

    let section = "";
    for (let [type, id] of playlistMap) {
        section += `<article class="p-4">
        <h1 class="text-2xl font-bold mb-4 capitalize" id="section-name">${type}</h1>
        <section id="${id}" class="grid grid-cols-auto-fill-cards gap-6">
        </section>
      </article>`;
    }
    mainContent.innerHTML = section;
};

// load all playlists in an playlist section on dashboard
const loadPlaylistsAll = () => {
    loadPlaylist(ENDPOINT.featuredPlaylist, "featured-playlist-items");
    loadPlaylist(ENDPOINT.topLists, "top-playlist-items");
};

// format the duration of track
const formatTime = (duration) => {
    const min = Math.floor(duration / 60_000);
    const sec = ((duration % 6_000) / 1000).toFixed(0);
    const formattedTime = sec == 60 ? min + 1 + ":00" : min + ":" + (sec < 10 ? "0" : "") + sec;
    return formattedTime;
};

// on clicking a track show it's selected
const onTrackSelection = (id, event) => {
    document.querySelectorAll("#tracks .track").forEach((trackItem) => {
        if (trackItem.id === id) {
            trackItem.classList.add("bg-gray", "selected");
        } else {
            trackItem.classList.remove("bg-gray", "selected");
        }
    });
};

const updateIconsForPlaymode = (id) => {
    const playButton = document.getElementById("play");
    playButton.querySelector("span").textContent = "pause_circle";
    const playingTrackButton = document.querySelector(`#play-track-${id}`);
    if (playingTrackButton) {
        playingTrackButton.textContent = "pause";
    }
};

const updateIconsForPausemode = (id) => {
    const playButton = document.getElementById("play");
    playButton.querySelector("span").textContent = "play_circle";
    const playingTrackButton = document.querySelector(`#play-track-${id}`);
    if (playingTrackButton) {
        playingTrackButton.textContent = "play_arrow";
    }
};

// show the total-duration of song when played
const onAudioMetaDataLoaded = (id) => {
    const totalSongDuration = document.getElementById("total-song-duration");
    totalSongDuration.textContent = `0:${audio.duration.toFixed(0)}`;
    // updateIconsForPlaymode(id);
};

// const onNowPlayingPlayButtonClick = (id) => {
//     if (audio.paused) {
//         audio.play();
//         updateIconsForPlaymode(id);
//     } else {
//         audio.pause();
//         updateIconsForPausemode(id);
//     }
// };

const togglePlay = () => {
    if (audio.src) {
        if (audio.paused) {
            audio.play();
        } else {
            audio.pause();
        }
    }
};

const playNextTrack = () => {};

const playPrevTrack = () => {};

// show the sontent on play-bar when a track is played
const onPlayTrack = (event, { image, name, artistNames, previewUrl, duration, id }) => {
    if (event?.stopPropagation) {
        event.stopPropagation();
    }

    // console.log(image, name, artistNames, previewUrl, duration, id)
    if (audio.src === previewUrl) {
        togglePlay();
    } else {
        const nowPlayingSongImage = document.getElementById("now-playing-image");
        const nowPlayingSongName = document.getElementById("now-playing-song");
        const nowPlayingSongArtist = document.getElementById("now-playing-artist");
        const audioControl = document.getElementById("audio-control");

        audioControl.setAttribute("data-track-id", id);
        nowPlayingSongImage.src = image.url;
        nowPlayingSongName.innerText = name;
        nowPlayingSongArtist.textContent = artistNames;

        audio.src = previewUrl;
        // audio.removeEventListener("loadedmetadata", () => onAudioMetaDataLoaded(id));
        // audio.addEventListener("loadedmetadata", () => onAudioMetaDataLoaded(id));
        // playButton.addEventListener("click", () => onNowPlayingPlayButtonClick(id));
        audio.play();
        // clearInterval(progressInterval);
        // progressInterval = setInterval(() => {
        //     if (audio.paused) {
        //         return;
        //     }
        //     songDurationCompleted.textContent = `${
        //         audio.currentTime.toFixed(0) < 10
        //             ? "0:0" + audio.currentTime.toFixed(0)
        //             : "0:" + audio.currentTime.toFixed(0)
        //     }`;
        //     songProgress.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
        // }, 100);
    }
};

// load songData/tracks
const loadtracks = ({ tracks }) => {
    const trackSection = document.getElementById("tracks");

    let trackNo = 1;

    const loadedTracks = [];

    for (let trackItem of tracks.items.filter(item => item.track.preview_url)) {
        let {
            id,
            artists,
            name,
            album,
            duration_ms: duration,
            preview_url: previewUrl,
        } = trackItem.track;
        let track = document.createElement("section");
        track.id = id;
        track.className =
            "track grid grid-cols-[50px_1fr_1fr_50px] items-center justify-items-start gap-4 text-secondary rounded-md hover:bg-light-black p-1";
        let image = album.images.find((img) => img.height === 64);
        let artistNames = Array.from(artists, (artist) => artist.name).join(", ");
        track.innerHTML = `
        <p class="flex items-center justify-center relative justify-self-center"><span class="track-no">${trackNo++}</span></p>
        <section class="grid grid-cols-[auto_1fr] place-items-center gap-4">
            <img class="h-10 w-10" src="${image.url}" alt="${name}">
            <article>
            <h2 class="song-title text-white text-base line-clamp-1">${name}</h2>
            <p class="text-sm line-clamp-1">${artistNames}</p>
                </article>
        </section>
        <p class="text-sm">${album.name}</p>
        <p class="text=sm">${formatTime(duration)}</p>`;

        track.addEventListener("click", (event) => onTrackSelection(id, event));

        const playButton = document.createElement("button");
        playButton.id = `play-track-${id}`;
        playButton.className = `play w-full absolute right-1 invisible material-symbols-outlined`;
        playButton.textContent = "play_arrow";
        playButton.addEventListener("click", (event) =>
            onPlayTrack(event, { image, name, artistNames, previewUrl, duration, id })
        );

        track.querySelector("p").appendChild(playButton);
        trackSection.appendChild(track);
        loadedTracks.push({id, artistNames, name, album, duration, previewUrl, image});
    }
    setItemsInLocalStorage(LOADED_TRACKS, loadedTracks);
};

// load trackheader on playlist page and cover-content
const loadTracksAll = async (playlistId) => {
    const playlist = await fetchRequest(`${ENDPOINT.playlist}/${playlistId}`);
    const { name, description, images, tracks } = playlist;
    const coverElement = document.querySelector("#cover-content");
    coverElement.innerHTML = `
    <img class="object-contain h-40 w-40" src="${images[0].url}" alt="">
    <section class="self-center">
    <h2 id="playlist-name" class="text-6xl">${name}</h2>
    <p id="playlist-artists">${description}</p>
    <p id="Playlist-details">${tracks.items.length} songs</p>
  </section>`;

    const mainContent = document.querySelector("#main-content");
    mainContent.innerHTML = `<header id="playlist-header" class="mx-8 py-4 mb-4 border-gray border-b-[0.5px] z-10   ">
    <nav>
        <ul class="grid grid-cols-[50px_1fr_1fr_50px] gap-4 text-secondary">
            <li class="justify-self-center">#</li>
            <li>Title</li>
            <li>Album</li>
            <li>clock</li>
        </ul>
    </nav>
  </header>
  <section id="tracks" class="px-8"></section>`;
    // console.log(playlist);
    loadtracks(playlist);
    // console.log(playlist.tracks);
};

const onContentScroll = (event) => {
    const { scrollTop } = event.target;
    const header = document.querySelector(".header");
    if (scrollTop >= header.offsetHeight) {
        header.classList.remove("bg-transparent");
        header.classList.add("sticky", "top-0", "bg-black");
    } else {
        header.classList.add("bg-transparent");
        header.classList.remove("sticky", "top-0", "bg-black");
    }

    if (history.state.type === SECTIONTYPE.PLAYLIST) {
        const coverElement = document.getElementById("cover-content");
        // console.log(coverElement);
        const playlistHeader = document.getElementById("playlist-header");
        if (scrollTop >= coverElement.offsetHeight - header.offsetHeight) {
            playlistHeader.classList.add("sticky", "bg-black-secondary", "px-8");
            playlistHeader.classList.remove("mx-8");
            playlistHeader.style.top = `${header.offsetHeight}px`;
        } else {
            playlistHeader.classList.remove("sticky", "bg-black-secondary", "px-8");
            playlistHeader.classList.add("mx-8");
            playlistHeader.style.top = `revert`;
        }
    }
};

// load the page depending which section belongs to either dashbard/playlist
const loadSection = (section) => {
    if (section.type === SECTIONTYPE.DASHBOARD) {
        createPlaylistSections();
        loadPlaylistsAll();
    } else if (section.type === SECTIONTYPE.PLAYLIST) {
        loadTracksAll(section.playlist);
    }
    document.querySelector(".content").addEventListener("scroll", onContentScroll);
};

document.addEventListener("DOMContentLoaded", () => {
    const volume = document.getElementById("volume");
    const playButton = document.getElementById("play");
    const songDurationCompleted = document.getElementById("song-duration-completed");
    const songProgress = document.getElementById("progress");
    const timeline = document.getElementById("timeline");
    const audioControl = document.getElementById("audio-control");
    const next = document.getElementById("next");
    const prev = document.getElementById("prev");

    let progressInterval;

    loadUserProfile();
    const section = { type: SECTIONTYPE.DASHBOARD };
    history.pushState(section, "", "");
    loadSection(section);

    document.addEventListener("click", () => {
        const profileMenu = document.getElementById("profile-menu");
        if (!profileMenu.classList.contains("hidden")) {
            profileMenu.classList.add("hidden");
        }
    });

    audio.addEventListener("play", () => {
        const selectedTrackId = audioControl.getAttribute("data-track-id");
        const tracks = document.getElementById("tracks");
        const playingTrack = tracks?.querySelector("section.playing");
        const selectedTrack = tracks?.querySelector(`[id="${selectedTrackId}]`);
        if (playingTrack?.id !== selectedTrack?.id) {
            playingTrack?.classList.remove("playing");
        }
        selectedTrack?.classList.add("playing");
        progressInterval = setInterval(() => {
            if (audio.paused) {
                return;
            }
            songDurationCompleted.textContent = `${
                audio.currentTime.toFixed(0) < 10
                    ? "0:0" + audio.currentTime.toFixed(0)
                    : "0:" + audio.currentTime.toFixed(0)
            }`;
            songProgress.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
        }, 100);
        updateIconsForPlaymode(selectedTrackId);
    });

    audio.addEventListener("pause", () => {
        if (progressInterval) {
            clearInterval(progressInterval);
        }
        const selectedTrackId = audioControl.getAttribute("data-track-id");
        updateIconsForPausemode(selectedTrackId);
    });

    audio.addEventListener("loadedmetadata", onAudioMetaDataLoaded());
    playButton.addEventListener("click", togglePlay);

    volume.addEventListener("change", () => {
        audio.volume = volume.value / 100;
    });

    timeline.addEventListener(
        "click",
        (event) => {
            const timeLineWidth = window.getComputedStyle(timeline).width;
            const timeToSeek = (event.offsetX / parseInt(timeLineWidth)) * audio.duration;
            audio.currentTime = timeToSeek;
            songProgress.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
        },
        false
    );

    next.addEventListener("click", playNextTrack);
    prev.addEventListener("click", playPrevTrack);

    window.addEventListener("popstate", (event) => {
        loadSection(event.state);
    });
});
