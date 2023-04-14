const fs = require('fs')
const filesToIgnore = require('./filesToIgnore.js');

const getFileListFromDirectory = (dir, sortBy) => {
    let fileList = []
    fs.readdirSync(dir, {withFileTypes: true})
      .filter(item => !item.isDirectory())
      .map(item => {
        const name = item.name;
        const stats = fs.statSync(dir + '/' + name);
        const size = stats.size;
        const fileExtension = name.split('.').pop();
        const lastModified = stats.mtime;
        return { name, size, fileExtension, lastModified };
      })
      .forEach(item => fileList.push(item))
    fileList = fileList.filter(item => !filesToIgnore.includes(item.name));
    if(sortBy) {
      fileList.sort((a, b) => {
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        } else if (sortBy === 'size') {
          return a.size - b.size;
        } else if (sortBy === 'lastModified') {
          return a.lastModified - b.lastModified;
        } else if (sortBy === 'fileExtension') {
          return a.fileExtension.localeCompare(b.fileExtension);
        }
      });
    }
    if(sortBy === 'size') {
      fileList.reverse();
    }
    return fileList;
  } 

  module.exports = getFileListFromDirectory;