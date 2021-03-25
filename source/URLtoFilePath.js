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