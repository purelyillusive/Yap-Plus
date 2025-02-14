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
    /* Dark mode with pink theme */
    #bookmarklet-gui {
      background-color: ${isDark ? "#1a1218" : "#fff"};
      color: ${isDark ? "#f8e1f4" : "#333"};
    }

    #bookmarklet-gui-header {
      background-color: ${isDark ? "#3f2a38" : "#f6c1f6"};
    }

    #bookmarklet-gui-header button {
      background-color: ${isDark ? "#5d3f56" : "#ccc"};
      color: ${isDark ? "#f8e1f4" : "#333"};
      border: 1px solid ${isDark ? "#6d4964" : "#ccc"};
    }

    #bookmarklet-gui-header button:hover {
      background-color: ${isDark ? "#7a5371" : "#ddd"};
      color: ${isDark ? "#ffffff" : "#333"};
    }

    .screen {
      background-color: ${isDark ? "#1a1218" : "#fff"};
      color: ${isDark ? "#f8e1f4" : "#333"};
    }

    /* Login and Signup Background Styles - Pink Dark Mode */
    #main-screen,
    #login-screen,
    #create-account-screen,
    #stay-login-screen,
    #saved-account {
      background-color: ${isDark ? "#291824" : "#fff0f5"};
    }

    #email-login-section,
    #email-create-section,
    #google-login-section,
    #google-create-section {
      background-color: ${isDark ? "#3d2a36" : "#ffebf3"};
      border: 1px solid ${isDark ? "#5d3f56" : "#ffd6e7"} !important;
    }

    #login-button,
    #create-account-button {
      background-color: ${isDark ? "#8c5a7f" : "#ffb6c1"};
      border: 1px solid ${isDark ? "#a67a96" : "#ff8da1"};
    }

    #login-button:hover,
    #create-account-button:hover {
      background-color: ${isDark ? "#a67a96" : "#ff8da1"};
    }

    /* Profile Customization - make pink in dark mode */
    #customize-account-screen {
      background-color: ${isDark ? "#291824" : "#fff0f5"};
    }

    #customize-account-screen input,
    #customize-account-screen textarea {
      background-color: ${isDark ? "#3d2a36" : "#fff"};
      border: 1px solid ${isDark ? "#5d3f56" : "#ccc"};
      color: ${isDark ? "#f8e1f4" : "#333"};
    }

    #submit-customize {
      background-color: ${isDark ? "#8c5a7f" : "#ffb6c1"};
      border: 1px solid ${isDark ? "#a67a96" : "#ff8da1"};
      color: ${isDark ? "#ffffff" : "#333"};
    }

    #submit-customize:hover {
      background-color: ${isDark ? "#a67a96" : "#ff8da1"};
    }

    /* Channel Creation Screen - pink in dark mode */
    #channel-screen {
      background-color: ${isDark ? "#291824" : "#fff0f5"};
    }

    #channel-screen input,
    #channel-screen textarea,
    #channel-screen select {
      background-color: ${isDark ? "#3d2a36" : "#fff"};
      border: 1px solid ${isDark ? "#5d3f56" : "#ccc"};
      color: ${isDark ? "#f8e1f4" : "#333"};
    }

    #submit-channel,
    #back-channel {
      background-color: ${isDark ? "#8c5a7f" : "#ffb6c1"};
      border: 1px solid ${isDark ? "#a67a96" : "#ff8da1"};
      color: ${isDark ? "#ffffff" : "#333"};
    }

    #submit-channel:hover,
    #back-channel:hover {
      background-color: ${isDark ? "#a67a96" : "#ff8da1"};
    }

    /* Chat elements */
    #chat-screen {
      background-color: ${isDark ? "#1a1218" : "#faf5f9"};
    }

    #settings-bar {
      background: ${isDark ? "#3f2a38" : "#f6c1f6"};
    }

    #customize-profile,
    #dark-mode,
    #read-all,
    #hide-left-sidebar {
      background: ${isDark ? "#5d3f56" : "#e8d3e8"};
      color: ${isDark ? "#f8e1f4" : "#495057"};
    }

    #customize-profile:hover,
    #dark-mode:hover,
    #read-all:hover,
    #hide-left-sidebar:hover {
      background: ${isDark ? "#7a5371" : "#ca99ca"};
    }

    #left-sidebar {
      background: ${isDark ? "linear-gradient(to bottom, #3f2a38, #291824)" : "linear-gradient(to bottom, #d2a6c9, #dbb8d4)"};
      border-right: 2px solid ${isDark ? "#5d3f56" : "#ccc"};
    }

    #bottom-left-sidebar {
      background-color: ${isDark ? "#291824" : "#fcebfc"};
      border-top: 1px solid ${isDark ? "#5d3f56" : "#ddd"};
    }

    #create-new-server {
      background-color: ${isDark ? "#8c5a7f" : "#5865F2"};
    }

    #create-new-server:hover {
      background-color: ${isDark ? "#a67a96" : "#4752C4"};
    }

    .server {
      background-color: ${isDark ? "#5d3f56" : "#e0e0e0"};
    }

    .server:hover {
      background-color: ${isDark ? "#7a5371" : "#d0d0d0"};
    }

    .server.selected {
      background-color: ${isDark ? "#8c5a7f" : "#ccc"};
      box-shadow: 0 0 0 1px ${isDark ? "#a67a96" : "#999"};
    }

    .dm {
      background-color: ${isDark ? "#3d2a36" : "#e8e8e8"};
      color: ${isDark ? "#f8e1f4" : "#333"};
    }

    .dm:hover {
      background-color: ${isDark ? "#5d3f56" : "#d0d0d0"};
    }

    #right-sidebar {
      background-color: ${isDark ? "#1a1218" : "#faf5f9"};
      color: ${isDark ? "#f8e1f4" : "#333"};
    }

    #messages {
      background-color: ${isDark ? "#291824" : "#faf5f9"};
    }

    .message {
      background-color: ${isDark ? "#3d2a36" : "#e0e0e0"};
      color: ${isDark ? "#f8e1f4" : "#333"};
    }

    .message.sent {
      background-color: ${isDark ? "#5d3f56" : "#e8d3e8"};
      color: ${isDark ? "#f8e1f4" : "#006064"};
    }

    .message.received {
      background-color: ${isDark ? "#3d2a36" : "#fcebfc"};
      color: ${isDark ? "#f8e1f4" : "#33691e"};
    }

    .message.received.unread {
      background-color: ${isDark ? "#4d3a3a" : "#fcebfc"};
      border-left: 3px solid ${isDark ? "#ff6b8b" : "#d2a6c9"};
    }

    .send-info {
      color: ${isDark ? "#a67a96" : "#666"};
    }

    #message-send {
      background-color: ${isDark ? "#3d2a36" : "#e8d3e8"};
    }

    #message-input {
      border: 1px solid ${isDark ? "#5d3f56" : "#ccc"};
      color: ${isDark ? "#f8e1f4" : "black"};
      background-color: ${isDark ? "#291824" : "#fff"};
    }

    #send-button {
      background-color: ${isDark ? "#8c5a7f" : "#00796b"};
    }

    #send-button:hover {
      background-color: ${isDark ? "#a67a96" : "#004d40"};
    }

    .selected-members-container {
      border: 1px solid ${isDark ? "#5d3f56" : "#ccc"};
    }

    .selected-member {
      background: ${isDark ? "#3d2a36" : "#e0e0e0"};
    }

    .remove-member {
      color: ${isDark ? "#f8e1f4" : "#666"};
    }

    .members-list {
      border: 1px solid ${isDark ? "#5d3f56" : "#ccc"};
      background: ${isDark ? "#291824" : "#fff"};
    }

    .member-option:hover {
      background: ${isDark ? "#3d2a36" : "#f0f0f0"};
    }

    #member-search {
      border: 1px solid ${isDark ? "#5d3f56" : "#ccc"};
    }
  `;
}

  document.head.appendChild(style);
  updateColor();

  // Rest of the code remains unchanged...

  const gui = document.createElement("div");
  gui.id = "bookmarklet-gui";
  let originalState = {
    width: "50%",
    height: "60%",
    top: "10%",
    left: "50%",
    transform: "translateX(-50%)",
  };

  gui.innerHTML = `
