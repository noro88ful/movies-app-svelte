
# MovieBox – SvelteKit + TMDb

A modern, responsive movie app built with SvelteKit and Tailwind CSS.

> **Notice:**
> 
> If you see a red alert at the top of the app stating:
> 
> **Notice:** For live movie data, please provide your TMDB API key. You are currently viewing mock data. Enter a valid TMDB key to enable real-time content.
> 
> This means the app is running in mock mode. To enable real-time movie data, you must provide your own TMDB API key (see below).

---

## Features

It features:

- Pixel‑perfect home screen with two carousels: Popular and Recommended
- Filters by genre and year
- Details page with poster, backdrop, rating, overview, actors, and IMDb link
- TMDb integration via server-side API calls (no keys exposed to the client)
- Favorites functionality to save your preferred movies
- Interactive rating stars component
- Responsive design with modern UI components

## Tech Stack

- **Framework**: SvelteKit 2 + Svelte 5
- **Styling**: Tailwind CSS 3.4.11
- **Language**: TypeScript
- **API**: The Movie Database (TMDb) API
- **Testing**: Vitest + Playwright
- **Build Tool**: Vite

## Getting started

1. Install dependencies

```
npm install
```

2. Set the TMDb API key (v3). Copy the example environment file and add your API key:

```bash
cp .env.example .env
```


Then edit `.env` and replace `your_tmdb_api_key_here` with your actual API key. Without a valid key, the app will show mock data and a prominent red notice at the top of the home page.

You can get your TMDb API key from [The Movie Database (TMDb)](https://www.themoviedb.org/settings/api).

3. Run the dev server

```
npm run dev
```


Open the app, browse Popular/Recommended, adjust filters, and click any card for details.

If you see a red alert about the TMDB key, follow the instructions above to enable live data.

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview the production build
- `npm run test` - Run tests
- `npm run lint` - Lint the code
- `npm run format` - Format the code with Prettier

## Project Structure

```
src/
├── lib/
│   ├── api/           # TMDb API integration
│   ├── components/    # Reusable Svelte components
│   └── stores/        # Svelte stores for state management
├── routes/
│   ├── +page.svelte   # Home page
│   ├── favorites/     # Favorites page
│   └── title/[type]/[id]/ # Movie/TV details page
└── app.html           # Main app template
```

## Routes

- `/` – Home page with Popular and Recommended movies
- `/favorites` – Your saved favorite movies
- `/title/[type]/[id]` – Details page for movies or TV shows

## Features

### Components
- **MovieCard**: Displays movie posters with heart icon for favorites
- **Carousel**: Horizontal scrolling movie lists
- **FilterBar**: Genre and year filtering
- **RatingStars**: Interactive star rating display
- **Navbar**: Navigation with responsive design

### API Integration
- Server-side TMDb API calls for security
- Popular movies from trending endpoint
- Recommended movies from discover endpoint with filtering
- Detailed movie/TV information including cast and crew


## Screenshots

![Image-1](https://i.postimg.cc/HsYNT6PW/Screenshot-3.png)
![Image-2](https://i.postimg.cc/qM15q29s/Screenshot-4.png)
![Image-3](https://i.postimg.cc/s2h6Tq1m/Screenshot-5.png)
![Image-4](https://i.postimg.cc/SxjtMJhw/Screenshot-6.png)
![Image-5](https://i.postimg.cc/k4Pjzsbm/Screenshot-7.png)
![Image-6](https://i.postimg.cc/DwDpdnfm/Screenshot-8.png)

## Credits

Data provided by The Movie Database (TMDb). This product uses the TMDb API but is not endorsed or certified by TMDb.
