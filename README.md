# Theater6

Theater6 is a movie search app built with HTML, CSS, and JavaScript using the OMDb API. Users can search for movies or shows, sort the results, and open a modal to view more details about a selected title.

This project helped me practice building a small front-end application with real API data, dynamic rendering, client-side sorting, and interactive UI states.

## Features

- Search movies and shows with the OMDb API
- Debounced search input to reduce unnecessary API requests
- Request tracking to prevent stale search results from overwriting newer ones
- Client-side sorting by release date and IMDb rating
- Loading, empty, and error states for better user feedback
- Hover details on movie cards
- Modal with expanded movie information
- Responsive layout for desktop, tablet, and mobile

## Tech Stack

- HTML5
- CSS3
- JavaScript (Vanilla JS)
- OMDb API

## How It Works

The app follows a simple front-end flow:

1. The user types into the search input.
2. The input handler debounces the search so requests are not sent on every keystroke.
3. JavaScript sends a search request to the OMDb API using the title query.
4. The app takes the returned search matches and fetches detailed movie data for each result using the IMDb ID.
5. The results are stored in memory and rendered into the DOM as movie cards.
6. When the user changes the sort dropdown, the app sorts the already-fetched movie data client-side instead of making another API call.
7. When the user clicks a movie card, the app opens a modal and fills it with the cached movie details.

## What I Learned

Building this project helped me understand how the three core front-end layers work together:

- HTML provides the structure and placeholders for the UI
- CSS controls layout, responsiveness, and visual states like hover effects
- JavaScript handles behavior, API calls, state management, and rendering

I also learned several important front-end concepts while building and debugging this project:

- How debounce improves the search experience by waiting until the user pauses typing
- Why debounce alone is not enough and how request tracking helps prevent stale async responses from overwriting newer results
- How to work with asynchronous JavaScript using `fetch`, `async/await`, and `Promise.all`
- How to render API data into the DOM and update the UI from application state
- How to handle loading, empty, and error states instead of leaving the page blank
- How client-side sorting works when data is already stored in memory
- How CSS Grid and Flexbox solve different layout problems
- How modal dialogs work and how JavaScript can control visibility with classes and accessibility attributes

## Challenges And Solutions

### 1. Sorting behavior after search

One challenge was understanding why sorting sometimes worked only in certain situations. I learned that sorting needs its own event path from the dropdown, not just logic that runs after search results load.

### 2. Debounce versus stale requests

At first, debounce seemed like enough for search. While working on the project, I learned that debounce only controls when requests start. It does not stop older requests from finishing later and overwriting newer results. That is where request tracking becomes important. 

### 3. Dynamic rendering bugs

I also ran into rendering issues caused by small markup mistakes. That reinforced how important correct HTML structure is when CSS selectors and JavaScript interactions depend on it.

### 4. Working with incomplete API data

The OMDb API can return missing fields or values like `N/A`, so I had to add fallbacks for posters, text fields, and movie metadata to keep the UI stable.

### 5. Defensive Programming in General
Once I got the initial user flow working, it was in the defensive programming and edge cases where I had to get help. This allowed me to 
consider situations where the app could fail and how to prevent those errors. Utilizing Copilot helped me identify where the app was weak, and I took that opportunity to learn new defensive concepts and prevent ways in which the app could fail in searching, sorting, and rendering.

### 6. Modal Design
I also had a vision for the CSS and struggled to implement some aspects of the modal and the movie card that turns up on the most poster on hover. Once I got some CSS ideas from Copilot, I got unstuck and learned new CSS concepts to implement in the future.

## Project Structure

- [index.html](./index.html): page structure, controls, results container, footer, and modal markup
- [styles.css](./styles.css): layout, styling, responsive behavior, hover effects, and modal presentation
- [index.js](./index.js): search logic, API requests, request tracking, sorting, rendering, and modal behavior
- [config.js](./config.js): OMDb API key configuration

## Prerequisites

Before running the project, make sure you have:

- A modern web browser such as Chrome, Safari, Edge, or Firefox
- A code editor such as VS Code
- A valid OMDb API key
- An optional local development server such as the VS Code Live Server extension for easier testing

## Installation And Setup

1. Clone the repository.
2. Add your OMDb API key to [config.js](./config.js).
3. Open the project folder in your code editor.
4. Open [index.html](./index.html) directly in the browser, or run the project with a local server such as Live Server.

## Future Improvements

- Sanitize remote data before inserting it into the DOM
- Add keyboard focus management for the modal
- Add pagination or a load-more feature
- Add filtering by year or type
- Improve test coverage for search, sorting, and modal behavior
- Refine accessibility and screen reader support

## Credits

- Movie data from the OMDb API
- Footer icon attribution: Freepik / Flaticon

