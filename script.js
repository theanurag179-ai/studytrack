// ==========================================
// STUDYTRACK - STUDENT STUDY MANAGER
// Complete JavaScript
// ==========================================


// ---------- 1. STORAGE ----------

function loadData(key, fallback) {
    try {
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : fallback;
    } catch (error) {
        console.warn("Could not load saved data:", key);
        return fallback;
    }
}

let tasks = loadData("studyTrackTasks", []);
let subjects = loadData("studyTrackSubjects", [
    "Mathematics",
    "Science",
    "English"
]);

let totalStudySeconds =
    Number(localStorage.getItem("studyTrackStudySeconds")) || 0;

let studyActivityDates = loadData(
    "studyTrackActivityDates",
    []
);

let studyXP =
    Number(localStorage.getItem("studyTrackXP")) || 0;

let unlockedBadges = loadData(
    "studyTrackBadges",
    []
);

let exams = loadData("studyTrackExams", []);
let notes = loadData("studyTrackNotes", []);

if (!Array.isArray(tasks)) tasks = [];
if (!Array.isArray(subjects)) subjects = [];
if (!Array.isArray(studyActivityDates)) studyActivityDates = [];
if (!Array.isArray(unlockedBadges)) unlockedBadges = [];
if (!Array.isArray(exams)) exams = [];
if (!Array.isArray(notes)) notes = [];

let dailySeconds = loadData("studyTrackDailySeconds", {});

if (
    typeof dailySeconds !== "object" ||
    dailySeconds === null ||
    Array.isArray(dailySeconds)
) {
    dailySeconds = {};
}

let goalMinutes =
    Number(localStorage.getItem("studyTrackGoalMinutes")) || 120;

let flashcards = loadData("studyTrackFlashcards", []);

if (!Array.isArray(flashcards)) flashcards = [];

let editingNoteId = null;


function saveData() {
    localStorage.setItem(
        "studyTrackTasks",
        JSON.stringify(tasks)
    );

    localStorage.setItem(
        "studyTrackSubjects",
        JSON.stringify(subjects)
    );

    localStorage.setItem(
        "studyTrackStudySeconds",
        String(totalStudySeconds)
    );

    localStorage.setItem(
        "studyTrackActivityDates",
        JSON.stringify(studyActivityDates)
    );

    localStorage.setItem(
        "studyTrackXP",
        String(studyXP)
    );

    localStorage.setItem(
        "studyTrackBadges",
        JSON.stringify(unlockedBadges)
    );

    localStorage.setItem(
        "studyTrackExams",
        JSON.stringify(exams)
    );

    localStorage.setItem(
        "studyTrackNotes",
        JSON.stringify(notes)
    );

    localStorage.setItem(
        "studyTrackDailySeconds",
        JSON.stringify(dailySeconds)
    );
}


// ---------- 2. HELPER FUNCTIONS ----------

function getElement(id) {
    return document.getElementById(id);
}


function showToast(message) {
    const toast = getElement("toast");

    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(showToast.timeout);

    showToast.timeout = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}


function getToday() {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


function formatStudyTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }

    return `${minutes}m`;
}


function formatDate(dateString) {
    if (!dateString) return "No deadline";

    const parts = dateString.split("-");

    if (parts.length !== 3) return dateString;

    return new Date(
        Number(parts[0]),
        Number(parts[1]) - 1,
        Number(parts[2])
    ).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}


function createElement(tag, className, text) {
    const element = document.createElement(tag);

    if (className) {
        element.className = className;
    }

    if (text !== undefined) {
        element.textContent = text;
    }

    return element;
}


function saveFeatureData() {
    localStorage.setItem(
        "studyTrackActivityDates",
        JSON.stringify(studyActivityDates)
    );

    localStorage.setItem(
        "studyTrackXP",
        String(studyXP)
    );

    localStorage.setItem(
        "studyTrackBadges",
        JSON.stringify(unlockedBadges)
    );

    localStorage.setItem(
        "studyTrackExams",
        JSON.stringify(exams)
    );

    localStorage.setItem(
        "studyTrackNotes",
        JSON.stringify(notes)
    );
}


// ---------- 3. STUDENT PROFILE ----------

let studentName =
    localStorage.getItem("studyTrackStudentName") || "";


function openProfileModal(isEditing = false) {
    const modal = getElement("profileModal");
    const input = getElement("studentNameInput");
    const title = getElement("profileTitle");

    if (!modal || !input || !title) return;

    title.textContent = isEditing
        ? "Edit Your Profile"
        : "Welcome to StudyTrack!";

    input.value = studentName;

    modal.classList.add("active");

    setTimeout(() => {
        input.focus();
    }, 100);
}


function setupProfile() {
    if (!studentName) {
        openProfileModal(false);
    } else {
        updateWelcomeMessage();
    }
}


function updateWelcomeMessage() {
    const welcomeMessage = getElement("welcomeMessage");

    if (!welcomeMessage) return;

    const hour = new Date().getHours();

    let greeting = "Good morning";

    if (hour >= 12 && hour < 17) {
        greeting = "Good afternoon";
    } else if (hour >= 17) {
        greeting = "Good evening";
    }

    welcomeMessage.textContent =
        `${greeting}, ${studentName || "Student"}! 👋`;
}


function editProfile() {
    openProfileModal(true);
}


const profileForm = getElement("profileForm");

if (profileForm) {
    profileForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const input = getElement("studentNameInput");
        const newName = input.value.trim();

        if (!newName) {
            showToast("Please enter your name.");
            input.focus();
            return;
        }

        studentName = newName;

        localStorage.setItem(
            "studyTrackStudentName",
            studentName
        );

        getElement("profileModal").classList.remove("active");

        updateWelcomeMessage();

        showToast("Your profile has been updated!");
    });
}


// ---------- 4. DARK / LIGHT MODE ----------

function updateThemeButton() {
    const button = getElement("themeToggle");

    if (!button) return;

    const isDark =
        document.body.classList.contains("dark-mode");

    button.textContent = isDark ? "☀️" : "🌙";

    button.setAttribute(
        "aria-label",
        isDark ? "Switch to light mode" : "Switch to dark mode"
    );
}