<div id="bookmarklet-gui-header">
   <span>Yap Window</span>   
   <div class="button-group">
      <button id="bookmarklet-minimize">−</button>
      <button id="bookmarklet-fullscreen">⛶</button>
      <button id="bookmarklet-close">×</button>
   </div>
</div>
<div id="login-screen" class="screen hidden">
   <h2>Log In</h2>
   <div id="google-login-section" style="border:1px solid black">
      <h3>Sign In with Google</h3>
      <button id="google-login-button">Login with Google</button>
   </div>
   <div id="email-login-section" style="border:1px solid black">
      <h3>Login with Email</h3>
      <label for="login-email">Email</label>
      <input id="login-email" type="email" placeholder="Enter your email" required="">
      <label for="login-password">Password</label>
      <input id="login-password" type="password" placeholder="Enter your password" required="">
      <button id="submit-login-email">Log In</button>
      <label id="login-email-error" style="color: #f2545b"></label>
   </div>
   <div>
      <button id="back-login-button">Back</button>
   </div>
   <hr style="margin: 20px 0">
</div>
<div id="create-account-screen" class="screen hidden">
   <h2>Create Account</h2>
   <div id="google-create-section" style="border:1px solid black">
      <h3>Create Account with Google</h3>
      <button id="google-create-button">Sign Up with Google</button>
   </div>
   <div id="email-create-section" style="border:1px solid black">
      <h3>Create Account with Email</h3>
      <label for="create-email">Email</label>
      <input id="create-email" type="email" placeholder="Enter your email" required="">
      <label for="create-email">Password</label>
      <input id="create-password" type="password" placeholder="Enter your password" required="">
      <button id="submit-create-email">Create Account</button>
      <label id="create-email-error" style="color: #f2545b"></label>
   </div>
   <div>
      <button id="back-create-button">Back</button>
   </div>
   <hr style="margin: 20px 0">
