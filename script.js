const noteForm = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const noteCategory = document.querySelector("#note-category");
const notesList = document.querySelector("#notes-list");
const errorMessage = document.querySelector("#error-message");
const searchInput = document.querySelector("#search-input");
const noteCount = document.querySelector("#note-count");

/*Load notes from localStorage when page opens (or start with empty array)*/
let notes = JSON.parse(localStorage.getItem("notes")) || [];

/*Helper function to save notes to localStorage*/
function saveNotes() {
    localStorage.setItem("notes", JSON.stringify(notes));
}

function renderNotes(filterText = "") {
    notesList.innerHTML = "";

    /*Filter notes based on search query (case-insensitive)*/
    const filteredNotes = notes.filter(note => 
        note.text.toLowerCase().includes(filterText.toLowerCase())
    );

    /*Update count message based on total notes*/
    if (notes.length === 0) {
        noteCount.textContent = "You have no notes yet.";
    } else if (notes.length === 1) {
        noteCount.textContent = "You have 1 note.";
    } else {
        noteCount.textContent = `You have ${notes.length} notes.`;
    }

    /*This is for handling case where search finds nothing*/
    if (filteredNotes.length === 0 && notes.length > 0) {
        const li = document.createElement("li");
        li.textContent = "No notes match your search.";
        notesList.appendChild(li);
        return;
    }

    filteredNotes.forEach((note) => {
        const li = document.createElement("li");
        li.className = `note-card category-${note.category.toLowerCase()}`;

        const contentDiv = document.createElement("div");
        contentDiv.className = "note-content";

        const textP = document.createElement("p");
        textP.textContent = note.text; // Safe from XSS

        const metaP = document.createElement("p");
        metaP.className = "note-meta";
        metaP.textContent = `[${note.category}] - ${note.createdAt}`;

        contentDiv.appendChild(textP);
        contentDiv.appendChild(metaP);
        li.appendChild(contentDiv);

        /* Deletion button */
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", () => {
            notes = notes.filter(n => n.id !== note.id);
            saveNotes(); /* Update storage */
            renderNotes(searchInput.value); /* Re-render keeping search filter active */
        });
        li.appendChild(deleteBtn);

        notesList.appendChild(li);
    });
}

/*Form submission listener*/
noteForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const text = noteInput.value.trim();
    const category = noteCategory.value;

    /* Validation */
    if (text === "") {
        errorMessage.textContent = "Please type a note first.";
        return;
    }
    if (text.length > 200) {
        errorMessage.textContent = "Notes must be 200 characters or fewer.";
        return;
    }

    errorMessage.textContent = "";

    const newNote = {
        id: Date.now().toString(),
        text: text,
        category: category,
        createdAt: new Date().toLocaleString()
    };

    notes.push(newNote);
    saveNotes(); /* Save to localStorage!*/
    noteInput.value = "";
    noteInput.focus();
    renderNotes(searchInput.value);
});

/*Real-time search listener*/
searchInput.addEventListener("input", (e) => {
    renderNotes(e.target.value);
});

/*Initial render when the page loads*/
renderNotes();