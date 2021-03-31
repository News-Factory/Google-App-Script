// THIS FUNCTION RENAMES ALL THE FILES INTO A FOLDER, 
// WE USE IT HERE TO RENAME THE FILES WE GOT FROM WP AS 
// THEY ARE NAMED WITH A BUNCH OF SPACES

function renameFiles(folderName) {
    var folders = DriveApp.getFoldersByName(folderName);
    while (folders.hasNext()) {
      var folder = folders.next();
      var files = folder.getFiles();
      while (files.hasNext()) {
        var file = files.next();
        var fileName = file.getName();
        // This is specific for our scenario.
        // We wanted to remove everything after the extension. 'The ?key='   was after our extension.
        if (fileName.indexOf('wpforms') > -1) {
          fileName= fileName.split('wpforms')[1];
          file.setName(fileName);
        }
      }
    }
  }
  
  function renameRB(){
    renameFiles('Red&BlueNew')
  }
  