// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBK3XrYN630hzci5WCFAVOnSGMz0nD2KiI",
  authDomain: "faxmasusers.firebaseapp.com",
  projectId: "faxmasusers",
  storageBucket: "faxmasusers.firebasestorage.app",
  messagingSenderId: "931836276138",
  appId: "1:931836276138:web:530c989d463fab77d10fd3",
  measurementId: "G-5JBDKQCTS4"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Privacy Modal Logic
document.addEventListener("DOMContentLoaded", () => {
    const privacyModal = document.getElementById("privacy-modal");
    const agreeButton = document.getElementById("agree-button");

    agreeButton.addEventListener("click", () => {
        privacyModal.style.display = "none";
    });
});

// Start Game Logic
document.getElementById("start-game").addEventListener("click", async () => {
    const username = document.getElementById("username").value.trim();
    if (!username) {
        alert("Please enter a username!");
        return;
    }

    // Save Username to Firebase
    try {
        const usernameRef = db.ref("usernames").push();
        await usernameRef.set({ username });
        console.log("Username saved to Firebase successfully!");
    } catch (error) {
        console.error("Error saving username to Firebase:", error);
        alert("There was an issue saving your username. Please try again.");
        return;
    }

    // Fetch characteristics
    const response = await fetch("data.json");
    const data = await response.json();
    const characteristics = data.characteristics;

    // Generate random Bingo matrix
    const randomCharacteristics = [...characteristics]
        .sort(() => Math.random() - 0.5)
        .slice(0, 9);

    // Display Bingo board
    const bingoBoard = document.getElementById("bingo-board");
    bingoBoard.innerHTML = randomCharacteristics
        .map(
            (fact, index) => `
            <div class="bingo-cell" data-index="${index}">
                <div class="fact">${fact}</div>
                <input type="text" class="bingo-input" placeholder="Enter a name">
                <input type="text" class="bingo-input" placeholder="Enter a fun fact">
            </div>
        `
        )
        .join("");
    bingoBoard.classList.remove("hidden");

    // Add click functionality to Bingo cells
    document.querySelectorAll(".bingo-cell").forEach((cell) => {
        cell.addEventListener("click", () => {
            cell.classList.toggle("marked");
        });
    });
});
