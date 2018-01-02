// FILE WITH FULL VIEW MANIPULATION AND CALLS TO API FUNCTIONS

// completed
function onOpen() {
  
  var ui = SpreadsheetApp.getUi();
  
  ui.createMenu('Graphic Era University')
      .addItem('Prepare Sheet', 'prepareSheet')
      .addSubMenu(ui.createMenu('Sync')
          .addItem('Cata', 'getCata')
          .addItem('Assignment', 'getAssignment'))
      .addSubMenu(ui.createMenu('Action')
          .addItem('Create Pro Var', 'createVar')
          .addItem('Update Pro Var', 'updateVar')
          .addItem('Update Structure', 'updateStructure'))
      .addToUi();
}

// completed
function prepareSheet(e) {
  
  var app = SpreadsheetApp;
  var sheet = app.getActiveSpreadsheet().getActiveSheet();
  
  sheet.getRange('A1').setValue('Select Cata').setFontWeight("bold");
  sheet.getRange('A2').setValue('Select Pro').setFontWeight("bold");
  sheet.getRange('A3').setValue('Enter var name').setFontWeight("bold");
  sheet.getRange('A4').setValue('Enter Description').setFontWeight("bold");
  sheet.getRange('A5').setValue('Enter Duration (Month)').setFontWeight("bold");
  sheet.getRange('A6').setValue('Varient Primary Key').setFontWeight("bold");
  sheet.getRange('A8').setValue('pk').setFontWeight("bold");
  sheet.getRange('B8').setValue('Lecture Topic').setFontWeight("bold");
  sheet.getRange('C8').setValue('Lecture Number').setFontWeight("bold");
  sheet.getRange('D8').setValue('Lecture Description').setFontWeight("bold");
  sheet.getRange('E8').setValue('Lecture Duration (Hours)').setFontWeight("bold");
  sheet.getRange('F8').setValue('Notes Url').setFontWeight("bold");
  sheet.getRange('G8').setValue('Assignment Id').setFontWeight("bold");
  sheet.getRange('H8').setValue('Module Id1').setFontWeight("bold");
  sheet.getRange('I8').setValue('Module Id2').setFontWeight("bold");
  sheet.getRange('J8').setValue('Module Id3').setFontWeight("bold");
  
  getCata(e);
  getAssignment(e, true);
}

// completed
function getCata(e){
  
  var app = SpreadsheetApp;
  var sheet = app.getActiveSpreadsheet().getActiveSheet();
  
  var cataList = getCataApi();
  
  var rangeRule = app.newDataValidation().requireValueInList(cataList);
  sheet.getRange('B1').setDataValidation(null);
  sheet.getRange('B1').clear();
  sheet.getRange('B1').setDataValidation(rangeRule);
}

// completed
function createVar(e) {
  
  var app = SpreadsheetApp;
  var sheet = app.getActiveSpreadsheet().getActiveSheet();
  
  var varId = sheet.getRange('B6').getValue();
  if( !(varId == "" || varId == undefined)) {
    SpreadsheetApp.getUi().alert('Varient already created');
    return;
  }
  
  var cataName = sheet.getRange('B1').getValue().trim();
  var proName = sheet.getRange('B2').getValue().trim();
  var varName = sheet.getRange('B3').getValue().trim();
  var description = sheet.getRange('B4').getValue().trim();
  var time = sheet.getRange('B5').getValue();
  
  if (cataName == '-' || cataName == '') {
    SpreadsheetApp.getUi().alert('Please select valid cata.');
    return;
  }
  if (proName == '-' || cataName == '') {
    SpreadsheetApp.getUi().alert('Please select valid pro.');
    return;
  }
  if (varName == '') {
    SpreadsheetApp.getUi().alert('Please enter pro var name.');
    return;
  }
  if (description == '') {
    SpreadsheetApp.getUi().alert('Please enter description.');
    return;
  }
  if (time == '' || time == 0) {
    SpreadsheetApp.getUi().alert('Please enter valid time.');
    return;
  }
  
  varId = -999;
  varId = createProVarApi(cataName, proName, varName, description, time);
  if( varId != -999)
    sheet.getRange('B6').setValue(varId).setFontWeight("bold").setFontColor("white").setBackgroundColor("red");
  else
    SpreadsheetApp.getUi().alert('Sorry! could not create var. Please try again.');
}

// completed
function updateVar(e) {
  
  var app = SpreadsheetApp;
  var sheet = app.getActiveSpreadsheet().getActiveSheet();
  
  var varId = sheet.getRange('B6').getValue();
  if( varId == "" || varId == undefined ){
    SpreadsheetApp.getUi().alert('Create a valid var first');
    return;
  }
  
  var varName = sheet.getRange('B3').getValue().trim();
  var description = sheet.getRange('B4').getValue().trim();
  var time = sheet.getRange('B5').getValue();
  
  if (varName == ''){
    SpreadsheetApp.getUi().alert('Please enter var name');
    return;
  }
  if (description == ''){
    SpreadsheetApp.getUi().alert('Please enter description.');
    return;
  }
  if (time == '' || time == 0){
    SpreadsheetApp.getUi().alert('Please enter time.');
    return;
  }
  
  var updatedBool = false;
  updatedBool = updateProVarApi(varId, varName, description, time);
  if( !updatedBool) 
    SpreadsheetApp.getUi().alert('Sorry! could not update var. Please try again.');
  
}

// completed
function getAssignment(e, noSync){
  
  noSync = true && (noSync != undefined);
  
  var app = SpreadsheetApp;
  var sheet = app.getActiveSpreadsheet().getActiveSheet();
  
  var assignmentList = getAssignmentApi(noSync);
  
  var rangeRule = app.newDataValidation().requireValueInList(assignmentList);
  sheet.getRange('G9').setDataValidation(null);
  sheet.getRange('G9').clear();
  sheet.getRange('G9').setDataValidation(rangeRule);
}

