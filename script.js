/* ============================================================
   LOADING SCREEN
============================================================ */
window.addEventListener("DOMContentLoaded", () => {
    const loader = document.createElement("div");
    loader.id = "loadingScreen";
    loader.innerHTML = `
        <img src="imgs/chicken1.png" class="loading-chicken">
    `;
    document.body.appendChild(loader);
});

/* ============================================================
   PAGE TRANSITION
============================================================ */
document.body.classList.add("page-enter");
setTimeout(() => {
    document.body.classList.add("page-enter-active");
}, 20);

/* ============================================================
   INDEX PAGE — RUNAWAY NO BUTTON
============================================================ */
const noBtn = document.getElementById("noBtn");

if (noBtn) {
    let firstHover = true;

    noBtn.style.transition = "left 0.25s ease, top 0.25s ease, transform 0.25s ease";

    noBtn.addEventListener("mouseover", () => {
        if (firstHover) {
            firstHover = false;

            const rect = noBtn.getBoundingClientRect();
            noBtn.style.position = "absolute";
            noBtn.style.left = `${rect.left}px`;
            noBtn.style.top = `${rect.top}px`;

            setTimeout(() => moveNoButton(), 120);
        } else {
            moveNoButton();
        }
    });

    function moveNoButton() {
        const btnWidth = noBtn.offsetWidth;
        const btnHeight = noBtn.offsetHeight;

        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        const maxX = screenWidth - btnWidth - 20;
        const maxY = screenHeight - btnHeight - 20;

        const randX = Math.random() * maxX;
        const randY = Math.random() * maxY;

        noBtn.style.left = `${randX}px`;
        noBtn.style.top = `${randY}px`;
    }
}

/* ============================================================
   MULTI-DAY SELECTION (DATE PAGE)
============================================================ */
let selectedDays = JSON.parse(localStorage.getItem("dates")) || [];

const addDateBtn = document.getElementById("addDateBtn");
const resetDatesBtn = document.getElementById("resetDatesBtn");
const dateInput = document.getElementById("dateInput");
const selectedDatesBox = document.getElementById("selectedDates");

/* Always start empty */
if (dateInput) {
    dateInput.value = "";
}

if (addDateBtn && dateInput && selectedDatesBox) {
    addDateBtn.addEventListener("click", () => {
        const d = dateInput.value;
        if (!d) return;

        selectedDays.push(d);
        localStorage.setItem("dates", JSON.stringify(selectedDays));

        updateSelectedDates();
        dateInput.value = "";
    });

    updateSelectedDates();
}

/* RESET ALL DAYS */
if (resetDatesBtn) {
    resetDatesBtn.addEventListener("click", () => {
        selectedDays = [];
        localStorage.removeItem("dates");
        updateSelectedDates();
        if (dateInput) dateInput.value = "";
    });
}

function updateSelectedDates() {
    if (!selectedDatesBox) return;

    if (selectedDays.length === 0) {
        selectedDatesBox.textContent = "No days selected yet.";
        return;
    }

    selectedDatesBox.innerHTML = selectedDays
        .map(day => {
            const pretty = new Date(day).toLocaleDateString(undefined, {
                weekday: "long",
                month: "long",
                day: "numeric"
            });
            return `<div>${pretty}</div>`;
        })
        .join("");
}

/* Next button does nothing extra */
function saveDate() {}

/* ============================================================
   SAVE TIME / PLACE
============================================================ */
function saveTime() {
    const t = document.getElementById("timeInput").value;
    localStorage.setItem("time", t);
}

/* SAVE PLACE — USE DISPLAY TEXT, NOT VALUE */
function savePlace() {
    const select = document.getElementById("placeSelect");
    const selectedText = select.options[select.selectedIndex].text;
    localStorage.setItem("place", selectedText);
}

/* ============================================================
   SUMMARY PAGE LOGIC
============================================================ */
window.addEventListener("load", () => {
    const summary = document.getElementById("summaryText");
    const inviteYes = document.getElementById("inviteMessageYes");

    if (!summary || !inviteYes) return;

    const dates = JSON.parse(localStorage.getItem("dates")) || [];
    const rawTime = localStorage.getItem("time");
    const place = localStorage.getItem("place");   // <-- NOW MATCHES place.html DISPLAY TEXT

    if (dates.length === 0 || !rawTime || !place) {
        const msg = "Oops! The chicken misplaced some info. Go back and fill everything out!";
        summary.textContent = msg;
        inviteYes.value = msg;
        return;
    }

    /* Convert time to AM/PM */
    function formatTime(t) {
        const [hour, minute] = t.split(":");
        let h = parseInt(hour);
        const ampm = h >= 12 ? "PM" : "AM";
        h = h % 12 || 12;
        return `${h}:${minute} ${ampm}`;
    }

    const prettyTime = formatTime(rawTime);

    const prettyDates = dates.map(d =>
        new Date(d).toLocaleDateString(undefined, {
            weekday: "long",
            month: "long",
            day: "numeric"
        })
    ).join(", ");

    const finalMessage =
        `Hey! I’d love to take you to ${place} on ${prettyDates} at ${prettyTime}. ` +
        `Would you like to go on a date with me? 🐔💚`;

    summary.textContent = finalMessage;
    inviteYes.value = finalMessage;

    const noSummaryBtn = document.getElementById("noSummaryBtn");
    const yesBtn = document.getElementById("yesBtn");
    const yesForm = document.getElementById("yesForm");

    /* ============================================================
       SUMMARY — NO SHRINK / YES GROW + HEARTBEAT + SUPER MODE
    ============================================================ */
    if (noSummaryBtn && yesBtn) {
        let yesSize = 1.0;
        let noSize = 1.0;

        noSummaryBtn.addEventListener("click", () => {
            yesSize += 0.15;
            noSize -= 0.10;

            yesBtn.style.transform = `scale(${yesSize})`;
            noSummaryBtn.style.transform = `scale(${noSize})`;

            yesBtn.classList.add("yes-heartbeat");

            if (noSize < 0.3) {
                noSummaryBtn.disabled = true;
                noSummaryBtn.style.opacity = "0";
                noSummaryBtn.style.pointerEvents = "none";

                yesBtn.classList.add("yes-super");
            }
        });
    }

    /* ============================================================
       CONFETTI EXPLOSION
    ============================================================ */
    function launchConfetti() {
        const duration = 1500;
        const end = Date.now() + duration;

        (function frame() {
            for (let i = 0; i < 20; i++) {
                const confetti = document.createElement("div");
                confetti.classList.add("confetti-piece");

                confetti.style.left = Math.random() * window.innerWidth + "px";
                confetti.style.top = "-20px";
                confetti.style.backgroundColor =
                    ["#ff5c5c", "#ffd700", "#7edc6f", "#5cb3ff"][Math.floor(Math.random() * 4)];

                document.body.appendChild(confetti);

                setTimeout(() => {
                    confetti.style.transform =
                        `translateY(${window.innerHeight + 100}px) rotate(${Math.random() * 360}deg)`;
                    confetti.style.opacity = "0";
                }, 10);

                setTimeout(() => confetti.remove(), 1500);
            }

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        })();
    }

    /* ============================================================
       YES BUTTON — DELAYED SUBMIT (2s)
    ============================================================ */
    if (yesBtn && yesForm) {
        yesBtn.addEventListener("click", (e) => {
            e.preventDefault();
            launchConfetti();
            setTimeout(() => {
                yesForm.submit();
            }, 2000);
        });
    }
});
