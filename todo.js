// Tambahkan kode ini di bagian atas file JavaScript Anda
let spotifyPlayer = null;
let isSpotifyOpen = false;

// Fungsi untuk membuat dan menampilkan Spotify player
function createSpotifyPlayer() {
    if (!spotifyPlayer) {
        // Buat container untuk Spotify
        spotifyPlayer = document.createElement('div');
        spotifyPlayer.id = 'spotify-player';
        spotifyPlayer.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 300px;
            height: 380px;
            background: white;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 1000;
            display: none;
        `;

        // Tambahkan iframe Spotify
        const spotifyIframe = document.createElement('iframe');
        spotifyIframe.style.borderRadius = '10px';
        spotifyIframe.src = "https://open.spotify.com/embed/playlist/1mfuKA5qmOUWvOvMhN5rA4?utm_source=generator"; // Playlist untuk fokus belajar
        spotifyIframe.width = "100%";
        spotifyIframe.height = "380";
        spotifyIframe.frameBorder = "0";
        spotifyIframe.allowfullscreen = "";
        spotifyIframe.allow = "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
        spotifyIframe.loading = "lazy";

        spotifyPlayer.appendChild(spotifyIframe);

        // Tambahkan tombol close
        const closeButton = document.createElement('button');
        closeButton.innerHTML = '✖';
        closeButton.style.cssText = `
            position: absolute;
            top: -10px;
            right: -10px;
            background: #ff4444;
            color: white;
            border: none;
            border-radius: 50%;
            width: 25px;
            height: 25px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
        `;
        closeButton.onclick = toggleSpotifyPlayer;
        spotifyPlayer.appendChild(closeButton);

        // Tambahkan ke body
        document.body.appendChild(spotifyPlayer);
    }
}

// Fungsi untuk toggle tampilan Spotify player
function toggleSpotifyPlayer() {
    if (!spotifyPlayer) {
        createSpotifyPlayer();
    }
    isSpotifyOpen = !isSpotifyOpen;
    spotifyPlayer.style.display = isSpotifyOpen ? 'block' : 'none';
}

// Buat tombol untuk Spotify
function createSpotifyButton() {
    const spotifyButton = document.createElement('button');
    spotifyButton.id = 'spotify-button';
    spotifyButton.innerHTML = '🎵'; // Emoji musik
    spotifyButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #1DB954; /* Warna Spotify */
        color: white;
        border: none;
        cursor: pointer;
        font-size: 20px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 999;
    `;
    spotifyButton.onclick = toggleSpotifyPlayer;
    document.body.appendChild(spotifyButton);
}

// Panggil fungsi ini saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    createSpotifyButton();
});

// Variabel untuk audio notifikasi
const notificationSound = new Audio('soundnotification.mp3');

// Pomodoro Timer
let timerInterval;
const workTimeInput = document.getElementById('workTime');
const breakTimeInput = document.getElementById('breakTime');
const startTimerButton = document.getElementById('startTimer');
const stopTimerButton = document.getElementById('stopTimer');
const timerDisplay = document.getElementById('timerDisplay');

let isWorkTime = true;
let remainingTime = 0;
let workTime = 0;
let breakTime = 0;

// Variabel untuk melacak tugas saat ini
let currentTask = null;
let isTaskSessionComplete = false;

// Fungsi untuk memulai timer
function startTimer(task = null) {
    // Jika ada tugas baru, reset status
    if (task) {
        currentTask = task;
        isTaskSessionComplete = false;
    }

    // Hentikan timer yang sedang berjalan
    if (timerInterval) clearInterval(timerInterval);

    // Ambil waktu belajar atau istirahat
    workTime = parseInt(workTimeInput.value) * 60;
    breakTime = parseInt(breakTimeInput.value) * 60;
    
    // Tentukan waktu berdasarkan sesi
    remainingTime = isWorkTime ? workTime : breakTime;

    // Perbarui tampilan timer
    updateTimerDisplay(remainingTime);

    // Jalankan timer
    timerInterval = setInterval(() => {
        if (remainingTime > 0) {
            remainingTime--;
            updateTimerDisplay(remainingTime);
        } else {
            // Hentikan interval
            clearInterval(timerInterval);
            
            // Mainkan notifikasi
            playNotificationWithAlert();
        }
    }, 1000);

    // Tambahkan kode untuk memastikan timer berjalan otomatis setelah dipindahkan
    startTimerButton.disabled = true;
    stopTimerButton.disabled = false;
}

// Fungsi untuk memperbarui tampilan timer
function updateTimerDisplay(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// Fungsi untuk berhenti timer
function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
        timerDisplay.textContent = '00:00';
        notificationSound.onended = null;

        // Reset tombol
        startTimerButton.disabled = false;
        stopTimerButton.disabled = true;
    }
}


// Fungsi untuk memutar suara notifikasi dan menampilkan alert
function playNotificationWithAlert() {
    // Mainkan suara notifikasi
    notificationSound.currentTime = 0;
    notificationSound.play();

    // Tunggu suara selesai
    notificationSound.onended = () => {
        // Tentukan pesan berdasarkan sesi
        const message = isWorkTime 
            ? "Waktu belajar telah selesai. Istirahat dulu!" 
            : "Waktu istirahat selesai. Saatnya belajar!";

        // Tampilkan alert
        alert(message);

        // Cek apakah tugas sedang dikerjakan
        if (currentTask) {
            // Jika sesi istirahat selesai
            if (!isWorkTime) {
                isTaskSessionComplete = true;
            }

            // Tandai tugas selesai jika kedua sesi telah diselesaikan
            if (isTaskSessionComplete && !isWorkTime) {
                markTaskComplete(currentTask);
                currentTask = null;
                isTaskSessionComplete = false;
            }
        }

        // Beralih sesi
        isWorkTime = !isWorkTime;

        // Mulai timer sesi berikutnya secara otomatis
        startTimer();
    };
}

