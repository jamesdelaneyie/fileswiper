![Fileswiper](https://github.com/jamesdelaneyie/fileswiper/blob/master/progress_gifs/fileswiper-progress-3.png)

# ✨File*swiper*

A tiny macOS app that lets you sort out the contents of a folder by swiping files into buckets. Built with Electron. 


### Features
- File previews for all native macOS file types
- Drag (or throw) files from the stack into buckets to move them
- Skip files by swiping them upwards
- Trash files by swiping them into the trash can
- Add up to 5 buckets to sort files into
- Sort files by name, size, and last modified date
- See file size, type, and last modified date at a glance
- Move history, undo the last move
- Folder watching, file list updates on OS level file changes
- Double click to preview file at full size


### Interesting bits: 

- Preview images are generated using the qlmanage command line tool in a child process, allowing all native OSX file types have preview images.
- AI: The main file list is a React component, which is updated by the main process when a file is moved to a bucket.
- Interact.js is used to add physics to the main file list, allowing you to throw files into buckets.
- The new trigonomic positioning of the buckets is calculated using the new CSS Math.sin and Math.cos functions.
- Live reloading during development is using webpack --watch and electron-reload.



To Do:
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
- bug: moving files too fast breaks the animation flow
- ~~add: lock window size~~ 
- change: move add folder button to the circle path UI
- folders add / remove in one direction
- 


Development:

- `npm install`
- `npm start`


![Fileswiper](https://github.com/jamesdelaneyie/fileswiper/blob/master/progress_gifs/fileswiper.gif)