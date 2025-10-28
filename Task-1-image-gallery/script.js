// ----------------------------
// Load Fonts from JSON
// ----------------------------
fetch('assets/theme/fonts.json')
  .then(res => res.json())
  .then(data => {
    // Inject font links into <head>
    data.links.forEach(link => {
      const linkEl = document.createElement('link');
      linkEl.rel = 'stylesheet';
      linkEl.href = link;
      document.head.appendChild(linkEl);
    });

    // Apply fonts via CSS variables
    document.documentElement.style.setProperty('--font-title', data.fonts.title);
    document.documentElement.style.setProperty('--font-primary', data.fonts.primary);
    document.documentElement.style.setProperty('--font-secondary', data.fonts.secondary);
    // document.documentElement.style.setProperty('--font-heading', data.fonts.heading);

    // Apply fonts immediately to body and title
    document.body.style.fontFamily = data.fonts.primary;
    const title = document.querySelector('h1.title');
    if (title) title.style.fontFamily = data.fonts.title;
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
const searchInput = document.getElementById("searchInput");
const searchBar = document.querySelector(".search-bar");

const suggestionBox = document.createElement("div");
suggestionBox.classList.add("suggestions");
searchBar.appendChild(suggestionBox);

const downloadBtn = document.getElementById('download');

let currentImages = [];
let currentIndex = 0;
let currentQuery = 'random';
let page = 1;
let isLoading = false;

// ----------------------------
// Unsplash API Setup
// ----------------------------
const accessKey = "9RPhGwyw0-goFLLnB0ZY9lsgqgqmU06Hyvw228-vllI"; 
const perPage = 20; // load 20 images per batch

async function loadImages(query = 'random', reset = true) {
  if (isLoading) return;
  isLoading = true;

  if (reset) {
    gallery.innerHTML = "";
    page = 1;
  }

  try {
    const res = await fetch(
      `https://api.unsplash.com/photos/random?query=${query}&count=${perPage}&client_id=${accessKey}`
    );
    const data = await res.json();

    data.forEach(photo => {
      const imgDiv = document.createElement('div');
      imgDiv.classList.add('image-card');
      imgDiv.innerHTML = `<img src="${photo.urls.small}" alt="${photo.alt_description}" loading="lazy" />`;
      gallery.appendChild(imgDiv);
    });

    attachLightboxEvents();
  } catch (err) {
    console.error("Error fetching images:", err);
  } finally {
    isLoading = false;
  }
}

// ----------------------------
// Infinite Scroll
// ----------------------------
window.addEventListener('scroll', () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
    loadImages(currentQuery, false);
  }
});

// ----------------------------
// Lightbox Functions
// ----------------------------
function attachLightboxEvents() {
  currentImages = document.querySelectorAll('.image-card img');
  currentImages.forEach((img, index) => {
    img.onclick = () => openLightbox(index);
  });
}

function openLightbox(index) {
  currentIndex = index;
  const currentSrc = currentImages[currentIndex].src;
  lightboxImage.src = currentSrc;
  downloadBtn.href = currentSrc;
  lightbox.style.display = 'flex';
}

closeBtn.addEventListener('click', () => lightbox.style.display = 'none');

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
  downloadBtn.href = currentSrc;
}

// Keyboard navigation for lightbox
document.addEventListener('keydown', e => {
  if (lightbox.style.display === 'flex') {
    if (e.key === 'ArrowRight') nextBtn.click();
    if (e.key === 'ArrowLeft') prevBtn.click();
    if (e.key === 'Escape') closeBtn.click();
  }
});

// ----------------------------
// Filters
// ----------------------------
filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelector('.filters .active').classList.remove('active');
    btn.classList.add('active');
    currentQuery = btn.dataset.category === 'all' ? 'random' : btn.dataset.category;
    loadImages(currentQuery, true);
  });
});

