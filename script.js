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
        privacyTitle: "🎄 Welcome to the Christmas Party 🎄",
        privacyText: "ho, ho, ho! By joining in, you're giving us permission to use your chosen alias for our merry Bingo game. No need to worry—your info will stay as safe as gifts under the Christmas tree. Feeling creative? Pick a festive nickname like “Jingle Belle” or “Snowy McFrost”! 🎅",
        agreeButton: "Count me in for fun! 🎁",
        descriptionTitle: "🧊 First Game: Ice Breaker! ❄️",
        descriptionText: "Let’s kick things off with a jolly start! Your mission is to complete the 3x3 board by talking with your colleagues and discovering who matches the characteristics listed on your grid. Under each characteristic, write down the name of the person who fits the best. 🎄 **Pro Tip:** Each person can only be used for one characteristic, so get to know as many people as possible!. Bring your A-game and try to fill out the entire board—it’s going to play a part in the fun surprises we have planned later tonight. So get chatting and spread some holiday cheer!",
        gameTitle: "Bingo Game",
        startGameButton: "Start Game",
        usernamePlaceholder: "Enter your nickname",
        gotItButton: "Take me to the game! 🎁"
    },
    german: {
        privacyTitle: "🎅 Willkommen zur Weihnachtsessen 🎅",
        privacyText: "Ho, ho, ho, Weihnachtsfreund! Mit deinem Klick erlaubst du uns, deinen gewählten Alias für unser festliches Bingo zu nutzen. Keine Sorge—deine Daten sind bei uns sicherer als der Lebkuchen vor dem Weihnachtsmann und werden nur genutzt, um heute Abend Weihnachtszauber zu verbreiten. Lust auf einen kreativen Namen? Wie wär’s mit „Keks-König“ oder „Glühwein-Gretel“? 🍪🎄 Denn hier geht’s darum!",
        agreeButton: "Ich bin dabei – Frohes Fest und Spaß! 🎁",
        descriptionTitle: "🧊 Erstes Spiel: Eisbrecher-Gaudi! ❄️",
        descriptionText: "Pack ma’s, Kollegen! Dein Ziel ist es, das 3x3 Feld zu füllen, indem du mit den anderen ins Gespräch kommst und herausfindest, wer zu den Eigenschaften auf deinem Spielfeld passt. Unter jede Eigenschaft schreibst du den Namen der Person, die dazu passt. 🧊 **Tipp:** Jede Person darf nur einmal verwendet werden – also quatsch möglichst viele Leute an! Gib dein Bestes, das ganze Feld vollzukriegen – später am Abend kommt das noch zünftig zum Einsatz! Also schnapp dir einen Glühwein, quatsch drauflos, und mach aus dieser Eisbrecher-Gaudi einen echten Kracher. Prost und viel Spaß!",
        gameTitle: "Bingo-Spiel",
        startGameButton: "Spiel starten",
        usernamePlaceholder: "Geben Sie Ihren Spitznamen ein",
        gotItButton: "Auf geht’s zum Spiel! 🎁"
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