</div>
<div id="customize-account-screen" class="screen hidden">
   <h2>Final Steps</h2>
   <label for="create-username">Username</label>
   <input id="create-username" type="text" placeholder="Pick a username" required="">
   <label for="create-picture">Profile Picture (optional)</label>
   <input id="create-picture" type="file" accept="image/*">
   <label for="create-bio">Bio (optional)</label>   
   <textarea id="create-bio" rows="8" columns="50" height="100px">I'm a yapper</textarea>
   <button id="submit-customize">Save</button>
</div>
<div id="stay-login-screen" class="screen hidden">
   <h2>Would you like to stay logged in?</h2>
   <h3>Any future logins on this site will automatically sign you into your account</h3>
   <div id="stay-login-buttons" style="justify-content: space-between; align-items: center;">
      <button id="stay-yes" style="width: 20%">Yes</button>
      <button id="stay-no" style="width: 20%">No</button>
      <button id="stay-forget" style="width: 20%">Don't Bother Me</button>
   </div>
</div>
<div id="main-screen" class="screen">
   <h2>Welcome to Yap Window</h2>
   <p>Press CTRL-ALT-D to switch between light and dark mode</p>
   <button id="login-button">Log In</button>
   <button id="create-account-button">Create Account</button>
   <p>By using Yap Window, you agree to the Terms and Conditions at https://docs.google.com/document/d/1nsVWJ94ijnRRsyV_mCkdVdXvuOvg6c4bk9PBP-L2NaI<\p>
</div>
<div id="saved-account" class="screen hidden">
   <h2>You have an account saved on this computer</h2>
   <p id="saved-email">Email: _______</p>
   <p id="saved-username">Username: _______</p>
   <button id="saved-login-button">Okay</button>
   <button id="saved-signout-button">Sign Out</button>