// completed
function customOnEdit(e) {
  var range = e.range;
  var cellEdited = range.getA1Notation(); 
  
  if(isEditAllowed(e, cellEdited)) {
    if (cellEdited == 'B1'){
      cataService(e);
    }
    if (range.getColumn() == 7 && range.getRow() >= 9){
      var row = range.getRow();
      moduleService(e, row);
    }
  } else {
    SpreadsheetApp.getUi().alert('Sorry! The cell is protected.');
  }
}

// completed
function updateStructure(e) {
  
  var app = SpreadsheetApp;
  var sheet = app.getActiveSpreadsheet().getActiveSheet();
  
  var varId = parseInt(sheet.getRange('B6').getValue());
  if( varId == null || varId == "" || varId == undefined) {
    SpreadsheetApp.getUi().alert('Sorry! Please create a var first.');
    return; 
  }
  
  var lastRow = sheet.getLastRow();
  var currentRow =9;
  var abortTime = false;
  var abortTopic = false;
  var structure = {
    "pro_id" : varId,
    "data" : []
  };
  
  while(currentRow<=lastRow)
  {
    
    var id = sheet.getRange('A' + currentRow).getValue();
    if(id == null || id == undefined || id == "")
      id = null;
    else
      id = parseInt(id);
    
    var lectureNumber = sheet.getRange('C' + currentRow).getValue();
    if(lectureNumber == null || lectureNumber == undefined || lectureNumber == "")
      lectureNumber = null;
    else
      lectureNumber = parseInt(lectureNumber);
    
    var lectureTime = sheet.getRange('E' + currentRow).getValue();
    if(lectureTime == null || lectureTime == undefined || lectureTime == "") {
      var cell = sheet.getRange('E' + currentRow);
      cell.setBorder(true, true, true, true, false, false, "red", SpreadsheetApp.BorderStyle.SOLID);
      abortTime = true;
    }
    else { 
      var cell = sheet.getRange('E' + currentRow);
      cell.setBorder(false, false, false, false, false, false, "gray", SpreadsheetApp.BorderStyle.SOLID);
      lectureTime = parseFloat(lectureTime);
    }
    
    var lectureTopic = sheet.getRange('B' + currentRow).getValue().trim();
    if(lectureTopic == null || lectureTopic == undefined || lectureTopic == "") {
      var cell = sheet.getRange('B' + currentRow);
      cell.setBorder(true, true, true, true, false, false, "red", SpreadsheetApp.BorderStyle.SOLID);
      abortTopic = true;
    }
    else {
      var cell = sheet.getRange('B' + currentRow);
      cell.setBorder(false, false, false, false, false, false, "gray", SpreadsheetApp.BorderStyle.SOLID);
    }
      
    var lectureDescription = sheet.getRange('D' + currentRow).getValue().trim();
    if(lectureDescription == null || lectureDescription == undefined || lectureDescription == "")
      lectureDescription = null;
    
    var lectureNotes = sheet.getRange('F' + currentRow).getValue().trim();
    if(lectureDescription == null || lectureDescription == undefined || lectureDescription == "")
      lectureDescription = null;
    
    var assignmentId = sheet.getRange('G' + currentRow).getValue().trim().split('||')[1];
    if(assignmentId == null || assignmentId == undefined || assignmentId == "")
      assignmentId = null;
    else
      assignmentId = parseInt(assignmentId);
    
    var moduleId = [];
    moduleId.push(sheet.getRange('H' + currentRow).getValue().trim().split('||')[1]);
    moduleId.push(sheet.getRange('I' + currentRow).getValue().trim().split('||')[1]);
    moduleId.push(sheet.getRange('J' + currentRow).getValue().trim().split('||')[1]);
    for (index in moduleId)
    {
      if(moduleId[index] == null || moduleId[index] == undefined || moduleId[index] == "" || assignmentId == null)
        moduleId[index] = null;
      else
        moduleId[index] = parseInt(moduleId[index]);
    }
    
    var item = {
      "id" : id,
      "lecture_number": lectureNumber,
	  "lecture_time": lectureTime,
	  "lecture_topic": lectureTopic,
	  "lecture_description": lectureDescription,
	  "lecture_notes": lectureNotes,
	  "assignment_id": assignmentId,
	  "module_id": moduleId
    }
    structure["data"].push(item);
    currentRow++;
  }
  
  if( abortTopic == true || abortTime == true) {
    SpreadsheetApp.getUi().alert('Structure not updated, Please fill the required fields and try again');
    return;
  } 

  var list = updateStructureApi(structure);
  if( list == false) 
    return;
  
  var idList=[];
  var cache = CacheService.getScriptCache();
  if( cache.get("idList" + varId) == null || cache.get("idList" + varId) == '') {
    cache.put("idList" + varId, list, 86400); 
    idList = list;
  }
  else {
    idList = cache.get("idList" + varId).split(',');
    idList = idList.concat(list);
    cache.put("idList" + varId, idList, 86400);
  }

  currentRow = 9;
  for(index in idList) {
    sheet.getRange('A' + currentRow).setValue(idList[index]).setFontWeight("bold").setFontColor("white").setBackgroundColor("red");
    currentRow++;
  }
}

function onChange(e) {
  
  if(e.changeType == 'INSERT_ROW') {
   
    var sheet = SpreadsheetApp.getActiveSpreadsheet();
    var range = sheet.getActiveRange();
    sheet.deleteRow(range.getRowIndex());
    SpreadsheetApp.getUi().alert('Sorry, cannot add row in between.');
    
  }
}
