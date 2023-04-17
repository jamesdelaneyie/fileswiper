<p align="center">
    <img src="https://raw.githubusercontent.com/jamesdelaneyie/fileswiper/master/dist/assets/fileswiper-logo.png">
    <img src="https://raw.githubusercontent.com/jamesdelaneyie/fileswiper/master/progress_gifs/fileswiper-progress-4.gif">
</p>

# File*Swiper*

A tiny macOS app that lets you sort out the contents of a folder by swiping files into buckets.


### ✨ Features:
- ➡️ Swipe, drag, or throw files into the folder buckets to move them
- 🖼️ File previews for all native macOS file types
- ⏭️ Skip files by swiping them upwards
- 🗑️ Trash files by swiping them into the trash can
- 🪣 Add up to 8 buckets at once to sort files into
- 🔠 Sort files by name, size, and last modified date
- 🔬 See file size, type, and last modified date at a glance
- ↩️ Move history, undo the last move
- 🕵️ Folder watching, file list updates on OS level file changes
- 🔍 Double click to preview file at full size


### 🤓 Interesting bits: 

- [`qlmanage`](https://github.com/sidneys/quicklook-thumbnail) used to generate native file previews for macOS
- [`interact.js`](https://github.com/taye/interact.js) used for adding physics and handling drag interactions 
- [`CSS trigonomic functions`](https://web.dev/css-trig-functions/) used for the circular UI layout

### Development Setup / Notes:

- `npm install`
- `npm start`




### To Do:
- ~~Drag main file list into bucket to move file~~
- ~~Ability to move file to trash~~
- ~~Add undo functionality~~
- ~~Add a skip option on top of screen~~
- ~~Add ability to store the last directories used in local storage~~
- ~~Add ability to add and remove buckets from the UI~~
- ~~Position buckets along circle path~~
- ~~functionize the update file list~~
- ~~actually add file previews for jpg, png, gif, pdf, txt/code files~~
- ~~add file dialog to select directory for swiping !!~~ 
- ~~add trash and folder icons!!~~ 
- ~~add physics to main area so you can throw files into buckets, p2.js?~~ Interact.js
- ~~bug: moving files too fast breaks the animation flow~~
- ~~add: lock window size~~ 
- ~~change: move add folder button to the circle path UI~~
- ~~folders add / remove in one direction~~
- ~~Move js files into src folder~~
- ~~move skip button to offset center of screen~~
- ~~move folder select to current folder area~~
- ~~Add drop folder from finder functionality / both as root folder and as a bucket~~
- ~~Double click bucket to make root folder~~
- Remove tailwind, and/or move it to being used in stylesheet 
- Improve the responsive layout from fullscreen -> mobile
- Implement the sort by option in the UI
- Implement file filtering in UI
- Add x icon for removing folders, currently right click
- Add search function to filter files
- Keyboard shortcuts for moving files into buckets, skip, undo, trash
- Add ability to rename buckets / folders


### 🛣️ Ideas for V2:

- Allow a list of files from multiple locations to populate the stack
- Have electron serve itself from local IP so can connect on mobile devices to swipe
- Add video previews in detailed view 
- Dark mode + add custom themes for design and layout
- Cloud integration, dropbox, google drive, etc
- 


### 📜 License:
MIT