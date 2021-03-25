/*
Here we'll construct a form based on the 8 first rows in a google sheet
The 8 rows are: titles, descriptions, formType, layerNames, AEtype
6 first rows apply to the form META, the next 2 apply to AE META
the type of input in the form is different than the type of layer in AE

Every sheet will have these 8 cells at A1:A8 to define the script:
  FormItemTitle
  FormItemDesc
  Required
  FormItemType
  Choices
  ItemId
  AELayerName
  AEItemType
*/

function mainProjectAnalyzer(){
  /*
    here we'll check the status of the projects sheets and forms
    where there's no form it will be created
    where there is a form it will be checked and updated, unless it's locked
  */
  
  var metaRows=10;

  var ss=SpreadsheetApp.openById('1ZLkt6db4W-2Xt2bC6qixZezz9kTnpXuhiuGt5qLQpVc');
  var sheet=ss.getSheetByName('projectList');
  var values=sheet.getDataRange().getDisplayValues();
  var titles=values[0];
  
  //create locations as objects
  var locs={};
  for (var i=0; i<titles.length; i++){locs[titles[i]]=i;}
  
  //go over all projects
  for (var i=0; i<values.length; i++){
    var projName=values[i][locs.projName];
    var status=values[i][locs.status];
    var formId=values[i][locs.formId];
    if (formId=="" || formId==null){
      //form has not been created yet
      
      //Let's get the sheets so that we can trace the new sheet created for form responses:
      var sheetsBefore=ss.getSheets();
      var formDesc=values[i][locs.formDesc];
      //buildForm using project name and description from the sheet
      var form=buildForm(projName,formDesc);
      //write the id of the form
      sheet.getRange(i+1,locs['formId']+1).setValue(form.getId());
      //change status to updated
      sheet.getRange(i+1,locs['status']+1).setValue('updated');
      //write when updated
      sheet.getRange(i+1,locs['lastUpdate']+1).setValue(new Date());

      //now we need to rename the new sheet and copy the meta data into it
      //this procedure sucks cause google sheets MUST create a new sheet and it takes a while to get it
      for (var n=0; n<6; n++){SpreadsheetApp.flush(); Utilities.sleep(8500);}
      var formSheet=get_form_destination_sheet(form);
      
      if (formSheet!==null){
        //copy metadata, delete old sheet
          var oldFormSheet=ss.getSheetByName(projName);
          var oldFormSheetValues=oldFormSheet.getDataRange().getDisplayValues();
          formSheet.getRange(1,1,oldFormSheetValues.length,oldFormSheetValues[0].length).setValues(oldFormSheetValues);
          ss.deleteSheet(oldFormSheet);
          SpreadsheetApp.flush(); Utilities.sleep(5000);
          formSheet.setName(projName);
        
        //formattting
          formSheet.setFrozenRows(metaRows);
          // var rowsToHide=formSheet.getRange(2,1,metaRows-1);
          // formSheet.hideRow(rowsToHide);
          formSheet.getRange(1,1,metaRows-2).setBackground('green');
          formSheet.getRange(metaRows-1,1,2).setBackground('yellow');
          //formSheet.deleteRow(metaRows+1); //doesn't help to get rid of the extra row
      }

    } else {
      //form exists, let's update
      //
    }
  }
}

function testTheNextFunction(){
  var ss=SpreadsheetApp.getActive();
  var transSheet=ss.getSheetByName('Red&BlueNew');          ///  <<---- NEED TO CHANGE THE TEMPLATE NAME HERE
  var values=transSheet.getDataRange().getDisplayValues();
  var targetSheet=ss.getSheetByName('testSheet');
  var testValues = targetSheet.getDataRange();
  testValues.clearContent();
  var newValues=organizeByNumItem(values);
  targetSheet.getRange(1,1,newValues.length, newValues[0].length).setValues(newValues);
  transSheet.getRange(1,1,newValues.length, newValues[0].length).setValues(newValues);
}

function organizeByNumItem(values){
  var locs=defineLocs(values);
    //'FormItemTitle','FormItemDesc','Required','FormItemType','Choices',
    //'ItemId','FormSection','NumItem','AELayerName','AEItemType'
  // Logger.log(locs['NumItem']);
  var newValues=[];
  
  //Copy meta column
  for (var i=0; i<values.length; i++){
    newValues.push([values[i][0]]);
  }
  // Logger.log('after newValues creation:')
  // Logger.log(newValues.length);
  // Logger.log(newValues[0].length);

  var colLength=values[0].length;
  // Logger.log('colLength: '+colLength);

  for (var j=1; j<colLength; j++){
    for (var col=1; col<colLength; col++){
      Logger.log('j: '+j+', col: '+col+', colLength: '+colLength);
      var numItem=values[locs['NumItem']][col];
      var myNumber =numItem.toString();
      Logger.log(numItem);
      // Logger.log(myNumber);
      if (numItem==j){
        for (var n in locs){
          Logger.log(values[locs[n]][col]);
          newValues[locs[n]].push(values[locs[n]][col]);
          // break;
        }
      }
    }
  }

  Logger.log(newValues.length);
  Logger.log(newValues[0].length);
  return newValues;
}

