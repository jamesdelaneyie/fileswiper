<p align="center">
    <img src="https://raw.githubusercontent.com/jamesdelaneyie/fileswiper/master/dist/assets/fileswiper-logo.png">
    <img src="https://raw.githubusercontent.com/jamesdelaneyie/fileswiper/master/progress_gifs/fileswiper-progress-5.gif">
</p>

# File*Swiper*

A tiny macOS app that lets you sort out the contents of a folder by swiping files into buckets.


### ✨ Features:
- ➡️ Swipe, drag, or throw files into the folder buckets to move them
- 🖼️ File previews for all native macOS file types
- ⏭️ Skip files by swiping them upwards
- 🗑️ Trash files by swiping them into the trash can
- 🪣 Add up to 8 buckets at once to sort files into
- 🔬 See file size and type date at a glance
- ↩️ Move history, undo the last move
- 🔍 Double click to preview file at full size

### 📦 Download:

- [Download the latest release Alpha v0.1.0](https://github.com/jamesdelaneyie/fileswiper/releases/)

NOTE: Tested on macOS 11.4 (Big Sur) only so far, and only on my machine. Trash functionality is not working on production app yet, but works in dev mode.
 

### 🤓 Interesting bits: 

- [`qlmanage`](https://github.com/sidneys/quicklook-thumbnail) used to generate native file previews for macOS
- [`interact.js`](https://github.com/taye/interact.js) used for adding physics and handling drag interactions 
- [`CSS trigonomic functions`](https://web.dev/css-trig-functions/) used for the circular UI layout

### Development Setup / Notes:

- `npm install`
- `npm start`


### 🛣️ For V1 (* = work started):

- Allow a list of files from multiple locations to populate the stack
- Have electron serve itself from local IP so can connect on mobile devices to swipe *
-- This works! Tested 17/04/2023. Mobile needs significant UI/UX work to be usable
-- Improve the responsive layout from fullscreen -> mobile
-- Use websockets to connect to Electron instance on LAN
-- Use QR code on electron main screen to open link on mobile
-- Then verify connection on mobile using single use PIN
-- Then use mobile to swipe files into buckets
- Add video previews in detailed view 
- Keyboard shortcuts for moving files into buckets, skip, undo, trash
- Add ability to rename buckets / folders
- Dark mode + add custom themes for design and layout
- Cloud integration, dropbox, google drive, etc
- Remove tailwind, and/or move it to being used in stylesheet / clean up styles in general
- Implement the sort by option in the UI *
- add search / filtering to the file list *
- 🔠 Sort files by name, size, and last modified date *
- 🕵️ Folder watching, file list updates on OS level file changes *


### 📜 License:
MIT