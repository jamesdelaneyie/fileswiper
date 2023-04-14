const fs = require('fs')

const moveFile = (fileMoves, oldPath, newPath) => {
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
      fileMoves.push({oldPath: oldPath, newPath: newPath});
    })
   
  }

module.exports = moveFile;