function get_form_destination_sheet(form){ 
  //https://stackoverflow.com/questions/16775552/identifying-form-destination-spreadsheet-and-sheet
    const form_id = form.getId();
    const destination_id = form.getDestinationId();
    if (destination_id) {
        const spreadsheet = SpreadsheetApp.openById(destination_id);
        const matches = spreadsheet.getSheets().filter(function (sheet) {
            const url = sheet.getFormUrl();
            return url && url.indexOf(form_id) > -1;
        });
        return matches.length > 0 ? matches[0] : null; 
    }
    return null;
}

function buildForm(formName,formDesc){
  var ss=SpreadsheetApp.openById('1ZLkt6db4W-2Xt2bC6qixZezz9kTnpXuhiuGt5qLQpVc');
  var sheet=ss.getSheetByName(formName);
  var workingFolder=DriveApp.getFolderById('1mvL07El-zzjKEZMV_jWoHHIAgpSOGzGp'); //Form Controller
  var form=form_setup(formName,formDesc,ss,workingFolder);
    //project, sheet and form name are identical
    //when defining the form response sheet a new sheet is created in the spreadsheet
    //so the sheet used to create the form cannot be the sheet accepting the responses unfortunately
    
  var values=sheet.getDataRange().getDisplayValues();
    //META keyWords=['FormItemTitle','FormItemDesc','FormItemType','Choices','AELayerName','AEItemType'];
  var locs=defineLocs(values); //defines the locations of the META rows in the sheet

  var newValues=organizeByNumItem(values);
  
  for (var j=1; j<newValues[0].length; j++){
    //Going over the columns, each column is going to be an item in the form
    var itemTitle=newValues[locs.FormItemTitle][j];
    var itemDesc=newValues[locs.FormItemDesc][j];
    var itemType=newValues[locs.FormItemType][j];
    var itemRequired=newValues[locs.Required][j].indexOf('V')>-1; //Boolean
    
    var item=createFormItemBasedOnType(form,itemType);
    //each formItem has a different creation function
    item.setTitle(itemTitle);
    item.setHelpText(itemDesc);
    item.setRequired(itemRequired);
    
    //if of type CHECKBOX, LIST, MULTIPLE_CHOICE so we need to set choices
    if (itemType=='CHECKBOX' || itemType=='LIST' || itemType=='MULTIPLE_CHOICE'){
      var choicesOBJ=item.getChoices();
      var choices=newValues[locs.Choices][j].split(', ');
      for (var i=0; i<choices.length; i++){
        choicesOBJ.push(item.createChoice(choices[i]));
      }
      choicesOBJ.shift(); //has extra item at the beginning on creation
      item.setChoices(choicesOBJ);
    } // if itemType 
    
    //write itemId in the sheet
    sheet.getRange(locs.ItemId+1, j+1).setValue(item.getId());
    
  } //for j
  return form;
}

function createFormItemBasedOnType(form,itemType){
  //Logger.log(itemType);
  var item=null;
  switch(itemType){
    case 'CHECKBOX': item=form.addCheckboxItem(); break;
    case 'LIST': item=form.addListItem(); break;
    case 'MULTIPLE_CHOICE': item=form.addMultipleChoiceItem(); break;
    case 'DATETIME': item=form.addDateTimeItem(); break;
    case 'PAGE_BREAK': item=form.addPageBreakItem(); break;
    case 'PARAGRAPH_TEXT': item=form.addParagraphTextItem(); break;
    case 'TEXT': item=form.addTextItem(); break;
    default: item=false;
  }
  return item;
}

function form_setup(formName,formDesc,responseSS,workingFolder){
  //create new form, connect master sheet to it
  //this setup should be run once
  var form=FormApp.create(formName);
  
  var formId=form.getId();
  var formFile=DriveApp.getFileById(formId);
  formFile.moveTo(workingFolder);
  
  var ss = SpreadsheetApp.openById('1ZLkt6db4W-2Xt2bC6qixZezz9kTnpXuhiuGt5qLQpVc'); //Realestate Master

  // Update form properties via chaining.
  form.setTitle(formName)
    .setDescription(formDesc)
    .setConfirmationMessage('Thanks for responding!')
    .setAllowResponseEdits(false)
    .setAcceptingResponses(true);

  // Update the form's response destination.
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());

  return form;
}

//mini

function defineLocs(sheetValues){
  //this will return the row locations of the META data:
  var keyWords=['FormItemTitle','FormItemDesc','Required','FormItemType','Choices','ItemId','FormSection','NumItem','AELayerName','AEItemType'];
  var metaRow=colToARR(sheetValues,0); //make col 0 into arr (row)
  var locs={};
  for (var i=0; i<keyWords.length; i++){
    locs[keyWords[i]]=i;
  }
  return locs;
}

function colToARR(values,colNum){
  //converts 2d column into 1d array for convenience purposes
  var row=[];
  for (var i=0; i<values.length; i++){
    row.push(values[i][colNum]);
  }
  return row;
}