function setTheme(theme) {
    const isDark = theme === "dark";

    document.body.classList.toggle("dark-mode", isDark);

    localStorage.setItem(
        "studyTrackTheme",
        isDark ? "dark" : "light"
    );

    updateThemeButton();
}


function toggleTheme() {
    const isDark =
        document.body.classList.contains("dark-mode");

    setTheme(isDark ? "light" : "dark");
}


const themeButton = getElement("themeToggle");

if (themeButton) {
    themeButton.addEventListener("click", toggleTheme);
}

const savedTheme =
    localStorage.getItem("studyTrackTheme") || "dark";

setTheme(savedTheme);


// ---------- 5. NAVIGATION ----------

const pageTitles = {
    dashboard: "Dashboard",
    tasks: "My Tasks",
    planner: "Study Planner",
    timer: "Focus Timer",
    subjects: "Subjects",
    progress: "Progress Report",
    achievements: "Achievements",
    exams: "Exam Countdown",
    notes: "Personal Notes",
    flashcards: "Flashcards",
    backup: "Backup & Restore"
};


function showPage(pageName) {
    const targetPage = getElement(pageName);

    if (!targetPage) return;

    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

    document.querySelectorAll(".nav-btn").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.page === pageName
        );
    });

    targetPage.classList.add("active");

    const title = getElement("pageTitle");

    if (title) {
        title.textContent =
            pageTitles[pageName] || "StudyTrack";
    }

    closeMoreSheet();
    updateMoreButton(pageName);
    window.scrollTo(0, 0);

    if (pageName === "dashboard") {
        updateDashboard();
        renderReminders();
    }

    if (pageName === "progress") {
        updateReport();
    }

    if (pageName === "planner") {
        renderPlanner();
    }

    if (pageName === "achievements") {
        updateAchievements();
    }

    if (pageName === "exams") {
        renderExams();
    }

    if (pageName === "notes") {
        renderNotes();
    }

    if (pageName === "flashcards") {
        renderFlashcards();
    }
}


window.showPage = showPage;
window.editProfile = editProfile;


document.querySelectorAll(".nav-btn").forEach(button => {
    button.addEventListener("click", () => {
        showPage(button.dataset.page);
    });
});


// ---------- 6. CURRENT DATE ----------

function displayDate() {
    const dateElement = getElement("currentDate");

    if (dateElement) {
        dateElement.textContent =
            new Date().toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            });
    }
}


// ---------- 7. SUBJECT MANAGEMENT ----------

function renderSubjects() {
    const subjectList = getElement("subjectList");
    const taskSubject = getElement("taskSubject");

    if (subjectList) {
        subjectList.replaceChildren();

        if (subjects.length === 0) {
            subjectList.appendChild(
                createElement(
                    "p",
                    "empty-message",
                    "No subjects added yet."
                )
            );
        }

        subjects.forEach(subject => {
            const item = createElement("div", "subject-item");

            const name = createElement("span", "", subject);

            const deleteButton = createElement(
                "button",
                "delete-subject",
                "Delete"
            );

            deleteButton.type = "button";

            deleteButton.addEventListener("click", () => {
                deleteSubject(subject);
            });

            item.append(name, deleteButton);
            subjectList.appendChild(item);
        });
    }

    if (taskSubject) {
        const selectedValue = taskSubject.value;

        taskSubject.replaceChildren();

        const defaultOption = createElement(
            "option",
            "",
            "Select Subject"
        );

        defaultOption.value = "";
        taskSubject.appendChild(defaultOption);

        subjects.forEach(subject => {
            const option = createElement("option", "", subject);

            option.value = subject;
            taskSubject.appendChild(option);
        });

        if (subjects.includes(selectedValue)) {
            taskSubject.value = selectedValue;
        }
    }
}


function addSubject(event) {
    event.preventDefault();

    const input = getElement("subjectName");

    if (!input) return;

    const subject = input.value.trim();

    if (!subject) {
        showToast("Please enter a subject name.");
        return;
    }

    if (subjects.some(item =>
        item.toLowerCase() === subject.toLowerCase()
    )) {
        showToast("This subject already exists.");
        return;
    }

    subjects.push(subject);

    saveData();
    renderSubjects();
    updateReport();

    input.value = "";

    showToast("Subject added successfully!");
}


function deleteSubject(subject) {
    const usedByTasks = tasks.some(
        task => task.subject === subject
    );

    if (usedByTasks) {
        showToast("This subject is being used by a task.");
        return;
    }

    subjects = subjects.filter(
        item => item !== subject
    );

    saveData();
    renderSubjects();
    updateReport();

    showToast("Subject deleted.");
}


const subjectForm = getElement("subjectForm");

if (subjectForm) {
    subjectForm.addEventListener("submit", addSubject);
}


// ---------- 8. TASK MANAGEMENT ----------

function renderTasks() {
    const container = getElement("allTasks");

    if (!container) return;

    container.replaceChildren();

    const filter =
        getElement("taskFilter")?.value || "all";

    const search =
        getElement("taskSearch")?.value.trim().toLowerCase() || "";

    let filteredTasks = [...tasks];

    if (filter === "pending") {
        filteredTasks = filteredTasks.filter(
            task => !task.completed
        );
    }

    if (filter === "completed") {
        filteredTasks = filteredTasks.filter(
            task => task.completed
        );
    }

    if (search) {
        filteredTasks = filteredTasks.filter(task =>
            (task.name || "").toLowerCase().includes(search) ||
            (task.subject || "").toLowerCase().includes(search)
        );
    }

    filteredTasks.sort((a, b) =>
        (a.date || "").localeCompare(b.date || "")
    );

    if (filteredTasks.length === 0) {
        container.appendChild(
            createElement(
                "p",
                "empty-message",
                "No tasks found. Try another search or add a task!"
            )
        );

        return;
    }

    filteredTasks.forEach(task => {
        const card = createElement("div", "task-item task-card");

        if (task.completed) {
            card.classList.add("completed");
        }

        const info = createElement(
            "div",
            "task-details task-info"
        );

        const title = createElement("h3", "", task.name);

        const details = createElement(
            "p",
            "",
            `${task.subject || "No subject"} | Due: ${formatDate(task.date)}`
        );

        const priorityName =
            (task.priority || "Medium").toLowerCase();

        const priority = createElement(
            "span",
            `priority ${priorityName}`,
            `${task.priority || "Medium"} Priority`
        );

        info.append(title, details, priority);

        const actions = createElement("div", "task-actions");

        const completeButton = createElement(
            "button",
            "",
            task.completed ? "Undo" : "Complete"
        );

        completeButton.type = "button";

        completeButton.addEventListener("click", () => {
            toggleTask(task.id);
        });

        const edit = createElement("button", "", "Edit");
        edit.type = "button";

        edit.addEventListener("click", () => {
            editTask(task.id);
        });

        const deleteButton = createElement(
            "button",
            "delete-btn",
            "Delete"
        );

        deleteButton.type = "button";

        deleteButton.addEventListener("click", () => {
            deleteTask(task.id);
        });

        actions.append(completeButton, edit, deleteButton);

        card.append(info, actions);
        container.appendChild(card);
    });
}


