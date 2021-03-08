function DisassembleForm(){
   //Setvars
  var ss = SpreadsheetApp.getActive();
  var sheet = ss.getSheetByName("break");
  var formID_for_deconstructon = sheet.getRange(1,3).getValue();
  
  var items_OBJ_aray = [];
  
  var form = FormApp.openById(formID_for_deconstructon);
  var items = form.getItems();
  for (var i=0; i<items.length; i++){
    var itemType = items[i].getType().toString();
    var choices = null;
    switch (itemType){
    case "CHECKBOX":
        choices = items[i].asCheckboxItem().getChoices();
        choices = convertChoicesToString(choices);
        break;
    case "LIST":
        choices = items[i].asListItem().getChoices();
        choices = convertChoicesToString(choices);
        break;
    case "MULTIPLE_CHOICE":
        choices = items[i].asMultipleChoiceItem().getChoices();
        choices = convertChoicesToString(choices);
        break;
    }
    var itemOBJ = new item_OBJ(items[i].getId(),items[i].getTitle(),items[i].getType(),choices);
    items_OBJ_aray.push(itemOBJ);
  }
  writeItemsToSheet(sheet,items_OBJ_aray);
}

//mini functions

function writeItemsToSheet(sheet,items_OBJ_aray){
  //writeObjTitles_ToSheet(sheet,items_OBJ_aray);
  for (var i=0; i<items_OBJ_aray.length; i++){
    var colCounter = 1;
    for (var n in items_OBJ_aray[i]){
      sheet.getRange(i+3,colCounter).setValue(items_OBJ_aray[i][n]);
      colCounter++;
    }
  }
}

function writeObjTitles_ToSheet(sheet,items_OBJ_aray){
  var colCounter = 1;
  for (var n in items_OBJ_aray[0]){
    sheet.getRange(2,colCounter).setValue(n);
    colCounter++;
  }
}

//Constructors

function item_OBJ(id,title,type,choices){
  this.id = id;
  this.title = title;
  this.type = type;
  this.choices = choices;
}

//miniFuncs

function convertChoicesToString(choices){
  var choiceString = choices[0].getValue();
  for (var i=1; i<choices.length; i++){
    choiceString+=", "+choices[i].getValue();
  }
  return choiceString;
}
