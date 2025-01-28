(async function () {
  var email = document.getElementById("email-saved-here").textContent;
  var username;
  /* Firebase Config */
  const firebaseConfig = {
    apiKey: "AIzaSyA48Uv_v5c7-OCnkQ8nBkjIW8MN4STDcJs",
    authDomain: "noise-75cba.firebaseapp.com",
    databaseURL: "https://noise-75cba-default-rtdb.firebaseio.com",
    projectId: "noise-75cba",
    storageBucket: "noise-75cba.appspot.com",
    messagingSenderId: "1092146908435",
    appId: "1:1092146908435:web:f72b90362cc86c5f83dee6",
  };
  /* Check if the GUI is already open */
  var database, auth, provider, email;
  try {
    /* Dynamically load Firebase modules */
    var { initializeApp } = await import(
      "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js"
    );
    const sc = document.createElement("script");
    sc.setAttribute(
      "src",
      "https://cdn.jsdelivr.net/npm/emoji-toolkit@8.0.0/lib/js/joypixels.min.js",
    );
    document.head.appendChild(sc);
    const ss = document.createElement("stylesheet");
    sc.setAttribute(
      "href",
      "https://cdn.jsdelivr.net/npm/emoji-toolkit@8.0.0/extras/css/joypixels.min.css",
    );
    document.head.appendChild(ss);
    var {
      getAuth,
      GoogleAuthProvider,
      createUserWithEmailAndPassword,
      signInWithPopup,
      signInWithEmailAndPassword,
    } = await import(
      "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js"
    );
    var { getDatabase, get, ref, set, onValue, push, update, remove, child } =
      await import(
        "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js"
      );
    /* Initialize Firebase app */
    var app = initializeApp(firebaseConfig); /* Initialize Firebase services */
    database = getDatabase(app);
    auth = getAuth(app);
    var provider = new GoogleAuthProvider();
  } catch (error) {
    console.error("Error initializing Firebase:", error);
    alert("Firebase initialization failed. Check the console for details.");
    return;
  }

  const gui = document.getElementById("bookmarklet-gui");
  chatScreen = document.getElementById("chat-screen");
  chatScreen.style.display = "flex";

  async function checkForUpdates() {
    const userRef = ref(
      database,
      `Accounts/${email.replace(/\./g, "*")}/Version`,
    );
    const updatesRef = ref(database, "Updates");

    const userVersionSnapshot = await get(userRef);
    const updatesSnapshot = await get(updatesRef);

    if (!userVersionSnapshot.exists() || !updatesSnapshot.exists()) {
      console.error("Failed to fetch user version or updates.");
      return;
    }

    const userVersionData =
      userVersionSnapshot.val().replace("*", ".") || "1.0";
    const updates = updatesSnapshot.val();

    const userVersion = userVersionData.split(".").map(Number);
    const versionKeys = Object.keys(updates)
      .map((v) => v.replace("*", ".").split(".").map(Number))
      .filter((version) => {
        for (let i = 0; i < Math.max(version.length, userVersion.length); i++) {
          const vPart = version[i] || 0;
          const cPart = userVersion[i] || 0;
          if (vPart > cPart) return true;
          if (vPart < cPart) return false;
        }
        return false;
      });

    if (versionKeys.length > 0) {
      const newUpdates = versionKeys.map((version) => version.join("*"));
      showUpdatePopup(updates, newUpdates);
    }
  }

  function showUpdatePopup(updates, newUpdates) {
    let isDark = localStorage.getItem("bookmarklet-mode") === "dark";
    const popup = document.createElement("div");
    popup.classList.add("update-popup");
    popup.style.position = "fixed";
    popup.style.top = "10%";
    popup.style.left = "50%";
    popup.style.transform = "translateX(-50%)";
    popup.style.backgroundColor = isDark ? "#2c2c2c" : "#fff";
    popup.style.color = isDark ? "#eaeaea" : "#333";
    popup.style.padding = "20px";
    popup.style.borderRadius = "8px";
    popup.style.boxShadow = isDark
      ? "0 4px 8px rgba(0, 0, 0, 0.6)"
      : "0 4px 8px rgba(0, 0, 0, 0.1)";
    popup.style.zIndex = "100000";
    popup.style.maxWidth = "300px";
    popup.style.maxHeight = "250px";
    popup.style.overflowY = "auto";

    const title = document.createElement("h3");
    title.textContent = "New Updates!";
    popup.appendChild(title);

    newUpdates.forEach((version) => {
      const update = updates[version];

      const updateElement = document.createElement("div");

      const updateHeader = document.createElement("strong");
      updateHeader.textContent = `Update ${version.replace("*", ".")}`;

      const updateDate = document.createElement("small");
      updateDate.textContent = ` (${new Date(update.Date).toLocaleDateString()})`;

      const updateDescription = document.createElement("p");
      updateDescription.textContent = update.Description;

      updateElement.appendChild(updateHeader);
      updateElement.appendChild(updateDate);
      updateElement.appendChild(updateDescription);
      popup.appendChild(updateElement);
    });

    const closeButton = document.createElement("button");
    closeButton.style.backgroundColor = isDark ? "#4c4c4c" : "#eee";
    closeButton.textContent = "Close";
    closeButton.onclick = () => popup.remove();
    popup.appendChild(closeButton);

    document.getElementById("chat-screen").appendChild(popup);

    const mostRecentVersion = newUpdates[newUpdates.length - 1];
    set(
      ref(database, `Accounts/${email.replace(/\./g, "*")}/Version`),
      mostRecentVersion,
    );
  }

  async function fetchChatList() {
    const chatRef = ref(database, "Chat Info");

    onValue(chatRef, (snapshot) => {
      const chatData = snapshot.val();
      if (chatData) {
        populateSidebar(chatData);
      }
    });
  }
  var currentChat = "General";
  let currentChatListener = null;

  function populateSidebar(chatData) {
    const sidebar = document.getElementById("server-list");
    sidebar.innerHTML = "";

    for (const [chatName, chatInfo] of Object.entries(chatData)) {
      const { Description, Members, Type } = chatInfo;

      if (
        Type === "Public" ||
        (Type === "Private" &&
          Members.split(", ").includes(`${email.replace(/\./g, "*")}`))
      ) {
        const chatElement = document.createElement("div");
        chatElement.className = "server";
        chatElement.textContent = chatName;
        chatElement.title = Description;

        chatElement.onclick = function () {
          loadMessages(chatName);
          document.getElementById("messages").scrollTop =
            messagesDiv.scrollHeight;
        };

        sidebar.appendChild(chatElement);
      }
    }
  }
  async function loadMessages(chatName) {
    const messagesDiv = document.getElementById("messages");
    messagesDiv.innerHTML = "";
    currentChat = chatName;

    if (currentChatListener) {
      currentChatListener();
      currentChatListener = null;
    }

    const messagesRef = ref(database, `Chats/${chatName}`);
    const appendedMessages = new Set();
    let loadedMessages = [];
    let isLoadingMore = false;
    let initialLoad = true;
    let oldestLoadedIndex = null;
    const MESSAGES_PER_LOAD = 50;

    messagesDiv.addEventListener("scroll", async () => {
      if (
        messagesDiv.scrollTop <= 100 &&
        !isLoadingMore &&
        loadedMessages.length > 0
      ) {
        isLoadingMore = true;

        if (oldestLoadedIndex > 0) {
          const oldScrollHeight = messagesDiv.scrollHeight;
          const oldScrollTop = messagesDiv.scrollTop;
          const oldClientHeight = messagesDiv.clientHeight;

          const olderMessages = loadedMessages.slice(
            Math.max(0, oldestLoadedIndex - MESSAGES_PER_LOAD),
            oldestLoadedIndex,
          );

          await appendMessages(olderMessages, true);
          oldestLoadedIndex = Math.max(
            0,
            oldestLoadedIndex - MESSAGES_PER_LOAD,
          );

          const newScrollHeight = messagesDiv.scrollHeight;
          const heightDifference = newScrollHeight - oldScrollHeight;
          messagesDiv.scrollTop = oldScrollTop + heightDifference;
        }
        isLoadingMore = false;
      }
    });

    function formatDate(dateString) {
      const messageDate = new Date(dateString);
      const now = new Date();
      const diffTime = now - messageDate;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        return `Today ${messageDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}`;
      } else if (diffDays === 1) {
        return `Yesterday ${messageDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}`;
      } else {
        return `${diffDays} days ago ${messageDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}`;
      }
    }

    async function appendMessages(newMessages, prepend = false) {
      if (currentChat !== chatName) return;

      let lastUser = null;
      let lastTimestamp = null;
      let lastMessageDiv = null;

      const fragment = document.createDocumentFragment();

      const messagesToProcess = prepend
        ? [...newMessages].reverse()
        : newMessages;

      if (!prepend && messagesDiv.children.length > 0) {
        lastMessageDiv = messagesDiv.lastChild;
        lastUser = lastMessageDiv.dataset.user;
        lastTimestamp = new Date(lastMessageDiv.dataset.date);
      }

      const wasNearBottom =
        messagesDiv.scrollHeight -
          messagesDiv.scrollTop -
          messagesDiv.clientHeight <=
        20;

      for (const message of messagesToProcess) {
        if (appendedMessages.has(message.id)) continue;

        const messageDate = new Date(message.Date);
        const username = message.User;
        const isSameUser = username === lastUser;
        const isCloseInTime =
          lastTimestamp && messageDate - lastTimestamp < 5 * 60 * 1000;

        if (!isSameUser || !isCloseInTime || !lastMessageDiv) {
          const messageDiv = document.createElement("div");
          messageDiv.classList.add("message");
          messageDiv.classList.add(
            message.User === email ? "sent" : "received",
          );
if (message.User !== email && (!readMessages[currentChat] || message.id > readMessages[currentChat])) {
  messageDiv.classList.add('unread');
}
          messageDiv.style.marginTop = "10px";
          messageDiv.dataset.messageId = message.id;
          messageDiv.dataset.user = username;
          messageDiv.dataset.date = messageDate;

          const headerInfo = document.createElement("p");
          headerInfo.className = "send-info";
          headerInfo.textContent = `${username}   ${formatDate(message.Date)}`;
          messageDiv.appendChild(headerInfo);

          const messageContent = document.createElement("p");
          messageContent.textContent = message.Message;
          messageContent.style.marginTop = "5px";
          messageDiv.appendChild(messageContent);

          if (prepend) {
            fragment.insertBefore(messageDiv, fragment.firstChild);
          } else {
            fragment.appendChild(messageDiv);
          }
          lastMessageDiv = messageDiv;
        } else {
          const messageContent = document.createElement("p");
          messageContent.textContent = message.Message;
          messageContent.style.marginTop = "5px";
          lastMessageDiv.appendChild(messageContent);
        }

        lastUser = username;
        lastTimestamp = messageDate;
        appendedMessages.add(message.id);
      }

      if (prepend) {
        const oldScrollHeight = messagesDiv.scrollHeight;
        messagesDiv.insertBefore(fragment, messagesDiv.firstChild);
        const newScrollHeight = messagesDiv.scrollHeight;
        messagesDiv.scrollTop += newScrollHeight - oldScrollHeight;
      } else {
        messagesDiv.appendChild(fragment);
        if (initialLoad || wasNearBottom) {
          requestAnimationFrame(() => {
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
          });
        }
      }
    }

    currentChatListener = onValue(messagesRef, async (snapshot) => {
      const messages = snapshot.val();
      if (messages && currentChat === chatName) {
        const sortedMessages = Object.keys(messages)
          .map((messageId) => ({
            id: messageId,
            ...messages[messageId],
          }))
          .sort((a, b) => new Date(a.Date) - new Date(b.Date));

        loadedMessages = sortedMessages;

        if (initialLoad) {
          messagesDiv.innerHTML = "";
          appendedMessages.clear();
          const recentMessages = sortedMessages.slice(-MESSAGES_PER_LOAD);
          oldestLoadedIndex = Math.max(
            0,
            sortedMessages.length - MESSAGES_PER_LOAD,
          );
          await appendMessages(recentMessages);
          initialLoad = false;
        } else {
          const wasNearBottom =
            messagesDiv.scrollHeight -
              messagesDiv.scrollTop -
              messagesDiv.clientHeight <=
            20;

          const lastDisplayedMessage = Array.from(messagesDiv.children)
            .filter((el) => el.dataset.messageId)
            .pop();

          if (lastDisplayedMessage) {
            const lastMessageId = lastDisplayedMessage.dataset.messageId;
            const lastMessageIndex = sortedMessages.findIndex(
              (msg) => msg.id === lastMessageId,
            );

            if (lastMessageIndex !== -1) {
              const newMessages = sortedMessages.slice(lastMessageIndex + 1);
              if (newMessages.length > 0) {
                await appendMessages(newMessages);
                if (wasNearBottom) {
                  requestAnimationFrame(() => {
                    messagesDiv.scrollTop = messagesDiv.scrollHeight;
                  });
                }
              }
            }
          }
        }
      }
    });
  }

  /* Function to send a message */
  async function sendMessage() {
    const messagesRef = ref(database, `Chats/${currentChat}`);
    const messageInput = document.getElementById("message-input");
    let message = messageInput.value.trim();
    message = convertHtmlToEmoji(joypixels.shortnameToImage(message));
    if (message) {
      const newMessageRef = push(messagesRef);
      await update(newMessageRef, {
        User: email,
        Message: message,
        Date: Date.now(),
      });
      messageInput.value = "";
    }
  }
  function convertHtmlToEmoji(inputString) {
    return inputString.replace(
      /<img[^>]*alt="([^"]*)"[^>]*>/g,
      (match, altText) => {
        return altText || match;
      },
    );
  }

  function formatDate(timestamp) {
    const messageDate = new Date(timestamp);
    const today = new Date();
    const diffTime = today - messageDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "One day ago";
    } else {
      return `${diffDays} days ago`;
    }
  }
  checkForUpdates();

  /* Attach send message functionality to the button */
  const sendButton = document.getElementById("send-button");
  sendButton.addEventListener("click", sendMessage);

  const messageInput = document.getElementById("message-input");
  messageInput.addEventListener("input", (e) => {
    e.target.value = convertHtmlToEmoji(
      joypixels.shortnameToImage(e.target.value),
    );
    e.target.value = e.target.value.substring(0, 1000);
  });

  /* Add Enter key functionality */
  messageInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  });

  document
    .getElementById("create-new-server")
    .addEventListener("click", async function () {
      chatScreen.style.display = "none";
      document.getElementById("channel-screen").classList.remove("hidden");
      const channelType = document.getElementById("channel-type");
      const channelMembers = document.getElementById("channel-members");
      const channelName = document.getElementById("channel-name");
      const channelDescription = document.getElementById("channel-description");
      const submitButton = document.getElementById("submit-channel");
      const backButton = document.getElementById("back-channel");

      document
        .getElementById("channel-type")
        .addEventListener("change", function () {
          const membersContainer = document.getElementById("members-container");
          if (this.value === "Public") {
            membersContainer.style.display = "none";
          } else {
            membersContainer.style.display = "block";
            loadMemberOptions();
          }
        });

      async function loadMemberOptions() {
        const membersContainer = document.getElementById("members-container");
        const membersList = document.getElementById("members-list");
        const memberSearch = document.getElementById("member-search");
        const selectedMembers = document.getElementById("selected-members");
        let availableMembers = [];

        const accountsRef = ref(database, "Accounts");
        try {
          const snapshot = await get(accountsRef);
          const accounts = snapshot.val();

          availableMembers = Object.keys(accounts)
            .filter(
              (accountEmail) => accountEmail !== email.replace(/\./g, "*"),
            )
            .map((accountEmail) => ({
              id: accountEmail,
              email: accountEmail.replace(/\*/g, "."),
            }));

          renderMembersList(availableMembers);
        } catch (error) {
          console.error("Error loading members:", error);
        }

        function renderMembersList(members) {
          membersList.innerHTML = "";
          members.forEach((member) => {
            const option = document.createElement("div");
            option.className = "member-option";
            option.textContent = member.email;
            option.onclick = () => addMember(member);
            membersList.appendChild(option);
          });
        }

        function addMember(member) {
          const memberElement = document.createElement("div");
          memberElement.className = "selected-member";
          memberElement.innerHTML = `
            ${member.email}
            <span class="remove-member" onclick="this.parentElement.remove()">×</span>
        `;
          selectedMembers.appendChild(memberElement);
          membersList.style.display = "none";
          memberSearch.value = "";
        }

        memberSearch.onfocus = () => {
          membersList.style.display = "block";
        };

        document.addEventListener("click", (e) => {
          if (!membersContainer.contains(e.target)) {
            membersList.style.display = "none";
          }
        });

        memberSearch.oninput = (e) => {
          const searchTerm = e.target.value.toLowerCase();
          const filteredMembers = availableMembers.filter((member) =>
            member.email.toLowerCase().includes(searchTerm),
          );
          renderMembersList(filteredMembers);
          membersList.style.display = "block";
        };
      }

      submitButton.addEventListener("click", async function () {
        const name = channelName.value.trim();
        const type = channelType.value;
        const description = channelDescription.value.trim();

        if (!name) {
          alert("Please enter a channel name");
          return;
        }

        let members = [];
        members.push(email.replace(/\./g, "*"));

        if (type === "Private") {
          const selectedMemberElements =
            document.querySelectorAll(".selected-member");
          if (selectedMemberElements.length === 0) {
            alert("Please select at least one member for private channel");
            return;
          }
          members = members.concat(
            Array.from(selectedMemberElements).map((el) =>
              el.textContent.trim().replace(/×$/, "").replace(/\./g, "*"),
            ),
          );
        }

        const channelData = {
          Description: description || "No description provided",
          Members: type === "Private" ? members.join(", ") : "None",
          Type: type,
        };

        try {
          const newChannelRef = ref(database, `Chat Info/${name}`);
          await set(newChannelRef, channelData);

          channelName.value = "";
          channelDescription.value = "";
          channelType.value = "Public";
          document.getElementById("channel-screen").classList.add("hidden");
          chatScreen.style.display = "flex";
        } catch (error) {
          console.error("Error creating channel:", error);
          alert("Error creating channel. Please try again.");
        }
      });
      backButton.addEventListener("click", async function () {
        channelName.value = "";
        channelDescription.value = "";
        channelType.value = "Public";
        document.getElementById("channel-screen").classList.add("hidden");
        chatScreen.style.display = "flex";
      });

      channelType.value = "Public";
      channelMembers.disabled = true;
    });

  /* Load existing messages */
  fetchChatList();
  loadMessages("General");
  const messagesDiv = document.getElementById("messages");
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
})();
