// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyClJtSEK7wybjP6Cqs3MGu1euVA3rasJ9Y",
    authDomain: "swiftlybackend.firebaseapp.com",
    projectId: "swiftlybackend",
    storageBucket: "swiftlybackend.appspot.com",
    messagingSenderId: "379805934715",
    appId: "1:379805934715:web:7c03cf61061057297aeede"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

// Initialize Firebase Auth and Firestore
const auth = firebase.auth();
const db = firebase.firestore();

const provider = new firebase.auth.GithubAuthProvider();
provider.addScope('user:email'); // This requests the user's email from GitHub.

function handleGitHubSignIn() {
    auth.signInWithPopup(provider) // Changed to signInWithPopup
        .then((result) => {
            // This gives you a GitHub Access Token.
            const token = result.credential.accessToken;

            // Use token to fetch the user's profile information from GitHub.
            fetch('https://api.github.com/user/emails', {
                headers: {
                    'Authorization': `token ${token}`
                }
            })
            .then(response => response.json())
            .then(emails => {
                const primaryEmail = emails.find(email => email.primary).email;
                saveUserEmailToWaitlist(result.user.uid, primaryEmail);
            })
            .catch((error) => {
                console.error('Error fetching user email from GitHub:', error);
            });
        })
        .catch((error) => {
            console.error('Error during GitHub sign-in:', error);
        });
}

auth.getRedirectResult().then((result) => {
    if (result.credential) {
        // This gives you a GitHub Access Token.
        const token = result.credential.accessToken;

        // Use token to fetch the user's profile information from GitHub.
        fetch('https://api.github.com/user/emails', {
            headers: {
                'Authorization': `token ${token}`
            }
        })
        .then(response => response.json())
        .then(emails => {
            // The user's primary email address is the one marked as 'primary'.
            const primaryEmail = emails.find(email => email.primary).email;

            // Call the function to save the email to Firestore.
            saveUserEmailToWaitlist(result.user.uid, primaryEmail);
        })
        .catch((error) => {
            console.error('Error fetching user email from GitHub:', error);
        });
    }
    }).catch((error) => {
        // Handle errors
        console.error('Error during GitHub redirect sign-in:', error);
        });
        
        document.addEventListener('DOMContentLoaded', function() {
        const signInButton = document.getElementById('github-signin');
        if (signInButton) {
            signInButton.addEventListener('click', handleGitHubSignIn);
        }
    });


document.addEventListener('DOMContentLoaded', function() {
    const signInButton = document.getElementById('github-signin');
    signInButton.addEventListener('click', handleGitHubSignIn);
});


function saveUserEmailToWaitlist(userId, email) {
    // Assuming your collection is named 'waitlist'
    db.collection('waitlist').doc(userId).set({
        Email: email,
        Approved: false // Set to false by default, as per your Firestore screenshot
    })
    .then(() => {
        console.log('User email added to waitlist!');
        // Here you can redirect the user or show a confirmation message
    })
    .catch((error) => {
        console.error('Error adding user to waitlist: ', error);
        // Handle any errors here, such as showing a message to the user
    });
}


// terminal
// let inputContent = `
//     <svg class="terminal_cursor" width="15" height="9" viewBox="0 0 15 9" fill="none" xmlns="http://www.w3.org/2000/svg">
//         <rect width="3" height="3" fill="#AAAAAA"/>
//         <rect x="3" y="3" width="3" height="3" fill="#AAAAAA"/>
//         <rect y="6" width="3" height="3" fill="#AAAAAA"/>
//         <rect x="9" y="6" width="3" height="3" fill="#AAAAAA"/>
//         <rect x="12" y="6" width="3" height="3" fill="#AAAAAA"/>
//     </svg>
//     <input type="text" autofocus class="terminal_input">
// `


// document.addEventListener("DOMContentLoaded", () => {
//     let terminal = document.querySelector(".terminal");
//     let terminalInput = document.querySelector(".terminal_input");

//     // Function to display output in the terminal
//     function displayOutput(message) {
//         let output = document.createElement("h3");
//         output.innerHTML = message;
//         output.classList.add("output");
//         terminal.appendChild(output);
//     }

//     // Function to simulate pressing Enter
//     function simulateEnterKeyPress() {
//         const enterEvent = new KeyboardEvent('keydown', {
//             key: 'Enter',
//             code: 'Enter',
//             which: 13,
//             keyCode: 13,
//         });
//         terminalInput.dispatchEvent(enterEvent);
//     }

//     // Function to simulate typing each character
//     function typeCharacterByCharacter(text, index = 0, callback) {
//         if (index < text.length) {
//             terminalInput.value += text[index];
//             setTimeout(() => typeCharacterByCharacter(text, index + 1, callback), 100); // Adjust 100ms for typing speed
//         } else if (callback) {
//             callback();
//         }
//     }

//     // Set up the keypress event listener
//     terminal.addEventListener("keypress", function(event) {
//         terminalInput = event.target; // Update the terminalInput to the current active input

//         if (terminalInput.classList.contains('terminal_input') && event.key === "Enter") {
//             event.preventDefault();

//             let command = terminalInput.value.trim().toLowerCase(); // Get and trim the input value, make it lowercase

//             switch(command) {
//                 case 'gg':
//                     // Handle 'gg' command
//                     displayOutput("GG command executed.");
//                     break;
//                 case 'help':
//                     displayOutput("Commands available: gg, help, info, quit");
//                     break;
//                 case 'info':
//                     displayOutput("This is a cool terminal app.");
//                     break;
//                 case 'quit':
//                     displayOutput("Goodbye!");
//                     break;
//                 default:
//                     displayOutput("Invalid Command");
//             }

//             // Disable the current input
//             terminalInput.setAttribute("disabled", "");

//             // Remove activeInput class from the current input's container
//             terminalInput.parentElement.classList.remove("activeInput");

//             // Create a new input container
//             let inputContainer = document.createElement("div");
//             inputContainer.innerHTML = inputContent;
//             inputContainer.classList.add("inputDiv", "activeInput");
//             terminal.appendChild(inputContainer);

//             // Focus the new input
//             let newInput = inputContainer.querySelector(".terminal_input");
//             if (newInput) {
//                 newInput.focus();
//             }
//         }
//     });

//     // Start typing "gg" and then simulate pressing Enter
//     setTimeout(() => {    
//         typeCharacterByCharacter("gg", 0, simulateEnterKeyPress);
//     }, 300)
// });