function addTask(event) {
    event.preventDefault();

    const name = getElement("taskName").value.trim();
    const subject = getElement("taskSubject").value;
    const date = getElement("taskDate").value;
    const priority = getElement("taskPriority").value;
    const editId = getElement("editId").value;

    if (!name || !subject || !date) {
        showToast("Please fill in all task details.");
        return;
    }

    if (editId) {
        const task = tasks.find(
            item => String(item.id) === String(editId)
        );

        if (task) {
            task.name = name;
            task.subject = subject;
            task.date = date;
            task.priority = priority;

            showToast("Task updated successfully!");
        }
    } else {
        tasks.push({
            id: Date.now(),
            name,
            subject,
            date,
            priority,
            completed: false,
            createdAt: getToday(),
            xpAwarded: false
        });

        showToast("Task added successfully!");
    }

    saveData();

    getElement("taskForm").reset();

    cancelEdit();
    renderAll();
}


function toggleTask(id) {
    const task = tasks.find(
        item => String(item.id) === String(id)
    );

    if (!task) return;

    const wasCompleted = task.completed;

    task.completed = !task.completed;

    if (!wasCompleted && task.completed && !task.xpAwarded) {
        task.xpAwarded = true;

        studyXP += 10;

        recordStudyActivity();
        checkBadges();

        showToast("Task completed! You earned 10 XP.");
    } else {
        showToast(
            task.completed
                ? "Task completed!"
                : "Task marked as pending."
        );
    }

    saveData();
    renderAll();
}


function deleteTask(id) {
    tasks = tasks.filter(
        task => String(task.id) !== String(id)
    );

    saveData();
    renderAll();

    showToast("Task deleted.");
}


function editTask(id) {
    const task = tasks.find(
        item => String(item.id) === String(id)
    );

    if (!task) return;

    getElement("taskName").value = task.name;
    getElement("taskSubject").value = task.subject;
    getElement("taskDate").value = task.date;
    getElement("taskPriority").value = task.priority || "Medium";
    getElement("editId").value = task.id;

    getElement("submitTask").textContent = "Update Task";

    getElement("cancelEdit").classList.remove("hidden");

    showPage("tasks");

    showToast("Edit your task and press Update Task.");
}


function cancelEdit() {
    const form = getElement("taskForm");

    if (form) {
        form.reset();
    }

    if (getElement("editId")) {
        getElement("editId").value = "";
    }

    if (getElement("submitTask")) {
        getElement("submitTask").textContent = "+ Add Task";
    }

    if (getElement("cancelEdit")) {
        getElement("cancelEdit").classList.add("hidden");
    }
}


window.cancelEdit = cancelEdit;
window.addTask = addTask;
window.addSubject = addSubject;


const taskForm = getElement("taskForm");

if (taskForm) {
    taskForm.addEventListener("submit", addTask);
}

const taskFilter = getElement("taskFilter");

if (taskFilter) {
    taskFilter.addEventListener("change", renderTasks);
}

const taskSearch = getElement("taskSearch");

if (taskSearch) {
    taskSearch.addEventListener("input", renderTasks);
}

const cancelEditButton = getElement("cancelEdit");

if (cancelEditButton) {
    cancelEditButton.addEventListener("click", cancelEdit);
}


// ---------- 9. DASHBOARD ----------

function updateDashboard() {
    const total = tasks.length;

    const completed = tasks.filter(
        task => task.completed
    ).length;

    const pending = total - completed;

    const percentage = total === 0
        ? 0
        : Math.round((completed / total) * 100);

    if (getElement("totalTasks")) {
        getElement("totalTasks").textContent = total;
    }

    if (getElement("completedTasks")) {
        getElement("completedTasks").textContent = completed;
    }

    if (getElement("pendingTasks")) {
        getElement("pendingTasks").textContent = pending;
    }

    if (getElement("trackedStudyTime")) {
        getElement("trackedStudyTime").textContent =
            formatStudyTime(totalStudySeconds);
    }

    if (getElement("progressFill")) {
        getElement("progressFill").style.width =
            `${percentage}%`;
    }

    if (getElement("progressPercentage")) {
        getElement("progressPercentage").textContent =
            `${percentage}%`;
    }

    if (getElement("progressText")) {
        getElement("progressText").textContent =
            percentage === 100
                ? "Excellent! All your tasks are completed!"
                : `${completed} of ${total} tasks completed. Keep going!`;
    }

    updateWelcomeMessage();
    renderTodayTasks();
    updateHeroTiles();
    updateGoal();
    updateDailyQuote();
    updateAchievements();
}


function renderTodayTasks() {
    const container = getElement("todayTasks");

    if (!container) return;

    container.replaceChildren();

    const todayList = tasks.filter(
        task => task.date === getToday()
    );

    if (todayList.length === 0) {
        container.appendChild(
            createElement(
                "p",
                "empty-message",
                "You have no tasks scheduled for today."
            )
        );

        return;
    }

    todayList.forEach(task => {
        const item = createElement("div", "planner-task");

        const name = createElement("span", "", task.name);

        const status = createElement(
            "span",
            "",
            task.completed ? "Completed ✓" : "Pending"
        );

        item.append(name, status);
        container.appendChild(item);
    });
}


