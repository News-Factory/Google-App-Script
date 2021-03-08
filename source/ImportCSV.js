//Import CSV into the first two rows of a google sheet

function importCSV(){ 
  //from https://stackoverflow.com/questions/35377021/google-apps-script-utilities-parsecsv-and-replacement-character

  var ss=SpreadsheetApp.openById('1ZLkt6db4W-2Xt2bC6qixZezz9kTnpXuhiuGt5qLQpVc'); //Realestate master
  var csvFolder=DriveApp.getFolderById('1hzm9NX7LSDXlkTa98YGf9ar6L4z1ukCS'); //Real Estate Project\csv\
  var csvFiles=csvFolder.getFiles();
  //This is where the processed csvFiles will go:
  var processedFolder=DriveApp.getFolderById('1qaujAA3rFN27nqwMK2uALbPGYQQfMbEM'); //Real Estate Project\csv\processed\
  //Currently processing one file at a time
  var file=csvFiles.next();
  var projName=file.getName().split('.')[0];
  var csv = file.getBlob().getDataAsString();
  var csvData = Utilities.parseCsv(csv);
  var sheet=ss.insertSheet();
  sheet.setName(projName);

  // these are the variables to insert data from the meta sheet
  var metaSheet=ss.getSheetByName('meta');
  var metaValues=metaSheet.getDataRange().getDisplayValues();
  // Logger.log(metaValues.length);
  
  for (var i=0; i<csvData.length; i++){
    sheet.getRange(i+9, 2, 1, csvData[i].length).setValues(new Array(csvData[i]));
    //This is a method that calls setValues for every row in the csv. This is a relatively slow function.
    //It's better practice to write the ENTIRE csv to the sheet. But for now since it's only two rows no one will give a F@#$k
  }

  // insert data from the meta sheet
  for (var i=0; i<metaValues.length; i++){
    var cell =sheet.getRange(i+1,1,metaValues[i].length,1);
    cell.setValues(new Array(metaValues[i]));

    // and set the background color for the cells
    cell.setBackground('green');
    if(i>=8){
      cell.setBackground('yellow');
    }
  }

  file.moveTo(processedFolder);
  var projectSheet=ss.getSheetByName('projectList');
  var values=projectSheet.getDataRange().getDisplayValues();
  var titles=values[0];
  var firstEmptyRow=values.length+1;
  projectSheet.getRange(firstEmptyRow,titles.indexOf('projName')+1).setValue(projName);
  projectSheet.getRange(firstEmptyRow,titles.indexOf('status')+1).setValue('new');
}