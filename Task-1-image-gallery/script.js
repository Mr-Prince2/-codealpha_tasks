// ----------------------------
// Fonts JSON Integration
// ----------------------------
fetch('assets/theme/fonts.json')
  .then(response => response.json())
  .then(data => {
    document.h1.style.fontFamily = data.fonts.title;
  })
  .catch(err => console.error("Fonts JSON load error:", err));

// ----------------------------
// DOM Elements
// ----------------------------
const gallery = document.querySelector('.gallery');
const lightbox = document.querySelector('.lightbox');
const lightboxImage = document.querySelector('.lightbox-image');
const closeBtn = document.querySelector('.close');
const nextBtn = document.getElementById('next');
const prevBtn = document.getElementById('prev');
const filterButtons = document.querySelectorAll('.filters button');

let currentImages = []; // Array of current images in gallery
let currentIndex = 0;   // Currently opened image index

// ----------------------------
// Unsplash API Setup
// ----------------------------
const accessKey = "9RPhGwyw0-goFLLnB0ZY9lsgqgqmU06Hyvw228-vllI"; // API key

async function loadImages(query = 'nature', count = 120) {
  try {
    const res = await fetch(
      `https://api.unsplash.com/photos/random?query=${query}&count=${count}&client_id=${accessKey}`
    );
    const data = await res.json();

    // Clear previous images
    gallery.innerHTML = "";

    // Append new images
    data.forEach(photo => {
      const imgDiv = document.createElement('div');
      imgDiv.classList.add('image-card');
      imgDiv.innerHTML = `<img src="${photo.urls.small}" alt="${photo.alt_description}" />`;
      gallery.appendChild(imgDiv);
    });

    // Attach lightbox events to new images
    attachLightboxEvents();

  } catch (err) {
    console.error("Error fetching images:", err);
  }
}

// ----------------------------
// Lightbox Functions
// ----------------------------
const downloadBtn = document.getElementById('download');

function attachLightboxEvents() {
  currentImages = document.querySelectorAll('.image-card img');
  currentImages.forEach((img, index) => {
    img.addEventListener('click', () => openLightbox(index));
  });
}

function openLightbox(index) {
  currentIndex = index;
  const currentSrc = currentImages[currentIndex].src;
  lightboxImage.src = currentSrc;
  downloadBtn.href = currentSrc; // link image to download button
  lightbox.style.display = 'flex';
}

// Close Lightbox
closeBtn.addEventListener('click', () => {
  lightbox.style.display = 'none';
});

// Next / Prev Buttons
nextBtn.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % currentImages.length;
  updateLightboxImage();
});

prevBtn.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
  updateLightboxImage();
});

function updateLightboxImage() {
  const currentSrc = currentImages[currentIndex].src;
  lightboxImage.src = currentSrc;
  downloadBtn.href = currentSrc; // update download link
}


// ----------------------------
// Filters
// ----------------------------
filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active class
    document.querySelector('.filters .active').classList.remove('active');
    btn.classList.add('active');

    const category = btn.dataset.category;

    // Load images by category
    if (category === 'all') {
      loadImages('random',120); // Random images
    } else {
      loadImages(category, 120);
    }
  });
});

// ----------------------------
// 🔍 Search Suggestions Feature
// ----------------------------
const searchInput = document.getElementById("searchInput");
const searchBar = document.querySelector(".search-bar");

// ✅ Create suggestion box dynamically
const suggestionBox = document.createElement("div");
suggestionBox.classList.add("suggestions");
searchBar.appendChild(suggestionBox);

// Common categories or tags for suggestions
const suggestionList = [
  "Nature", "City", "Animals", "Birds", "Cars", "Anime", "Emoji",
  "Mountains", "Beach", "Flowers", "Technology", "People",
  "Food", "Architecture", "Space", "Ocean", "Rain", "Sunset"
];

// Listen for typing in the search bar
searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase().trim();
  suggestionBox.innerHTML = ""; // Clear old suggestions

  if (query.length === 0) {
    suggestionBox.style.display = "none";
    return;
  }

  // Filter suggestions based on input
  const matches = suggestionList.filter(item =>
    item.toLowerCase().includes(query)
  );

  // Show matches
  if (matches.length > 0) {
    suggestionBox.style.display = "block";
    matches.forEach(match => {
      const suggestionItem = document.createElement("div");
      suggestionItem.classList.add("suggestion-item");
      suggestionItem.textContent = match;

      // ✅ Click on suggestion → load that category
      suggestionItem.addEventListener("click", () => {
        searchInput.value = match;
        suggestionBox.style.display = "none";
        loadImages(match.toLowerCase(), 120);
      });

      suggestionBox.appendChild(suggestionItem);
    });
  } else {
    suggestionBox.style.display = "none";
  }
});

// Hide suggestions when clicking outside
document.addEventListener("click", (e) => {
  if (!searchBar.contains(e.target)) {
    suggestionBox.style.display = "none";
  }
});


// ----------------------------
// Initial Load
// ----------------------------
loadImages('all', 120); // Default category on page load
