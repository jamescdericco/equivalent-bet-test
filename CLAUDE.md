# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Code Style Guidelines
- **Files:** snake_case for component files (e.g., `equivalent_bet_test.tsx`)
- **Components:** PascalCase for React components (e.g., `EquivalentBetTest`)
- **Functions:** camelCase for functions (e.g., `lotteryProbability`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `INITIAL_MIN_P`)
- **Enums:** PascalCase with camelCase members
- **Imports:** Group by library then local files
- **TypeScript:** Use strict mode, explicit types for all function parameters and returns
- **JSX:** Return JSX at the end of component function
- **Styling:** Use Tailwind CSS classes and Chakra UI components
- **Error Handling:** Use TypeScript type checking and descriptive error messages
- **Testing:** No formal testing setup found