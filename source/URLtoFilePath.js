// THESE FUNCTIONS WORK FOR THE IMAGES UPLOADED VIA GOOGLE FORM

function massConvertRowFileURLs(row, template){
  //row is a 1 dimentional array
  for (var i=0; i<row.length; i++){
    if (isFileURL(row[i])){
      row[i]=convertFileURLtoLegitPath(row[i], template);
    }
  }
  return row;
}

function convertFileURLtoLegitPath(fileURL,template){
  //google upload file leaves a url in the sheet. 
  //we need to convert it to a path that the after effects can locate.
  //fileURL is varified as a URL before entering the function
  //it's structure is like this: https://drive.google.com/open?id=1Bby5F9IWdSOBKkyqco5zSf66K1r8od8F
  var fileId=fileURL.split('=')[1];
  var file=DriveApp.getFileById(fileId);
  var parentFolderName=file.getParents().next().getName();

  // CHANGE HERE FOR FILES PATH IN THE EXPORT.txt         ///  <<---- NEED TO CHANGE THE TEMPLATE NAME HERE
  var masterUploadFolderPath='G:\\My Drive\\Real Estate Project\\scripts\\Google Script\\Form controller\\'+template+' (File responses)\\'; 
  var filePath=masterUploadFolderPath+parentFolderName+'\\'+file.getName();
  return filePath;
}

function isFileURL(value){
  var pattern='https://drive.google.com';
  return value.indexOf(pattern)>-1;
}



// WHILE THESE FUNCTIONS WORK WITH THE FILES UPLOADED FROM WORDPRESS FORMS

function massConvertFileURLs(row, template){
  //row is a 1 dimentional array
  for (var i=0; i<row.length; i++){
    if (whatFileURL(row[i])){
      row[i]=convertURLtoLegitPath(row[i], template);
    }
  }
  return row;
}

function convertURLtoLegitPath(fileURL,template){
  //WPforms upload file leaves a url in the sheet. 
  //we need to convert it to a path that after effects can locate.
  //fileURL is varified as a URL before entering the function
  //it's structure is like this: https://videofactory.tv/wp-content/uploads/wpforms/774-cf89c70f3b90447f065a00cd04beb70b/      REL1-3-79ea6df2420e76276bdac2793b70dc3f.jpeg

  // we cut it in half (cause its too long) and then take out all the / and special characters

  var fileShortURL=fileURL.split('wpforms/')[1]
  var fileId=fileShortURL.replace(/[\/\\#,+()$~%'":*?<>{}]/g, ' ');
  // var file=DriveApp.getFileById(fileId);
  // var parentFolderName=file.getParents().next().getName();

  // CHANGE HERE FOR FILES PATH IN THE EXPORT.txt         ///  <<---- NEED TO CHANGE THE TEMPLATE NAME HERE
  var masterUploadFolderPath='G:\\My Drive\\Real Estate Project\\Customer Photos\\'+template+'\\'; 
  var filePath=masterUploadFolderPath+fileId;
  return filePath;
}


function whatFileURL(value){
  var pattern='https://videofactory.tv';
  return value.indexOf(pattern)>-1;
}