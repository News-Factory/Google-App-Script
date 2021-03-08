function encryptTxtObject_mass(values,types,sym){
  //notes is a SINGLE row
  //exports a txt that has NO connector symbols at beginning and end
  var titles = values[0];
  var res = encryptTxtObject_row(titles,values[2],types,sym);
  for (var i=3; i<values.length; i++){
    res+=sym['con']+encryptTxtObject_row(titles,values[i],types,sym);
  }
  return res;
}

function encryptTxtObject_row(titles,row,types,sym){
  //titles is a SINGLE row
  //exports a txt that has NO connector symbols at beginning and end
  var res = encryptTxtObject_single(titles[0],row[0],types[0],sym);
  for (var i=1; i<titles.length; i++){
    res+=sym['con']+encryptTxtObject_single(titles[i],row[i],types[i],sym);
  }
  return res;
}

function encryptTxtObject_single(title,value,type,sym){
  //exports a txt that has NO connector symbols at beginning and end
  return 'title: '+title+sym['ref']+'value: '+value+sym['ref']+'type: '+type;
}

function timeStampToClassicFormat(value){ //value is timestamp format
  //converts a timestamp to this format ddmmyy-hhmm
  var splitted=value.split(' '); //06/01/2021 18:32:57
  var date=splitted[0].replace('/','').replace('/','');
  var time=splitted[1].replace(':','').replace(':','');
  return date+'-'+time;
}