// ---------- 10. DAILY STUDY PLANNER ----------

function renderPlanner() {
    const container = getElement("plannerTasks");

    if (!container) return;

    container.replaceChildren();

    const selectedDate =
        getElement("plannerDate")?.value || getToday();

    const dailyTasks = tasks.filter(
        task => task.date === selectedDate
    );

    if (dailyTasks.length === 0) {
        container.appendChild(
            createElement(
                "p",
                "empty-message",
                "No tasks planned for this day."
            )
        );

        return;
    }

    dailyTasks.forEach(task => {
        const item = createElement("div", "planner-task");

        const name = createElement("span", "", task.name);

        const status = createElement(
            "span",
            "",
            task.completed ? "Completed ✓" : "Pending"
        );

        item.append(name, status);
        container.appendChild(item);
    });
}


const plannerDate = getElement("plannerDate");

if (plannerDate) {
    plannerDate.value = getToday();

    plannerDate.addEventListener("change", renderPlanner);
}


// ---------- 11. DEADLINE REMINDERS ----------

function renderReminders() {
    const container = getElement("reminders");

    if (!container) return;

    container.replaceChildren();

    const today = getToday();

    const pendingTasks = tasks.filter(
        task => !task.completed && task.date
    );

    const overdue = pendingTasks.filter(
        task => task.date < today
    );

    const upcoming = pendingTasks.filter(
        task => task.date >= today
    );

    upcoming.sort((a, b) =>
        a.date.localeCompare(b.date)
    );

    overdue.sort((a, b) =>
        a.date.localeCompare(b.date)
    );

    if (overdue.length === 0 && upcoming.length === 0) {
        container.appendChild(
            createElement(
                "p",
                "empty-message",
                "No pending deadlines. Great work!"
            )
        );

        return;
    }

    overdue.forEach(task => {
        container.appendChild(
            createElement(
                "div",
                "reminder",
                `⚠️ Overdue: ${task.name} — ${formatDate(task.date)}`
            )
        );
    });

    upcoming.forEach(task => {
        container.appendChild(
            createElement(
                "div",
                "reminder",
                `📅 ${task.name} — Due ${formatDate(task.date)}`
            )
        );
    });
}


// ---------- 12. POMODORO TIMER ----------

let timerInterval = null;
let timerSeconds = 25 * 60;
let timerDurationSeconds = 25 * 60;
let timerRunning = false;
let isBreakSession = false;
let activityRecordedThisSession = false;


function updateTimerDisplay() {
    const display = getElement("timerDisplay");

    if (!display) return;

    const minutes = Math.floor(timerSeconds / 60);
    const seconds = timerSeconds % 60;

    display.textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    const tracked = getElement("trackedStudyTime");
    const timerTotal = getElement("timerTotal");

    if (tracked) {
        tracked.textContent =
            formatStudyTime(totalStudySeconds);
    }

    if (timerTotal) {
        timerTotal.textContent =
            formatStudyTime(totalStudySeconds);
    }
}


function startTimer() {
    if (timerRunning) return;

    if (timerSeconds <= 0) {
        timerSeconds = timerDurationSeconds;
    }

    timerRunning = true;

    if (getElement("timerMessage")) {
        getElement("timerMessage").textContent =
            isBreakSession
                ? "Enjoy your break!"
                : "Stay focused! You are doing great.";
    }

    timerInterval = setInterval(() => {
        timerSeconds--;

        if (!isBreakSession) {
            totalStudySeconds++;

            dailySeconds[getToday()] =
                (dailySeconds[getToday()] || 0) + 1;

            if (!activityRecordedThisSession) {
                recordStudyActivity();
                activityRecordedThisSession = true;
            }

            saveData();

            updateDashboard();
            updateReport();
        }

        updateTimerDisplay();

        if (timerSeconds <= 0) {
            clearInterval(timerInterval);
            timerRunning = false;

            playBeep();

            if (getElement("timerMessage")) {
                getElement("timerMessage").textContent =
                    isBreakSession
                        ? "Break finished! Ready to focus again?"
                        : "Focus session complete! Take a break.";
            }

            if (!isBreakSession) {
                studyXP += 5;
                checkBadges();
                saveData();
                updateAchievements();

                showToast("Focus session complete! You earned 5 XP.");
            } else {
                showToast("Break completed!");
            }

            updateDashboard();
            updateReport();
        }

    }, 1000);
}


function pauseTimer() {
    clearInterval(timerInterval);
    timerRunning = false;

    if (getElement("timerMessage")) {
        getElement("timerMessage").textContent = "Timer paused.";
    }
}


function resetTimer() {
    clearInterval(timerInterval);

    timerRunning = false;
    timerSeconds = timerDurationSeconds;
    activityRecordedThisSession = false;

    updateTimerDisplay();

    if (getElement("timerMessage")) {
        getElement("timerMessage").textContent = "Ready to study?";
    }
}


function setTimer(minutes) {
    clearInterval(timerInterval);

    timerRunning = false;

    timerDurationSeconds = minutes * 60;
    timerSeconds = timerDurationSeconds;

    isBreakSession = minutes < 25;
    activityRecordedThisSession = false;

    updateTimerDisplay();

    if (getElement("timerMessage")) {
        getElement("timerMessage").textContent =
            isBreakSession
                ? "Break time. Relax and recharge."
                : "Ready for a focused study session?";
    }
}


window.startTimer = startTimer;
window.pauseTimer = pauseTimer;
window.resetTimer = resetTimer;
window.setTimer = setTimer;


// ---------- 13. PROGRESS REPORT ----------

function updateReport() {
    const total = tasks.length;

    const completed = tasks.filter(
        task => task.completed
    ).length;

    const percentage = total === 0
        ? 0
        : Math.round((completed / total) * 100);

    if (getElement("reportTotalTasks")) {
        getElement("reportTotalTasks").textContent = total;
    }

    if (getElement("reportCompletedTasks")) {
        getElement("reportCompletedTasks").textContent =
            completed;
    }

    if (getElement("reportTime")) {
        getElement("reportTime").textContent =
            formatStudyTime(totalStudySeconds);
    }

    if (getElement("reportPercentage")) {
        getElement("reportPercentage").textContent =
            `${percentage}%`;
    }

    renderSubjectChart();
    renderWeeklyChart();
}


