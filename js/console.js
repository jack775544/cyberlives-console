var commandRegister = {};
var helpRegister = {};
var commandHistory = new Array();
var curDir = "~"
var keyIndex = 0;
var folderArray = {};

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
    commandHistory.push(text);
    printToConsole("$" + curDir.name + " " + text);
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
    $(document).scrollTop($(document)[0].scrollHeight);
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

function printCommandToConsole(text) {
    $('#console').append("&gt; " + text + "<br/>");
}

function printToConsole(text) {
    $('#console').append(text + "<br/>");
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
            var command = commandRegister[alias];
            printToConsole(alias + " " + helpRegister[command]);
        }
    }
}

function ls(){
    /*$.each(curDir.childFolders, function(key){
        printToConsole(key);
    });*/
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
            curDir = folderArray[folderName];
        } else {
            printErrorToConsole("Error: The folder " + folderName + " does not exist");
            return;
        }
    }
    $("#dir").text(folderName);
}

function commands() {
    addToHelpRegister(clearConsole, "Clears the console");
    addToCommandRegister("cls", clearConsole);
    addToCommandRegister("clear", clearConsole);

    addToHelpRegister(clearHistory, "Clears console history");
    addToCommandRegister("clsh", clearHistory);
    addToCommandRegister("clearHist", clearHistory);
    addToCommandRegister("clearHistory", clearHistory);
    
    addToHelpRegister(helpMessage, "Displays this help message");
    addToCommandRegister("help", helpMessage);
    
    addToHelpRegister(ls, "Shows objects in the current folder");
    addToCommandRegister("ls", ls);
    addToCommandRegister("dir", ls);
    
    addToHelpRegister(cd, "Change the current directory");
    addToCommandRegister("cd", cd);
}

// ---------

function initFolders(){
    folderArray["~"] = {name:"~", parent:undefined, childFolders:["journals", "logs"], files:undefined, pwd:undefined};
    folderArray["journals"] = {name:"journals", parent:"~", childFolders:undefined, files:undefined, pwd:undefined};
    folderArray["logs"] = {name:"logs", parent:"~", childFolders:["roland"], files:undefined, pwd:undefined};
    folderArray["roland"] = {name:"roland", parent:"logs", childFolders:undefined, files:["diary/roland/Roland-1.html", "diary/roland/Roland-2.html", "diary/roland/Roland-3.html"], pwd:'27cfe1c4c58e082c734bd19495dc681aed2563468cd5a6903f98580198e7e0cd4a615e67135f41c81fb861e967e7b660a0fa748515c7ee8cd94963d94434b13a'};
    curDir = folderArray["~"];
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