(async function () {
  const style = document.createElement("style");
  style.id = "bookmarklet-style";

  let isDark = localStorage.getItem("bookmarklet-mode") === "dark";
  function toggleDarkMode() {
    isDark = !isDark;
    localStorage.setItem("bookmarklet-mode", isDark ? "dark" : "light");
    document.getElementById("dark-mode").textContent = isDark
      ? "Light Mode"
      : "Dark Mode";
    updateColor();
  }
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.altKey && e.key === "d") {
      e.preventDefault();
      toggleDarkMode();
    }
  });

  function updateColor() {
    style.innerHTML = `
#bookmarklet-gui {
	position: fixed;
	top: 10%;
	left: 50%;
	transform: translateX(-50%);
	width: 40%;
	height: 50%;
	z-index: 1000000;
	background-color: ${isDark ? "#333" : "#fff"};
	color: ${isDark ? "#ddd" : "#333"};
	font-family: 'Aptos',
		Calibri,
		sans-serif;
	border-radius: 10px;
	box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: center;
	resize: both;
	overflow: hidden;
}

#bookmarklet-gui-header {
	position: absolute;
	top: 0;
	right: 0;
	left: 0;
	height: 40px;
	background-color: ${isDark ? "#444" : "#f6c1f6"};
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0 10px;
	border-top-left-radius: 10px;
	border-top-right-radius: 10px;
}

#bookmarklet-gui-header .button-group {
	display: flex;
	gap: 5px;
}

#bookmarklet-gui-header button {
	width: 30px;
	height: 30px;
	border-radius: 15px;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 18px;
	margin: 0 2px;
	background-color: ${isDark ? "#444" : "#ccc"};
	color: ${isDark ? "#ddd" : "#333"};
	border: 1px solid ${isDark ? "#444" : "#ccc"};
	cursor: pointer;
	transition: all 0.2s ease-in-out;
}

#bookmarklet-gui-header button:hover {
	background-color: ${isDark ? "#555" : "#ddd"};
	color: ${isDark ? "#eee" : "#333"};
}

#bookmarklet-close:hover {
	background-color: ${isDark ? "#ff4d4d" : "#ff4d4d"};
	color: white;
}

#bookmarklet-minimize:hover {
	background-color: ${isDark ? "#90ee90" : "#90ee90"};
	color: ${isDark ? "#333" : "#333"};
}

#bookmarklet-maximize:hover {
	background-color: ${isDark ? "#ffd700" : "#ffd700"};
	color: ${isDark ? "#333" : "#333"};
}

.screen {
	width: 100%;
	height: calc(100% - 40px);
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: center;
	padding: 20px;
	box-sizing: border-box;
	overflow-y: auto;
	margin-top: 20px;
	background-color: ${isDark ? "#333" : "#fff"};
	color: ${isDark ? "#ddd" : "#333"};
}

/* Login and Signup Background Styles */
#login-screen,
#create-account-screen,
#stay-login-screen,
#saved-account {
    background-color: ${isDark ? "#3a3a3a" : "#fff0f5"};
}

#email-login-section,
#email-create-section,
#google-login-section,
#google-create-section {
    background-color: ${isDark ? "#444" : "#ffebf3"};
    border: 1px solid ${isDark ? "#555" : "#ffd6e7"} !important;
    padding: 15px;
    margin-bottom: 15px;
    border-radius: 8px;
}

#login-button,
#create-account-button {
    background-color: ${isDark ? "#8c5a72" : "#ffb6c1"};
    border: 1px solid ${isDark ? "#a67a8e" : "#ff8da1"};
}

#login-button:hover,
#create-account-button:hover {
    background-color: ${isDark ? "#a67a8e" : "#ff8da1"};
}

.screen.hidden {
	display: none;
}

.screen input,
.screen textarea,
.screen button {
	width: 100%;
	height: auto;
	margin: 10px 0;
	padding: 10px;
	border-radius: 5px;
	box-sizing: border-box;
	font-size: 12px;
	text-align: center;
	display: block;
	margin-left: auto;
	margin-right: auto;
	color: ${isDark ? "#ddd" : "#333"};
	background-color: ${isDark ? "#444" : "#ddd"};
	border: 1px solid ${isDark ? "#555" : "#ccc"};
}

.screen button:hover {
	background-color: ${isDark ? "#555" : "#ccc"};
	color: ${isDark ? "#eee" : "#333"};
}

.screen h2,
.screen h3 {
	color: ${isDark ? "#ddd" : "#333"};
	text-align: center;
}

.screen label {
	color: ${isDark ? "#ddd" : "#333"};
}

.screen textarea {
	min-height: 50px;
	color: ${isDark ? "#ddd" : "#333"};
	background-color: ${isDark ? "#444" : "#fff"};
	border: 1px solid ${isDark ? "#555" : "#ccc"};
}

.screen div {
	width: 90%;
	border: 1px solid ${isDark ? "#555" : "#ccc"};
	justify-items: center;
}


.chat {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 0;
  box-sizing: border-box;
  background-color: ${isDark ? "#222" : "#fff"};
  color: ${isDark ? "#ddd" : "#333"};
  height: 100%;
}

.chat.hidden {
  display: none !important;
}

#chat-screen {
  flex-direction: column;
  margin-top: 40px;
  padding-top: 0;
  height: calc(100% - 40px);
}

#lower-chat {
  display: flex;
  flex-direction: row;
  height: calc(100% - 40px);
  width: 100%;
  margin: 0;
}

/* Settings Bar */
#settings-bar {
  width: 100%;
  height: 40px;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-bottom: 1px solid ${isDark ? "#444" : "#e0e0e0"};
  background: ${isDark ? "#2a2a2a" : "#f6c1f6"};
  padding: 0 16px;
  gap: 12px;
  position: sticky;
  top: 0;
  z-index: 10;
}

#customize-profile {
  background: ${isDark ? "#404040" : "#e8d3e8"};
  color: ${isDark ? "#ffffff" : "#495057"};
  border: none;
  padding: 6px 16px;
  border-radius: 4px;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

#customize-profile:hover {
  background: ${isDark ? "#505050" : "#ca99ca"};
}

#dark-mode {
  background: ${isDark ? "#404040" : "#e8d3e8"};
  color: ${isDark ? "#ffffff" : "#495057"};
  border: none;
  padding: 6px 16px;
  border-radius: 4px;
  font-weight: 500;
  transition: all 0.2s ease;
}

#dark-mode:hover {
  background: ${isDark ? "#505050" : "#ca99ca"};
}

#read-all {
  background: ${isDark ? "#404040" : "#e8d3e8"};
  color: ${isDark ? "#ffffff" : "#495057"};
  border: none;
  padding: 6px 16px;
  border-radius: 4px;
  font-weight: 500;
  transition: all 0.2s ease;
}

#read-all:hover {
  background: ${isDark ? "#505050" : "#ca99ca"};
}

#hide-left-sidebar {
  background: ${isDark ? "#404040" : "#e8d3e8"};
  color: ${isDark ? "#ffffff" : "#495057"};
  border: none;
  padding: 6px 16px;
  border-radius: 4px;
  font-weight: 500;
  transition: all 0.2s ease;
}

#hide-left-sidebar:hover {
  background: ${isDark ? "#505050" : "#ca99ca"};
}

.setting-button {
  height: 32px;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}





/* Left Sidebar (Server and DM) */
#left-sidebar {
  width: 20%;
  min-width: 180px;
  display: flex;
  flex-direction: column;
  height: 100%;
  border-right: 2px solid ${isDark ? "#555" : "#ccc"};
  background: ${isDark ? "linear-gradient(to bottom, #444, #333)" : "linear-gradient(to bottom, #d2a6c9, #dbb8d4)"};
  padding: 8px;
  box-sizing: border-box;
  flex-shrink: 0;
  margin-bottom: 0;
}

#top-left-sidebar {
  height: 60%;
  min-height: 60%;
  max-height: 60%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 10px;
  overflow-y: auto;
  overflow-x: hidden;
}

#bottom-left-sidebar {
  height: 40%;
  min-height: 40%;
  width: 100%;
  padding: 8px 0 0 0;
  background-color: ${isDark ? "#333" : "#fcebfc"};
  display: flex;
  flex-direction: column;
  align-items: center;
  border-top: 1px solid ${isDark ? "#555" : "#ddd"};
  overflow-y: auto;
  overflow-x: hidden;
  margin-bottom: 0;
}

#server-list {
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
}

#create-new-server {
  padding: 8px 5px;
  background-color: ${isDark ? "#a65653" : "#5865F2"};
  color: white;
  border: none;
  border-radius: 4px;
  width: 90%;
  font-size: 13px;
  font-weight: 500;
  transition: background-color 0.3s ease;
  margin-bottom: 8px;
}

#create-new-server:hover {
  background-color: ${isDark ? "#c79d9b" : "#4752C4"};
}

.server {
  background-color: ${isDark ? "#555" : "#e0e0e0"};
  width: 90%;
  padding: 5px 4px;
  margin-bottom: 1px;
  font-size: 13px;
  font-weight: 500;
  text-align: center;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.server:hover {
  background-color: ${isDark ? "#666" : "#d0d0d0"};
}

.server.selected {
  background-color: ${isDark ? "#777" : "#ccc"};
  box-shadow: 0 0 0 1px ${isDark ? "#888" : "#999"};
}

.dm {
	width: 90%;
	padding: 8px 12px;
	margin: 0;
	font-size: 13px;
	font-weight: 500;
	text-align: center;
	border-radius: 6px;
	background-color: ${isDark ? "#444" : "#e8e8e8"};
	color: ${isDark ? "#fff" : "#333"};
	transition: all 0.2s ease;
	cursor: pointer;
	border: 1px solid transparent;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.dm:hover {
	background-color: ${isDark ? "#555" : "#d0d0d0"};
	transform: translateY(-1px);
	box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

/* Right Sidebar (Messages Area) */
#right-sidebar {
	width: 80%;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	height: 100%;
	padding-left: 10px;
	background-color: ${isDark ? "#333" : "#faf5f9"};
	color: ${isDark ? "#ddd" : "#333"};
	min-width: 0;
}

#messages {
	flex: 1;
	overflow-y: auto;
	background-color: ${isDark ? "#520b4c" : "#faf5f9"};
	padding: 10px;
	margin-bottom: 10px;
}

.message {
	padding: 3px 8px;
	margin-bottom: 3px;
	border-radius: 5px;
	font-size: 12px;
	width: 95%;
	max-width: 95%;
	word-wrap: break-word;
	background-color: ${isDark ? "#e0e0e0" : "#e0e0e0"};
	color: ${isDark ? "#ccc" : "#333"};
}

.message.sent {
	text-align: right;
	background-color: ${isDark ? "#4a4a4a" : "#e8d3e8"};
	color: ${isDark ? "#cccccc" : "#006064"};
}

.message.received {
	text-align: left;
	background-color: ${isDark ? "#3a3a3a" : "#fcebfc"};
	color: ${isDark ? "#cccccc" : "#33691e"};
}
.message.received.unread {
  background-color: ${isDark ? "#4a3a3a" : "#fcebfc"};
  border-left: 3px solid ${isDark ? "#ff6b6b" : "#d2a6c9"};
  box-shadow: 0 1px 3px ${isDark ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.1)"};
}

.send-info {
	font-size: 8px;
	color: ${isDark ? "#888" : "#666"};
}
#message-send {
  padding: 10px;
  background-color: ${isDark ? "#444" : "#e8d3e8"};
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: auto;
}

#message-input {
	width: 80%;
	padding: 10px;
	border-radius: 5px;
	border: 1px solid ${isDark ? "#555" : "#ccc"};
	margin-top: auto;
	margin-bottom: auto;
	color: ${isDark ? "#ddd" : "black"};
	background-color: ${isDark ? "#333" : "#fff"};
}

#send-button {
	padding: 10px 30px;
	background-color: ${isDark ? "#4a4a4a" : "#00796b"};
	color: white;
	border: none;
	border-radius: 5px;
	cursor: pointer;
	margin-top: auto;
	margin-bottom: auto;
	margin-left: 10px;
}

#send-button:hover {
	background-color: ${isDark ? "#3a3a3a" : "#004d40"};
}
.selected-members-container {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin: 8px 0;
    min-height: 24px;
    padding: 4px;
    border: 1px solid ${isDark ? "#555" : "#ccc"};
    border-radius: 4px;
    overflow: hidden;
}

.selected-member {
    background: ${isDark ? "#444" : "#e0e0e0"};
    padding: 2px 6px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 0.85em;
    white-space: nowrap;
}

.remove-member {
    cursor: pointer;
    color: ${isDark ? "#fff" : "#666"};
    font-weight: bold;
    font-size: 0.9em;
}

.members-dropdown {
    position: relative;
}

.members-list {
    border: 1px solid ${isDark ? "#555" : "#ccc"};
    border-radius: 4px;
    max-height: 200px;
    overflow-y: auto;
    position: absolute;
    width: 100%;
    background: ${isDark ? "#333" : "#fff"};
    display: none;
}

.member-option {
    padding: 8px;
    cursor: pointer;
}

.member-option:hover {
    background: ${isDark ? "#444" : "#f0f0f0"};
}

#member-search {
    width: 100%;
    padding: 8px;
    margin: 8px 0;
    border: 1px solid ${isDark ? "#555" : "#ccc"};
    border-radius: 4px;
}
`;
  }

  document.head.appendChild(style);
  updateColor();

  // Rest of the code remains unchanged...
