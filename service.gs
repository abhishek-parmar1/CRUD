// FILE WITH HELPER FUNCTIONS AND CALLS TO API FUNCTIONS WITH LITTLE VIEW MANIPULATION

// completed
function isEditAllowed(e, cellEdited) {
  
  var range = e.range;
  var protectedCells = ["B6","A1","A2","A3","A4","A5","A6","A8","B8","C8","D8","E8","F8","G8","H8","I8","J8"];
  var cellEdited = range.getA1Notation();  
  var protectedIndex = protectedCells.indexOf(cellEdited);
  var cell = cellEdited;
  cellEdited = cellEdited.split('');
  
  if( protectedIndex > -1 || ( cellEdited[0] == 'A' && parseInt(cellEdited.slice(1,cellEdited.length).join('')) >=9 &&  sheet.getRange(cell).getValue() != "" && sheet.getRange(cell).getValue() != undefined) ) {
     if( e.oldValue == undefined)
       range.setValue("");
     else
       range.setValue(e.oldValue);
     return false;
  } 
  else
    return true;
}

// completed
function cataService(e) {
  
  cataValue = e.value.trim();
  
  if ( cataValue == '-' || cataValue == '') {
    return
  } 
  else {
    var app = SpreadsheetApp;
    var sheet = app.getActiveSpreadsheet().getActiveSheet();
    
    proList = getProGenApi(cataValue);
    
    var rangeRule = app.newDataValidation().requireValueInList(proList);
    sheet.getRange('B2').setDataValidation(null);
    sheet.getRange('B2').clear();
    sheet.getRange('B2').setDataValidation(rangeRule);
  }
}

// completed
function moduleService(e, row) {
  
  var app = SpreadsheetApp;
  var sheet = app.getActiveSpreadsheet().getActiveSheet();
  
  assignmentName = e.value.trim().split('||')[0];
  assignmentGenId = e.value.trim().split('||')[1];
  moduleList = moduleListApi(assignmentName, assignmentGenId);
  
  var rangeRule = app.newDataValidation().requireValueInList(moduleList);
  sheet.getRange('H' + row).setDataValidation(null);
  sheet.getRange('H' + row).clear();
  sheet.getRange('H' + row).setDataValidation(rangeRule);
  rangeRule = app.newDataValidation().requireValueInList(moduleList);
  sheet.getRange('I' + row).setDataValidation(null);
  sheet.getRange('I' + row).clear();
  sheet.getRange('I' + row).setDataValidation(rangeRule);
  rangeRule = app.newDataValidation().requireValueInList(moduleList);
  sheet.getRange('J' + row).setDataValidation(null);
  sheet.getRange('J' + row).clear();
  sheet.getRange('J' + row).setDataValidation(rangeRule);
}
