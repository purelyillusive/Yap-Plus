(async function () {
  if (document.getElementById("bookmarklet-gui")) {
    const gui = document.getElementById("bookmarklet-gui");
    gui.style.opacity = "1";
    gui.style.display = "flex";
  } else {
    /* Firebase Config */
    const firebaseConfig = {
      apiKey: "AIzaSyBze6NI0eB8S2RK5pr9E97dirYp5propCw",
      authDomain: "yap--window.firebaseapp.com",
      databaseURL: "https://yap--window-default-rtdb.firebaseio.com",
      projectId: "yap--window",
      storageBucket: "yap--window.firebasestorage.app",
      messagingSenderId: "331436638756",
      appId: "1:331436638756:web:15affa3bf7a433d7a04eb1",
      measurementId: "G-R6NQW8X18R"
    };

    var database, auth, provider, email, mostRecentVersionKey;
    try {
      /* Dynamically load Firebase modules */
      var { initializeApp } = await import(
        "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js"
      );
      var { getDatabase, get, ref, set, onValue, push, update, remove, child } =
        await import(
          "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js"
        );
      var {
        getAuth,
        GoogleAuthProvider,
        createUserWithEmailAndPassword,
        signInWithPopup,
        signInWithEmailAndPassword,
        sendEmailVerification,
        sendSignInLinkToEmail,
        isSignInWithEmailLink,
        signInWithEmailLink,
        setPersistence,
        browserLocalPersistence,
        onAuthStateChanged,
      } = await import(
        "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js"
      );

      var app = initializeApp(firebaseConfig);
      database = getDatabase(app);
      auth = getAuth(app);
      provider = new GoogleAuthProvider();
    } catch (error) {
      console.error("Error initializing Firebase:", error);
      alert("Firebase initialization failed. Check the console for details.");
      return;
    }

    fetch(
      "https://raw.githubusercontent.com/purelyillusive/Yap-Plus/refs/heads/main/Code/guiTEST.js?token=$(date +%s)",
    )
      .then((r) => r.text())
      .then((code) => {
        eval(code);
        const gui = document.getElementById("bookmarklet-gui");
        async function openChatScreen() {
          const firebaseStuff = {
            database,
            auth,
            app,
            getDatabase,
            get,
            ref,
            set,
            onValue,
            push,
            update,
            remove,
            child,
          };
          fetch(
            "https://raw.githubusercontent.com/purelyillusive/Yap-Plus/refs/heads/main/Code/chatTEST.js?token=$(date +%s)",
          )
            .then((r) => r.text())
            .then((chatCode) => {
              const wrappedChatCode = `
              (function(firebaseStuff) {
                const { database, auth, app, getDatabase, get, ref, set, onValue, push, update, remove, child  } = firebaseStuff;
                ${chatCode}
              })(firebaseStuff);
            `;
              eval(wrappedChatCode);
            })
            .catch((error) => {
              console.error("Error loading chat code:", error);
              alert("Failed to load chat code. Check the console for details.");
            });
        }

        const mainScreen = document.getElementById("main-screen");
        const loginScreen = document.getElementById("login-screen");
        const createScreen = document.getElementById("create-account-screen");
        const customizeScreen = document.getElementById(
          "customize-account-screen",
        );
        const verificationScreen = document.getElementById(
          "verification-screen",
        );
        const stayloginScreen = document.getElementById("stay-login-screen");
        const savedAccountScreen = document.getElementById("saved-account");

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          unsubscribe();
          if (user) {
            const storedForget = localStorage.getItem("neverPersist");
            const email = user.email;
            const sanitizedEmail = email.replace(/\./g, "*");
            const usernameRef = ref(
              database,
              `Accounts/${sanitizedEmail}/Username`,
            );

            mainScreen.classList.add("hidden");
            savedAccountScreen.classList.remove("hidden");

            try {
              const snapshot = await get(usernameRef);
              if (snapshot.exists()) {
                const username = snapshot.val();
                document.getElementById("saved-username").textContent =
                  "Username: " + username;
              } else {
                console.error("No username found for this email.");
                document.getElementById("saved-username").textContent =
                  "Username: Not Found";
              }
            } catch (error) {
              console.error("Error fetching username:", error);
              document.getElementById("saved-username").textContent =
                "Username: Error";
            }

            document.getElementById("saved-email").textContent =
              "Email: " + email;

            document.getElementById("saved-login-button").onclick =
              function () {
                savedAccountScreen.classList.add("hidden");
                openChatScreen();
              };

            document.getElementById("saved-signout-button").onclick =
              async function () {
                try {
                  await auth.signOut();
                  savedAccountScreen.classList.add("hidden");
                  mainScreen.classList.remove("hidden");
                } catch (error) {
                  console.error("Error signing out:", error);
                }
              };
          } else {
            mainScreen.classList.remove("hidden");
          }
        });

        async function handleEmailVerification(user, screen) {
          let retryCount = 0;
          let verificationCheckInterval;
          verificationScreen.classList.remove("hidden");
          screen.classList.add("hidden");
          async function attemptVerification() {
            try {
              await sendEmailVerification(user);

              return true;
            } catch (error) {
              await new Promise((resolve) => setTimeout(resolve, 2000));
              return await attemptVerification();
            }
          }
          await attemptVerification();

          return new Promise((resolve) => {
            verificationCheckInterval = setInterval(async () => {
              try {
                await auth.currentUser.reload();
                if (auth.currentUser.emailVerified) {
                  clearInterval(verificationCheckInterval);

                  verificationScreen.classList.add("hidden");
                  resolve();
                }
              } catch (error) {
                console.error("Error checking verification status:", error);
              }
            }, 1000);

            document.getElementById("resend-verification").onclick =
              async () => {
                try {
                  await sendEmailVerification(auth.currentUser);
                  document.getElementById("verification-error").textContent =
                    "Verification email resent!";
                } catch (error) {
                  document.getElementById("verification-error").textContent =
                    error.message;
                }
              };
          }).finally(() => {
            if (verificationCheckInterval) {
              clearInterval(verificationCheckInterval);
            }
          });
        }

        storedEmail = localStorage.getItem("userEmail");
        /* Login and Create Account functions */
        document.getElementById("login-button").onclick = function () {
          mainScreen.classList.add("hidden");
          loginScreen.classList.remove("hidden");
        };

        document.getElementById("create-account-button").onclick = function () {
          mainScreen.classList.add("hidden");
          createScreen.classList.remove("hidden");
        };

        /* Account creation using email and password */
        document.getElementById("submit-create-email").onclick =
          async function () {
            const emailInput = document.getElementById("create-email");
            const passwordInput = document.getElementById("create-password");
            const errorLabel = document.getElementById("create-email-error");
            email = emailInput.value.trim();
            const password = passwordInput.value.trim();

            if (!email || !password) {
              errorLabel.textContent = "Please enter both email and password.";
              return;
            }

            try {
              const result = await createUserWithEmailAndPassword(
                auth,
                email,
                password,
              );
              const user = result.user;

              email = user.email;

              await handleEmailVerification(user, createScreen);

              emailInput.value = "";
              passwordInput.value = "";
              errorLabel.textContent = "";
              create_account();
              customizeScreen.classList.remove("hidden");
              createScreen.classList.add("hidden");
              document.getElementById("create-username").value = "Anonymous";
            } catch (error) {
              errorLabel.textContent = error.message;
            }
          };

        /* Account creation using Google */
        document.getElementById("google-create-button").onclick =
          async function () {
            try {
              result = await signInWithPopup(auth, provider);
              const user = result.user;
              email = result.user;
              email = user.email = user.email;
              create_account();
              customizeScreen.classList.remove("hidden");
              createScreen.classList.add("hidden");
              document.getElementById("create-username").value = "Anonymous";
            } catch (error) {
              document.getElementById("create-email-error").textContent =
                error.message;
            }
          };

        /* Back Create Button */
        document.getElementById("back-create-button").onclick =
          async function () {
            mainScreen.classList.remove("hidden");
            createScreen.classList.add("hidden");
          };

        /* Log In Submit Button */
        document.getElementById("submit-login-email").onclick =
          async function () {
            const emailInput = document.getElementById("login-email");
            const passwordInput = document.getElementById("login-password");
            const errorLabel = document.getElementById("login-email-error");
            email = emailInput.value.trim();
            const password = passwordInput.value.trim();

            if (!email || !password) {
              errorLabel.textContent = "Please enter your email and password.";
              return;
            }

            try {
              const result = await signInWithEmailAndPassword(
                auth,
                email,
                password,
              );
              const user = result.user;

              if (!user.emailVerified) {
                console.log("yay!");
                await handleEmailVerification(user, loginScreen);
              }

              email = user.email;
              emailInput.value = "";
              passwordInput.value = "";
              errorLabel.textContent = "";

              const storedForget = localStorage.getItem("neverPersist");

              if (storedForget !== "true") {
                loginScreen.classList.add("hidden");
                stayloginScreen.classList.remove("hidden");
              } else {
                loginScreen.classList.add("hidden");
                openChatScreen();
              }
            } catch (error) {
              errorLabel.textContent = error.message;
            }
          };

        /* Google Log In */
        document.getElementById("google-login-button").onclick =
          async function () {
            try {
              result = await signInWithPopup(auth, provider);
              const user = result.user;
              email = user.email;
              const storedForget = localStorage.getItem("neverPersist");

              if (storedForget !== "true") {
                loginScreen.classList.add("hidden");
                stayloginScreen.classList.remove("hidden");
              } else {
                loginScreen.classList.add("hidden");
                openChatScreen();
              }
            } catch (error) {
              const errorLabel = document.getElementById("login-email-error");
              errorLabel.textContent = error.message;
            }
          };

        /* Back Login Button */
        document.getElementById("back-login-button").onclick =
          async function () {
            mainScreen.classList.remove("hidden");
            loginScreen.classList.add("hidden");
          };

        /* Account Creation */
        function create_account() {
          const accountsRef = ref(
            database,
            `Accounts/${email.replace(/\./g, "*")}`,
          );

          const updatesRef = ref(database, "Updates");

          get(updatesRef)
            .then((updatesSnapshot) => {
              const updates = updatesSnapshot.val();

              const versionKeys = Object.keys(updates).sort((a, b) => {
                const aParts = a.split("*").map(Number);
                const bParts = b.split("*").map(Number);

                for (
                  let i = 0;
                  i < Math.max(aParts.length, bParts.length);
                  i++
                ) {
                  const aSegment = aParts[i] || 0;
                  const bSegment = bParts[i] || 0;

                  if (aSegment < bSegment) return -1;
                  if (aSegment > bSegment) return 1;
                }

                return 0;
              });

              mostRecentVersionKey = versionKeys[versionKeys.length - 1];

              const accountData = {
                Bio: "None",
                Username: "Anonymous",
                Version: mostRecentVersionKey,
              };

              set(accountsRef, accountData)
                .then(() => {
                  console.log(
                    "Account created successfully with version:",
                    mostRecentVersionKey,
                  );
                })
                .catch((error) => {
                  console.error("Error creating account:", error);
                  alert("Failed to create account. Please try again.");
                });
            })
            .catch((error) => {
              console.error("Error fetching updates:", error);
              alert("Failed to fetch the latest version. Please try again.");
            });
        }

        /* Customize Account Button */
        document.getElementById("submit-customize").onclick =
          async function () {
            const username = document
              .getElementById("create-username")
              .value.trim();
            const bio = document.getElementById("create-bio").value.trim();

            const accountsRef = ref(
              database,
              `Accounts/${email.replace(/\./g, "*")}`,
            );
            const updatedAccountData = {
              Username: username || "Anonymous",
              Bio: bio || "I'm a yapper",
              Version: mostRecentVersionKey,
            };

            set(accountsRef, updatedAccountData)
              .then(() => {})
              .catch((error) => {
                console.error("Error updating profile:", error);
                alert("Failed to update profile. Please try again.");
              });
            stayloginScreen.classList.remove("hidden");
            customizeScreen.classList.add("hidden");
          };

        document.getElementById("stay-yes").onclick = async function () {
          localStorage.setItem("userEmail", email);
          openChatScreen();
          stayloginScreen.classList.add("hidden");
        };
        document.getElementById("stay-no").onclick = async function () {
          openChatScreen();
          stayloginScreen.classList.add("hidden");
        };
        document.getElementById("stay-forget").onclick = async function () {
          localStorage.setItem("userEmail", "none");
          openChatScreen();
          stayloginScreen.classList.add("hidden");
        };
      });
  }
})();
