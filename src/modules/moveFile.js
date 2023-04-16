const fs = require('fs')

const moveFile = (fileMoves, oldPath, newPath, undo=false) => {
    fs.rename(oldPath, newPath, function (err) {
      if (err) {
        if (err.code === 'EXDEV') {
          copy();
        } else {
          console.log(err);
        }
        return;
      }
      fs.utimesSync(newPath, new Date(), new Date());
      if(!undo) {
        fileMoves.push({oldPath: oldPath, newPath: newPath});
      }
    })
   return Promise.resolve();
  }

module.exports = moveFile;