// ---------- 14. SUBJECT PERFORMANCE ----------

function renderSubjectChart() {
    const chart = getElement("subjectChart");

    if (!chart) return;

    chart.replaceChildren();

    if (subjects.length === 0) {
        chart.appendChild(
            createElement(
                "p",
                "empty-message",
                "Add subjects to see your performance."
            )
        );

        return;
    }

    subjects.forEach(subject => {
        const subjectTasks = tasks.filter(
            task => task.subject === subject
        );

        const total = subjectTasks.length;

        const completed = subjectTasks.filter(
            task => task.completed
        ).length;

        const percentage = total === 0
            ? 0
            : Math.round((completed / total) * 100);

        const row = createElement("div", "chart-row");

        const label = createElement(
            "div",
            "chart-label",
            subject
        );

        const bar = createElement("div", "chart-bar");
        const fill = createElement("div", "chart-fill");

        fill.style.width = `${percentage}%`;

        bar.appendChild(fill);

        const result = createElement(
            "span",
            "chart-result",
            `${completed}/${total} completed (${percentage}%)`
        );

        row.append(label, bar, result);
        chart.appendChild(row);
    });
}


// ---------- 15. STUDY STREAK ----------

function recordStudyActivity() {
    const today = getToday();

    if (!studyActivityDates.includes(today)) {
        studyActivityDates.push(today);
    }

    saveFeatureData();
    updateAchievements();
}


function calculateStreak() {
    const dates = [...new Set(studyActivityDates)].sort();

    let best = 0;
    let run = 0;
    let previousDay = null;

    dates.forEach(date => {
        const currentDate = new Date(date + "T00:00:00");

        const currentDay = Math.floor(
            currentDate.getTime() / 86400000
        );

        if (
            previousDay !== null &&
            currentDay === previousDay + 1
        ) {
            run++;
        } else {
            run = 1;
        }

        best = Math.max(best, run);
        previousDay = currentDay;
    });

    const today = Math.floor(
        new Date(getToday() + "T00:00:00").getTime() / 86400000
    );

    let current = 0;

    if (previousDay === today || previousDay === today - 1) {
        current = run;
    }

    return { current, best };
}


// ---------- 16. XP AND BADGES ----------

const badgeDefinitions = [
    {
        id: "first-task",
        icon: "🌱",
        name: "First Step",
        description: "Complete your first task.",
        condition: () =>
            tasks.filter(task => task.completed).length >= 1
    },
    {
        id: "five-tasks",
        icon: "⭐",
        name: "Getting Started",
        description: "Complete five tasks.",
        condition: () =>
            tasks.filter(task => task.completed).length >= 5
    },
    {
        id: "ten-tasks",
        icon: "🏆",
        name: "Task Champion",
        description: "Complete ten tasks.",
        condition: () =>
            tasks.filter(task => task.completed).length >= 10
    },
    {
        id: "three-day-streak",
        icon: "🔥",
        name: "On Fire",
        description: "Build a three-day study streak.",
        condition: () => calculateStreak().best >= 3
    },
    {
        id: "hundred-xp",
        icon: "💎",
        name: "XP Collector",
        description: "Earn 100 XP.",
        condition: () => studyXP >= 100
    }
];


function checkBadges() {
    badgeDefinitions.forEach(badge => {
        if (
            badge.condition() &&
            !unlockedBadges.includes(badge.id)
        ) {
            unlockedBadges.push(badge.id);

            showToast(
                "New badge unlocked: " + badge.name + "!"
            );
        }
    });

    saveFeatureData();
}


function updateAchievements() {
    const streak = calculateStreak();

    const xpElements = [
        "dashboardXP",
        "achievementXP"
    ];

    const streakElements = [
        "dashboardStreak",
        "achievementStreak"
    ];

    const bestElements = [
        "dashboardBestStreak",
        "achievementBestStreak"
    ];

    const badgeElements = [
        "dashboardBadgeCount",
        "achievementBadgeCount"
    ];

    xpElements.forEach(id => {
        if (getElement(id)) {
            getElement(id).textContent = studyXP;
        }
    });

    streakElements.forEach(id => {
        if (getElement(id)) {
            getElement(id).textContent = streak.current;
        }
    });

    bestElements.forEach(id => {
        if (getElement(id)) {
            getElement(id).textContent =
                streak.best + " days";
        }
    });

    badgeElements.forEach(id => {
        if (getElement(id)) {
            getElement(id).textContent =
                unlockedBadges.length;
        }
    });

    if (getElement("headerXP")) {
        getElement("headerXP").textContent = studyXP + " XP";
    }

    if (getElement("headerStreak")) {
        getElement("headerStreak").textContent =
            streak.current + (streak.current === 1 ? " day" : " days");
    }

    const message =
        streak.current > 0
            ? `Amazing! You have studied for ${streak.current} consecutive days!`
            : "Start studying today to build your streak!";

    if (getElement("dashboardStreakMessage")) {
        getElement("dashboardStreakMessage").textContent = message;
    }

    if (getElement("achievementStreakMessage")) {
        getElement("achievementStreakMessage").textContent = message;
    }

    updateLevel();
    renderBadges();
}


function renderBadges() {
    const container = getElement("badgeList");

    if (!container) return;

    container.replaceChildren();

    badgeDefinitions.forEach(badge => {
        const unlocked =
            unlockedBadges.includes(badge.id);

        const card = createElement(
            "div",
            "badge-card" +
            (unlocked ? "" : " badge-locked")
        );

        const icon = createElement(
            "div",
            "badge-icon",
            unlocked ? badge.icon : "🔒"
        );

        const title = createElement("h3", "", badge.name);

        const description = createElement(
            "p",
            "",
            badge.description
        );

        const status = createElement(
            "p",
            "",
            unlocked ? "Unlocked ✓" : "Not unlocked yet"
        );

        card.append(icon, title, description, status);

        container.appendChild(card);
    });
}


// ---------- 17. EXAM COUNTDOWN ----------