</div>
<div id="chat-screen" class="chat hidden">
  <div id="settings-bar">
    <button id="customize-profile" class="setting-button">Profile</button>
    <button id="dark-mode" class="setting-button">${isDark ? "Light Mode" : "Dark Mode"}</button>
    <button id="read-all" class="setting-button">Read All</button>
    <button id="hide-left-sidebar" class="setting-button">Hide Left Sidebar</button>
  </div>
  <div id="lower-chat" class="chat">
    <div id="left-sidebar">
      <div id="top-left-sidebar">
        <button id="create-new-server">Create New Server</button>
        <div id="server-list">
          <div class="server" id="general-server">General</div>
        </div>
      </div>
      <div id="bottom-left-sidebar">
        <div id="dm-list">
        </div>
      </div>
    </div>
    <div id="right-sidebar">
      <div id="messages">
      </div>
      <div id="message-send">
        <p id="typing-indicator"></p>
        <input type="text" id="message-input" autocomplete="off" placeholder="Yap away..."/>
        <button id="send-button">Send</button>
      </div>
    </div>
  </div>
</div>
<div id="channel-screen" class="screen hidden">
    <h2>Create/Customize Channel</h2>
    <label for="channel-name">Channel Name</label>
    <input id="channel-name" type="text" placeholder="Name your channel..." required>
    
    <label for="channel-type">Channel Type</label>
    <select id="channel-type">
        <option value="Public">Public</option>
        <option value="Private">Private</option>
    </select>
    
    <div id="members-container" style="display: none;">
        <label>Select Members</label>
        <div id="selected-members" class="selected-members-container"></div>
        <div class="members-dropdown">
            <input type="text" id="member-search" placeholder="Type Emails Here...">
            <div id="members-list" class="members-list"></div>
        </div>
    </div>
    
    <label for="channel-description">Description/Rules (optional)</label>   
    <textarea id="channel-description" rows="8" columns="50"></textarea>
    <button id="submit-channel">Save</button>
   <button id="back-channel">Back</button>
</div>
<p style="display: none" id="email-saved-here"></p>
      `;
  document.body.appendChild(gui);

  /* Make the GUI draggable */
  const header = gui.querySelector("#bookmarklet-gui-header");
  const enableDragging = () => {
    header.onmousedown = function (e) {
      const offsetX = e.clientX - gui.offsetLeft;
      const offsetY = e.clientY - gui.offsetTop;
      document.onmousemove = function (e) {
        gui.style.left = `${e.clientX - offsetX}px`;
        gui.style.top = `${e.clientY - offsetY}px`;
      };
      document.onmouseup = function () {
        document.onmousemove = null;
      };
    };
  };
  enableDragging();

  /* Close button functionality */
  gui.querySelector("#bookmarklet-close").onclick = function () {
    gui.remove();
  };
  gui.querySelector("#bookmarklet-minimize").onclick = function () {
    gui.style.transition = "all 0.3s ease";
    gui.style.opacity = "0";

    setTimeout(() => {
      gui.style.display = "none";
    }, 300);
  };

  /* Fullscreen functionality */
  gui.querySelector("#bookmarklet-fullscreen").onclick = function (e) {
    const isFullscreen = e.target.innerHTML === "⿻";
    if (!isFullscreen) {
      originalState = {
        width: gui.style.width,
        height: gui.style.height,
        top: gui.style.top,
        left: gui.style.left,
        transform: gui.style.transform,
      };
      gui.style.position = "fixed";
      gui.style.width = "100%";
      gui.style.height = "100%";
      gui.style.top = "0";
      gui.style.left = "0";
      gui.style.transform = "none";
      gui.style.resize = "none";
      header.onmousedown = null;
      e.target.innerHTML = "⿻";
    } else {
      gui.style.width = originalState.width;
      gui.style.height = originalState.height;
      gui.style.top = originalState.top;
      gui.style.left = originalState.left;
      gui.style.transform = originalState.transform;
      gui.style.resize = "both";
      enableDragging();
      e.target.innerHTML = "⛶";
    }
  };

  document
    .getElementById("dark-mode")
    ?.addEventListener("click", toggleDarkMode);
})();
