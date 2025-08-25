const toggle = document.getElementById("theme-toggle");
const btns = document.querySelectorAll(".filter-btn");

let theme = localStorage.getItem("theme");
if (theme === "light") document.documentElement.classList.remove("dark");

let allCards = [];
let currentFilter = "all";

toggle.addEventListener("click", () => {
  if (theme === "dark") {
    theme = "light";
    localStorage.setItem("theme", theme);
    document.documentElement.classList.remove("dark");
  } else {
    theme = "dark";
    localStorage.setItem("theme", theme);
    document.documentElement.classList.add("dark");
  }
});

btns.forEach((btn) => {
  btn.addEventListener("click", () => {
    btns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    currentFilter = btn.textContent.trim().toLowerCase();
    applyFilter();
  });
});

function applyFilter() {
  if (currentFilter === "all") {
    displayCards(allCards);
  } else if (currentFilter === "active") {
    displayCards(allCards.filter((c) => c.isActive));
  } else if (currentFilter === "inactive") {
    displayCards(allCards.filter((c) => !c.isActive));
  }
}

async function loadData() {
  try {
    let saved = localStorage.getItem("cards");
    if (saved) {
      allCards = JSON.parse(saved);
    } else {
      let res = await fetch("../../data.json");
      allCards = await res.json();
      localStorage.setItem("cards", JSON.stringify(allCards));
    }
    displayCards(allCards);
  } catch (error) {
    console.log("Error loading", error);
  }
}

function displayCards(cards) {
  const content = cards
    .map((card) => {
      const index = allCards.findIndex((c) => c === card);

      return `<div
              class="card card-border col-span-12 md:col-span-6 lg:col-span-4 dark:bg-neutral-800 bg-neutral-0 rounded-xl border dark:border-neutral-600/70 border-neutral-300/60"
              >
              <div class="card-body ">
                <div class="card-header flex">
                  <div class="card-img w-24">
                    <img src="${card.logo}" alt="${card.name}" />
                  </div>
                  <div class="card-txt ms-4">
                    <h2 class="card-title dark:text-white text-neutral-800">${
                      card.name
                    }</h2>
                    <p class="dark:text-neutral-300/80 text-neutral-600/80 text-base line-clamp-3 md:line-clamp-2">
                      ${card.description}
                    </p>
                  </div>
                </div>

                <div class="card-actions flex justify-between pt-8">
                  <button
                    class="remove-btn px-3 py-1 text-sm rounded-full border dark:text-neutral-200 text-neutral-800 border-neutral-600/60 hover:dark:bg-red-400 hover:font-medium hover:border-red-600/90 hover:bg-red-600/90 hover:dark:text-neutral-800 hover:text-neutral-0"
                     data-index="${index}"
                    >
                    Remove
                  </button>
                  <input
                    type="checkbox"
                     data-index="${index}"
                      aria-label="Toggle extension active state"
                    class="toggle border-neutral-600/50 bg-neutral-600/50 text-white checked:dark:border-red-400/90 checked:border-red-600/90 checked:dark:bg-red-400/90 checked:bg-red-600/90 py-0 checked:py-0 checked:hover:bg-red-400 checked:hover:border-red-400 checked:dark:hover:bg-red-500/90 checked:dark:hover:border-red-500/90"
                    ${card.isActive ? "checked" : ""} 
                    />
                 
                </div>
              </div>
            </div>`;
    })
    .join("");
  document.querySelector(".cards").innerHTML = content;

  deleteCard();
  toggleState();
}

function deleteCard() {
  document.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = parseInt(btn.dataset.index);
      allCards.splice(index, 1);
      localStorage.setItem("cards", JSON.stringify(allCards));
      applyFilter();
    });
  });
}

function toggleState() {
  document.querySelectorAll(".toggle").forEach((toggle) => {
    toggle.addEventListener("change", () => {
      const index = parseInt(toggle.dataset.index);
      allCards[index].isActive = toggle.checked;
      localStorage.setItem("cards", JSON.stringify(allCards));
    });
  });
}

loadData();
