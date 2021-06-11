/** 
 * Indexing Script for Google Drive
 * 
 * Google Apps Script - Indexing Script
 * 
 * Modify by: Albert
 * 
 * V 2.5
 * 
 * No need to run from google script, just select from sheet.
 * 
 * Modify from: https://gist.githubusercontent.com/mesgarpour/07317e81e9ee2b3f1699/raw/23833cef09a62a3d2cf56b4143bb3cf4dbb5b827/appsScript_ListFilesFolders_Mesgarpour.js
 * 
 */
 

var sheet = SpreadsheetApp.getActiveSheet();
var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
var scriptproperties = PropertiesService.getScriptProperties();

//get ID value from columm D1
var folderId = sheet.getRange("D1").getValue();
//To change D1 to other cell if you want to change input cell

var folderId = folderId.toString().trim();

//Don't clear if there is text or background
function clearwhite() {
  var sheet = SpreadsheetApp.getActive();
  var range = sheet.getDataRange();
  var bgColors = range.getBackgrounds();
  for (var i=0; i<bgColors.length; i++) {
    for (var j=0; j<bgColors[i].length; j++) {
      if (bgColors[i][j] === '#ffffff') {
        range.getCell(i+1,j+1).clearContent();
      }
    }
  }  
}

//Auth script

function authorize() {
    spreadsheet.toast("Enter Folder ID", "", -1);

}

//Menu on sheet
function onOpen() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var menuEntries = [{
            name: "0. Authorize",
            functionName: "authorize"
        }, {
            name: "A. Run Folder",
            functionName: "folderFind"
        }, {
            name: "B. Run All Files",
            functionName: "filesFind"
        }, {
            name: "C. Run Parent Folder",
            functionName: "parentFind"
        }, {
            name: "D. Clear Index",
            functionName: "clearwhite"
        }
    ];
    ss.addMenu("GDrive Index", menuEntries);
    spreadsheet.toast("Select GDrive Index-> 0.Authorize. This is an One Time Action.", "Get Started", -1);
}

//Funtion list all files

function filesFind() {
    
    try {
        deletekeys();
        spreadsheet.toast("Files Index Run. Please Wait...", "Started", -1);
        listAll();
        spreadsheet.toast("Done Indexing.", "Success", -1);
    } catch (e) {
        Browser.msgBox("Error", "Sorry, Error Occured: " + e.toString(), Browser.Buttons.OK);
        spreadsheet.toast("Error Occurred :( Put at D1.", "Oops!", -1);
    }

}

//Funtion list all folder

function folderFind() {
    
    try {
        deletekeys();
        spreadsheet.toast("Folder Index Run. Please Wait...", "Started", -1);
        listFolders();
        spreadsheet.toast("Done Indexing.", "Success", -1);
    } catch (e) {
        Browser.msgBox("Error", "Sorry, Error Occured: " + e.toString(), Browser.Buttons.OK);
        spreadsheet.toast("Error Occurred :( Put at D1.", "Oops!", -1);
    }

}

// Funtion list only folder 1 level directory 
function parentFind() {
    
    try {
        deletekeys();
        spreadsheet.toast("Folder Index Run. Please Wait...", "Started", -1);
        listParentFolder();
        spreadsheet.toast("Done Indexing.", "Success", -1);
    } catch (e) {
        Browser.msgBox("Error", "Sorry, Error Occured: " + e.toString(), Browser.Buttons.OK);
        spreadsheet.toast("Error Occurred :( Put at D1.", "Oops!", -1);
    }

}

function deletekeys() {
    scriptproperties.deleteAllProperties();
}

// Main function 1: List all folders, & write into the current sheet.
function listFolders(){
  getFolderTree(folderId, false);
};

// Main function 2: List all files & folders, & write into the current sheet.
function listAll(){
  getFolderTree(folderId, true); 
};

// Main function 3: List all parent folders, & write into the current sheet.
function listParentFolder(){
  getFolderTreeParent(folderId, false); 
};

// =================
// Get Folder Tree
function getFolderTree(folderId, listAll) {
  try {
    // Get folder by id
    var parentFolder = DriveApp.getFolderById(folderId);
    
    // Initialise the sheet
    var file, data, sheet = SpreadsheetApp.getActiveSheet();
    clearwhite();
    //sheet.appendRow(["Full Path", "Name", "Date", "URL", "Last Updated", "Description", "Size"]);
   
   //If this upper line is enable it will generate the top legend. I disable this because I need custom header on sheet.
    
    // Get files and folders
    getChildFolders(parentFolder.getName(), parentFolder, data, sheet, listAll);
    
  } catch (e) {
    Logger.log(e.toString());
  }
};

// =================
// Get Folder (Parent only) Tree
function getFolderTreeParent(folderId, listAll) {
  try {
    // Get folder by id
    var parentFolder = DriveApp.getFolderById(folderId);
    
    // Initialise the sheet
    var file, data, sheet = SpreadsheetApp.getActiveSheet();
    clearwhite();
    //sheet.appendRow(["Full Path", "Name", "Date", "URL", "Last Updated", "Description", "Size"]);
    
    // Get files and folders
    getChildFoldersParent(parentFolder.getName(), parentFolder, data, sheet, listAll);
    
  } catch (e) {
    Logger.log(e.toString());
  }
};

// Get the list of files and folders and their metadata in recursive mode
function getChildFolders(parentName, parent, data, sheet, listAll) {
  var childFolders = parent.getFolders();
  
  // List folders inside the folder
  while (childFolders.hasNext()) {
    var childFolder = childFolders.next();
    // Logger.log("Folder Name: " + childFolder.getName());
    data = [ 
      //parentName + "/" + childFolder.getName(),
      childFolder.getName(),
      childFolder.getUrl(),
      childFolder.getDateCreated(),
      childFolder.getLastUpdated(),
     // childFolder.getDescription(),
     // childFolder.getSize()
     
     /*You can change what information to display on the sheet.
     In this case I only need file name,url date create and updated.
     You also can change what information want to display first by changing order of the things.*/
     
    ];
    // Write
    sheet.appendRow(data);
    
    // List files inside the folder
    var files = childFolder.getFiles();
    while (listAll & files.hasNext()) {
      var childFile = files.next();
      // Logger.log("File Name: " + childFile.getName());
      data = [ 
      //  parentName + "/" + childFolder.getName() + "/" + childFile.getName(),
        childFile.getName(),
        childFile.getUrl(),
        childFile.getDateCreated(),
        childFile.getLastUpdated(),
       // childFile.getDescription(),
       // childFile.getSize()
       
       /*You can change what information to display on the sheet.
       In this case I only need file name,url date create and updated.
       You also can change what information want to display first by changing order of the things.*/
       
      ];
      // Write
      sheet.appendRow(data);
    }
    
    // Recursive call of the subfolder
    getChildFolders(parentName + "/" + childFolder.getName(), childFolder, data, sheet, listAll);  
  }
};

// Get the list of parent folder and folders and their metadata in recursive mode
function getChildFoldersParent(parentName, parent, data, sheet) {
  var childFolders = parent.getFolders();
  
  // List folders inside the folder
  while (childFolders.hasNext()) {
    var childFolder = childFolders.next();
    // Logger.log("Folder Name: " + childFolder.getName());
    data = [ 
      childFolder.getName(),
      childFolder.getUrl(),
      childFolder.getDateCreated(),   
      childFolder.getLastUpdated(),
      /*You can change what information to display on the sheet.
      In this case I only need file name,url date create and updated.
      You also can change what information want to display first by changing order of the things. */
    ];
    // Write
    sheet.appendRow(data);
    
  }
};
