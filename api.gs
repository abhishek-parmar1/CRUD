// FILE DEALS WITH CACHE AND API ONLY
var baseUrl = 'base url of api'

// completed
function getCataApi() {
  
  var url = baseUrl + 'url of api to get cata';
  var response = UrlFetchApp.fetch(url);
  var json = response.getContentText();
  var data = JSON.parse(json);
  
  var cataList = ["-"];
  data['result'].forEach(function(value){
    cataList.push(value['cataName'] + " || " + value['id']);
  })
  return cataList;
}

// completed
function getProGenApi(cataName) {
  
  cataId = cataName.split('||')[1].trim();
  cataId=parseInt(cataId);
  
  var url = baseUrl + 'url of api to get pro gen' + cataId;
  var response = UrlFetchApp.fetch(url);
  var json = response.getContentText();
  var data = JSON.parse(json);
  
  var proList = ["-"];
  data['result'].forEach(function(value){
    proList.push(value['genName'] + " || " + value['id']);
  })
  return proList;
}

// completed
function updateProVarApi(varId, varName, description, time) {
  
  varId = parseInt(varId);
  varName = varName.trim();
  description = description.trim();
  time = parseInt(time);
  
  var payload = {
    "proName" : varName,
    "proDescription" : description,
    "proTime" : time,
    "proId" : varId
  }
  var options = {
   'method' : 'put',
   'contentType': 'application/json',
   'payload' : JSON.stringify(payload)
 };
 var url = baseUrl + 'url of api to update pro var';
 var response = UrlFetchApp.fetch(url, options);
 var json = response.getContentText();
 var data = JSON.parse(json);
 
 if( data["status"] == true)
   return true;
 else
   return;
}

// completed
function createProVarApi(cataName, proName, varName, description, time){
  
  cataId = cataName.split('||')[1].trim();
  proId = parseInt(proName.split('||')[1].trim());
  varName = varName.trim();
  description = description.trim();
  time = parseInt(time);
  
  var payload = {
    "proName" : varName,
    "proGenId" : proId,
    "proDescription" : description,
    "proTime" : time
  }
  var options = {
   'method' : 'post',
   'contentType': 'application/json',
   'payload' : JSON.stringify(payload)
 };
  var url = baseUrl + 'url of api to create a var';
  var response = UrlFetchApp.fetch(url, options);
  var json = response.getContentText();
  var data = JSON.parse(json);
  
  if( data["status"] == true)
    return data["result"]["proId"];
  else
    return;
}

// completed
function getAssignmentApi(noSync) {
  
  var cache = CacheService.getScriptCache();
  
  if(noSync) {
    if ( !(cache.get("assignmentList") == null || cache.get("assignmentList") == '')) {
      var assignmentList = cache.get("assignmentList").split(',');
      return assignmentList; 
    }    
  }
  
  var url = baseUrl + 'url of api to get assignments'; 
  var response = UrlFetchApp.fetch(url);
  var json = response.getContentText();
  var data = JSON.parse(json);
  
  var assignmentList = [];
  data['result'].forEach(function(value){
    assignmentList.push(value['assignmentName'] + "-" + (value["version"] == null ? "" : value["version"] ) + "-" + ( (new Date (value["createdOn"])).toLocaleString().split(' ').slice(0,3).join(' ') ) + " || " + value['id'] + " || "  );
  })
  cache.put("assignmentList", assignmentList, 86400);
  
  return assignmentList;
}

// completed
function moduleListApi(assignmentName, assignmentGenId) {
  
  var cache = CacheService.getScriptCache();
 
  if( !(cache.get(assignmentName + " " + assignmentGenId) == null || cache.get(assignmentName + " " + assignmentGenId) == '')) {
    var moduleList = cache.get(assignmentName + " " + assignmentGenId).split(',');
    return moduleList; 
  }
  
  var url = baseUrl + 'url of api to get module list' + assignmentGenId;
  var response = UrlFetchApp.fetch(url);
  var json = response.getContentText();
  var data = JSON.parse(json);
  
  var moduleList = [];
  data['result'].forEach(function(value){
    moduleList.push(value['moduleName'] + " || " + value['id'] );
  })
  cache.put(assignmentName + " " + assignmentGenId, moduleList, 86400);
  
  return moduleList;
}

// completed
function updateStructureApi(structure) {
  
  var options = {
   'method' : 'post',
   'contentType': 'application/json',
   'payload' : JSON.stringify(structure)
 };
 
  var url = baseUrl + 'url of api to update structure';
  var response = UrlFetchApp.fetch(url, options);
  var json = response.getContentText();
  var data = JSON.parse(json);
 
  if(data["status"] == "True") 
     return data['result']['structureIds'];
  else {
    SpreadsheetApp.getUi().alert('Sorry! Unable to update list. Try again');
    return false;
  }
}