function renderExams() {
    const container = getElement("examList");

    if (!container) return;

    container.replaceChildren();

    exams.sort((a, b) =>
        a.date.localeCompare(b.date)
    );

    if (exams.length === 0) {
        container.appendChild(
            createElement(
                "p",
                "empty-message",
                "No exams added yet."
            )
        );

        return;
    }

    exams.forEach(exam => {
        const card = createElement("div", "feature-card");

        const title = createElement("h3", "", exam.name);

        const date = createElement(
            "p",
            "",
            "Exam date: " + formatDate(exam.date)
        );

        const today = new Date(getToday() + "T00:00:00");
        const examDay = new Date(exam.date + "T00:00:00");

        const days = Math.round(
            (examDay - today) / 86400000
        );

        let message;

        if (days < 0) {
            message = "This exam date has passed.";
        } else if (days === 0) {
            message = "Your exam is today!";
        } else {
            message = days + " days remaining";
        }

        const countdown = createElement(
            "div",
            "exam-days",
            message
        );

        const deleteButton = createElement(
            "button",
            "secondary",
            "Delete"
        );

        deleteButton.type = "button";

        deleteButton.addEventListener("click", () => {
            exams = exams.filter(
                item => item.id !== exam.id
            );

            saveFeatureData();
            renderExams();

            showToast("Exam deleted.");
        });

        card.append(title, date, countdown, deleteButton);

        container.appendChild(card);
    });
}


const examForm = getElement("examForm");

if (examForm) {
    examForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const name = getElement("examName").value.trim();
        const date = getElement("examDate").value;

        if (!name || !date) return;

        if (date < getToday()) {
            showToast("Please select today or a future date.");
            return;
        }

        exams.push({
            id: Date.now(),
            name,
            date
        });

        saveFeatureData();

        examForm.reset();
        renderExams();

        showToast("Exam added successfully!");
    });
}


// ---------- 18. PERSONAL NOTES ----------

function renderNotes() {
    const container = getElement("notesList");

    if (!container) return;

    container.replaceChildren();

    if (notes.length === 0) {
        container.appendChild(
            createElement(
                "p",
                "empty-message",
                "No notes saved yet."
            )
        );

        return;
    }

    notes.forEach(note => {
        const card = createElement("div", "feature-card");

        const title = createElement("h3", "", note.title);

        const content = createElement(
            "p",
            "note-content",
            note.content
        );

        const editButton = createElement(
            "button",
            "secondary",
            "Edit"
        );

        editButton.type = "button";

        editButton.addEventListener("click", () => {
            getElement("noteTitle").value = note.title;
            getElement("noteContent").value = note.content;

            editingNoteId = note.id;

            getElement("saveNoteButton").textContent =
                "Update Note";

            getElement("cancelNoteEdit").classList.remove("hidden");

            showPage("notes");

            getElement("noteTitle").focus();
        });

        const deleteButton = createElement(
            "button",
            "secondary",
            "Delete"
        );

        deleteButton.type = "button";

        deleteButton.addEventListener("click", () => {
            notes = notes.filter(
                item => item.id !== note.id
            );

            saveFeatureData();
            renderNotes();

            showToast("Note deleted.");
        });

        card.append(title, content, editButton, deleteButton);

        container.appendChild(card);
    });
}


function resetNoteForm() {
    const form = getElement("noteForm");

    if (form) {
        form.reset();
    }

    editingNoteId = null;

    if (getElement("saveNoteButton")) {
        getElement("saveNoteButton").textContent =
            "+ Save Note";
    }

    if (getElement("cancelNoteEdit")) {
        getElement("cancelNoteEdit").classList.add("hidden");
    }
}


const noteForm = getElement("noteForm");

if (noteForm) {
    noteForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const title = getElement("noteTitle").value.trim();
        const content = getElement("noteContent").value.trim();

        if (!title || !content) return;

        if (editingNoteId !== null) {
            const note = notes.find(
                item => item.id === editingNoteId
            );

            if (note) {
                note.title = title;
                note.content = content;
            }

            showToast("Note updated!");
        } else {
            notes.push({
                id: Date.now(),
                title,
                content
            });

            showToast("Note saved!");
        }

        saveFeatureData();

        resetNoteForm();
        renderNotes();
    });
}


const cancelNoteButton = getElement("cancelNoteEdit");

if (cancelNoteButton) {
    cancelNoteButton.addEventListener(
        "click",
        resetNoteForm
    );
}


// ---------- 19. FOCUS MODE ----------

function toggleFocusMode() {
    const enabled =
        document.body.classList.toggle("focus-mode");

    const button = getElement("focusModeButton");

    if (button) {
        button.textContent = enabled
            ? "↩ Exit Focus Mode"
            : "🎯 Enter Focus Mode";
    }
}


const focusButton = getElement("focusModeButton");

if (focusButton) {
    focusButton.addEventListener(
        "click",
        toggleFocusMode
    );
}


// ---------- 19B. HERO TILES (TODAY / WEEK / TOP SUBJECT) ----------

function updateHeroTiles() {
    const todayEl = getElement("heroToday");
    const weekEl = getElement("heroWeek");
    const topEl = getElement("heroTopSubject");

    const today = getToday();

    if (todayEl) {
        todayEl.textContent = tasks.filter(
            task => task.date === today
        ).length;
    }

    // Tasks due in the last 7 days (including today) that are completed
    const start = new Date(today + "T00:00:00");
    start.setDate(start.getDate() - 6);

    const startKey =
        start.getFullYear() + "-" +
        String(start.getMonth() + 1).padStart(2, "0") + "-" +
        String(start.getDate()).padStart(2, "0");

    if (weekEl) {
        weekEl.textContent = tasks.filter(
            task => task.completed &&
                    task.date >= startKey &&
                    task.date <= today
        ).length;
    }

    if (topEl) {
        const counts = {};

        tasks.forEach(task => {
            if (task.completed && task.subject) {
                counts[task.subject] =
                    (counts[task.subject] || 0) + 1;
            }
        });

        const entries = Object.entries(counts)
            .sort((a, b) => b[1] - a[1]);

        topEl.textContent = entries.length ? entries[0][0] : "—";
    }
}


