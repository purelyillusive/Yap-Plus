(async function () {
  var email = document.getElementById("email-saved-here").textContent;
  var username;
  var readMessages = {};
  var readAll = true;
  var isDark = false;
  const BOT_USERS = {
    AI: "[AI]",
    RNG: "[RNG]",
    EOD: "[EOD]",
  };
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
  chatScreen.classList.remove("hidden");

  async function initializeReadMessages() {
    const readMessagesRef = ref(
      database,
      `Accounts/${email.replace(/\./g, "*")}/readMessages`,
    );
    const snapshot = await get(readMessagesRef);
    readMessages = snapshot.val() || {};
    return readMessages;
  }

  function updateReadAllStatus() {
    const allChats = document.querySelectorAll(".server");
    readAll = true;

    allChats.forEach((chat) => {
      const unreadCount = parseInt(chat.getAttribute("data-unread") || "0");
      if (unreadCount > 0) {
        readAll = false;
      }
    });
    updateFavicon();
  }
  async function setupDarkModeDetection() {
    const waitForGui = () => {
      return new Promise((resolve) => {
        const checkGui = () => {
          const gui = document.getElementById("bookmarklet-gui");
          if (gui) {
            resolve(gui);
          } else {
            setTimeout(checkGui, 100);
          }
        };
        checkGui();
      });
    };

    const gui = await waitForGui();
    if (!gui) return;

    function detectDarkMode() {
      const style = window.getComputedStyle(gui);
      return (
        style.backgroundColor.includes("51, 51, 51") ||
        style.backgroundColor.includes("#333")
      );
    }

    function updateBadgeStyles() {
      const badges = document.querySelectorAll(".unread-badge");
      badges.forEach((badge) => {
        badge.style.backgroundColor = isDark ? "#ff6b6b" : "#ff4444";
        badge.style.color = "white";
      });
    }

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "style"
        ) {
          isDark = detectDarkMode();
          updateBadgeStyles();
        }
      });
    });

    observer.observe(gui, {
      attributes: true,
      attributeFilter: ["style"],
    });

    isDark = detectDarkMode();
    updateBadgeStyles();
  }

  async function scrollToFirstUnread(chatName) {
    const messagesDiv = document.getElementById("messages");

    await new Promise((resolve) => {
      const checkMessages = () => {
        if (messagesDiv.children.length > 0) {
          resolve();
        } else {
          setTimeout(checkMessages, 50);
        }
      };
      checkMessages();
    });

    let findUnreadMessage = async () => {
      let unreadMessages = Array.from(
        document.querySelectorAll(".message.unread"),
      );
      if (unreadMessages.length === 0) {
        return null;
      }
      return unreadMessages[0];
    };

    const firstUnread = await findUnreadMessage();
    if (!firstUnread) return;

    const smoothScroll = () => {
      const targetPosition =
        firstUnread.offsetTop - messagesDiv.clientHeight / 3;
      const startPosition = messagesDiv.scrollTop;
      const distance = targetPosition - startPosition;
      const duration = 500;
      let start = null;

      const animation = (currentTime) => {
        if (!start) start = currentTime;
        const progress = (currentTime - start) / duration;

        if (progress < 1) {
          const ease = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);
          const currentPosition = startPosition + distance * ease(progress);
          messagesDiv.scrollTop = currentPosition;
          window.requestAnimationFrame(animation);
        } else {
          messagesDiv.scrollTop = targetPosition;
        }
      };

      window.requestAnimationFrame(animation);
    };

    try {
      smoothScroll();
    } catch (error) {
      console.error("Error during smooth scroll:", error);
      firstUnread.scrollIntoView({ block: "center", behavior: "smooth" });
    }

    await new Promise((resolve) => setTimeout(resolve, 100));
    const unreadMessages = document.querySelectorAll(".message.unread");
    unreadMessages.forEach((msg) => {
      if (!msg.classList.contains("unread")) {
        msg.classList.add("unread");
      }
    });
  }

  async function updateFavicon() {
    const currentUrl = window.location.href;
    const hasUnreadMessages = !readAll;

    let link = document.querySelector(
      'link[rel="icon"], link[rel="shortcut icon"]',
    );
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }

    if (hasUnreadMessages) {
      let notificationIconPath;

      if (currentUrl.includes("lakesideschool.instructure.com")) {
        iconUrl =
          "https://raw.githubusercontent.com/TheHumblePotato/Yap-Window/main/Favicon/CanvasNotification.png";
      } else if (currentUrl.includes("google.com")) {
        iconUrl =
          "https://raw.githubusercontent.com/TheHumblePotato/Yap-Window/main/Favicon/GoogleNotification.png";
      }

      if (iconUrl) {
        try {
          link.href = iconUrl;
        } catch (error) {
          console.error("Error loading notification favicon:", error);
        }
      }
    } else {
      if (currentUrl.includes("lakesideschool.instructure.com")) {
        link.href =
          "https://instructure-uploads-pdx.s3.us-west-2.amazonaws.com/account_211800000000000001/attachments/3701/smallershield.png";
      } else if (currentUrl.includes("google.com")) {
        link.href = "https://google.com/favicon.ico";
      }
    }
  }

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
      if (version == "2*2") {
        version = "3*7";
      }
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
    closeButton.style.backgroundColor = isDark ? "#bf21a7" : "#fc8dec";
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

    onValue(chatRef, async (snapshot) => {
      const chatData = snapshot.val();
      if (chatData) {
        await populateSidebar(chatData);
        const generalServer = Array.from(
          document.querySelectorAll(".server"),
        ).find((server) => server.textContent.trim() === "General");
        if (generalServer) {
          generalServer.classList.add("selected");
        }
      }
    });
  }

  var currentChat = "General";
  let currentChatListener = null;

  async function populateSidebar(chatData) {
    if (Object.keys(readMessages).length === 0) {
      await initializeReadMessages();
    }

    const sidebar = document.getElementById("server-list");
    sidebar.innerHTML = "";

    const chatElements = new Map();

    for (const [chatName, chatInfo] of Object.entries(chatData)) {
      const { Description, Members, Type } = chatInfo;
      const memberList =
        Type === "Private"
          ? Members.split(",").map((m) => m.trim().replace(/\s+/g, ""))
          : [];

      if (
        Type === "Public" ||
        (Type === "Private" && memberList.includes(email.replace(/\./g, "*")))
      ) {
        const chatElement = document.createElement("div");
        chatElement.className = "server";
        chatElement.textContent = chatName;
        chatElement.title = Description;

        const badge = document.createElement("span");
        badge.className = "unread-badge";
        badge.style.display = "none";
        badge.style.backgroundColor = isDark ? "#ff6b6b" : "#ff4444";
        badge.style.color = "white";
        badge.style.borderRadius = "10px";
        badge.style.padding = "2px 6px";
        badge.style.fontSize = "12px";
        badge.style.marginLeft = "5px";
        chatElement.appendChild(badge);

        chatElement.onclick = function () {
          document
            .querySelectorAll(".server")
            .forEach((s) => s.classList.remove("selected"));
          this.classList.add("selected");
          loadMessages(chatName);
          updateUnreadCount(chatName);
        };

        sidebar.appendChild(chatElement);
        chatElements.set(chatName, chatElement);
      }
    }

    chatElements.forEach((element, chatName) => {
      const chatRef = ref(database, `Chats/${chatName}`);
      onValue(chatRef, async (snapshot) => {
        const messages = snapshot.val() || {};
        const lastReadMessage = readMessages[chatName] || "";
        let unreadCount = 0;

        Object.entries(messages).forEach(([messageId, message]) => {
          if (
            message.User !== email &&
            (!lastReadMessage || messageId > lastReadMessage)
          ) {
            unreadCount++;
          }
        });

        const badge = element.querySelector(".unread-badge");
        element.setAttribute("data-unread", unreadCount);

        if (unreadCount > 0) {
          badge.textContent = unreadCount > 99 ? "99+" : unreadCount;
          badge.style.display = "inline";
        } else {
          badge.style.display = "none";
        }
      });
    });

    updateReadAllStatus();
  }

  async function updateUnreadCount(chatName) {
    const chatRef = ref(database, `Chats/${chatName}`);
    const snapshot = await get(chatRef);
    const messages = snapshot.val() || {};

    const accountRef = ref(
      database,
      `Accounts/${email.replace(/\./g, "*")}/readMessages/${chatName}`,
    );
    const lastReadSnapshot = await get(accountRef);
    const lastReadMessage = lastReadSnapshot.val() || "";
    let unreadCount = 0;

    const sortedMessages = Object.entries(messages).sort(
      ([, a], [, b]) => new Date(a.Date) - new Date(b.Date),
    );

    let lastReadIndex = -1;
    sortedMessages.forEach(([messageId, message], index) => {
      if (messageId === lastReadMessage) {
        lastReadIndex = index;
      }
    });

    sortedMessages.forEach(([messageId, message], index) => {
      if (message.User !== email && index > lastReadIndex) {
        unreadCount++;
      }
    });

    const chatElement = Array.from(document.querySelectorAll(".server")).find(
      (el) => el.textContent.trim().includes(chatName.trim()),
    );

    if (chatElement) {
      const badge = chatElement.querySelector(".unread-badge");
      chatElement.setAttribute("data-unread", unreadCount);

      if (unreadCount > 0) {
        badge.textContent = unreadCount > 99 ? "99+" : unreadCount;
        badge.style.display = "inline";
      } else {
        badge.style.display = "none";
      }

      if (badge) {
        badge.style.backgroundColor = isDark ? "#ff6b6b" : "#ff4444";
        badge.style.color = "white";
      }
    }

    updateReadAllStatus();
  }
  async function loadMessages(chatName) {
    document.getElementById("bookmarklet-gui").scrollTop = 0;
    const messagesDiv = document.getElementById("messages");
    messagesDiv.innerHTML = "";
    currentChat = chatName;

    const chatRef = ref(database, `Chats/${chatName}`);
    const snapshot = await get(chatRef);
    const messages = snapshot.val();
    if (messages) {
      const messageIds = Object.keys(messages).sort();
      if (messageIds.length > 0) {
        const latestMessageId = messageIds[messageIds.length - 1];
        await markMessagesAsRead(chatName, latestMessageId);
      }
    }

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
    const MESSAGES_PER_LOAD = 100;

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

      const messageMidnight = new Date(
        messageDate.getFullYear(),
        messageDate.getMonth(),
        messageDate.getDate(),
      );
      const todayMidnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
      );

      const diffTime = todayMidnight - messageMidnight;
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
      const lastReadMessage = readMessages[chatName] || "";

      const fragment = document.createDocumentFragment();

      const messagesToProcess = prepend ? newMessages : [...newMessages];
      messagesToProcess.sort((a, b) => new Date(a.Date) - new Date(b.Date));

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
          if (Object.values(BOT_USERS).includes(message.User)) {
            messageDiv.classList.add("bot");
            if (!lastReadMessage || message.id > lastReadMessage) {
              messageDiv.classList.add("unread");
            } else {
              messageDiv.classList.remove("unread");
            }
          } else if (message.User === email) {
            messageDiv.classList.add("sent");
          } else {
            messageDiv.classList.add("received");
            if (!lastReadMessage || message.id > lastReadMessage) {
              messageDiv.classList.add("unread");
            } else {
              messageDiv.classList.remove("unread");
            }
          }

          messageDiv.style.marginTop = "10px";
          messageDiv.dataset.messageId = message.id;
          messageDiv.dataset.user = username;
          messageDiv.dataset.date = messageDate;
          messageDiv.dataset.lastMessageId = message.id;

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
          lastMessageDiv.dataset.lastMessageId = message.id;
          if (
            message.User !== email &&
            (!lastReadMessage || message.id > lastReadMessage)
          ) {
            lastMessageDiv.classList.add("unread");
          }
        }
        document.getElementById("bookmarklet-gui").scrollTop = 0;
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
      document.getElementById("bookmarklet-gui").scrollTop = 0;
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
          setTimeout(async () => {
            await scrollToFirstUnread(chatName);
          }, 100);
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

  async function markMessagesAsRead(chatName, messageId) {
    const messageElement = document.querySelector(
      `[data-message-id="${messageId}"]`,
    );
    if (!messageElement) return;

    const lastMessageId = messageElement.dataset.lastMessageId;
    if (!lastMessageId) return;

    const currentLastRead = readMessages[chatName] || "";
    if (currentLastRead && lastMessageId <= currentLastRead) return;

    readMessages[chatName] = lastMessageId;

    const readMessagesRef = ref(
      database,
      `Accounts/${email.replace(/\./g, "*")}/readMessages/${chatName}`,
    );
    await set(readMessagesRef, lastMessageId);

    document.querySelectorAll(".message").forEach((msg) => {
      const msgId = msg.dataset.lastMessageId;
      const msgUser = msg.dataset.user;
      if (msgId && msgId <= lastMessageId && msgUser !== email) {
        msg.classList.remove("unread");
      }
    });
    document.getElementById("bookmarklet-gui").scrollTop = 0;
    await updateUnreadCount(chatName);
  }

  /* Function to send a message */
  async function sendMessage() {
    const messagesRef = ref(database, `Chats/${currentChat}`);
    const messageInput = document.getElementById("message-input");
    let message = messageInput.value.trim();
    message = convertHtmlToEmoji(joypixels.shortnameToImage(message));

    if (message) {
      messageInput.value = "";
      if (message.toLowerCase().startsWith("/ai ")) {
        let d = Date.now();
        const question = message.substring(4).trim();

        const messagesSnapshot = await get(messagesRef);
        const messages = messagesSnapshot.val() || {};
        const messageEntries = Object.entries(messages)
          .sort((a, b) => new Date(a[1].Date) - new Date(b[1].Date))
          .slice(-20);

        const userMessageRef = push(messagesRef);
        await update(userMessageRef, {
          User: email,
          Message: message,
          Date: d,
        });

        const API_KEYS = [
          "AIzaSyDJEIVUqeVkrbtMPnBvB8QWd9VuUQQQBjg",
          "AIzaSyB42CD-hXRnfq3eNpLWnF9at5kHePI5qgQ",
          "AIzaSyAzipn1IBvbNyQUiiJq6cAkE6hAlShce94",
          "AIzaSyBkR_XbsH9F-eWarriJ8Vc1KqmjEWhh7-s",
          "AIzaSyAT94ASgr96OQuR9GjVxpS1pee5o5CZ6H0",
          "AIzaSyC1fFINANR_tuOM18Lo3HF9WXosX-6BHLM",
          "AIzaSyCJeCvi3Br0gPVH0ccL279wSkAEjOdlnx4",
        ];

        const chatHistory = messageEntries
          .map(([id, msg]) => {
            return `${msg.User}: ${msg.Message}`;
          })
          .join("\n");

        const fullPrompt = `The following is a chat log for context. Most of the users are 7th graders in Lakeside school in Washington, US. Please do not assume genders or age of anyone. Messages from "[AI]" are past responses you have given, but you do not have memory of them.

Current User: ${email}

Chat Log:
${chatHistory}

Now, respond to the user's question naturally:
User: ${question}

First, reverse your real answer so that you are saying the opposite of what you want to say. 1+1=2 would become something like 1+1=potato. 
Then, make your responce more sarcastic, like, much more sarcastic. ONLY reply with this final sarcastic responce`;

        let aiReply = null;
        let successfulRequest = false;

        for (const API_KEY of API_KEYS) {
          try {
            const response = await fetch(
              "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=" +
                API_KEY,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
                }),
              },
            ).then((res) => res.json());

            const responseText =
              response.candidates?.[0]?.content?.parts?.[0]?.text;
            if (responseText && responseText.trim() !== "") {
              aiReply = responseText;
              successfulRequest = true;
              break;
            }
          } catch (error) {
            console.error(`Error with API key ${API_KEY}:`, error);
          }
        }

        if (!successfulRequest) {
          aiReply =
            "Sorry, AI assistance is temporarily unavailable. Please try again later.";
        }

        const aiMessageRef = push(messagesRef);
        await update(aiMessageRef, {
          User: "[AI]",
          Message: aiReply,
          Date: d,
        });
      } else if (message.toLowerCase().startsWith("/coinflip")) {
        const parts = message.split(" ");
        let headsChance = 50;
        let tailsChance = 50;

        if (parts.length === 3) {
          headsChance = parseFloat(parts[1]);
          tailsChance = parseFloat(parts[2]);

          if (headsChance + tailsChance !== 100) {
            const total = headsChance + tailsChance;
            if (total > 0) {
              headsChance = (headsChance / total) * 100;
              tailsChance = (tailsChance / total) * 100;
            } else {
              headsChance = 50;
              tailsChance = 50;
            }
          }
        }

        const userMessageRef = push(messagesRef);
        await update(userMessageRef, {
          User: email,
          Message: message,
          Date: Date.now(),
        });

        const random = Math.random() * 100;
        let result = random < headsChance ? "Heads" : "Tails";
        const chances = `(${headsChance.toFixed(1)}% Heads, ${tailsChance.toFixed(1)}% Tails)`;
        if (Math.floor(Math.random() * 37) == 0) {
          result = "THE RIM!";
        }
        const botMessageRef = push(messagesRef);
        await update(botMessageRef, {
          User: "[RNG]",
          Message: `🎲 Coin flip result: ${result}`,
          Date: Date.now(),
        });
      }else if (message.toLowerCase().startsWith("/eod")) {
    const parts = message.split(" ");
    let yesChance = 45;
    let noChance = 45;
    let maybeChance = 10;

    if (parts.length === 4) {
        yesChance = parseFloat(parts[1]);
        noChance = parseFloat(parts[2]);
        maybeChance = parseFloat(parts[3]);

        if (yesChance + noChance + maybeChance !== 100) {
            const total = yesChance + noChance + maybeChance;
            if (total > 0) {
                yesChance = (yesChance / total) * 100;
                noChance = (noChance / total) * 100;
                maybeChance = (maybeChance / total) * 100;
            } else {
                yesChance = 45;
                noChance = 45;
                maybeChance = 10;
            }
        }
    }

    const userMessageRef = push(messagesRef);
    await update(userMessageRef, {
        User: email,
        Message: message,
        Date: Date.now(),
    });

    const random = Math.random() * 100;
    let result = random < yesChance ? "Yes" : random < yesChance + noChance ? "No" : "Maybe";
    const chances = `(${yesChance.toFixed(1)}% Yes, ${noChance.toFixed(1)}% No, ${maybeChance.toFixed(1)}% Maybe)`;
    
    const botMessageRef = push(messagesRef);
    await update(botMessageRef, {
        User: "[RNG]",
        Message: `🎲 EOD decision: ${result}`,
        Date: Date.now(),
    });
        
      } else if (message.toLowerCase().startsWith("/roll ")) {
        const sides = parseInt(message.split(" ")[1]);

        const userMessageRef = push(messagesRef);
        await update(userMessageRef, {
          User: email,
          Message: message,
          Date: Date.now(),
        });

        if (isNaN(sides) || sides < 1) {
          const errorMessageRef = push(messagesRef);
          await update(errorMessageRef, {
            User: BOT_USERS.RNG,
            Message: "Please specify a valid number of sides (e.g., /roll 6)",
            Date: Date.now(),
          });
          return;
        }

        let result = Math.floor(Math.random() * sides) + 1;
        if (Math.floor(Math.random() * 3.7) == 0) {
          result = 37;
        }
        if (result == 37) {
          result = "37!!!";
        }
        const botMessageRef = push(messagesRef);
        await update(botMessageRef, {
          User: BOT_USERS.RNG,
          Message: `🎲 Rolling a ${sides}-sided die: ${result}`,
          Date: Date.now(),
        });
      } else {
        const newMessageRef = push(messagesRef);
        await update(newMessageRef, {
          User: email,
          Message: message,
          Date: Date.now(),
        });
      }

      messageInput.value = "";

      const snapshot = await get(messagesRef);
      const messages = snapshot.val() || {};

      const allMessageIds = Object.keys(messages).sort();
      if (allMessageIds.length > 0) {
        const latestMessageId = allMessageIds[allMessageIds.length - 1];
        await markMessagesAsRead(currentChat, latestMessageId);
      }
    }
    document.getElementById("bookmarklet-gui").scrollTop = 0;
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

  document.getElementById("messages").addEventListener("click", async (e) => {
    const messageElement = e.target.closest(".message");
    if (messageElement) {
      const messageId = messageElement.dataset.messageId;
      if (messageId) {
        await markMessagesAsRead(currentChat, messageId);
      }
    }
  });

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

  async function markAllMessagesAsRead() {
    try {
      document.querySelectorAll(".message.unread").forEach((msg) => {
        msg.classList.remove("unread");
      });

      document.querySelectorAll(".unread-badge").forEach((badge) => {
        badge.style.display = "none";
        badge.textContent = "0";
      });

      const chatInfoRef = ref(database, "Chat Info");
      const chatInfoSnapshot = await get(chatInfoRef);
      const chatInfo = chatInfoSnapshot.val();

      const readMessagesUpdates = {};

      for (const [chatName, chatDetails] of Object.entries(chatInfo)) {
        const isAccessible =
          chatDetails.Type === "Public" ||
          (chatDetails.Type === "Private" &&
            chatDetails.Members.split(",").includes(email.replace(/\./g, "*")));

        if (isAccessible) {
          const chatRef = ref(database, `Chats/${chatName}`);
          const chatSnapshot = await get(chatRef);
          const messages = chatSnapshot.val();

          if (messages) {
            const messageIds = Object.keys(messages).sort();
            const latestMessageId = messageIds[messageIds.length - 1];

            const readMessageRef = ref(
              database,
              `Accounts/${email.replace(/\./g, "*")}/readMessages/${chatName}`,
            );
            await set(readMessageRef, latestMessageId);

            readMessages[chatName] = latestMessageId;
          }
        }
      }

      updateReadAllStatus();
      updateFavicon();
    } catch (error) {
      console.error("Error marking all messages as read:", error);
      alert("Failed to mark all messages as read. Please try again.");
    }
  }

  const hideSidebarButton = document.getElementById("hide-left-sidebar");
  let isSidebarHidden = false;

  hideSidebarButton.addEventListener("click", function () {
    const leftSidebar = document.getElementById("left-sidebar");
    const rightSidebar = document.getElementById("right-sidebar");
    const chatScreen = document.getElementById("chat-screen");

    if (!isSidebarHidden) {
      leftSidebar.style.transition = "all 0.3s ease";
      leftSidebar.style.width = "0";
      leftSidebar.style.opacity = "0";
      leftSidebar.style.overflow = "hidden";
      leftSidebar.style.display = "none";

      rightSidebar.style.width = "100%";
      rightSidebar.style.left = "0";

      hideSidebarButton.textContent = "Show Left Sidebar";
      isSidebarHidden = true;
    } else {
      leftSidebar.style.transition = "all 0.3s ease";
      leftSidebar.style.width = "20%";
      leftSidebar.style.opacity = "1";
      leftSidebar.style.overflow = "visible";
      leftSidebar.style.display = "block";

      rightSidebar.style.width = "80%";
      rightSidebar.style.left = "20%";

      hideSidebarButton.textContent = "Hide Left Sidebar";
      isSidebarHidden = false;
    }
  });

  document.getElementById("read-all").addEventListener("click", async () => {
    try {
      await markAllMessagesAsRead();
      updateFavicon();
    } catch (error) {
      console.error("Error marking all messages as read:", error);
    }
  });

  document.getElementById("iltg-button").addEventListener("click", async () => {
    const messagesRef = ref(database, `Chats/${currentChat}`);
    const userMessageRef = push(messagesRef);
    await update(userMessageRef, {
      User: email,
      Message: "I Lost The Game!!!",
      Date: Date.now(),
    });
  });

  document.getElementById("37-button").addEventListener("click", async () => {
    const element = document.createElement("div");

    const textOptions = ["37", "37!", "37!!", "37!!!"];
    const randomText =
      textOptions[Math.floor(Math.random() * textOptions.length)];

    const colorOptions = [
      "#FF5733",
      "#33FF57",
      "#3357FF",
      "#FF33F5",
      "#F5FF33",
      "#33FFF5",
      "#FF3333",
      "#33FF33",
      "#3333FF",
      "#FF33FF",
    ];
    const randomColor =
      colorOptions[Math.floor(Math.random() * colorOptions.length)];

    element.textContent = randomText;
    element.style.position = "absolute";
    element.style.fontWeight = "bold";
    element.style.fontSize = Math.floor(Math.random() * 30 + 20) + "px";
    element.style.color = randomColor;
    element.style.backgroundColor = "rgba(255, 255, 255, 0.7)";
    element.style.padding = "5px 10px";
    element.style.borderRadius = "10px";
    element.style.boxShadow = "0 0 15px " + randomColor;
    element.style.zIndex = "9999";
    element.style.cursor = "pointer";
    element.style.userSelect = "none";

    const gui = document.querySelector("#bookmarklet-gui-header").parentElement;
    const guiRect = gui.getBoundingClientRect();

    const maxX = guiRect.width - 100;
    const maxY = guiRect.height - 50;
    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);

    element.style.left = randomX + "px";
    element.style.top = randomY + "px";

    const randomRotation = Math.floor(Math.random() * 360);
    element.style.transform = `rotate(${randomRotation}deg)`;

    element.style.transition = "transform 0.3s, opacity 0.3s";

    const uniqueId =
      "effect-" + Date.now() + "-" + Math.floor(Math.random() * 1000);

    const style = document.createElement("style");
    style.id = uniqueId;
    style.textContent = `
    @keyframes bounce-${uniqueId} {
      0%, 20%, 50%, 80%, 100% {transform: rotate(${randomRotation}deg) translateY(0);}
      40% {transform: rotate(${randomRotation}deg) translateY(-20px);}
      60% {transform: rotate(${randomRotation}deg) translateY(-10px);}
    }
    @keyframes glitter-${uniqueId} {
      0% {text-shadow: 0 0 10px ${randomColor}, 0 0 20px ${randomColor};}
      50% {text-shadow: 0 0 20px ${randomColor}, 0 0 30px ${randomColor};}
      100% {text-shadow: 0 0 10px ${randomColor}, 0 0 20px ${randomColor};}
    }
  `;
    document.head.appendChild(style);

    element.style.animation = `bounce-${uniqueId} 1s ease infinite, glitter-${uniqueId} 0.8s ease infinite`;

    const confettiColors = ["#fd0", "#0ff", "#f0f", "#0f0", "#f00", "#00f"];

    element.addEventListener("click", async () => {
      const maxConfetti = 25;
      const existingConfetti = document.querySelectorAll(".party-confetti");

      if (existingConfetti.length > 50) {
        existingConfetti.forEach((c, index) => {
          if (index < existingConfetti.length - 25) {
            c.remove();
          }
        });
      }

      const isEasterEgg = Math.floor(Math.random() * 37) === 0;

      if (isEasterEgg) {
        const atTheSameTimeText = document.createElement("div");
        atTheSameTimeText.textContent = "AT THE SAME TIME";
        atTheSameTimeText.style.position = "absolute";
        atTheSameTimeText.style.fontWeight = "bold";
        atTheSameTimeText.style.fontSize = "24px";
        atTheSameTimeText.style.color = "#FF0000";
        atTheSameTimeText.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
        atTheSameTimeText.style.padding = "10px 15px";
        atTheSameTimeText.style.borderRadius = "10px";
        atTheSameTimeText.style.boxShadow = "0 0 20px #FF0000";
        atTheSameTimeText.style.zIndex = "10000";
        atTheSameTimeText.style.left = randomX + "px";
        atTheSameTimeText.style.top = randomY + "px";
        atTheSameTimeText.style.transition = "opacity 2s";

        gui.appendChild(atTheSameTimeText);

        try {
          const messagesRef = ref(database, `Chats/${currentChat}`);
          const userMessageRef = push(messagesRef);
          await update(userMessageRef, {
            User: email,
            Message: "AT THE SAME TIME",
            Date: Date.now(),
          });
        } catch (error) {
          console.error("Error sending message:", error);
        }

        setTimeout(() => {
          atTheSameTimeText.style.opacity = "0";
          setTimeout(() => {
            atTheSameTimeText.remove();
          }, 2000);
        }, 1000);
      }

      for (let i = 0; i < maxConfetti; i++) {
        const confetti = document.createElement("div");
        confetti.className = "party-confetti";
        confetti.style.position = "absolute";
        confetti.style.width = "10px";
        confetti.style.height = "10px";
        confetti.style.backgroundColor =
          confettiColors[Math.floor(Math.random() * confettiColors.length)];
        confetti.style.borderRadius = "50%";
        confetti.style.left = randomX + Math.random() * 50 + "px";
        confetti.style.top = randomY + Math.random() * 50 + "px";
        confetti.style.zIndex = "9998";
        confetti.style.opacity = "1";
        confetti.style.transition = "top 1s, left 1s, opacity 1s";

        gui.appendChild(confetti);

        setTimeout(() => {
          confetti.style.top = randomY + (Math.random() * 200 - 100) + "px";
          confetti.style.left = randomX + (Math.random() * 200 - 100) + "px";
          confetti.style.opacity = "0";

          setTimeout(() => {
            confetti.remove();
          }, 1000);
        }, 10);
      }

      element.style.transform = `rotate(${randomRotation}deg) scale(0)`;
      element.style.opacity = "0";
      setTimeout(() => {
        element.remove();
        document.getElementById(uniqueId)?.remove();
      }, 300);
    });

    gui.appendChild(element);
  });

  document.getElementById("kill-button").addEventListener("click", () => {
    const allElements = document.querySelectorAll("body *");
    const colors = [
      "#FF5733",
      "#33FF57",
      "#3357FF",
      "#FF33F5",
      "#F5FF33",
      "#33FFF5",
    ];
    let chaosTimeout = null;
    let maxChaosTime = 0;

    allElements.forEach((element) => {
      if (
        element.id !== "kill-button" &&
        !element.classList.contains("scrambled")
      ) {
        element.classList.add("scrambled");

        const originalStyle = {
          position: element.style.position,
          left: element.style.left,
          top: element.style.top,
          transform: element.style.transform,
          transition: element.style.transition,
          zIndex: element.style.zIndex,
          color: element.style.color,
          backgroundColor: element.style.backgroundColor,
          opacity: element.style.opacity,
        };

        element.dataset.originalStyle = JSON.stringify(originalStyle);

        element.style.opacity = "0";

        setTimeout(() => {
          element.style.position = "fixed";
          element.style.left = Math.random() * 90 + "vw";
          element.style.top = Math.random() * 90 + "vh";
          element.style.transform = `rotate(${Math.random() * 720 - 360}deg) scale(${0.5 + Math.random()})`;
          element.style.transition =
            "all 0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55)";
          element.style.zIndex = Math.floor(Math.random() * 100);
          element.style.opacity = "1";

          if (Math.random() > 0.5) {
            element.style.animation = `spin ${3 + Math.random() * 7}s infinite linear`;
          }

          if (Math.random() > 0.5) {
            element.style.color =
              colors[Math.floor(Math.random() * colors.length)];
          }

          if (Math.random() > 0.7) {
            element.style.backgroundColor =
              colors[Math.floor(Math.random() * colors.length)] + "80";
          }
        }, Math.random() * 500);
      }
    });

    const styleSheet = document.createElement("style");
    styleSheet.innerHTML = `
    @keyframes spin {
      from { transform: rotate(0deg) scale(1); }
      50% { transform: rotate(180deg) scale(1.2); }
      to { transform: rotate(360deg) scale(1); }
    }
    @keyframes float {
      0% { transform: translate(0, 0) rotate(0deg); }
      33% { transform: translate(20px, -15px) rotate(10deg); }
      66% { transform: translate(-15px, 20px) rotate(-15deg); }
      100% { transform: translate(0, 0) rotate(0deg); }
    }
  `;
    document.head.appendChild(styleSheet);

    const restoreWebsite = () => {
      const scrambledElements = document.querySelectorAll(".scrambled");
      scrambledElements.forEach((element) => {
        element.style.opacity = "0";
        element.style.transition = "all 1s ease-out";
      });

      setTimeout(() => {
        scrambledElements.forEach((element) => {
          if (element.dataset.originalStyle) {
            const originalStyle = JSON.parse(element.dataset.originalStyle);

            element.style.animation = "none";
            element.style.position = originalStyle.position;
            element.style.left = originalStyle.left;
            element.style.top = originalStyle.top;
            element.style.transform = originalStyle.transform;
            element.style.transition = originalStyle.transition;
            element.style.zIndex = originalStyle.zIndex;
            element.style.color = originalStyle.color;
            element.style.backgroundColor = originalStyle.backgroundColor;
            element.style.opacity = originalStyle.opacity || "1";

            element.classList.remove("scrambled");
          }
        });

        const textScrambles = document.querySelectorAll(".text-scramble");
        textScrambles.forEach((el) => el.remove());
      }, 1000);
    };
    const pctext = [
      "CHAOS!",
      "SCRAMBLED!",
      "37!",
      "DISORDER!",
      "MAYHEM!",
      "SPIN!",
      "WHEEEE!",
      "I LOST THE GAME!",
      "AT THE SAME TIME!",
      " W RIZZ!",
      "I ATE IT!",
      "no comment.",
      "lol",
      "kIdS tHeSe dAyS!",
      "bruh.",
    ];
    const sptext = [
      "Yu-heng!",
      "Jalice!",
      "Ju-bin!",
      "Shimmy!",
      "[Insert Ship Name Here!]",
    ];
    const addChaosText = () => {
      const chaosText = document.createElement("div");
      chaosText.className = "text-scramble";
      if (Math.floor(Math.random() * 37) == 0) {
        chaosText.textContent =
          sptext[Math.floor(Math.random() * sptext.length)];
      } else {
        chaosText.textContent =
          pctext[Math.floor(Math.random() * pctext.length)];
      }
      chaosText.style.position = "fixed";
      chaosText.style.left = Math.random() * 90 + "vw";
      chaosText.style.top = Math.random() * 90 + "vh";
      chaosText.style.color = colors[Math.floor(Math.random() * colors.length)];
      chaosText.style.fontWeight = "bold";
      chaosText.style.fontSize = 20 + Math.random() * 40 + "px";
      chaosText.style.transform = `rotate(${Math.random() * 360}deg)`;
      chaosText.style.zIndex = "9999";
      chaosText.style.textShadow = "2px 2px 4px rgba(0,0,0,0.5)";
      chaosText.style.opacity = "0";
      chaosText.style.transition = "opacity 0.5s ease-in-out";
      chaosText.style.animation = `spin ${2 + Math.random() * 5}s infinite linear, float ${3 + Math.random() * 4}s infinite ease-in-out`;

      document.body.appendChild(chaosText);

      setTimeout(() => {
        chaosText.style.opacity = "1";
      }, 10);

      const duration = 2000 + Math.random() * 5000;

      setTimeout(() => {
        chaosText.style.opacity = "0";
        setTimeout(() => {
          chaosText.remove();
        }, 500);
      }, duration);

      return duration + 500;
    };

    for (let i = 0; i < 20; i++) {
      const delay = Math.random() * 5000;
      const timeoutId = setTimeout(() => {
        const duration = addChaosText();
        const totalTime = delay + duration;
        if (totalTime > maxChaosTime) {
          maxChaosTime = totalTime;

          if (chaosTimeout) {
            clearTimeout(chaosTimeout);
          }
          chaosTimeout = setTimeout(restoreWebsite, maxChaosTime + 1000);
        }
      }, delay);
    }

    const scrambleText = () => {
      const textElements = document.querySelectorAll(
        "p, h1, h2, h3, h4, h5, h6, span, a, button",
      );

      textElements.forEach((element) => {
        if (
          Math.random() > 0.6 &&
          element.innerText &&
          element.innerText.trim() !== "" &&
          !element.dataset.originalText
        ) {
          element.dataset.originalText = element.innerText;

          const words = element.innerText.split(" ");
          const scrambledWords = words.map((word) => {
            if (word.length <= 2 || Math.random() > 0.5) return word;

            const chars = word.split("");
            for (let i = chars.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [chars[i], chars[j]] = [chars[j], chars[i]];
            }

            return chars.join("");
          });

          element.innerText = scrambledWords.join(" ");
        }
      });
    };

    scrambleText();
  });
  gui.querySelector("#bookmarklet-close").onclick = function () {
    const currentUrl = window.location.href;
    let link = document.querySelector(
      'link[rel="icon"], link[rel="shortcut icon"]',
    );
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }

    if (currentUrl.includes("lakesideschool.instructure.com")) {
      link.href =
        "https://instructure-uploads-pdx.s3.us-west-2.amazonaws.com/account_211800000000000001/attachments/3701/smallershield.png";
    } else if (currentUrl.includes("google.com")) {
      link.href = "https://google.com/favicon.ico";
    }

    gui.remove();
  };

  document
    .getElementById("customize-profile")
    .addEventListener("click", async function () {
      const customizeScreen = document.getElementById(
        "customize-account-screen",
      );
      const chatScreen = document.getElementById("chat-screen");

      document.getElementById("create-username").value = "";
      document.getElementById("create-bio").value = "";
      document.getElementById("create-picture").value = "";

      const accountRef = ref(database, `Accounts/${email.replace(/\./g, "*")}`);
      const snapshot = await get(accountRef);
      const userData = snapshot.val();

      if (userData) {
        document.getElementById("create-username").value =
          userData.Username || "";
        document.getElementById("create-bio").value = userData.Bio || "";
      }

      chatScreen.classList.add("hidden");
      customizeScreen.classList.remove("hidden");
    });

  document.getElementById("submit-customize").onclick = async function () {
    const username = document.getElementById("create-username").value.trim();
    const bio = document.getElementById("create-bio").value.trim();
    const pictureInput = document.getElementById("create-picture");
    const pictureFile = pictureInput.files[0];
    const chatScreen = document.getElementById("chat-screen");
    const customizeScreen = document.getElementById("customize-account-screen");

    try {
      let imageUrl = "None";
      if (pictureFile) {
        const storage = getStorage();
        const fileRef = storageRef(
          storage,
          `ProfilePictures/${email.replace(/\./g, "*")}`,
        );
        await uploadBytes(fileRef, pictureFile);
        imageUrl = await getDownloadURL(fileRef);
      }

      const accountsRef = ref(
        database,
        `Accounts/${email.replace(/\./g, "*")}`,
      );
      const snapshot = await get(accountsRef);
      const existingData = snapshot.val() || {};

      const updatedAccountData = {
        ...existingData,
        Username: username || "Anonymous",
        Bio: bio || "I'm a yapper",
        Image: imageUrl !== "None" ? imageUrl : existingData.Image || "None",
      };

      await set(accountsRef, updatedAccountData);

      chatScreen.classList.remove("hidden");
      customizeScreen.classList.add("hidden");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };
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
      const membersContainer = document.getElementById("members-container");
      const selectedMembers = document.getElementById("selected-members");
      const membersList = document.getElementById("members-list");

      function resetForm() {
        channelType.value = "Public";
        membersContainer.style.display = "none";
        membersList.innerHTML = "";
        selectedMembers.innerHTML = "";
        if (!submitButton.clicked) {
          channelName.value = "";
          channelDescription.value = "";
        }
      }

      resetForm();

      let availableMembers = [];
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

      function loadMemberOptions() {
        const membersContainer = document.getElementById("members-container");
        const membersList = document.getElementById("members-list");
        const memberSearch = document.getElementById("member-search");
        const selectedMembers = document.getElementById("selected-members");
        let availableMembers = [];

        async function updateAvailableMembers() {
          const accountsRef = ref(database, "Accounts");
          const snapshot = await get(accountsRef);
          const accounts = snapshot.val();

          const selectedEmails = new Set(
            Array.from(document.querySelectorAll(".selected-member"))
              .map((el) => el.textContent.trim().replace(/×$/, ""))
              .map((email) => email.replace(/\./g, "*")),
          );

          availableMembers = Object.keys(accounts)
            .filter(
              (accountEmail) =>
                accountEmail !== email.replace(/\./g, "*") &&
                !selectedEmails.has(accountEmail),
            )
            .map((accountEmail) => ({
              id: accountEmail,
              email: accountEmail.replace(/\*/g, "."),
            }));

          renderMembersList(availableMembers);
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
        <span class="remove-member">×</span>
    `;

          memberElement.querySelector(".remove-member").onclick = () => {
            memberElement.remove();
            availableMembers.push(member);
            availableMembers.sort((a, b) => a.email.localeCompare(b.email));
            renderMembersList(availableMembers);
          };

          selectedMembers.appendChild(memberElement);

          availableMembers = availableMembers.filter(
            (availableMember) => availableMember.id !== member.id,
          );
          renderMembersList(availableMembers);

          membersList.style.display = "none";
          memberSearch.value = "";
        }

        updateAvailableMembers();

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
        const chatInfoRef = ref(database, `Chat Info/${name}`);
        const snapshot = await get(chatInfoRef);
        if (snapshot.exists()) {
          alert(
            "A channel with this name already exists. Please choose a different name.",
          );
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
              el.textContent
                .trim()
                .replace(/×$/, "")
                .replace(/\./g, "*")
                .trim()
                .replace(/\s+/g, ""),
            ),
          );
        }

        const channelData = {
          Description: description || "No description provided",
          Members: type === "Private" ? members.join(",") : "None",
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
        resetForm();
        document.getElementById("channel-screen").classList.add("hidden");
        chatScreen.style.display = "flex";
      });

      channelType.value = "Public";
      channelMembers.disabled = true;
    });

  function setupUnreadCountUpdates() {
    const chatsRef = ref(database, "Chats");

    onValue(chatsRef, async (snapshot) => {
      const chats = snapshot.val();
      if (!chats) return;

      const servers = document.querySelectorAll(".server");
      for (const server of servers) {
        const chatName = server.textContent.trim();
        if (chats[chatName]) {
          await updateUnreadCount(chatName);
        }
      }
    });
  }

  /* Load existing messages */
  setupDarkModeDetection();
  checkForUpdates();
  fetchChatList();
  setupUnreadCountUpdates();
  await initializeReadMessages();
  loadMessages("General");
  const messagesDiv = document.getElementById("messages");
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
})();
