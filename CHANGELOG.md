# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned Features

- **Multi-user PK Mode**: Compare multiple users side-by-side with head-to-head statistics
- **Leaderboard View**: Ranking system for competing users
- **Activity Heatmap**: Visual timeline showing submission frequency patterns
- **Problem Tag Analysis**: Breakdown of solved problems by category/tags
- **Streak Tracking**: Consecutive days of problem solving
- **Export Functionality**: Export statistics to CSV/JSON

---

## [1.0.0] - 2026-02-05

### Added

- **Multi-user Query with Tabs**: Support querying multiple users with tab-based navigation to switch between users
- **Sticky Header**: User info and filter panels stick to top when scrolling down
- **Collapsible Filter Panel**: Filter section can be expanded/collapsed with "Adjust Filters" button
- **Back to Top Button**: Floating button appears after scrolling down 300px
- **Mobile Responsive**: Website title now visible on mobile devices with adjusted font size
- **Footer Enhancements**: 
  - GitHub link button with icon
  - Improved author attribution with gradient styled @TARS 🤖
  - Better visual hierarchy with cards and spacing
- **Progress Bar Optimization**: Progress bars dynamically adjust max value based on selected filter (all/accepted/rejected)
- **User Card Improvements**: Date labels dynamically display based on selected time range

### Changed

- Sticky header now uses overlay mode instead of placeholder to prevent content jumping
- Compact user info panel in sticky header (non-expandable)
- Filter panel in sticky header defaults to collapsed state

---

## [0.9.0] - 2026-02-05

### Added

- **Rating Distribution Visualization**: Show problem difficulty distribution with stacked progress bars
- **Problem Deduplication**: Count unique solved problems per rating range (each problem only counted once)
- **Filter by Rating Range**: Click on rating distribution bars to filter submissions by difficulty
- **Result Filter Tabs**: Quick filter by All/Accepted/Rejected with count badges
- **Theme Toggle**: Light/Dark/System theme switcher in header
- **Internationalization**: Full Chinese (zh-CN) and English (en) language support

### Changed

- Progress bars in "all" mode now use difficulty-specific colors
- Improved submission list layout with difficulty badges and verdict colors

---

## [0.5.0] - 2026-02-05

### Added

- **Date Range Selection**: Custom date range picker with preset shortcuts (Today, Yesterday, Last 7/30 Days)
- **Tag-based User Input**: Add/remove multiple users with visual tags
- **Keyboard Shortcuts**: 
  - Enter: Add tag
  - Shift+Enter: Execute search
  - Backspace: Delete last tag
- **Submission Filtering**: Filter by submission result (Accepted/Rejected)
- **Footer**: Basic footer with Codeforces data attribution

### Changed

- Website renamed to "别让我逮到你" (I'm watching you)
- Improved date picker UI with visual selection indicators

---

## [0.1.0] - 2026-02-05

### Added

- Initial project setup with React + TypeScript + Vite + Tailwind CSS
- Basic Codeforces API integration
- User query by handle with avatar and rating display
- Submission list with problem name, verdict, time, and language
- Dark mode support based on system preference

---

## Versioning Policy

- **MAJOR**: Breaking changes or major feature additions
- **MINOR**: New features, enhancements (backward compatible)
- **PATCH**: Bug fixes, minor improvements

## Release Process

1. Update `CHANGELOG.md` with new version and changes
2. Update version in `package.json`
3. Create git tag: `git tag -a v1.0.0 -m "Release version 1.0.0"`
4. Push tag: `git push origin v1.0.0`
5. Deploy: `vercel --prod --yes`
