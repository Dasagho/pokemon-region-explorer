# PokéRegion Explorer

A beautiful Pokemon Region Explorer built with Vite, React, TypeScript, and shadcn/ui. Browse Pokemon by their natural habitats, explore regions, locations, and encounter details.

![Pokemon Regions](https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png)

## Features

- **Region Explorer**: Browse all Pokemon regions (Kanto, Johto, Hoenn, etc.)
- **Location Details**: View specific areas and their Pokemon encounters
- **Encounter Data**: See spawn rates, levels, and encounter methods
- **Pokemon Details**: Comprehensive stats, types, and information
- **Dark/Light Theme**: Full theme support with toggle
- **Responsive Design**: Works on all device sizes
- **Beautiful UI**: Built with shadcn/ui components

## Tech Stack

- **Framework**: Vite 7 + React 19 + TypeScript 5.9
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Routing**: React Router v7
- **Icons**: Lucide React
- **API**: PokéAPI (https://pokeapi.co/)
- **Linting**: ESLint 9 with flat config
- **Formatting**: Prettier 3

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pokemon-region-explorer
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The build output will be in the `dist` directory.

### Linting and Formatting

```bash
# Run ESLint
npm run lint

# Format code with Prettier
npx prettier --write .
```

## Project Structure

```
pokemon-region-explorer/
├── src/
│   ├── components/
│   │   ├── ui/          # shadcn/ui components
│   │   ├── main-layout.tsx
│   │   ├── mode-toggle.tsx
│   │   └── theme-provider.tsx
│   ├── pages/
│   │   ├── home.tsx     # Regions list
│   │   ├── region.tsx   # Region details
│   │   ├── location.tsx # Location encounters
│   │   └── pokemon.tsx  # Pokemon details
│   ├── services/
│   │   └── pokeApi.ts   # PokéAPI service
│   ├── lib/
│   │   └── utils.ts     # Utility functions
│   ├── router.tsx       # React Router config
│   ├── App.tsx          # Root component
│   └── main.tsx         # Entry point
├── public/              # Static assets
├── components.json      # shadcn/ui config
├── tsconfig.json        # TypeScript config
└── vite.config.ts       # Vite config
```

## Features Details

### Region Explorer
- Browse all 9 main Pokemon regions
- View region-specific information and generation
- See starter Pokemon for each region
- Navigate to locations within regions

### Location Browser
- View all areas within a region
- Filter by location type (Route, Settlement, Cave, Forest, etc.)
- Access detailed encounter information

### Pokemon Encounters
- Group encounters by method (Grass, Surf, Fish, etc.)
- See level ranges and encounter rates
- View Pokemon types and stats
- Navigate to detailed Pokemon pages

### Pokemon Details
- Official artwork display
- Base stats with visual progress bars
- Type badges with colors
- Height and weight information
- Abilities (including hidden abilities)

## Design

This app uses a clean, modern design with:
- Neutral color palette with subtle accents
- Card-based layouts
- Smooth hover transitions
- Responsive grid systems
- Dark mode support

## Credits

- Data: [PokéAPI](https://pokeapi.co/)
- UI Components: [shadcn/ui](https://ui.shadcn.com/)
- Icons: [Lucide](https://lucide.dev/)

## License

MIT
