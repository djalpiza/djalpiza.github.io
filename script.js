// Firebase Configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBK3XrYN630hzci5WCFAVOnSGMz0nD2KiI",
  authDomain: "faxmasusers.firebaseapp.com",
  databaseURL: "https://faxmasusers-default-rtdb.europe-west1.firebasedatabase.app", // Use the correct region-specific URL
  projectId: "faxmasusers",
  storageBucket: "faxmasusers.firebasestorage.app",
  messagingSenderId: "931836276138",
  appId: "1:931836276138:web:530c989d463fab77d10fd3",
  measurementId: "G-5JBDKQCTS4"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Text translations
const translations = {
    english: {
        privacyTitle: "Privacy Notice",
        privacyText: "By proceeding, you consent to share your name or chosen alias with the game organizers. Rest assured, this information will be used solely for the purpose of the Bingo game and will not be shared with any third parties. You may use a nickname if you prefer not to share your real name.",
        agreeButton: "I Agree",
        descriptionTitle: "Welcome to Bingo!",
        descriptionText: "Your goal is to match characteristics of people in a 3x3 bingo board. Below each characteristic, you can write a name and a fun fact to connect it to someone you know. Click on a cell to mark it when you've completed it. The challenge: get three in a row, column, or diagonal!",
        gameTitle: "Bingo Game",
        startGameButton: "Start Game",
        usernamePlaceholder: "Enter your nickname",
        gotItButton: "Got It!"
    },
    german: {
        privacyTitle: "Datenschutzhinweis",
        privacyText: "Wenn Sie fortfahren, stimmen Sie zu, Ihren Namen oder ein Pseudonym mit den Spielorganisatoren zu teilen. Diese Informationen werden ausschließlich für das Bingo-Spiel verwendet und nicht an Dritte weitergegeben. Sie können ein Pseudonym verwenden, wenn Sie Ihren echten Namen nicht teilen möchten.",
        agreeButton: "Ich stimme zu",
        descriptionTitle: "Willkommen bei Bingo!",
        descriptionText: "Ihr Ziel ist es, Eigenschaften von Personen auf einem 3x3-Bingo-Feld zuzuordnen. Unter jeder Eigenschaft können Sie einen Namen und eine lustige Tatsache schreiben, um sie mit jemandem zu verbinden, den Sie kennen. Klicken Sie auf ein Feld, um es zu markieren, wenn Sie es abgeschlossen haben. Die Herausforderung: drei in einer Reihe, Spalte oder Diagonale!",
        gameTitle: "Bingo-Spiel",
        startGameButton: "Spiel starten",
        usernamePlaceholder: "Geben Sie Ihren Spitznamen ein",
        gotItButton: "Verstanden!"
    }
};

// Language selection logic
document.addEventListener("DOMContentLoaded", () => {
    const languageModal = document.getElementById("language-modal");
    const selectEnglish = document.getElementById("select-english");
    const selectGerman = document.getElementById("select-german");

    const setLanguage = (lang) => {
        const langTexts = translations[lang];
		document.body.setAttribute("data-lang", lang); // Store the selected language globally
        document.getElementById("privacy-title").textContent = langTexts.privacyTitle;
        document.getElementById("privacy-text").textContent = langTexts.privacyText;
        document.getElementById("agree-button").textContent = langTexts.agreeButton;
        document.getElementById("description-title").textContent = langTexts.descriptionTitle;
        document.getElementById("description-text").textContent = langTexts.descriptionText;
        document.getElementById("game-title").textContent = langTexts.gameTitle;
        document.getElementById("start-game").textContent = langTexts.startGameButton;
        document.getElementById("username").placeholder = langTexts.usernamePlaceholder;
        document.getElementById("start-description").textContent = langTexts.gotItButton;
    };

    selectEnglish.addEventListener("click", () => {
        setLanguage("english");
        languageModal.classList.add("hidden");
        document.getElementById("privacy-modal").classList.remove("hidden");
    });

    selectGerman.addEventListener("click", () => {
        setLanguage("german");
        languageModal.classList.add("hidden");
        document.getElementById("privacy-modal").classList.remove("hidden");
    });
});

// Rest of your existing script.js logic here (unchanged from your provided version)
// Privacy Modal Logic
document.addEventListener("DOMContentLoaded", () => {
    const privacyModal = document.getElementById("privacy-modal");
    const agreeButton = document.getElementById("agree-button");
    const descriptionModal = document.getElementById("description-modal");
    const descriptionButton = document.getElementById("start-description");

    // Hide description modal when user clicks "Got It"
    descriptionButton.addEventListener("click", () => {
		console.log("Got It! button clicked");
        descriptionModal.classList.add("hidden");
		console.log("Modal classes:", descriptionModal.classList);
    });

    // Show game description after agreeing to privacy notice
    agreeButton.addEventListener("click", () => {
        privacyModal.classList.add("hidden");
        descriptionModal.classList.remove("hidden");
    });

});

// Enable Start Game Button when Username is Entered
const usernameInput = document.getElementById("username");
const startGameButton = document.getElementById("start-game");

usernameInput.addEventListener("input", () => {
    if (usernameInput.value.trim()) {
        startGameButton.disabled = false;
    } else {
        startGameButton.disabled = true;
    }
});

// Start Game Logic
startGameButton.addEventListener("click", async () => {
    const username = usernameInput.value.trim();
    const selectedLanguage = document.body.getAttribute("data-lang"); // Store selected language
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
	
	// Disable Start Game Button after clicking
    startGameButton.disabled = true;
    console.log("Start Game button disabled.");

    // Fetch characteristics
    const response = await fetch("data.json");
    const data = await response.json();
    const characteristics = data.characteristics.map((char) => char[selectedLanguage]);

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
                <input type="text" class="bingo-input" placeholder="Name">
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
