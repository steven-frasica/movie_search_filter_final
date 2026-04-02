// App state shared across handlers.
// Keeping it at file scope makes the data accessible to search, sort, and modal logic.
// In a larger app, this would usually move into a dedicated state/store layer.
// - searchResults: lightweight search results from OMDb `s=` endpoint
let searchResults = [];
// - movieDetails: enriched movie objects from OMDb `i=` endpoint
let movieDetails = [];
// - used to debounce search input
let searchDebounceTimer;
// - tracks the most recent search to avoid race conditions
let latestSearchId = 0;

// Front-end flow:
// 1. Read user input from the DOM.
// 2. Fetch data from the OMDb API.
// 3. Normalize/sort the data in memory.
// 4. Render the current UI state back into the DOM.



// Shows or hides the loading state inside the movie grid.
// This is a small example of UI state: the underlying movie data may not change,
// but the interface still needs to communicate that work is happening.
function setLoading(isLoading, message = "Loading movies...") {
  // Query the two UI nodes that change during loading.
  const movieGridEl = document.querySelector(".movie-results--grid");
  const sortSelectEl = document.querySelector("#sort-select");
  if (isLoading) {
    // Swap the results grid for a temporary loading UI.
    movieGridEl.innerHTML = `
      <div class="movie-grid__loading" role="status" aria-live="polite">
        <div class="spinner" aria-hidden="true"></div>
        <p>${message}</p>
      </div>`;
  }
  // Disable sorting while loading to avoid conflicting re-sorts.
  if (sortSelectEl) sortSelectEl.disabled = isLoading;
}

// Renders either movie cards or an empty-state message.
// The important idea is that the DOM is re-derived from the current state
// instead of manually tweaking lots of small elements.
async function renderMovieGrid(moviesToRender, message = "No movies found.") {
  // This container is the render target for every page state.
  const movieGridEl = document.querySelector(".movie-results--grid");
  if (!moviesToRender.length) {
    // Empty state uses a full-width status message instead of blank space.
    movieGridEl.innerHTML = `
      <p class="movie-grid__message" role="status" aria-live="polite">
        <span class="movie-grid__message-body">
          <span class="movie-grid__message-icon" aria-hidden="true">i</span>
          <span class="movie-grid__message-text" aria-hidden="true">${message}</span>`;
    return;
  }
  // Build all card markup first, then write to the DOM once.
  movieGridEl.innerHTML = moviesToRender.map(buildMovieCardMarkup).join("");
}

// Builds the HTML for one movie card.
// Template strings are convenient here, but they also mean the app is trusting
// API-provided text enough to insert it into HTML, which is a real interview discussion point.
function buildMovieCardMarkup(movie) {
  // Defenseive formatting for missing OMDb fields.
  const posterSrc =
    movie.Poster && movie !== "N/A"
      ? movie.Poster
      : "https://via.placeholder.com/400x600?text=No+Poster";
  // Return one complete movie-card template as a string.
  // The imdbId acts as a stable unique identifier for later lookups.
  return `<div class="movie-card"
            <div class="movie-card__media" onclick="openMovieModal('${movie.imdbID}'">
              <figure>
                <img src="${posterSrc}" alt="${movie.Title || "Movie"}">
              </figure>
            </div>
            <div class="movie-card__details" onclick="openMovieModal('${movie.imdbID}">
              <h3>${movie.Title || "Untitled"}</h3>
              <p><b>Released: ${movie.Released || "Unknown"}</b></p>
              <p><b> ${movie.Runtime && movie.Runtime !== "N/A" ? movie.Runtime : "Unknown"}</b></p>
              <p><b> ${movie.Genre || "Unknown"}</b></p>
              <p><b> ${movie.imdbRating || "N/A"}</b></p>
            </div>
          </div>`;
}

function onSearchChange(event) {
  // This handler is wired directly from the input element in index.html
  // It is responsible only for orchestrating search timing, not rendering details.
  // event.target is the <input>, so its current value is the live search text.
  // Normalize the input so accidental spaces do not trigger bad searches.
  query = event.target.value.trim();
  // Each keystroke gets a unique id so we can ignore stale responses later.
  const searchId = ++latestSearchId;

  // Debounce prevents firing API requests on every single key press.
  clearTimeout(searchDebounceTimer);
  if (!query) {
    // Reset both in-memory result lists when the search box becomes empty.
    searchResults = [];
    movieDetails = [];
    renderMovieGrid([], "Use the search bar to find movies or shows")
  }
  // Wait 350ms after the latest keystroke before hitting the API.
  searchDebounceTimer = setTimeout(() => {
    runSearch(query, searchId);
  }, 350)
}

renderMovieGrid([], "Use the search bar to find movies or shows");

setLoading(false);