// Simulated quotes for the Quote of the Day
const quotes = [
  "The only way to do great work is to love what you do.",
  "Success is not final, failure is not fatal: It is the courage to continue that counts.",
  "Believe you can and you're halfway there.",
  "Act as if what you do makes a difference. It does.",
  "Success usually comes to those who are too busy to be looking for it."
];

// Show a random quote
function showRandomQuote() {
  const quoteText = document.querySelector(".quote-text");
  const randomIndex = Math.floor(Math.random() * quotes.length);
  quoteText.textContent = quotes[randomIndex];
}

// Switch between forms (SignUp / SignIn)
document.getElementById("signUpBtn").addEventListener("click", () => {
  document.getElementById("welcome").classList.add("hidden");  // Updated section ID
  document.getElementById("signUpSection").classList.remove("hidden");
});

document.getElementById("signInBtn").addEventListener("click", () => {
  document.getElementById("welcome").classList.add("hidden");  // Updated section ID
  document.getElementById("signInSection").classList.remove("hidden");
});

// Handle Sign Up
document.getElementById("signUpForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const username = document.getElementById("signUpUsername").value;
  const password = document.getElementById("signUpPassword").value;

  // Make an HTTP POST request to the Flask backend
  fetch('/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: username,
      password: password
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      alert('Account created! Please sign in.');
      document.getElementById("signUpSection").classList.add("hidden");
      document.getElementById("signInSection").classList.remove("hidden");
    } else {
      alert(data.message);
    }
  })
  .catch((error) => {
    console.error('Error:', error);
  });
});

// Handle Sign In
document.getElementById("signInForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const username = document.getElementById("signInUsername").value;
  const password = document.getElementById("signInPassword").value;

  fetch('/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: username,
      password: password
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      // Success - Show the journal section
      document.getElementById("signInSection").classList.add("hidden");
      document.getElementById("dashboard").classList.remove("hidden");
      showRandomQuote();
      loadJournalEntries();  // Load journal entries after login
    } else {
      alert('Invalid credentials. Please try again.');
    }
  })
  .catch((error) => {
    console.error('Error:', error);
  });
});

// Add Entry Functionality
document.getElementById("addEntry").addEventListener("click", () => {
  const title = prompt("Enter the title of your journal entry:");
  const content = prompt("Enter the content of your journal entry:");

  if (title && content) {
    // Make an HTTP POST request to the backend to add a new journal entry
    fetch('/journal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: title,
        content: content
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert("Journal entry added successfully!");
        loadJournalEntries();  // Reload journal entries after adding a new one
      } else {
        alert("Error adding journal entry.");
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  } else {
    alert("Please enter both title and content.");
  }
});

// Load and Display Journal Entries
function loadJournalEntries() {
  fetch('/journal', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  .then(response => response.json())
  .then(data => {
    const entriesGrid = document.querySelector(".entries-grid");
    entriesGrid.innerHTML = '';  // Clear existing entries

    data.entries.forEach(entry => {
      const entryDiv = document.createElement('div');
      entryDiv.className = 'entry';

      const title = document.createElement('h3');
      title.textContent = entry.title;

      const content = document.createElement('p');
      content.textContent = entry.content;

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.addEventListener('click', () => {
        deleteEntry(entry.id);
      });

      entryDiv.appendChild(title);
      entryDiv.appendChild(content);
      entryDiv.appendChild(deleteButton);
      entriesGrid.appendChild(entryDiv);
    });
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}

// Delete Entry Functionality
function deleteEntry(entryId) {
  // Make an HTTP DELETE request to the backend to delete the journal entry
  fetch(`/journal/${entryId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      alert("Journal entry deleted successfully!");
      loadJournalEntries();  // Reload journal entries after deletion
    } else {
      alert("Error deleting journal entry.");
    }
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}

// Call loadJournalEntries when the user signs in
document.getElementById("viewEntries").addEventListener("click", () => {
  loadJournalEntries();
});