// ----------------------------
// Search Suggestions
// ----------------------------
const suggestionList = [
  "Animals","Architecture","Art","Astronomy","Adventure","Abstract","Animation","Accessories","Automobile","Anime",
  "Beach","Birds","Books","Basketball","Bikes","Bridges","Balloons","Butterflies","Buildings","Birthday",
  "City","Cars","Clouds","Camping","Cats","Chocolate","Coast","Concert","Canvas","Cuisine",
  "Desserts","Design","Dogs","Dance","Drama","Drawing","Dolphins","DIY","Dragon","Documentary",
  "Education","Eclipse","Emoji","Environment","Engineering","Exercise","Events","Ethnic","Exhibition","Electronics",
  "Fashion","Flowers","Food","Furniture","Fitness","Festival","Forest","Fantasy","Film","Fireworks",
  "Games","Garden","Galaxy","Gadgets","Graffiti","Gems","Goats","Glow","Golf","Glasses",
  "Hiking","History","Home","Halloween","Harbor","Horse","Hospitality","Humor","Holidays","Handmade",
  "Ice","Illustration","Islands","Insects","Interior","Industry","Innovation","Imagination","Icon","Instrument",
  "Jewelry","Jungle","Journey","Jazz","Jogging","Journal","Juice","Jackfruit","Jet","Jokes",
  "Kitchen","Kites","Kids","Kangaroo","Knitting","Kaleidoscope","Kingdom","Keyboard","Kayaking","Kitten",
  "Landscape","Lanterns","Love","Light","Lakes","Learning","Luxury","Leaves","Library","Legends",
  "Mountains","Music","Moon","Markets","Movies","Meditation","Manga","Magic","Machines","Marine",
  "Nature","Night","Nebula","Nutrition","Novel","Navigation","Neighborhood","Noodles","Numbers","News",
  "Ocean","Objects","Orchids","Outdoor","Opera","Observatory","Odyssey","Outfit","Origami","Organization",
  "People","Painting","Photography","Plants","Puzzles","Patterns","Pets","Performance","Parade","Places",
  "Quotes","Quilt","Queens","Quest","Quantum","Quokka","Questionnaire","Quiver","Quasar","Quality",
  "Rain","Roads","Rivers","Rocks","Roses","Running","Restaurants","Reptiles","Rainbow","Rooftop",
  "Space","Sunset","Stars","Sports","Sea","Snow","Street","Science","Skyscraper","Shopping",
  "Technology","Travel","Trees","Theater","Tropical","Training","Toys","Transportation","Tradition","Textiles",
  "Universe","Urban","Umbrella","University","Underwater","Upcycling","Utopia","Ukulele","Uniform","Unicorn",
  "Vehicles","Volcano","Valley","Vegetables","Village","Vacation","Vintage","Vortex","Vineyard","Victory",
  "Water","Wildlife","Winter","Wonders","Workshop","Waves","Writing","Whales","Woodwork","Wilderness",
  "Xylophone","Xerox","Xmas","Xenon","X-Factor","Xerophyte","Xenial","Xenolith","Xylography","X-traordinary",
  "Yoga","Yacht","Yard","Yellow","Youth","Yogurt","Yearbook","Yodel","Yen","Yield",
  "Zoo","Zephyr","Zodiac","Zebra","Zen","Zero","Zigzag","Zinnia","Zone","Zoom"
];

// Better UX: keyboard navigation for suggestions
let selectedIndex = -1;

searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase().trim();
  suggestionBox.innerHTML = "";
  selectedIndex = -1;

  if (!query) {
    suggestionBox.style.display = "none";
    return;
  }

  const matches = suggestionList.filter(item => item.toLowerCase().includes(query));

  if (matches.length) {
    suggestionBox.style.display = "block";
    matches.forEach((match, index) => {
      const div = document.createElement("div");
      div.classList.add("suggestion-item");
      div.textContent = match;

      div.onclick = () => {
        searchInput.value = match;
        suggestionBox.style.display = "none";
        currentQuery = match.toLowerCase();
        loadImages(currentQuery, true);
      };

      suggestionBox.appendChild(div);
    });
  } else {
    suggestionBox.style.display = "none";
  }
});

// Keyboard navigation in suggestions
searchInput.addEventListener("keydown", e => {
  const items = suggestionBox.querySelectorAll(".suggestion-item");
  if (!items.length) return;

  if (e.key === "ArrowDown") {
    selectedIndex = (selectedIndex + 1) % items.length;
    items.forEach(i => i.classList.remove("selected"));
    items[selectedIndex].classList.add("selected");
  }
  if (e.key === "ArrowUp") {
    selectedIndex = (selectedIndex - 1 + items.length) % items.length;
    items.forEach(i => i.classList.remove("selected"));
    items[selectedIndex].classList.add("selected");
  }
  if (e.key === "Enter" && selectedIndex >= 0) {
    items[selectedIndex].click();
  }
});

// Hide suggestions when clicking outside
document.addEventListener("click", e => {
  if (!searchBar.contains(e.target)) suggestionBox.style.display = "none";
});

// ----------------------------
// Initial Load
// ----------------------------
loadImages(currentQuery, true);
