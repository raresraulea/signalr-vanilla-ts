"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var signalR = require("@microsoft/signalr");
require("./css/main.css");
var divMessages = document.querySelector("#divMessages");
var tbMessage = document.querySelector("#tbMessage");
// Buttons
var btnSend = document.querySelector("#btnSend");
var btnJoinChat = document.querySelector("#btnJoinChat");
var btnsSelectGroup = [];
// Inputs
var usernameInput = document.querySelector("#usernameInput");
// Sidebar
var groupsList = document.querySelector("#sidebar__groups-list");
var onlineUsersList = document.querySelector(".online-users__list");
var username = new Date().getTime();
// State
var currentGroup = "";
var connection = new signalR.HubConnectionBuilder()
    .withUrl("/hub")
    .build();
// connection.on("RegisterNewConnection", (connectionId: string) => {
//     try {
//         const userLi = document.createElement("li");
//         userLi.innerHTML = connectionId;
//         groupsList.appendChild(userLi);
//         console.log("RegisterNewConnection", connectionId)
//     } catch (e) {
//         console.log(e);
//     }
// });
connection.on("newUserJoinedGroup", function (userId) {
    console.log("newUserJoinedGroup", userId);
    try {
        var userLi = document.createElement("li");
        userLi.innerHTML = userId;
        onlineUsersList.appendChild(userLi);
    }
    catch (e) {
        console.log(e);
    }
});
connection.on("announceNewConnectionsOnGroup", function (userIds) {
    console.log("announceNewConnectionsOnGroup", userIds);
    try {
        onlineUsersList.innerHTML = "";
        for (var i = 0; i < userIds.length; i++) {
            var userLi = document.createElement("li");
            userLi.innerHTML = userIds[i];
            onlineUsersList.appendChild(userLi);
        }
    }
    catch (e) {
        console.log(e);
    }
});
connection.on("displayAvailableGroups", function (groups) {
    try {
        for (var i = 0; i < groups.length; i++) {
            var groupLi = document.createElement("li");
            groupLi.innerHTML = "<button class=\"groups__button\">".concat(groups[i], "</button>");
            groupsList.appendChild(groupLi);
        }
        btnsSelectGroup = Array.from(document.querySelectorAll(".groups__button"));
        for (var i = 0; i < btnsSelectGroup.length; i++) {
            btnsSelectGroup[i].addEventListener("click", function (e) { return __awaiter(void 0, void 0, void 0, function () {
                var groupName;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            e.preventDefault();
                            return [4 /*yield*/, connection.send("LeaveGroup", currentGroup)];
                        case 1:
                            _a.sent();
                            groupName = e.target.textContent;
                            console.log("groupName", groupName);
                            divMessages.innerHTML = "";
                            return [4 /*yield*/, connection.send("JoinGroup", groupName)];
                        case 2:
                            _a.sent();
                            currentGroup = groupName;
                            return [2 /*return*/];
                    }
                });
            }); });
        }
        console.log(btnsSelectGroup);
    }
    catch (e) {
        console.log(e);
    }
});
connection.on("onMessageReceived", function (username, message) {
    var m = document.createElement("div");
    m.innerHTML = "<div class=\"message-author\">".concat(username, "</div><div>").concat(message, "</div>");
    divMessages.appendChild(m);
    divMessages.scrollTop = divMessages.scrollHeight;
});
connection.on("GetMessage", function () { return __awaiter(void 0, void 0, void 0, function () {
    var promise;
    return __generator(this, function (_a) {
        console.log("GetMessage");
        promise = new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve("message");
            }, 100);
        });
        return [2 /*return*/, promise];
    });
}); });
connection.start()
    .then(function () {
    connection.send("onConnected", connection.connectionId);
})
    .catch(function (err) { return document.write(err); });
tbMessage.addEventListener("keyup", function (e) {
    if (e.key === "Enter") {
        send();
    }
});
// Button Event Listeners
btnSend.addEventListener("click", send);
btnJoinChat.addEventListener("click", joinChat);
function joinChat(e) {
    return __awaiter(this, void 0, void 0, function () {
        var username;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    username = usernameInput.value;
                    console.log("joinChat", username);
                    return [4 /*yield*/, connection.send("onConnected", username)];
                case 1:
                    _a.sent();
                    usernameInput.value = "";
                    usernameInput.disabled = true;
                    btnJoinChat.disabled = true;
                    btnSend.disabled = false;
                    tbMessage.disabled = false;
                    tbMessage.focus();
                    return [2 /*return*/];
            }
        });
    });
}
function send() {
    return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    connection.send("newMessage", username, tbMessage.value)
                        .then(function () { return (tbMessage.value = ""); });
                    return [4 /*yield*/, connection.invoke("waitForMessage", connection.connectionId)];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
