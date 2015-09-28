var commandRegister = {};
var helpRegister = {};
var commandHistory = new Array();
var curDir = "~"
var keyIndex = 0;
var folderArray = {};
var rain = 1;
var pass = undefined;
var fileMap = {};
var lastPass = undefined;

function addToHelpRegister(command, desc) {
    helpRegister[command] = desc;
}

function addToCommandRegister(alias, command) {
    commandRegister[alias] = command;
}

function getCommand(command) {
    return commandRegister[command];
}

function run() {
    var text = $.trim($('#input').val());
    if (text == "") {
        return;
    }
    if (pass !== undefined){
        if (CryptoJS.SHA3(text) == pass[0]){
            curDir = folderArray[pass[1]];
            lastPass = text;
            buildFileMap();
            printErrorToConsole("Password Correct, Welcome USER");
            $("#dir").text(curDir.name);
        } else {
            $("#dir").text(curDir.name);
            printErrorToConsole("Incorrect Password");
        }
        $('#input').val("");
        pass = undefined;
        window.scrollTo(0,document.body.scrollHeight);
        return;
    }
    commandHistory.push(text);
    printToConsole("$ " + curDir.name + "&gt;" + text);
    keyIndex = commandHistory.length;
    var input = text.split(" ");
    input[0] = input[0].toLowerCase();
    var command = getCommand(input[0]);
    if (command !== undefined) {
        command(input);
    } else {
        printErrorToConsole("Error: Command " + input[0] + " is not a valid command");
    }
    $('#input').val("");
    //$(document).scrollTop($(document)[0].scrollHeight);
    window.scrollTo(0,document.body.scrollHeight);
}

function historyUp() {
    if (keyIndex == 0) {
        return;
    }
    keyIndex = keyIndex - 1;
    $('#input').val(commandHistory[keyIndex]);
}

function historyDown() {
    if (keyIndex == commandHistory.length - 1) {
        return;
    }
    keyIndex = keyIndex + 1;
    $('#input').val(commandHistory[keyIndex]);
}

function initText() {
    printToConsole("Caelum OS");
    printToConsole("V2.0 Blue Edition");
    printToConsole("To view system help type 'help'")
    printToConsole("-------------------------------");
}

function printToConsole(text) {
    $('#console').append(text + "<br/>");
}

function printCommandToConsole(text) {
    printToConsole("&gt; " + text);
}

function printErrorToConsole(text){
    printCommandToConsole('<span style="color:#009900;">' + text + '</span>');
}

// --------- Console Functions ---------

function clearConsole() {
    $('#console').text("");
    initText();
}

function clearHistory() {
    commandHistory = new Array;
    keyIndex = 0;
    printCommandToConsole("Command History Cleared");
}

function helpMessage(){
    printCommandToConsole("Displaying System Help");
    for (var alias in commandRegister) {
        if (commandRegister.hasOwnProperty(alias)) {
            if (alias == "potato"){
                continue;
            }
            var command = commandRegister[alias];
            printToConsole(alias + " " + helpRegister[command]);
        }
    }
}

function ls(){
    var folders = curDir.childFolders;
    printToConsole('<span style="color:red;">./.</span>');
    if (curDir.parent !== undefined){
        printToConsole('<span style="color:red;">./..</span>');
    }
    if (folders !== undefined){
        for (var i = 0; i<folders.length; i++){
            printToConsole('<span style="color:red;">./' + folders[i] + '</span>');
        }
    };
    var files = curDir.files;
    if (files !== undefined){
        for (var i = 0; i<files.length; i++){
            printToConsole('<span style="color:cyan;">' + files[i] + '</span>');
        }
    }
}

function cd(args){
    if (args.length > 2){
        printErrorToConsole("Error: Invalid Args");
        return;
    }
    if(args.length == 1 || args[1] == "~"){
        curDir = folderArray["~"];
        folderName = "~";
        return;
    }
    var folders = curDir.childFolders;
    var folderName = args[1];
    if (folderName == ".."){
        if (curDir.parent === undefined){
            return;
        }
        folderName = curDir.parent;
        curDir = folderArray[folderName];
    } else if (folderName == "."){
        folderName = curDir.name;
    } else {
        var index = $.inArray(folderName, folders);
        if (index != -1){
            if (folderArray[folderName].pwd !== undefined){
                printCommandToConsole("Welcome USER. Please enter the password:");
                pass = [folderArray[folderName].pwd, folderName];
                $("#dir").text("");
                return;
            }
            curDir = folderArray[folderName];
        } else {
            printErrorToConsole("Error: The folder " + folderName + " does not exist");
            return;
        }
    }
    $("#dir").text(folderName);
}

function printHistory(){
    var out = "";
    for (var i = 0; i<commandHistory.length; i++){
        out = out + commandHistory[i] + "; ";
    }
    printToConsole(out);
}

function create(){
    var w = $(document).width()
    var x = w * Math.random();
    if (w-x < 50){
        x = x-75;
    }
    var img = $('<img />',
                 { class: 'potato',
                   src: 'icons/potato.png', 
                   alt:'Potato-Chan has made it rain'})
                  .appendTo($('body'));
    $(img).css('left', x);
    $(img).css('top', -50);
    spam = setTimeout(create,500);
}

