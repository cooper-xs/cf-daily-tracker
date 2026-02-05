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
- **Dark Mode Improvements**: Better contrast and color schemes
- **Performance Optimizations**: Virtual scrolling for large submission lists
- **PWA Support**: Offline capability and installable app

---

## [1.0.0] - 2025-02-05

### Added

- **Multi-user Query**: Support querying up to 10 users simultaneously with tab-based navigation
- **Sticky Header**: User info and filter panels stick to top when scrolling
- **Collapsible Filter Panel**: Filter section can be expanded/collapsed, showing summary when collapsed
- **Back to Top Button**: Floating button appears after scrolling down
- **Mobile Responsive**: Website title now visible on mobile devices
- **Footer Enhancements**: GitHub link button and improved author attribution (@cooper-xs, @yume, @TARS)
- **Rating Distribution Filter**: Progress bars dynamically adjust based on selected filter (all/accepted/rejected)
- **Deduplication Statistics**: Unique solved problems count displayed in rating distribution
- **Date Range Selection**: Filter submissions by custom date range
- **Internationalization**: Full Chinese and English language support
- **Dark Mode**: Complete dark theme support with system preference detection
- **Theme Switcher**: Light/Dark/System theme toggle in header

### Changed

- Improved progress bar visualization when filtering by accepted/rejected status
- Refined user card layout and information hierarchy
- Enhanced tab switching animation for multi-user view

### Fixed

- Progress bar scaling when filtered results have different max values
- Emoji color consistency in author attribution
- Scroll behavior with sticky headers to prevent content jumping

---

## [0.9.0] - 2025-02-04

### Added

- **Rating Distribution Visualization**: Show problem difficulty distribution with progress bars
- **Problem Deduplication**: Count unique solved problems per rating range
- **Filter by Rating Range**: Click on rating bars to filter submissions
- **Result Filter Tabs**: Quick filter by All/Accepted/Rejected with counts
- **Footer**: Basic footer with Codeforces attribution and author credits

### Changed

- Improved submission list layout with difficulty badges

---

## [0.5.0] - 2025-02-03

### Added

- **Basic User Query**: Search Codeforces users by handle
- **Submission List**: Display user submissions with verdict, time, and language
- **Batch Query**: Support comma-separated handles for batch lookup
- **Tag Input Interface**: Add/remove users with keyboard shortcuts
- **Date Filtering**: Filter submissions by preset date ranges (today, yesterday, last 7/30 days)

---

## [0.1.0] - 2025-02-02

### Added

- Initial project setup with React + TypeScript + Vite
- Tailwind CSS integration
- Basic project structure and component architecture

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
5. Deploy: `./deploy.sh prod`
