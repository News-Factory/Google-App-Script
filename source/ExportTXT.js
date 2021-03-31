function main(template){
  var ss=SpreadsheetApp.openById('1ZLkt6db4W-2Xt2bC6qixZezz9kTnpXuhiuGt5qLQpVc'); //
  // var template='Red&BlueNew';           ///  <<---- NEED TO CHANGE THE TEMPLATE NAME HERE
  var sheet=ss.getSheetByName(template);
  var rowToExport=sheet.getLastRow()-1;
  // Logger.log(rowToExport);
  exportOBJ(sheet,rowToExport,template);
  //else {Logger.log("couldn't get txtId");}
}

function testIt(){
  var template='Anglo-Saxon';
  renameFiles(template);
  main(template);
}

function exportOBJ(sheet,rowNum,template){
  //Export one row to a txt file for processing
  SpreadsheetApp.flush(); Utilities.sleep(1500);
  
  var waitingFolder=DriveApp.getFolderById('1ocejmhFUBdBq5kvtmXHtgNBpgbt2g51C');
  var values = sheet.getDataRange().getDisplayValues(); //[][]  
  Logger.log(values);

  switch(template){
    case 'Red&BlueNew':
    var needValues = sheet.getRange('B9:AX10').getDisplayValues();
    break;
    case 'Transparent':
    var needValues = sheet.getRange('B9:AU10').getDisplayValues();
    break;
    case 'Anglo-Saxon':
    var needValues = sheet.getRange('B9:AC10').getDisplayValues();
    break;

  }
  // var needValues = sheet.getRange('B9:AX10').getDisplayValues();     // <<---- CHANGE THE LETTERS HERE FOR EXPORT RANGE
  var timeStamp=timeStampToClassicFormat(values[rowNum][0]);
  //var template=values[rowNum][1];
  var titles = needValues[0]; //[title1, title2...]  // 
  var types = needValues[1];
  var sym = defineSymbols();
  //var txt = encryptTxtObject_mass(values,types,sym);
  var row=massConvertFileURLs(values[rowNum], template);
  var newRow=row.slice(1);  // this needs to be done in order to avoid the time stamp becoming part of the values for AE
  // Logger.log(newRow);
  var txt=encryptTxtObject_row(titles,newRow,types,sym);
  
  var txtFile = waitingFolder.createFile(timeStamp+' '+template+'.txt', txt);
  //Logger.log(txtFile.getName()+" "+txtFile.getUrl());
  //txtFile.setContent(txt);
  
  //var now = new Date();
  //var updateFile = DriveApp.getFileById("1EsFq_12bRn4af00JBfqdACihgC8WYS1M");
  //updateFile.setContent(now);  
}

function defineSymbols(){
  var sym = {};
  sym['con']='&~'; //divides objects from each other
  sym['ref']='&^'; //divides object title, value and note
  return sym;
}