// Fungsi untuk menandai tugas selesai
function markTaskComplete(task) {
    if (!task) return;

    // Cari elemen tugas di DOM
    const taskItems = document.querySelectorAll('#taskList li');
    taskItems.forEach(taskItem => {
        const taskSpan = taskItem.querySelector('span');
        if (taskSpan.dataset.text === task.text) {
            // Tambahkan kelas completed
            taskItem.classList.add('completed');
            
            // Simpan perubahan
            saveTasks();
        }
    });
}

// Fungsi untuk memindahkan tugas ke Pomodoro Timer
function moveToPomodoroTimer(taskTitle, workTime, breakTime) {
    // Cari tugas di daftar
    const taskItems = document.querySelectorAll('#taskList li');
    let taskToMove = null;

    taskItems.forEach(taskItem => {
        const taskSpan = taskItem.querySelector('span');
        if (taskSpan.dataset.text === taskTitle) {
            taskToMove = {
                text: taskTitle,
                workTime: workTime,
                breakTime: breakTime
            };
        }
    });

    if (taskToMove) {
        // Set waktu belajar dan istirahat
        workTimeInput.value = workTime;
        breakTimeInput.value = breakTime;
        
        // Atur ulang sesi ke waktu belajar
        isWorkTime = true;

        // Mulai timer dengan tugas yang dipilih
        startTimer(taskToMove);
    }
}

// Event listeners untuk tombol timer
startTimerButton.addEventListener('click', () => startTimer());
stopTimerButton.addEventListener('click', stopTimer);

// Inisialisasi tombol stop sebagai disabled
stopTimerButton.disabled = true;


// To-Do List
const taskInput = document.getElementById('taskInput');
const addTaskButton = document.getElementById('addTask');
const taskList = document.getElementById('taskList');

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach((task) => {
        // Pastikan data workTime dan breakTime di-cast ke integer agar tidak bertambah
        addTaskToDOM(task.text, parseInt(task.workTime), parseInt(task.breakTime), task.completed);
    });
}

function saveTasks() {
    const tasks = [];
    document.querySelectorAll('#taskList li').forEach((taskItem) => {
        tasks.push({
            text: taskItem.querySelector('span').dataset.text,
            workTime: parseInt(taskItem.dataset.workTime), // Pastikan disimpan sebagai integer
            breakTime: parseInt(taskItem.dataset.breakTime), // Pastikan disimpan sebagai integer
            completed: taskItem.classList.contains('completed'),
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function addTaskToDOM(taskText, workTime = 25, breakTime = 5, completed = false) {
    const taskItem = document.createElement('li');
    taskItem.className = 'list-group-item d-flex justify-content-between align-items-center';
    taskItem.dataset.workTime = workTime;
    taskItem.dataset.breakTime = breakTime;

    if (completed) taskItem.classList.add('completed');

    const taskSpan = document.createElement('span');
    taskSpan.textContent = `${taskText} (Belajar: ${workTime}m, Istirahat: ${breakTime}m)`;
    taskSpan.dataset.text = taskText; // Simpan teks asli tugas

    taskItem.appendChild(taskSpan);

    const taskButtons = document.createElement('div');
    const completeButton = document.createElement('button');
    completeButton.textContent = '✔';
    completeButton.className = 'btn btn-sm btn-outline-success me-2';
    completeButton.onclick = () => {
        taskItem.classList.toggle('completed');
        saveTasks();
    };

    const deleteButton = document.createElement('button');
    deleteButton.textContent = '✖';
    deleteButton.className = 'btn btn-sm btn-outline-danger me-2';
    deleteButton.onclick = () => {
        taskItem.remove();
        saveTasks();
    };

    // Tombol "Pindahkan ke Timer"
    const moveToTimerButton = document.createElement('button');
    moveToTimerButton.textContent = '⏱';
    moveToTimerButton.className = 'btn btn-sm btn-outline-primary';
    moveToTimerButton.onclick = () => {
        moveToPomodoroTimer(taskText, workTime, breakTime);
    };

    taskButtons.appendChild(completeButton);
    taskButtons.appendChild(deleteButton);
    taskButtons.appendChild(moveToTimerButton);
    taskItem.appendChild(taskButtons);

    taskList.appendChild(taskItem);
    saveTasks();
}

// Fungsi untuk memindahkan data ke Pomodoro Timer
function moveToPomodoroTimer(taskTitle, workTime, breakTime) {
    workTimeInput.value = workTime;
    breakTimeInput.value = breakTime;
    
    // Gunakan fungsi startTimer dengan parameter tugas
    startTimer({
        text: taskTitle,
        workTime: workTime,
        breakTime: breakTime
    });
    
    alert(`Tugas "${taskTitle}" telah dipindahkan ke Pomodoro Timer!`);
}

addTaskButton.onclick = () => {
    const taskText = taskInput.value.trim();
    const workTime = prompt('Masukkan waktu belajar (menit):', '25');
    const breakTime = prompt('Masukkan waktu istirahat (menit):', '5');

    if (taskText !== '' && workTime && breakTime) {
        addTaskToDOM(taskText, parseInt(workTime), parseInt(breakTime));
        saveTasks();
        taskInput.value = '';
    }
};

loadTasks();