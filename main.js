/* eslint-disable no-plusplus */
/* eslint-disable no-mixed-operators */
/* eslint-disable func-names */
/**
 * 1 creat lists audio song x
 * 2 render audio x
 * 3 play audio / handle click btn icon play if audio play and pause if audio pause x
 * 4 rotate cd song x
 * 5 handle navbar progress x / time progress x / end song x
 * 6 handle change name Song, name singer and song when song change and bag color x
 * 7 next x / prev song x
 * 8 handle random song x
 * 9 handle replay song x
 * 10 handle voice song x
 * 11 handle when click bar contain list song x
 * 12 handle like song x
 */

window.onload = function () {
    const $ = document.querySelector.bind(document);
    const audio = document.getElementById('audio');
    const PLAYER_STORAGE_KEY = 'musicApp';
    const songCd = $('.song-cd');
    const appMusic = document.getElementById('app-music');
    const songCurrentTime = $('.progress-time__current');
    const songDurationTime = $('.progress-time__duration');
    const progress = $('.progress');
    const btnPrev = $('.btn-prev-song');
    const btnNext = $('.btn-next-song');
    const playSong = $('.btn-playAndPause');
    const btnRadom = $('.btn-random-song');
    const btnReplay = $('.btn-replay-song');
    const btnVolume = $('.btn-volume-song');
    const btnClose = $('.btn-close-list');
    const playList = $('.plays-list');
    const progressContain = $('.progress-contain');
    const btnHeart = $('.btn-heart');
    const btnListSong = $('.btn-list-song');
    // --------------variable
    let current = 0;
    let isPlay = false;
    let isRandom = false;
    let isReplay = false;
    let isVolume = true;
    let arrayRandom = [];
    let count = 0;
    const songCdRotate = songCd.animate([
        { transform: 'rotate(360deg)' },

    ], {
        duration: 10000,
        iterations: Infinity,
    });
    songCdRotate.pause();
    const config = JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {};
    function setConfig(value, key) {
        config[value] = key;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(config));
    }
    function showConfigInLocalStage() {
        btnRadom.classList.toggle('active', isRandom);
        btnReplay.classList.toggle('active', isReplay);
    }
    function loadConfig() {
        isRandom = config.isRandom;
        isReplay = config.isReplay;
    }
    // list songs
    const songColors = [
        '#c31432',
        '#bd9b99',
        '#999ca1',
        '#dad95f',
        '#f6dbc5',
        '#ca83bf',
    ];
    const songs = [
        {
            nameSong: 'To the Moon',
            nameSinger: 'holigan',
            img: './assets/img/totheMoon.jpg',
            path: './assets/music/ToTheMoon-hooligan-6484403.mp3',
            isLike: false,
            backgroundColor: 'linear-gradient(#c31432,#240b36)',
        },
        {
            nameSong: 'Love is Gone',
            nameSinger: 'Slander Dylan',
            img: './assets/img/b4396e86b75ce51bf24da5d27784f1a2.jpg',
            path: './assets/music/Love Is Gone - Slander_ Dylan Matthew.mp3',
            isLike: false,
            backgroundColor: 'linear-gradient(#bd9b99,#9a656b)',
        },
        {
            nameSong: 'Du Cho Mai Ve Sau',
            nameSinger: 'Bui Truong Linh',
            img: './assets/img/DuchoVeSau.jpg',
            path: './assets/music/Du Cho Mai Ve Sau - buitruonglinh.mp3',
            isLike: false,
            backgroundColor: 'linear-gradient(#999ca1,#2e2f31)',
        },
        {
            nameSong: 'Muon Roi Ma Sao Con',
            nameSinger: 'Son Tung',
            img: './assets/img/muonRoiMaSaoCon.jpg',
            path: './assets/music/Muon Roi Ma Sao Con - Son Tung M-TP.mp3',
            isLike: false,
            backgroundColor: 'linear-gradient(#dad95f,#CAC531)',
        },
        {
            nameSong: 'Tron Tim',
            nameSinger: 'Den',
            img: './assets/img/trontim.jpg',
            path: './assets/music/Tron Tim - Den_ MTV Band.mp3',
            isLike: false,
            backgroundColor: 'linear-gradient(#f6dbc5,#ccb28e)',
        },
        {
            nameSong: 'Build a Bitch',
            nameSinger: 'Bella Poarch',
            img: './assets/img/loi-bai-hat-build-a-bitch-64-size-640x335-znd.jpg',
            path: './assets/music/Build A Bitch - Bella Poarch.mp3',
            isLike: false,
            backgroundColor: 'linear-gradient(#ca83bf,#983a89)',
        },
    ];
    // event
    function handleEventAudio() {
        audio.onplay = function () {
            isPlay = true;
            playSong.classList.remove('fa-play-circle');
            playSong.classList.add('fa-pause-circle');
        };
        audio.onpause = function () {
            isPlay = false;
            playSong.classList.remove('fa-pause-circle');
            playSong.classList.add('fa-play-circle');
        };
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const barProgress = Math.floor(100 / audio.duration * audio.currentTime);
                progress.style.width = `${barProgress}%`;
                const getTimeSong = getCurrentTimeSong();
                songCurrentTime.innerText = getTimeSong;
            }
        };
        // set length of audio
        audio.onloadedmetadata = function () {
            const test = getDurationSong();
            songDurationTime.innerText = test;
        };
        // event when song ended
        audio.onended = function () {
            if (isReplay) {
                audio.loop = true;
            } else {
                nextSong();
            }
            audio.play();
        };
    }
    function handleEventClick() {
        // handle play audio / pause audio
        playSong.onclick = function () {
            if (isPlay) {
                audio.pause();
                songCdRotate.pause();
            } else {
                audio.play();
                songCdRotate.play();
            }
        };
        // event when next song click
        btnNext.onclick = function () {
            nextSong();
            songCdRotate.play();
            audio.play();
        };
        // event when prev song click
        btnPrev.onclick = function () {
            prevSong();
            songCdRotate.play();
            audio.play();
        };
        // handle event click bar progress
        progressContain.onclick = function (e) {
            const widthProgress = e.target.clientWidth;
            const locationProgressNew = e.offsetX;
            const currentProgress = Math.floor(locationProgressNew / widthProgress * 100);
            const seekTime = currentProgress / 100 * audio.duration;
            // reset audio.currentTime when progress change
            audio.currentTime = seekTime;
            progress.style.width = `${currentProgress}%`;
        };
        // event click heart
        btnHeart.addEventListener('click', (e) => {
            if (songs[current].isLike) {
                songs[current].isLike = false;
                e.target.classList.replace('fas', 'far');
            } else {
                songs[current].isLike = true;
                e.target.classList.replace('far', 'fas');
            }
        });
        // event click volume on / off
        btnVolume.addEventListener('click', (e) => {
            if (isVolume) {
                isVolume = false;
                e.target.classList.remove('fa-volume-up');
                e.target.classList.add('fa-volume-mute');
                audio.muted = true;
            } else {
                isVolume = true;
                e.target.classList.remove('fa-volume-mute');
                e.target.classList.add('fa-volume-up');
                audio.muted = false;
            }
        });
        // event random song
        btnRadom.onclick = function (e) {
            isRandom = !isRandom;
            setConfig('isRandom', isRandom);
            e.target.classList.toggle('active', isRandom);
        };
        // event replay song
        btnReplay.onclick = function (e) {
            isReplay = !isReplay;
            setConfig('isReplay', isReplay);
            e.target.classList.toggle('active', isReplay);
        };
        // event click list song
        btnListSong.onclick = function () {
            playList.style.transform = 'translateX(-100%)';
        };
        // event click close list
        playList.onclick = function (e) {
            const closeListSong = e.target.closest('.btn-close-list');
            if (closeListSong) {
                this.style.transform = 'translateX(0)';
            }
            const chooseSong = e.target.closest('.item-song:not(.active)');
            const option = e.target.closest('.btn-option');
            chooseSongActive(chooseSong, option);
        };
    }
    // -----------------------------------
    // function handle
    // handle render list song
    function renderSong() {
        const htmls = songs.map((song, index) => (`<div class="item-song ${index === current ? 'active' : ''}" data-index="${index}">
        <div class="item-song__img" style="background-image:url(${song.img});"></div>
        <div class="item-song__info">
            <div class="item-song__info-name-song">${song.nameSong}</div>
            <div class="item-song__info-singer-name">${song.nameSinger}</div>
        </div>
        <i class="btn-option fas fa-ellipsis-v"></i>
    </div>`));
        playList.innerHTML += htmls.join('');
    }
    // handle render song current
    function renderCurrentSong() {
        $('.song-title__name').innerText = `${songs[current].nameSong}`;
        $('.song-title__singer').innerText = `${songs[current].nameSinger}`;
        const imgPath = `url(${songs[current].img})`;
        songCd.style.backgroundImage = imgPath;
        appMusic.style.backgroundImage = `${songs[current].backgroundColor}`;
        audio.src = `${songs[current].path}`;
        // ----------- section play list
        playList.style.backgroundImage = `${songs[current].backgroundColor}`;
        $('.item-song.active').style.backgroundColor = `${songColors[current]}`;
        btnClose.style.backgroundColor = `${songColors[current]}`;
    }
    // get duration song
    function getDurationSong() {
        if (audio.duration) {
            const durationTimeSong = Math.floor(audio.duration);
            const minuteTime = Math.floor(durationTimeSong / 60);
            const secondsTime = Math.floor(durationTimeSong % 60);
            return secondsTime > 10 ? `0${minuteTime}:${secondsTime}`
                : `0${minuteTime}:0${secondsTime}`;
        }
        return '00:00';
    }
    // get current time song
    function getCurrentTimeSong() {
        const timeCurrent = Math.floor(audio.currentTime);
        let secondsTime = 0;
        let minuteTime = 0;
        if (timeCurrent < 60) {
            secondsTime = timeCurrent;
            return secondsTime.toString().length >= 2 ? `0${minuteTime}:${secondsTime}` : `0${minuteTime}:0${secondsTime}`;
        }
        if (timeCurrent >= 60) {
            minuteTime = Math.floor(timeCurrent / 60);
            secondsTime = Math.floor(timeCurrent % 60);
            if (minuteTime < 10) {
                return secondsTime < 10 ? `0${minuteTime}:0${secondsTime}` : `0${minuteTime}:${secondsTime}`;
            }
        }
        return '00:00';
    }
    // when song be activated
    function songActive() {
        $('.item-song.active').style.removeProperty('background-color');
        $('.item-song.active').classList.remove('active');
        const currentSong = $(`[data-index='${current}']`);
        currentSong.classList.add('active');
    }
    // when click btn next song
    function nextSong() {
        if (isRandom) {
            randomSong();
        } else {
            current += 1;
            if (current >= songs.length) {
                current = 0;
            }
        }
        songActive();
        renderCurrentSong();
        checkLike();
    }
    // WHEN click btn prev song
    function prevSong() {
        if (isRandom) {
            randomSong();
        } else {
            current -= 1;
            if (current < 0) {
                current = songs.length - 1;
            }
        }
        songActive();
        renderCurrentSong();
        checkLike();
    }
    // check like
    function checkLike() {
        if (!songs[current].isLike) {
            btnHeart.classList.replace('fas', 'far');
        } else {
            btnHeart.classList.replace('far', 'fas');
        }
    }
    // random song
    function randomSong() {
        let checkIndex = 0;
        let checkArray = false;
        do {
            const randomIndex = Math.floor(Math.random() * songs.length);
            checkIndex = randomIndex;
            checkArray = arrayRandom.includes(checkIndex);
        } while (checkIndex === current || checkArray);
        arrayRandom[count] = checkIndex;
        count += 1;
        if (count >= songs.length) {
            arrayRandom = [];
            count = 0;
        }
        current = checkIndex;
    }
    // choose song
    function chooseSongActive(data, data2) {
        if (data && !data2) {
            current = Number(data.dataset.index);
            songActive();
            renderCurrentSong();
            songCdRotate.play();
            checkLike();
            audio.play();
        }
        /* if (data2) {
        } */
    }
    // ------------------------
    function start() {
        loadConfig();
        showConfigInLocalStage();
        handleEventClick();
        handleEventAudio();
        renderSong();
        renderCurrentSong();
        checkLike();
    }
    start();
};
