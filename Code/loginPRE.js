(async function () {
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

  var database, auth, provider, email, mostRecentVersionKey;
  try {
    /* Dynamically load Firebase modules */
    var { initializeApp } = await import(
      "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js"
    );
    var { getDatabase, get, ref, set } = await import(
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
    "https://raw.githubusercontent.com/TheHumblePotato/Yap-Window/refs/heads/main/Code/guiPRE.js",
  )
    .then((r) => r.text())
    .then((code) => {
      eval(code);
      const gui = document.getElementById("bookmarklet-gui");

      // Add verification screen HTML
      const verificationScreen = document.createElement('div');
      verificationScreen.id = 'verification-screen';
      verificationScreen.classList.add('hidden');
      verificationScreen.innerHTML = `
        <h2>Email Verification</h2>
        <p>Please check your email for a verification link.</p>
        <p>Once you verify your email, click continue below.</p>
        <button id="check-verification">Continue</button>
        <button id="resend-verification">Resend Verification Email</button>
        <p id="verification-error" class="error-text"></p>
      `;
      gui.appendChild(verificationScreen);

      async function openChatScreen() {
        document.getElementById("email-saved-here").textContent = email;

        fetch(
          "https://raw.githubusercontent.com/TheHumblePotato/Yap-Window/refs/heads/main/Code/chatPRE.js",
        )
          .then((r) => r.text())
          .then((chatCode) => eval(chatCode))
          .catch((error) => {
            console.error("Error loading chat.js:", error);
            alert("Failed to load chat.js. Check the console for details.");
          });
      }

      const mainScreen = document.getElementById("main-screen");
      const loginScreen = document.getElementById("login-screen");
      const createScreen = document.getElementById("create-account-screen");
      const customizeScreen = document.getElementById("customize-account-screen");
      const stayloginScreen = document.getElementById("stay-login-screen");
      const savedAccountScreen = document.getElementById("saved-account");

      // Handle email verification
      async function handleEmailVerification(user) {
        try {
          await sendEmailVerification(user);
          verificationScreen.classList.remove('hidden');
          return new Promise((resolve, reject) => {
            document.getElementById('check-verification').onclick = async () => {
              await auth.currentUser.reload();
              if (auth.currentUser.emailVerified) {
                verificationScreen.classList.add('hidden');
                resolve();
              } else {
                document.getElementById('verification-error').textContent = 'Email not yet verified. Please check your email and click the verification link.';
              }
            };
            
            document.getElementById('resend-verification').onclick = async () => {
              try {
                await sendEmailVerification(auth.currentUser);
                document.getElementById('verification-error').textContent = 'Verification email resent!';
              } catch (error) {
                document.getElementById('verification-error').textContent = error.message;
              }
            };
          });
        } catch (error) {
          console.error("Error sending verification email:", error);
          throw error;
        }
      }

      // Modified account creation
      document.getElementById("submit-create-email").onclick = async function () {
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
          const result = await createUserWithEmailAndPassword(auth, email, password);
          const user = result.user;
          email = user.email;
          
          // Handle email verification before proceeding
          await handleEmailVerification(user);
          
          emailInput.value = "";
          passwordInput.value = "";
          errorLabel.textContent = "";
          create_account();
          customizeScreen.classList.remove("hidden");
          createScreen.classList.add("hidden");
          // ... rest of the account creation code
        } catch (error) {
          errorLabel.textContent = error.message;
        }
      };

      // Modified login function
      document.getElementById("submit-login-email").onclick = async function () {
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
          const result = await signInWithEmailAndPassword(auth, email, password);
          const user = result.user;

          if (!user.emailVerified) {
            await handleEmailVerification(user);
          }

          email = user.email;
          emailInput.value = "";
          passwordInput.value = "";
          errorLabel.textContent = "";
          
          if ((!storedEmail || storedEmail == "") && storedEmail != "none") {
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

      // Rest of your existing code...
    });
})();
