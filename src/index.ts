import * as signalR from "@microsoft/signalr";
import "./css/main.css";

const divMessages: HTMLDivElement = document.querySelector("#divMessages");
const tbMessage: HTMLInputElement = document.querySelector("#tbMessage");

// Buttons
const btnSend: HTMLButtonElement = document.querySelector("#btnSend");
const btnJoinChat: HTMLButtonElement = document.querySelector("#btnJoinChat");
let btnsSelectGroup = [];

// Inputs
const usernameInput: HTMLInputElement = document.querySelector("#usernameInput");

// Sidebar
const groupsList: HTMLButtonElement = document.querySelector("#sidebar__groups-list");
const onlineUsersList: HTMLButtonElement = document.querySelector(".online-users__list");
const username = new Date().getTime();

// State
let currentGroup = "";

const connection = new signalR.HubConnectionBuilder()
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

connection.on("newUserJoinedGroup", (userId: string) => {
    console.log("newUserJoinedGroup", userId)
    try {
        const userLi = document.createElement("li");
        userLi.innerHTML = userId;
        onlineUsersList.appendChild(userLi);
    } catch (e) {
        console.log(e);
    }
});

connection.on("announceNewConnectionsOnGroup", (userIds: string[]) => {
    console.log("announceNewConnectionsOnGroup", userIds)
    try {
        onlineUsersList.innerHTML = "";
        for (let i = 0; i < userIds.length; i++) {
            const userLi = document.createElement("li");
            userLi.innerHTML = userIds[i];
            onlineUsersList.appendChild(userLi);
        }
    } catch (e) {
        console.log(e);
    }
});

connection.on("displayAvailableGroups", (groups: string[]) => {
    try {
        for (let i = 0; i < groups.length; i++) {
            const groupLi = document.createElement("li");
            groupLi.innerHTML = `<button class="groups__button">${groups[i]}</button>`;
            groupsList.appendChild(groupLi);
        }

        btnsSelectGroup = Array.from(document.querySelectorAll(".groups__button"));
        for (let i = 0; i < btnsSelectGroup.length; i++) {
            btnsSelectGroup[i].addEventListener("click", async (e: any) => {
                e.preventDefault();
                await connection.send("LeaveGroup", currentGroup);

                const groupName = e.target.textContent;
                console.log("groupName", groupName)
                divMessages.innerHTML = "";
                await connection.send("JoinGroup", groupName);
                currentGroup = groupName;
            });
        }
        console.log(btnsSelectGroup)
    } catch (e) {
        console.log(e);
    }
});

connection.on("onMessageReceived", (username: string, message: string) => {
  const m = document.createElement("div");

  m.innerHTML = `<div class="message-author">${username}</div><div>${message}</div>`;

  divMessages.appendChild(m);
  divMessages.scrollTop = divMessages.scrollHeight;
});

connection.on("GetMessage", async () => {
    console.log("GetMessage")
    let promise = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("message");
        }, 100);
    });
    return promise;
});

connection.start()
    .then(() => {
        connection.send("onConnected", connection.connectionId)
    })
    .catch((err) => document.write(err));

tbMessage.addEventListener("keyup", (e: KeyboardEvent) => {
  if (e.key === "Enter") {
    send();
  }
});

// Button Event Listeners
btnSend.addEventListener("click", send);
btnJoinChat.addEventListener("click", joinChat);

async function joinChat(e: any) { 
    e.preventDefault();
    const username = usernameInput.value;
    console.log("joinChat", username)
    await connection.send("onConnected", username);

    usernameInput.value = "";
    usernameInput.disabled = true;
    btnJoinChat.disabled = true;
    btnSend.disabled = false;
    tbMessage.disabled = false;
    tbMessage.focus();
}

async function send() {
    connection.send("SendMessageToGroup", currentGroup, tbMessage.value)
        .then(() => (tbMessage.value = ""));
}