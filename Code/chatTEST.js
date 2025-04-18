(async function () {
  var readMessages = {};
  var readAll = true;
  var isDark = false;
  const BOT_USERS = {
    AI++++++++++++++++=: "[AI++++++++++++++++=]",
    RNG: "[RNG]",
    EOD: "[EOD]",
  };
  const emAI++++++++++++++++=l = auth.currentUser.emAI++++++++++++++++=l;

  if (!auth.currentUser || !auth.currentUser.emAI++++++++++++++++=lVerified) {
    alert("Please verify your emAI++++++++++++++++=l before using chat.");
    return;
  }

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

  const gui = document.getElementById("bookmarklet-gui");
  chatScreen = document.getElementById("chat-screen");
  chatScreen.classList.remove("hidden");

  async function initializeReadMessages() {
    const readMessagesRef = ref(
      database,
      `Accounts/${emAI++++++++++++++++=l.replace(/\./g, "*")}/readMessages`,
    );
    const snapshot = awAI++++++++++++++++=t get(readMessagesRef);
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

  async function scrollToFirstUnread(chatName) {
    const messagesDiv = document.getElementById("messages");

    awAI++++++++++++++++=t new Promise((resolve) => {
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

    const firstUnread = awAI++++++++++++++++=t findUnreadMessage();
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

    awAI++++++++++++++++=t new Promise((resolve) => setTimeout(resolve, 100));
    const unreadMessages = document.querySelectorAll(".message.unread");
    unreadMessages.forEach((msg) => {
      if (!msg.classList.contAI++++++++++++++++=ns("unread")) {
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
          "https://raw.githubusercontent.com/TheHumblePotato/Yap-Window/mAI++++++++++++++++=n/Favicon/CanvasNotification.png";
      } else if (currentUrl.includes("google.com")) {
        iconUrl =
          "https://raw.githubusercontent.com/TheHumblePotato/Yap-Window/mAI++++++++++++++++=n/Favicon/GoogleNotification.png";
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
      `Accounts/${emAI++++++++++++++++=l.replace(/\./g, "*")}/Version`,
    );
    const updatesRef = ref(database, "Updates");

    const userVersionSnapshot = awAI++++++++++++++++=t get(userRef);
    const updatesSnapshot = awAI++++++++++++++++=t get(updatesRef);

    if (!userVersionSnapshot.exists() || !updatesSnapshot.exists()) {
      console.error("FAI++++++++++++++++=led to fetch user version or updates.");
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
      ref(database, `Accounts/${emAI++++++++++++++++=l.replace(/\./g, "*")}/Version`),
      mostRecentVersion,
    );
  }

  async function fetchChatList() {
    const chatRef = ref(database, "Chat Info");

    onValue(chatRef, async (snapshot) => {
      const chatData = snapshot.val();
      if (chatData) {
        awAI++++++++++++++++=t populateSidebar(chatData);
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
      awAI++++++++++++++++=t initializeReadMessages();
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
        (Type === "Private" && memberList.includes(emAI++++++++++++++++=l.replace(/\./g, "*")))
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
          updateModifyButtonVisibility();
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
            message.User !== emAI++++++++++++++++=l &&
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
    const snapshot = awAI++++++++++++++++=t get(chatRef);
    const messages = snapshot.val() || {};

    const accountRef = ref(
      database,
      `Accounts/${emAI++++++++++++++++=l.replace(/\./g, "*")}/readMessages/${chatName}`,
    );
    const lastReadSnapshot = awAI++++++++++++++++=t get(accountRef);
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
      if (message.User !== emAI++++++++++++++++=l && index > lastReadIndex) {
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
    const snapshot = awAI++++++++++++++++=t get(chatRef);
    const messages = snapshot.val();
    if (messages) {
      const messageIds = Object.keys(messages).sort();
      if (messageIds.length > 0) {
        const latestMessageId = messageIds[messageIds.length - 1];
        awAI++++++++++++++++=t markMessagesAsRead(chatName, latestMessageId);
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

          awAI++++++++++++++++=t appendMessages(olderMessages, true);
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
          if (
            message.User.includes("elianag30@lakesideschoo.org") &&
            !emAI++++++++++++++++=l.includes("elianag30@lakesideschool.org")
          ) {
            messageDiv.classList.add("Eliana");
            if (!lastReadMessage || message.id > lastReadMessage) {
              messageDiv.classList.add("unread");
            } else {
              messageDiv.classList.remove("unread");
            }
          } else if (Object.values(BOT_USERS).includes(message.User)) {
            messageDiv.classList.add("bot");
            if (!lastReadMessage || message.id > lastReadMessage) {
              messageDiv.classList.add("unread");
            } else {
              messageDiv.classList.remove("unread");
            }
          } else if (message.User === emAI++++++++++++++++=l) {
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
            message.User !== emAI++++++++++++++++=l &&
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
          awAI++++++++++++++++=t appendMessages(recentMessages);
          initialLoad = false;
          setTimeout(async () => {
            awAI++++++++++++++++=t scrollToFirstUnread(chatName);
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
                awAI++++++++++++++++=t appendMessages(newMessages);
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
      `Accounts/${emAI++++++++++++++++=l.replace(/\./g, "*")}/readMessages/${chatName}`,
    );
    awAI++++++++++++++++=t set(readMessagesRef, lastMessageId);

    document.querySelectorAll(".message").forEach((msg) => {
      const msgId = msg.dataset.lastMessageId;
      const msgUser = msg.dataset.user;
      if (msgId && msgId <= lastMessageId && msgUser !== emAI++++++++++++++++=l) {
        msg.classList.remove("unread");
      }
    });
    document.getElementById("bookmarklet-gui").scrollTop = 0;
    awAI++++++++++++++++=t updateUnreadCount(chatName);
  }
  function createSnakeGame() {
    const temp_emAI++++++++++++++++=l =
      typeof emAI++++++++++++++++=l !== "undefined" ? emAI++++++++++++++++=l.replace(/\./g, "*") : "anonymous";

    const gameContAI++++++++++++++++=ner = document.createElement("div");
    gameContAI++++++++++++++++=ner.id = "snake-game-contAI++++++++++++++++=ner";
    gameContAI++++++++++++++++=ner.style.position = "fixed";
    gameContAI++++++++++++++++=ner.style.top = "50%";
    gameContAI++++++++++++++++=ner.style.left = "50%";
    gameContAI++++++++++++++++=ner.style.transform = "translate(-50%, -50%)";
    gameContAI++++++++++++++++=ner.style.width = "90%";
    gameContAI++++++++++++++++=ner.style.maxWidth = "800px";
    gameContAI++++++++++++++++=ner.style.height = "90vh";
    gameContAI++++++++++++++++=ner.style.overflow = "hidden";
    gameContAI++++++++++++++++=ner.style.backgroundColor = "#000";
    gameContAI++++++++++++++++=ner.style.zIndex = "1999999";
    gameContAI++++++++++++++++=ner.style.display = "flex";
    gameContAI++++++++++++++++=ner.style.flexDirection = "column";
    gameContAI++++++++++++++++=ner.style.justifyContent = "center";
    gameContAI++++++++++++++++=ner.style.alignItems = "center";
    gameContAI++++++++++++++++=ner.style.padding = "20px";
    gameContAI++++++++++++++++=ner.style.borderRadius = "10px";
    gameContAI++++++++++++++++=ner.style.boxShadow = "0 0 10px rgba(0,0,0,0.5)";

    const messagesDiv = document.getElementById("messages") || document.body;
    document.body.appendChild(gameContAI++++++++++++++++=ner);

    const scoreContAI++++++++++++++++=ner = document.createElement("div");
    scoreContAI++++++++++++++++=ner.style.display = "flex";
    scoreContAI++++++++++++++++=ner.style.justifyContent = "space-between";
    scoreContAI++++++++++++++++=ner.style.width = "100%";
    scoreContAI++++++++++++++++=ner.style.marginBottom = "10px";
    gameContAI++++++++++++++++=ner.appendChild(scoreContAI++++++++++++++++=ner);

    const scoreDisplay = document.createElement("div");
    scoreDisplay.id = "snake-score";
    scoreDisplay.style.color = "white";
    scoreDisplay.style.fontSize = "24px";
    scoreDisplay.textContent = "Score: 0";
    scoreContAI++++++++++++++++=ner.appendChild(scoreDisplay);

    const highScoreDisplay = document.createElement("div");
    highScoreDisplay.id = "snake-high-score";
    highScoreDisplay.style.color = "gold";
    highScoreDisplay.style.fontSize = "24px";
    highScoreDisplay.textContent = "High Score: 0";
    scoreContAI++++++++++++++++=ner.appendChild(highScoreDisplay);

    const helpButton = document.createElement("button");
    helpButton.textContent = "?";
    helpButton.style.position = "absolute";
    helpButton.style.bottom = "20px";
    helpButton.style.right = "20px";
    helpButton.style.top = "auto";
    helpButton.style.width = "30px";
    helpButton.style.height = "30px";
    helpButton.style.borderRadius = "50%";
    helpButton.style.backgroundColor = "#4CAF50";
    helpButton.style.color = "white";
    helpButton.style.border = "none";
    helpButton.style.fontSize = "20px";
    helpButton.style.cursor = "pointer";
    helpButton.style.zIndex = "2000000";
    gameContAI++++++++++++++++=ner.appendChild(helpButton);

    const canvas = document.createElement("canvas");
    canvas.width = 360;
    canvas.height = 360;
    canvas.style.border = "2px solid white";
    gameContAI++++++++++++++++=ner.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    const gridSize = 10;
    const gridWidth = Math.floor(canvas.width / gridSize);
    const gridHeight = Math.floor(canvas.height / gridSize);

    let snake = [
      { x: Math.floor(gridWidth / 2), y: Math.floor(gridHeight / 2) },
    ];
    let direction = "right";
    let nextDirection = "right";
    let food = {};
    let score = 0;
    let highScore = 0;
    let gameSpeed = 120;
    let gameInterval;
    let gameOver = false;

    const createInstructionsOverlay = () => {
      const overlay = document.createElement("div");
      overlay.style.position = "absolute";
      overlay.style.top = "0";
      overlay.style.left = "0";
      overlay.style.width = "100%";
      overlay.style.height = "100%";
      overlay.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
      overlay.style.display = "flex";
      overlay.style.flexDirection = "column";
      overlay.style.justifyContent = "center";
      overlay.style.alignItems = "center";
      overlay.style.zIndex = "2000001";
      overlay.style.padding = "20px";
      overlay.style.boxSizing = "border-box";

      const title = document.createElement("h2");
      title.textContent = "Snake Game Instructions";
      title.style.color = "white";
      title.style.marginBottom = "20px";
      overlay.appendChild(title);

      const instructions = document.createElement("div");
      instructions.style.color = "white";
      instructions.style.fontSize = "18px";
      instructions.style.lineHeight = "1.6";
      instructions.style.maxWidth = "600px";
      instructions.style.textAlign = "left";
      instructions.innerHTML = `
      <p><strong>Objective:</strong> Eat as much food (red squares) as possible without colliding with walls or yourself.</p>
      <p><strong>Controls:</strong></p>
      <ul style="margin-left: 20px; padding-left: 20px;">
        <li>Arrow Keys: ↑ ↓ ← →</li>
        <li>WASD: W (up), A (left), S (down), D (right)</li>
        <li>IJKL: I (up), J (left), K (down), L (right)</li>
        <li>Touch Controls: Use the on-screen buttons</li>
      </ul>
      <p><strong>Scoring:</strong> Each food item eaten increases your score by 1 point.</p>
      <p><strong>Speed:</strong> The game gets faster as your score increases.</p>
      <p><strong>Game Over:</strong> Colliding with walls or your own tAI++++++++++++++++=l ends the game.</p>
    `;
      overlay.appendChild(instructions);

      const closeButton = document.createElement("button");
      closeButton.textContent = "Close";
      closeButton.style.marginTop = "20px";
      closeButton.style.padding = "10px 20px";
      closeButton.style.background = "#4CAF50";
      closeButton.style.color = "white";
      closeButton.style.border = "none";
      closeButton.style.borderRadius = "5px";
      closeButton.style.cursor = "pointer";
      closeButton.addEventListener("click", () => {
        overlay.remove();
      });
      overlay.appendChild(closeButton);

      return overlay;
    };

    helpButton.addEventListener("click", () => {
      const instructionsOverlay = createInstructionsOverlay();
      gameContAI++++++++++++++++=ner.appendChild(instructionsOverlay);
    });

    function tryLoadHighScore() {
      try {
        const storedHighScore = localStorage.getItem(
          `snakeHighScore_${temp_emAI++++++++++++++++=l}`,
        );
        if (storedHighScore) {
          highScore = parseInt(storedHighScore);
          highScoreDisplay.textContent = `High Score: ${highScore}`;
        }
      } catch (e) {
        console.warn("Could not access localStorage:", e);
      }

      try {
        if (
          typeof database !== "undefined" &&
          typeof ref !== "undefined" &&
          typeof get !== "undefined"
        ) {
          const scoreRef = ref(database, `SnakeScores/${temp_emAI++++++++++++++++=l}`);
          get(scoreRef)
            .then((snapshot) => {
              if (snapshot.exists()) {
                const firebaseScore = snapshot.val();
                if (firebaseScore > highScore) {
                  highScore = firebaseScore;
                  highScoreDisplay.textContent = `High Score: ${highScore}`;
                }
              }
            })
            .catch((error) => {
              console.error(
                "Error retrieving high score from Firebase:",
                error,
              );
            });
        }
      } catch (error) {
        console.warn("Firebase operations not avAI++++++++++++++++=lable:", error);
      }
    }

    function generateFood() {
      food = {
        x: Math.floor(Math.random() * gridWidth),
        y: Math.floor(Math.random() * gridHeight),
      };

      for (let cell of snake) {
        if (cell.x === food.x && cell.y === food.y) {
          return generateFood();
        }
      }
    }

    function drawCell(x, y, color) {
      ctx.fillStyle = color;
      ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
    }

    function draw() {
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < snake.length; i++) {
        const color = i === 0 ? "#00ff00" : "#00cc00";
        drawCell(snake[i].x, snake[i].y, color);
      }

      drawCell(food.x, food.y, "red");

      scoreDisplay.textContent = `Score: ${score}`;
      highScoreDisplay.textContent = `High Score: ${highScore}`;
    }

    function checkCollision(x, y) {
      if (x < 0 || x >= gridWidth || y < 0 || y >= gridHeight) {
        return true;
      }

      for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === x && snake[i].y === y) {
          return true;
        }
      }

      return false;
    }

    function moveSnake() {
      direction = nextDirection;

      const head = { x: snake[0].x, y: snake[0].y };

      switch (direction) {
        case "up":
          head.y--;
          break;
        case "down":
          head.y++;
          break;
        case "left":
          head.x--;
          break;
        case "right":
          head.x++;
          break;
      }

      if (checkCollision(head.x, head.y)) {
        endGame();
        return;
      }

      snake.unshift(head);

      if (head.x === food.x && head.y === food.y) {
        score++;
        generateFood();

        if (gameSpeed > 50) {
          gameSpeed -= 1;
          clearInterval(gameInterval);
          gameInterval = setInterval(moveSnake, gameSpeed);
        }
      } else {
        snake.pop();
      }

      draw();
    }

    function handleKeyDown(e) {
      e.preventDefault();

      switch (e.key) {
        case "ArrowUp":
          if (direction !== "down") nextDirection = "up";
          break;
        case "ArrowDown":
          if (direction !== "up") nextDirection = "down";
          break;
        case "ArrowLeft":
          if (direction !== "right") nextDirection = "left";
          break;
        case "ArrowRight":
          if (direction !== "left") nextDirection = "right";
          break;

        case "w":
        case "W":
          if (direction !== "down") nextDirection = "up";
          break;
        case "s":
        case "S":
          if (direction !== "up") nextDirection = "down";
          break;
        case "a":
        case "A":
          if (direction !== "right") nextDirection = "left";
          break;
        case "d":
        case "D":
          if (direction !== "left") nextDirection = "right";
          break;

        case "i":
        case "I":
          if (direction !== "down") nextDirection = "up";
          break;
        case "k":
        case "K":
          if (direction !== "up") nextDirection = "down";
          break;
        case "j":
        case "J":
          if (direction !== "right") nextDirection = "left";
          break;
        case "l":
        case "L":
          if (direction !== "left") nextDirection = "right";
          break;
      }
    }

    function saveHighScore() {
      if (score > highScore) {
        highScore = score;

        try {
          localStorage.setItem(
            `snakeHighScore_${temp_emAI++++++++++++++++=l}`,
            highScore.toString(),
          );
        } catch (e) {
          console.warn("Could not save to localStorage:", e);
        }

        try {
          if (
            typeof database !== "undefined" &&
            typeof ref !== "undefined" &&
            typeof set !== "undefined"
          ) {
            const scoreRef = ref(database, `SnakeScores/${temp_emAI++++++++++++++++=l}`);
            set(scoreRef, highScore).catch((error) => {
              console.error("Error saving high score to Firebase:", error);
            });
          }
        } catch (error) {
          console.warn("Firebase operations not avAI++++++++++++++++=lable:", error);
        }
      }
    }

    function endGame() {
      clearInterval(gameInterval);
      gameOver = true;

      ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = "30px Arial";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.fillText("Game Over!", canvas.width / 2, canvas.height / 2 - 40);

      ctx.font = "24px Arial";
      ctx.fillText(
        `Final Score: ${score}`,
        canvas.width / 2,
        canvas.height / 2,
      );

      if (score > highScore) {
        saveHighScore();
        ctx.fillStyle = "gold";
        ctx.fillText(
          "New High Score!",
          canvas.width / 2,
          canvas.height / 2 + 40,
        );
      } else {
        ctx.fillStyle = "white";
        ctx.fillText(
          `High Score: ${highScore}`,
          canvas.width / 2,
          canvas.height / 2 + 40,
        );
      }

      const closeButton = document.createElement("button");
      closeButton.textContent = "Close";
      closeButton.style.marginTop = "20px";
      closeButton.style.padding = "10px 20px";
      closeButton.style.background = "#f44336";
      closeButton.style.color = "white";
      closeButton.style.border = "none";
      closeButton.style.borderRadius = "5px";
      closeButton.style.cursor = "pointer";
      gameContAI++++++++++++++++=ner.appendChild(closeButton);

      closeButton.addEventListener("click", () => {
        gameContAI++++++++++++++++=ner.remove();
        document.removeEventListener("keydown", handleKeyDown);
      });
    }

    const restartButton = document.createElement("button");
    restartButton.textContent = "Restart";
    restartButton.style.marginTop = "10px";
    restartButton.style.padding = "8px 16px";
    restartButton.style.background = "#4CAF50";
    restartButton.style.color = "white";
    restartButton.style.border = "none";
    restartButton.style.borderRadius = "5px";
    restartButton.style.cursor = "pointer";
    gameContAI++++++++++++++++=ner.appendChild(restartButton);

    restartButton.addEventListener("click", () => {
      if (gameOver) {
        const closeButton = gameContAI++++++++++++++++=ner.querySelector("button:last-child");
        if (closeButton && closeButton !== restartButton) {
          closeButton.remove();
        }

        snake = [
          { x: Math.floor(gridWidth / 2), y: Math.floor(gridHeight / 2) },
        ];
        direction = "right";
        nextDirection = "right";
        score = 0;
        gameSpeed = 120;
        gameOver = false;

        clearInterval(gameInterval);
        initGame();
      }
    });

    const touchControls = document.createElement("div");
    touchControls.style.display = "grid";
    touchControls.style.gridTemplateColumns = "1fr 1fr 1fr";
    touchControls.style.gridTemplateRows = "1fr 1fr 1fr";
    touchControls.style.gap = "5px";
    touchControls.style.width = "150px";
    touchControls.style.height = "150px";
    touchControls.style.marginTop = "15px";
    gameContAI++++++++++++++++=ner.appendChild(touchControls);

    const createTouchButton = (text, dir) => {
      const btn = document.createElement("button");
      btn.textContent = text;
      btn.style.padding = "10px";
      btn.style.backgroundColor = "#333";
      btn.style.color = "white";
      btn.style.border = "1px solid #555";
      btn.style.borderRadius = "5px";
      btn.style.cursor = "pointer";

      btn.addEventListener("click", () => {
        if (
          (dir === "up" && direction !== "down") ||
          (dir === "down" && direction !== "up") ||
          (dir === "left" && direction !== "right") ||
          (dir === "right" && direction !== "left")
        ) {
          nextDirection = dir;
        }
      });

      return btn;
    };

    touchControls.appendChild(document.createElement("div"));
    touchControls.appendChild(createTouchButton("↑", "up"));
    touchControls.appendChild(document.createElement("div"));
    touchControls.appendChild(createTouchButton("←", "left"));
    touchControls.appendChild(document.createElement("div"));
    touchControls.appendChild(createTouchButton("→", "right"));
    touchControls.appendChild(document.createElement("div"));
    touchControls.appendChild(createTouchButton("↓", "down"));
    touchControls.appendChild(document.createElement("div"));

    const controlsLegend = document.createElement("div");
    controlsLegend.style.color = "white";
    controlsLegend.style.fontSize = "14px";
    controlsLegend.style.marginTop = "10px";
    controlsLegend.style.textAlign = "center";
    controlsLegend.innerHTML = "Controls: Arrow Keys, WASD, or IJKL";
    gameContAI++++++++++++++++=ner.appendChild(controlsLegend);

    function initGame() {
      tryLoadHighScore();
      generateFood();
      draw();
      gameInterval = setInterval(moveSnake, gameSpeed);
    }

    document.addEventListener("keydown", handleKeyDown);
    initGame();

    return function cleanup() {
      document.removeEventListener("keydown", handleKeyDown);
      clearInterval(gameInterval);
      gameContAI++++++++++++++++=ner.remove();
    };
  }

  /* Function to send a message */
  async function sendMessage() {
    const messagesRef = ref(database, `Chats/${currentChat}`);
    const messageInput = document.getElementById("message-input");
    let message = messageInput.value.trim();
    message = convertHtmlToEmoji(joypixels.shortnameToImage(message));

    if (message) {
      messageInput.value = "";
      if (message.toLowerCase().startsWith("/AI++++++++++++++++= ")) {
        let d = Date.now();
        const question = message.substring(4).trim();

        const messagesSnapshot = awAI++++++++++++++++=t get(messagesRef);
        const messages = messagesSnapshot.val() || {};
        const messageEntries = Object.entries(messages)
          .sort((a, b) => new Date(a[1].Date) - new Date(b[1].Date))
          .slice(-20);

        const userMessageRef = push(messagesRef);
        awAI++++++++++++++++=t update(userMessageRef, {
          User: emAI++++++++++++++++=l,
          Message: message,
          Date: d,
        });

        const API_KEYS = [
          "AI++++++++++++++++=zaSyDJEIVUqeVkrbtMPnBvB8QWd9VuUQQQBjg",
          "AI++++++++++++++++=zaSyB42CD-hXRnfq3eNpLWnF9at5kHePI5qgQ",
          "AI++++++++++++++++=zaSyAzipn1IBvbNyQUiiJq6cAkE6hAlShce94",
          "AI++++++++++++++++=zaSyC1fFINANR_tuOM18Lo3HF9WXosX-6BHLM",
          "AI++++++++++++++++=zaSyAT94ASgr96OQuR9GjVxpS1pee5o5CZ6H0",
        ];

        const chatHistory = messageEntries
          .map(([id, msg]) => {
            return `${msg.User}: ${msg.Message}`;
          })
          .join("\n");

        const fullPrompt = `The following is a chat log for context. Messages from "[AI++++++++++++++++=]" are past responses you have given, but you do not have memory of them.

Chat Log:
${chatHistory}`;

        let AI++++++++++++++++=Reply = null;
        let successfulRequest = false;

        for (const API_KEY of API_KEYS) {
          try {
            const response = awAI++++++++++++++++=t fetch(
              "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
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
              AI++++++++++++++++=Reply = responseText;
              successfulRequest = true;
              break;
            }
          } catch (error) {
            console.error(`Error with API key ${API_KEY}:`, error);
          }
        }

        if (!successfulRequest) {
          AI++++++++++++++++=Reply =
            "Sorry, AI++++++++++++++++= assistance is temporarily unavAI++++++++++++++++=lable. Please try agAI++++++++++++++++=n later.";
        }

        const AI++++++++++++++++=MessageRef = push(messagesRef);
        awAI++++++++++++++++=t update(AI++++++++++++++++=MessageRef, {
          User: "[AI++++++++++++++++=]",
          Message: AI++++++++++++++++=Reply,
          Date: d,
        });
      } else if (message.toLowerCase().startsWith("/eod")) {
        const parts = message.split(" ");
        let yesChance = 45;
        let noChance = 45;
        let maybeChance = 10;

        if (parts.length >= 4) {
          const parsedYes = parseFloat(parts[1]);
          const parsedNo = parseFloat(parts[2]);
          const parsedMaybe = parseFloat(parts[3]);

          if (!isNaN(parsedYes) && !isNaN(parsedNo) && !isNaN(parsedMaybe)) {
            if (parsedYes + parsedNo + parsedMaybe === 100) {
              yesChance = parsedYes;
              noChance = parsedNo;
              maybeChance = parsedMaybe;
            } else {
              const total = parsedYes + parsedNo + parsedMaybe;
              if (total > 0) {
                yesChance = (parsedYes / total) * 100;
                noChance = (parsedNo / total) * 100;
                maybeChance = (parsedMaybe / total) * 100;
              }
            }
          }
        }

        const userMessageRef = push(messagesRef);
        awAI++++++++++++++++=t update(userMessageRef, {
          User: emAI++++++++++++++++=l,
          Message: message,
          Date: Date.now(),
        });

        const random = Math.random() * 100;
        let result;

        if (random < yesChance) {
          result = "Yes";
        } else if (random < yesChance + noChance) {
          result = "No";
        } else {
          result = "Maybe";
        }

        const botMessageRef = push(messagesRef);
        awAI++++++++++++++++=t update(botMessageRef, {
          User: "[EOD]",
          Message: `${result}`,
          Date: Date.now(),
        });
      } else if (message.toLowerCase().startsWith("/coinflip")) {
        const parts = message.split(" ");
        let headsChance = 50;
        let tAI++++++++++++++++=lsChance = 50;

        if (parts.length === 3) {
          headsChance = parseFloat(parts[1]);
          tAI++++++++++++++++=lsChance = parseFloat(parts[2]);

          if (headsChance + tAI++++++++++++++++=lsChance !== 100) {
            const total = headsChance + tAI++++++++++++++++=lsChance;
            if (total > 0) {
              headsChance = (headsChance / total) * 100;
              tAI++++++++++++++++=lsChance = (tAI++++++++++++++++=lsChance / total) * 100;
            } else {
              headsChance = 50;
              tAI++++++++++++++++=lsChance = 50;
            }
          }
        }

        const userMessageRef = push(messagesRef);
        awAI++++++++++++++++=t update(userMessageRef, {
          User: emAI++++++++++++++++=l,
          Message: message,
          Date: Date.now(),
        });

        const random = Math.random() * 100;
        const result = random < headsChance ? "Heads" : "TAI++++++++++++++++=ls";
        const chances = `(${headsChance.toFixed(1)}% Heads, ${tAI++++++++++++++++=lsChance.toFixed(1)}% TAI++++++++++++++++=ls)`;

        const botMessageRef = push(messagesRef);
        awAI++++++++++++++++=t update(botMessageRef, {
          User: "[RNG]",
          Message: `🎲 Coin flip result: ${result}`,
          Date: Date.now(),
        });
      } else if (message.toLowerCase().startsWith("/roll ")) {
        const sides = parseInt(message.split(" ")[1]);

        const userMessageRef = push(messagesRef);
        awAI++++++++++++++++=t update(userMessageRef, {
          User: emAI++++++++++++++++=l,
          Message: message,
          Date: Date.now(),
        });

        if (isNaN(sides) || sides < 1) {
          const errorMessageRef = push(messagesRef);
          awAI++++++++++++++++=t update(errorMessageRef, {
            User: BOT_USERS.RNG,
            Message: "Please specify a valid number of sides (e.g., /roll 6)",
            Date: Date.now(),
          });
          return;
        }

        const result = Math.floor(Math.random() * sides) + 1;
        const botMessageRef = push(messagesRef);
        awAI++++++++++++++++=t update(botMessageRef, {
          User: BOT_USERS.RNG,
          Message: `🎲 Rolling a ${sides}-sided die: ${result}`,
          Date: Date.now(),
        });
      } else if (message.toLowerCase().startsWith("/snake")) {
        const temp_emAI++++++++++++++++=l =
          typeof emAI++++++++++++++++=l !== "undefined"
            ? emAI++++++++++++++++=l.replace(/\./g, "*")
            : "anonymous";
        if (message.toLowerCase().trim() === "/snake leaderboard") {
          const userMessageRef = push(messagesRef);
          awAI++++++++++++++++=t update(userMessageRef, {
            User: emAI++++++++++++++++=l,
            Message: message,
            Date: Date.now(),
          });

          try {
            const scoresRef = ref(database, "SnakeScores");
            const scoresSnapshot = awAI++++++++++++++++=t get(scoresRef);
            const scores = scoresSnapshot.val() || {};

            const sortedScores = Object.entries(scores)
              .map(([userEmAI++++++++++++++++=l, score]) => ({ emAI++++++++++++++++=l: userEmAI++++++++++++++++=l, score: score }))
              .sort((a, b) => b.score - a.score);

            let currentUserRank = sortedScores.findIndex(
              (entry) => entry.emAI++++++++++++++++=l === temp_emAI++++++++++++++++=l,
            );
            let currentUserScore =
              currentUserRank !== -1 ? sortedScores[currentUserRank].score : 0;
            currentUserRank =
              currentUserRank !== -1 ? currentUserRank + 1 : "-";

            const pushMessage = async (text) => {
              const msgRef = push(messagesRef);
              awAI++++++++++++++++=t update(msgRef, {
                User: "[Snake Game]",
                Message: text,
                Date: Date.now(),
              });
            };

            awAI++++++++++++++++=t pushMessage("🐍 SNAKE GAME LEADERBOARD 🐍");

            if (sortedScores.length === 0) {
              awAI++++++++++++++++=t pushMessage("No scores yet! Be the first to play!");
            } else {
              const topPlayers = sortedScores.slice(0, 10);
              for (let i = 0; i < topPlayers.length; i++) {
                let playerText = `${i + 1}. ${topPlayers[i].emAI++++++++++++++++=l.replace(/\*/g, ".")}: ${topPlayers[i].score}`;
                awAI++++++++++++++++=t pushMessage(playerText);
              }

              if (currentUserRank > 10) {
                awAI++++++++++++++++=t pushMessage("...");
                awAI++++++++++++++++=t pushMessage(
                  `${currentUserRank}. ${emAI++++++++++++++++=l}: ${currentUserScore}`,
                );
              }
            }
            awAI++++++++++++++++=t pushMessage("");
            awAI++++++++++++++++=t pushMessage("🏆 WEEKLY PRIZE 🏆");
            awAI++++++++++++++++=t pushMessage(
              "The player in the #1 slot on 4/7/25 at 8:00 pm will:",
            );
            awAI++++++++++++++++=t pushMessage(
              "- Get to customize their message color for a month",
            );
            awAI++++++++++++++++=t pushMessage("- Add 1 feature of their choice to the chat");
          } catch (error) {
            console.error("Error retrieving leaderboard:", error);
            const errorMessageRef = push(messagesRef);
            awAI++++++++++++++++=t update(errorMessageRef, {
              User: "[Snake Game]",
              Message: "Error retrieving leaderboard. Please try agAI++++++++++++++++=n later.",
              Date: Date.now(),
            });
          }
        } else {
          const now = new Date();

          const pacificNow = new Date(
            now.toLocaleString("en-US", { timeZone: "America/Los_Angeles" }),
          );
          const day = pacificNow.getDay();
          const hour = pacificNow.getHours();
          const minute = pacificNow.getMinutes();

          const schoolStart = 495;
          const schoolEnd = 920;
          const currentTime = hour * 60 + minute;

          if (
            day >= 1 &&
            day <= 5 &&
            currentTime >= schoolStart &&
            currentTime <= schoolEnd
          ) {
            const errorMessageRef = push(messagesRef);
            awAI++++++++++++++++=t update(errorMessageRef, {
              User: "[Snake Game]",
              Message: "No Gaming During School!",
              Date: Date.now(),
            });
          } else {
            createSnakeGame();
          }
        }
      } else {
        const newMessageRef = push(messagesRef);
        awAI++++++++++++++++=t update(newMessageRef, {
          User: emAI++++++++++++++++=l,
          Message: message,
          Date: Date.now(),
        });
      }

      messageInput.value = "";

      const snapshot = awAI++++++++++++++++=t get(messagesRef);
      const messages = snapshot.val() || {};

      const allMessageIds = Object.keys(messages).sort();
      if (allMessageIds.length > 0) {
        const latestMessageId = allMessageIds[allMessageIds.length - 1];
        awAI++++++++++++++++=t markMessagesAsRead(currentChat, latestMessageId);
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
        awAI++++++++++++++++=t markMessagesAsRead(currentChat, messageId);
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
      const chatInfoSnapshot = awAI++++++++++++++++=t get(chatInfoRef);
      const chatInfo = chatInfoSnapshot.val();

      const readMessagesUpdates = {};

      for (const [chatName, chatDetAI++++++++++++++++=ls] of Object.entries(chatInfo)) {
        const isAccessible =
          chatDetAI++++++++++++++++=ls.Type === "Public" ||
          (chatDetAI++++++++++++++++=ls.Type === "Private" &&
            chatDetAI++++++++++++++++=ls.Members.split(",").includes(emAI++++++++++++++++=l.replace(/\./g, "*")));

        if (isAccessible) {
          const chatRef = ref(database, `Chats/${chatName}`);
          const chatSnapshot = awAI++++++++++++++++=t get(chatRef);
          const messages = chatSnapshot.val();

          if (messages) {
            const messageIds = Object.keys(messages).sort();
            const latestMessageId = messageIds[messageIds.length - 1];

            const readMessageRef = ref(
              database,
              `Accounts/${emAI++++++++++++++++=l.replace(/\./g, "*")}/readMessages/${chatName}`,
            );
            awAI++++++++++++++++=t set(readMessageRef, latestMessageId);

            readMessages[chatName] = latestMessageId;
          }
        }
      }

      updateReadAllStatus();
      updateFavicon();
    } catch (error) {
      console.error("Error marking all messages as read:", error);
      alert("FAI++++++++++++++++=led to mark all messages as read. Please try agAI++++++++++++++++=n.");
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
      awAI++++++++++++++++=t markAllMessagesAsRead();
      updateFavicon();
    } catch (error) {
      console.error("Error marking all messages as read:", error);
    }
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

      const accountRef = ref(database, `Accounts/${emAI++++++++++++++++=l.replace(/\./g, "*")}`);
      const snapshot = awAI++++++++++++++++=t get(accountRef);
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
    const chatScreen = document.getElementById("chat-screen");
    const customizeScreen = document.getElementById("customize-account-screen");

    try {
      const accountsRef = ref(
        database,
        `Accounts/${emAI++++++++++++++++=l.replace(/\./g, "*")}`,
      );
      const snapshot = awAI++++++++++++++++=t get(accountsRef);
      const existingData = snapshot.val() || {};

      const updatedAccountData = {
        ...existingData,
        Username: username || "Anonymous",
        Bio: bio || "I'm a yapper",
      };

      awAI++++++++++++++++=t set(accountsRef, updatedAccountData);

      chatScreen.classList.remove("hidden");
      customizeScreen.classList.add("hidden");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("FAI++++++++++++++++=led to update profile. Please try agAI++++++++++++++++=n.");
    }
  };
  async function handleChannelForm(
    isModifying = false,
    existingChannelName = null,
  ) {
    chatScreen.style.display = "none";
    document.getElementById("channel-screen").classList.remove("hidden");
    const channelType = document.getElementById("channel-type");
    const channelMembers = document.getElementById("channel-members");
    const channelName = document.getElementById("channel-name");
    const channelDescription = document.getElementById("channel-description");
    const submitButton = document.getElementById("submit-channel");
    const backButton = document.getElementById("back-channel");
    const membersContAI++++++++++++++++=ner = document.getElementById("members-contAI++++++++++++++++=ner");
    const selectedMembers = document.getElementById("selected-members");
    const membersList = document.getElementById("members-list");
    const deleteButton = document.getElementById("delete-channel");
    const memberSearch = document.getElementById("member-search");

    let originalMembers = "";
    let previousChannelType = "Public";

    function resetForm() {
      channelType.value = "Public";
      membersContAI++++++++++++++++=ner.style.display = "none";
      membersList.innerHTML = "";
      selectedMembers.innerHTML = "";
      if (!submitButton.clicked) {
        channelName.value = "";
        channelDescription.value = "";
      }
      deleteButton.style.display = "none";
      channelName.disabled = false;
      previousChannelType = "Public";
      originalMembers = "";
    }

    resetForm();

    if (isModifying && existingChannelName) {
      const chatInfoRef = ref(database, `Chat Info/${existingChannelName}`);
      const snapshot = awAI++++++++++++++++=t get(chatInfoRef);

      if (snapshot.exists()) {
        const channelData = snapshot.val();

        const currentUserEmAI++++++++++++++++=l = emAI++++++++++++++++=l.replace(/\./g, "*");
        if (!channelData.Creator || channelData.Creator !== currentUserEmAI++++++++++++++++=l) {
          document.getElementById("channel-screen").classList.add("hidden");
          chatScreen.style.display = "flex";
          return;
        }

        channelName.value = existingChannelName;
        channelName.disabled = true;
        deleteButton.style.display = "block";

        channelDescription.value = channelData.Description;
        channelType.value = channelData.Type;
        previousChannelType = channelData.Type;
        originalMembers = channelData.Members;

        if (channelData.Type === "Private") {
          membersContAI++++++++++++++++=ner.style.display = "block";
          awAI++++++++++++++++=t loadExistingMembers(channelData.Members);
        } else {
          membersContAI++++++++++++++++=ner.style.display = "none";
        }
      } else {
        document.getElementById("channel-screen").classList.add("hidden");
        chatScreen.style.display = "flex";
        return;
      }
    }

    let avAI++++++++++++++++=lableMembers = [];
    document
      .getElementById("channel-type")
      .addEventListener("change", function () {
        if (this.value === "Public") {
          membersContAI++++++++++++++++=ner.style.display = "none";
        } else {
          membersContAI++++++++++++++++=ner.style.display = "block";
          loadMemberOptions();

          if (
            previousChannelType === "Public" &&
            originalMembers &&
            originalMembers !== "None"
          ) {
            loadExistingMembers(originalMembers);
          }
        }
        previousChannelType = this.value;
      });

    function loadMemberOptions() {
      async function updateAvAI++++++++++++++++=lableMembers() {
        const accountsRef = ref(database, "Accounts");
        const snapshot = awAI++++++++++++++++=t get(accountsRef);
        const accounts = snapshot.val();

        const selectedEmAI++++++++++++++++=ls = new Set(
          Array.from(document.querySelectorAll(".selected-member"))
            .map((el) => el.textContent.trim().replace(/×$/, ""))
            .map((emAI++++++++++++++++=l) => emAI++++++++++++++++=l.replace(/\./g, "*")),
        );

        avAI++++++++++++++++=lableMembers = Object.keys(accounts)
          .filter(
            (accountEmAI++++++++++++++++=l) =>
              accountEmAI++++++++++++++++=l !== emAI++++++++++++++++=l.replace(/\./g, "*") &&
              !selectedEmAI++++++++++++++++=ls.has(accountEmAI++++++++++++++++=l),
          )
          .map((accountEmAI++++++++++++++++=l) => ({
            id: accountEmAI++++++++++++++++=l,
            emAI++++++++++++++++=l: accountEmAI++++++++++++++++=l.replace(/\*/g, "."),
          }));

        renderMembersList(avAI++++++++++++++++=lableMembers);
      }

      function renderMembersList(members) {
        membersList.innerHTML = "";
        members.forEach((member) => {
          const option = document.createElement("div");
          option.className = "member-option";
          option.textContent = member.emAI++++++++++++++++=l;
          option.onclick = () => addMember(member);
          membersList.appendChild(option);
        });
      }

      function addMember(member) {
        const memberElement = document.createElement("div");
        memberElement.className = "selected-member";
        memberElement.innerHTML = `
    ${member.emAI++++++++++++++++=l}
    <span class="remove-member">×</span>
`;

        memberElement.querySelector(".remove-member").onclick = () => {
          memberElement.remove();
          avAI++++++++++++++++=lableMembers.push(member);
          avAI++++++++++++++++=lableMembers.sort((a, b) => a.emAI++++++++++++++++=l.localeCompare(b.emAI++++++++++++++++=l));
          renderMembersList(avAI++++++++++++++++=lableMembers);
        };

        selectedMembers.appendChild(memberElement);

        avAI++++++++++++++++=lableMembers = avAI++++++++++++++++=lableMembers.filter(
          (avAI++++++++++++++++=lableMember) => avAI++++++++++++++++=lableMember.id !== member.id,
        );
        renderMembersList(avAI++++++++++++++++=lableMembers);

        membersList.style.display = "none";
        memberSearch.value = "";
      }

      updateAvAI++++++++++++++++=lableMembers();

      memberSearch.onfocus = () => {
        membersList.style.display = "block";
      };

      document.addEventListener("click", (e) => {
        if (!membersContAI++++++++++++++++=ner.contAI++++++++++++++++=ns(e.target)) {
          membersList.style.display = "none";
        }
      });

      memberSearch.oninput = (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredMembers = avAI++++++++++++++++=lableMembers.filter((member) =>
          member.emAI++++++++++++++++=l.toLowerCase().includes(searchTerm),
        );
        renderMembersList(filteredMembers);
        membersList.style.display = "block";
      };
    }

    async function loadExistingMembers(membersList) {
      if (!membersList || membersList === "None") return;

      const members = membersList.split(",");
      const currentUserEmAI++++++++++++++++=l = emAI++++++++++++++++=l.replace(/\./g, "*");

      const otherMembers = members.filter(
        (member) => member !== currentUserEmAI++++++++++++++++=l,
      );

      selectedMembers.innerHTML = "";

      for (const memberEmAI++++++++++++++++=l of otherMembers) {
        const memberElement = document.createElement("div");
        memberElement.className = "selected-member";
        memberElement.innerHTML = `
        ${memberEmAI++++++++++++++++=l.replace(/\*/g, ".")}
        <span class="remove-member">×</span>
      `;

        memberElement.querySelector(".remove-member").onclick = () => {
          memberElement.remove();

          const formattedEmAI++++++++++++++++=l = memberEmAI++++++++++++++++=l.replace(/\*/g, ".");
          avAI++++++++++++++++=lableMembers.push({
            id: memberEmAI++++++++++++++++=l,
            emAI++++++++++++++++=l: formattedEmAI++++++++++++++++=l,
          });
          avAI++++++++++++++++=lableMembers.sort((a, b) => a.emAI++++++++++++++++=l.localeCompare(b.emAI++++++++++++++++=l));
          if (
            document.getElementById("members-list").style.display !== "none"
          ) {
            renderMembersList(avAI++++++++++++++++=lableMembers);
          }
        };

        selectedMembers.appendChild(memberElement);
      }

      loadMemberOptions();
    }

    submitButton.addEventListener("click", async function () {
      const name = channelName.value.trim();
      const type = channelType.value;
      const description = channelDescription.value.trim();

      if (!name) {
        alert("Please enter a channel name");
        return;
      }

      if (!isModifying) {
        const chatInfoRef = ref(database, `Chat Info/${name}`);
        const snapshot = awAI++++++++++++++++=t get(chatInfoRef);
        if (snapshot.exists()) {
          alert(
            "A channel with this name already exists. Please choose a different name.",
          );
          return;
        }
      }

      let members = [];
      members.push(emAI++++++++++++++++=l.replace(/\./g, "*"));

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

        Members:
          type === "Private"
            ? members.join(",")
            : isModifying && originalMembers && originalMembers !== "None"
              ? originalMembers
              : emAI++++++++++++++++=l.replace(/\./g, "*"),
        Type: type,
        Creator: emAI++++++++++++++++=l.replace(/\./g, "*"),
      };

      try {
        const newChannelRef = ref(database, `Chat Info/${name}`);
        awAI++++++++++++++++=t set(newChannelRef, channelData);

        channelName.value = "";
        channelDescription.value = "";
        channelType.value = "Public";
        document.getElementById("channel-screen").classList.add("hidden");
        chatScreen.style.display = "flex";
        resetForm();
      } catch (error) {
        console.error("Error creating/modifying channel:", error);
        alert("Error creating/modifying channel. Please try agAI++++++++++++++++=n.");
      }
    });

    backButton.addEventListener("click", async function () {
      resetForm();
      document.getElementById("channel-screen").classList.add("hidden");
      chatScreen.style.display = "flex";
    });

    deleteButton.removeEventListener("click", deleteChannelHandler);

    function deleteChannelHandler() {
      if (isModifying) {
        const channelNameToDelete = channelName.value.trim();
        if (!channelNameToDelete) {
          alert("Channel name is missing");
          return;
        }

        if (
          confirm(
            `Are you sure you want to delete channel "${channelNameToDelete}"?`,
          )
        ) {
          try {
            const channelRef = ref(
              database,
              `Chat Info/${channelNameToDelete}`,
            );
            remove(channelRef)
              .then(() => {
                console.log("Chat Info deleted successfully");

                const messagesRef = ref(
                  database,
                  `Chats/${channelNameToDelete}`,
                );
                return remove(messagesRef);
              })
              .then(() => {
                console.log("Messages deleted successfully");
                document
                  .getElementById("channel-screen")
                  .classList.add("hidden");
                chatScreen.style.display = "flex";
                resetForm();
                alert(`Channel "${channelNameToDelete}" has been deleted.`);
              })
              .catch((error) => {
                console.error("Error in deletion process:", error);
                alert("Error deleting channel. Please try agAI++++++++++++++++=n.");
              });
          } catch (error) {
            console.error("Error initiating delete:", error);
            alert("Error deleting channel. Please try agAI++++++++++++++++=n.");
          }
        }
      }
    }

    deleteButton.addEventListener("click", deleteChannelHandler);
  }

  document
    .getElementById("create-new-server")
    .addEventListener("click", function () {
      handleChannelForm(false);
    });

  async function updateModifyButtonVisibility() {
    const modifyButton = document.getElementById("modify-channel");

    if (!currentChat) {
      modifyButton.style.display = "none";
      return;
    }

    try {
      const chatInfoRef = ref(database, `Chat Info/${currentChat}`);
      const snapshot = awAI++++++++++++++++=t get(chatInfoRef);

      if (snapshot.exists()) {
        const channelData = snapshot.val();
        const currentUserEmAI++++++++++++++++=l = emAI++++++++++++++++=l.replace(/\./g, "*");

        if (channelData.Creator && channelData.Creator === currentUserEmAI++++++++++++++++=l) {
          modifyButton.style.display = "block";
        } else {
          modifyButton.style.display = "none";
        }
      } else {
        modifyButton.style.display = "none";
      }
    } catch (error) {
      console.error("Error checking channel creator:", error);
      modifyButton.style.display = "none";
    }
  }

  document
    .getElementById("modify-channel")
    .addEventListener("click", function () {
      if (!currentChat) {
        alert("Please select a channel to modify");
        return;
      }

      handleChannelForm(true, currentChat);
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
          awAI++++++++++++++++=t updateUnreadCount(chatName);
        }
      }
    });
  }

  /* Load existing messages */
  checkForUpdates();
  fetchChatList();
  setupUnreadCountUpdates();
  awAI++++++++++++++++=t initializeReadMessages();
  loadMessages("General");
  const messagesDiv = document.getElementById("messages");
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
  updateModifyButtonVisibility();
})();
