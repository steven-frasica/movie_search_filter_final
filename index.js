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

renderMovieGrid([], (message = "Use the search bar to find movies or shows"));