// ---------- 19C. MORE MENU (BOTTOM SHEET) ----------

const morePages = [
    "planner", "subjects", "achievements", "exams", "notes",
    "flashcards", "backup"
];


function openMoreSheet() {
    const sheet = getElement("moreSheet");

    if (sheet) sheet.classList.add("open");
}


function closeMoreSheet() {
    const sheet = getElement("moreSheet");

    if (sheet) sheet.classList.remove("open");
}


function updateMoreButton(pageName) {
    const button = getElement("moreBtn");

    if (button) {
        button.classList.toggle(
            "active",
            morePages.includes(pageName)
        );
    }
}


const moreButton = getElement("moreBtn");

if (moreButton) {
    moreButton.addEventListener("click", openMoreSheet);
}

const moreSheet = getElement("moreSheet");

if (moreSheet) {
    moreSheet.addEventListener("click", event => {
        if (event.target === moreSheet) {
            closeMoreSheet();
        }
    });
}


// ---------- 19D. DAILY STUDY GOAL ----------

function updateGoal() {
    const goal = Math.max(1, goalMinutes);

    const minutes = Math.floor(
        (dailySeconds[getToday()] || 0) / 60
    );

    const percentage = Math.min(
        100,
        Math.round((minutes / goal) * 100)
    );

    if (getElement("goalFill")) {
        getElement("goalFill").style.width = `${percentage}%`;
    }

    if (getElement("goalPercent")) {
        getElement("goalPercent").textContent = `${percentage}%`;
    }

    if (getElement("goalText")) {
        getElement("goalText").textContent =
            percentage >= 100
                ? `${minutes} of ${goal} min studied today. Goal reached! 🎉`
                : `${minutes} of ${goal} min studied today`;
    }

    const input = getElement("goalInput");

    if (input && document.activeElement !== input) {
        input.value = goal;
    }
}


const goalSaveButton = getElement("goalSave");

if (goalSaveButton) {
    goalSaveButton.addEventListener("click", () => {
        const value = Math.round(
            Number(getElement("goalInput").value)
        );

        if (!value || value < 5 || value > 1440) {
            showToast("Enter a goal between 5 and 1440 minutes.");
            return;
        }

        goalMinutes = value;

        localStorage.setItem(
            "studyTrackGoalMinutes",
            String(goalMinutes)
        );

        updateGoal();
        showToast("Daily goal updated!");
    });
}


// ---------- 19E. WEEKLY STUDY CHART ----------

function renderWeeklyChart() {
    const chart = getElement("weeklyChart");

    if (!chart) return;

    chart.replaceChildren();

    const days = [];

    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);

        const key =
            date.getFullYear() + "-" +
            String(date.getMonth() + 1).padStart(2, "0") + "-" +
            String(date.getDate()).padStart(2, "0");

        days.push({
            key,
            label: date.toLocaleDateString("en-IN", {
                weekday: "short"
            }),
            minutes: Math.floor((dailySeconds[key] || 0) / 60),
            isToday: i === 0
        });
    }

    const maxMinutes = Math.max(30, ...days.map(d => d.minutes));
    const barSpace = 120;

    let total = 0;

    days.forEach(day => {
        total += day.minutes;

        const column = createElement(
            "div",
            "week-col" + (day.isToday ? " today" : "")
        );

        const value = createElement(
            "span",
            "week-value",
            day.minutes > 0 ? day.minutes + "m" : ""
        );

        const bar = createElement(
            "div",
            "week-bar" + (day.minutes === 0 ? " empty" : "")
        );

        bar.style.height =
            Math.max(4, Math.round((day.minutes / maxMinutes) * barSpace)) + "px";

        const label = createElement("span", "week-day", day.label);

        column.append(value, bar, label);
        chart.appendChild(column);
    });

    if (getElement("weekTotal")) {
        getElement("weekTotal").textContent =
            formatStudyTime(total * 60);
    }
}


// ---------- 19F. LEVELS ----------

const levelTitles = [
    "Beginner", "Learner", "Explorer", "Scholar",
    "Achiever", "Expert", "Master", "Legend"
];

const xpPerLevel = 50;


function getLevelInfo(xp) {
    const level = Math.floor(xp / xpPerLevel) + 1;

    return {
        level,
        title: levelTitles[Math.min(level - 1, levelTitles.length - 1)],
        into: xp % xpPerLevel
    };
}


function updateLevel() {
    const info = getLevelInfo(studyXP);

    if (getElement("levelName")) {
        getElement("levelName").textContent =
            `Level ${info.level} · ${info.title}`;
    }

    if (getElement("levelFill")) {
        getElement("levelFill").style.width =
            `${Math.round((info.into / xpPerLevel) * 100)}%`;
    }

    if (getElement("levelText")) {
        getElement("levelText").textContent =
            `${xpPerLevel - info.into} XP to reach Level ${info.level + 1}`;
    }
}


// ---------- 19G. DAILY QUOTE ----------

const dailyQuotes = [
    "Small steps every day add up to big results.",
    "Start where you are. Use what you have. Do what you can.",
    "Focus on progress, not perfection.",
    "Today's effort is tomorrow's confidence.",
    "A little revision each day beats a long night before the exam.",
    "Difficult topics become easy once you start them.",
    "Consistency beats motivation. Show up anyway.",
    "Every expert was once a beginner who kept going.",
    "Break big goals into small tasks and finish one at a time.",
    "Rest is part of studying. Take your breaks.",
    "You do not have to be perfect to make progress.",
    "Your future self will thank you for studying today.",
    "Mistakes are proof that you are trying and learning."
];


function updateDailyQuote() {
    const element = getElement("dailyQuote");

    if (!element) return;

    const now = new Date();

    const dayNumber = Math.floor(
        Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) /
        86400000
    );

    element.textContent =
        dailyQuotes[dayNumber % dailyQuotes.length];
}


// ---------- 19H. FLASHCARDS ----------

const flippedCards = new Set();


function saveFlashcards() {
    localStorage.setItem(
        "studyTrackFlashcards",
        JSON.stringify(flashcards)
    );
}


