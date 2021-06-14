# DriveIndex.js

Simple Script for Indexing GDrive using Google Sheet and Script

## How to add Script and Run

1.  To run script put Google Folder ID at cell D1 (Can be custom on the code)
2.  This script need to add at Google Sheet on Tools-->Script Editor and paste the code.
3.  Deploy-->Test Deployment-->Google Workspace Add-on-->Done
4.  Save script and go back to Google Sheet
5.  Wait until GDrive Index Toolbar appear (if not try to refresh tab)
6.  For first time run Auth to verify the code (Security)

## How to get Folder ID

Go to the folder that you want to index
In url there is string at the end 

Example in https://drive.google.com/drive/folders/0AAFxtOxOHXbtUk9PVA

*0AAFxtOxOHXbtUk9PVA* is the Folder ID

## Type of function

A.  Run Folder - Index all folder and in its subdirectory

B.  Run All Files - Index all files and in its subdirectory

C.  Run Parent Folder - Index only parent folder on the spesific ID

D.  Clear Index - Clear all indexing 

### Example Template

You also can copy the file and put at your Google Drive and run the script.

https://docs.google.com/spreadsheets/d/1DHF1ELZdg58ezGZUFVLk9o8YwedRRKdmbmzLAOskjH0/edit?usp=sharing
