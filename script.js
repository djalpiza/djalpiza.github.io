document.getElementById("start-game").addEventListener("click", async () => {
    const username = document.getElementById("username").value.trim();
    if (!username) {
        alert("Please enter a username!");
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