function drop(){
    $('.potato').each(function(){
        this.style.top = parseInt(this.style.top) + 10 + 'px';
        if ($(document).height() - parseInt(this.style.top) < 60){
            $(this).remove();
        }
    });
    animate = setTimeout(drop, 20);
}

function potato(){
    if (rain){
        create();
        drop();
        rain = 0;
    } else {
        $('.potato').remove();
        clearTimeout(spam);
        clearTimeout(animate);
        rain = 1;
    }
}

function less(args){
    if (args.length != 2){
        printErrorToConsole("Error: Invalid Args");
        return;
    }
    var fileName = args[1];
    var files = curDir.files;
    var index = $.inArray(fileName, files);
    if (index != -1){
        var loc = fileMap[fileName];
        var win = window.open(loc, '_blank');
        if(win){
            win.focus();
        }else{
            printErrorToConsole('Please allow popups for this site');
        }
    }
}

function commands() {
    addToHelpRegister(clearConsole, "Clears the console");
    addToCommandRegister("cls", clearConsole);
    addToCommandRegister("clear", clearConsole);

    addToHelpRegister(clearHistory, "Clears console history");
    addToCommandRegister("clsh", clearHistory);
    addToCommandRegister("clearhist", clearHistory);
    addToCommandRegister("clearhistory", clearHistory);
    
    addToHelpRegister(helpMessage, "Displays this help message");
    addToCommandRegister("help", helpMessage);
    
    addToHelpRegister(ls, "Shows objects in the current folder");
    addToCommandRegister("ls", ls);
    addToCommandRegister("dir", ls);
    
    addToHelpRegister(cd, "Change the current directory");
    addToCommandRegister("cd", cd);
    
    addToHelpRegister(printHistory, "Prints the console command history");
    addToCommandRegister("hist", printHistory);
    addToCommandRegister("history", printHistory);
    addToCommandRegister("printhistory", printHistory);
    addToCommandRegister("potato", potato);
    
    addToHelpRegister(less, "Opens a file");
    addToCommandRegister("less", less);
}

// ---------

function initFolders(){
    /* These folders are completely virtual and have no relavence the the server file structure.
    A folders index in the map is it's name and the name property must be the same as this.
    A folder must reference both it's parent folder as well as any child folders that exist (yes this does mean there is doubling up but it is much easier)
    The files are the name of the files for the user to see, there is a mapping to the server location in the buildFileMap function
    pwd is the encoding of the password */
    folderArray["~"]        = {name:"~", 
                               parent:undefined, 
                               childFolders:["journals", "logs"], 
                               files:undefined, 
                               pwd:undefined};
    folderArray["logs"]     = {name:"logs", 
                               parent:"~", 
                               childFolders:undefined, 
                               files:["log_3/9/15.txt"], 
                               pwd:undefined};
    folderArray["journals"] = {name:"journals", 
                               parent:"~", 
                               childFolders:["roland", "violet"], 
                               files:undefined, 
                               pwd:undefined};
    folderArray["roland"]   = {name:"roland", 
                               parent:"journals", 
                               childFolders:undefined, 
                               files:["roland-1.txt", "roland-2.txt", "roland-3.txt"], 
                               pwd:'27cfe1c4c58e082c734bd19495dc681aed2563468cd5a6903f98580198e7e0cd4a615e67135f41c81fb861e967e7b660a0fa748515c7ee8cd94963d94434b13a'};
    folderArray["violet"]   = {name:"violet", 
                               parent:"journals", 
                               childFolders:undefined, 
                               files:["violet-1.txt", "violet-2.txt", "violet-3.txt"], 
                               pwd:"75741bbec44faa40ff4479e7640339b87f2b92fd6b5f11dd16a739006faf9c1415e06a3c21438bf96a45eb0dce0e9105e1be858f1dee981864b1e581a54c3af3"};
    
    buildFileMap();
    
    curDir = folderArray["~"];
}

function buildFileMap(){
    /* Maps the file location on the VFS to the physical file location */
    fileMap["roland-1.txt"] = "diary/" + lastPass + "/Roland-1.html"; // In passworded folder
    fileMap["roland-2.txt"] = "diary/" + lastPass + "/Roland-2.html";
    fileMap["roland-3.txt"] = "diary/" + lastPass + "/Roland-3.html";
    fileMap["violet-1.txt"] = "diary/" + lastPass + "/violet-1.html";
    fileMap["violet-2.txt"] = "diary/" + lastPass + "/violet-2.html";
    fileMap["violet-3.txt"] = "diary/" + lastPass + "/violet-3.html";
    fileMap["log_3/9/15.txt"] = "story/Chap1.html"; // Non passworded folder
}

function init() {
    $('#go').click(function () {
        run();
    });
    $(document).keypress(function (e) {
        if (e.which == 13) {
            run();
        }
    });
    $(document).keydown(function (e) {
        if (e.which == 38) {
            historyUp();
        }
        if (e.which == 40) {
            historyDown();
        }
    });
    $('#input').focus();
    $('#input').focusout(function () {
        $('#input').focus();
    });
    commands();
    initFolders();
    initText();
}

$(document).ready(function () {
    init();
});