function renderFlashcards() {
    const container = getElement("flashcardList");

    if (!container) return;

    container.replaceChildren();

    const known = flashcards.filter(card => card.known).length;

    if (getElement("fcSummary")) {
        getElement("fcSummary").textContent =
            flashcards.length === 0
                ? "No cards yet."
                : `${known} known · ${flashcards.length - known} to review`;
    }

    if (flashcards.length === 0) {
        container.appendChild(
            createElement(
                "p",
                "empty-message",
                "No flashcards yet. Add your first one above!"
            )
        );

        return;
    }

    flashcards.forEach(card => {
        const flipped = flippedCards.has(card.id);

        const wrapper = createElement(
            "div",
            "flash-card" +
            (card.known ? " known" : "") +
            (flipped ? " flipped" : "")
        );

        const face = createElement("button", "flash-face");
        face.type = "button";

        face.append(
            createElement(
                "span",
                "flash-label",
                flipped ? "ANSWER" : "QUESTION"
            ),
            createElement(
                "span",
                "flash-text",
                flipped ? card.a : card.q
            ),
            createElement(
                "span",
                "flash-hint",
                flipped ? "Tap to see the question" : "Tap to reveal the answer"
            )
        );

        face.addEventListener("click", () => {
            if (flippedCards.has(card.id)) {
                flippedCards.delete(card.id);
            } else {
                flippedCards.add(card.id);
            }

            renderFlashcards();
        });

        const actions = createElement("div", "flash-actions");

        const knownButton = createElement(
            "button",
            "secondary",
            card.known ? "↺ Review again" : "✓ I know this"
        );

        knownButton.type = "button";

        knownButton.addEventListener("click", () => {
            card.known = !card.known;

            saveFlashcards();
            renderFlashcards();
        });

        const deleteButton = createElement(
            "button",
            "secondary",
            "Delete"
        );

        deleteButton.type = "button";

        deleteButton.addEventListener("click", () => {
            flashcards = flashcards.filter(
                item => item.id !== card.id
            );

            flippedCards.delete(card.id);

            saveFlashcards();
            renderFlashcards();

            showToast("Flashcard deleted.");
        });

        actions.append(knownButton, deleteButton);
        wrapper.append(face, actions);
        container.appendChild(wrapper);
    });
}


const flashcardForm = getElement("flashcardForm");

if (flashcardForm) {
    flashcardForm.addEventListener("submit", event => {
        event.preventDefault();

        const question = getElement("fcQuestion").value.trim();
        const answer = getElement("fcAnswer").value.trim();

        if (!question || !answer) return;

        flashcards.unshift({
            id: Date.now(),
            q: question,
            a: answer,
            known: false
        });

        saveFlashcards();

        flashcardForm.reset();
        renderFlashcards();

        showToast("Flashcard added!");
    });
}


// ---------- 19I. BACKUP AND RESTORE ----------

const backupKeys = [
    "studyTrackTasks",
    "studyTrackSubjects",
    "studyTrackStudySeconds",
    "studyTrackActivityDates",
    "studyTrackXP",
    "studyTrackBadges",
    "studyTrackExams",
    "studyTrackNotes",
    "studyTrackStudentName",
    "studyTrackTheme",
    "studyTrackDailySeconds",
    "studyTrackGoalMinutes",
    "studyTrackFlashcards"
];


function exportBackup() {
    const data = {};

    backupKeys.forEach(key => {
        const value = localStorage.getItem(key);

        if (value !== null) {
            data[key] = value;
        }
    });

    const backup = {
        app: "StudyTrack",
        version: 1,
        exportedAt: new Date().toISOString(),
        data
    };

    const blob = new Blob(
        [JSON.stringify(backup, null, 2)],
        { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `studytrack-backup-${getToday()}.json`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);

    showToast("Backup downloaded.");
}


function importBackup(file) {
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
        let backup;

        try {
            backup = JSON.parse(reader.result);
        } catch (error) {
            showToast("That file is not a valid backup.");
            return;
        }

        if (
            !backup ||
            backup.app !== "StudyTrack" ||
            typeof backup.data !== "object" ||
            backup.data === null
        ) {
            showToast("That file is not a StudyTrack backup.");
            return;
        }

        const proceed = confirm(
            "Restoring will replace all your current StudyTrack data. Continue?"
        );

        if (!proceed) return;

        backupKeys.forEach(key => {
            if (typeof backup.data[key] === "string") {
                localStorage.setItem(key, backup.data[key]);
            } else {
                localStorage.removeItem(key);
            }
        });

        location.reload();
    };

    reader.onerror = () => {
        showToast("Could not read that file.");
    };

    reader.readAsText(file);
}


const exportButton = getElement("exportBtn");

if (exportButton) {
    exportButton.addEventListener("click", exportBackup);
}

const importInput = getElement("importFile");

if (importInput) {
    importInput.addEventListener("change", () => {
        importBackup(importInput.files[0]);
        importInput.value = "";
    });
}


// ---------- 19J. TIMER SOUND ----------

function playBeep() {
    try {
        const AudioContextClass =
            window.AudioContext || window.webkitAudioContext;

        if (!AudioContextClass) return;

        const context = new AudioContextClass();

        [0, 0.3, 0.6].forEach(offset => {
            const oscillator = context.createOscillator();
            const gain = context.createGain();
            const start = context.currentTime + offset;

            oscillator.type = "sine";
            oscillator.frequency.value = 880;

            gain.gain.setValueAtTime(0.0001, start);
            gain.gain.exponentialRampToValueAtTime(0.25, start + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.22);

            oscillator.connect(gain);
            gain.connect(context.destination);

            oscillator.start(start);
            oscillator.stop(start + 0.25);
        });

        setTimeout(() => context.close(), 1500);
    } catch (error) {
        // Sound is optional; ignore any errors.
    }
}


// ---------- 20. RENDER EVERYTHING ----------

function renderAll() {
    renderSubjects();
    renderTasks();
    updateDashboard();
    renderPlanner();
    renderReminders();
    updateReport();
    updateAchievements();
    renderExams();
    renderNotes();
    renderFlashcards();
}


// ---------- 21. START APPLICATION ----------

displayDate();
renderAll();
updateTimerDisplay();
setupProfile();

console.log("StudyTrack is running successfully!");