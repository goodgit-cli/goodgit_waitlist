function notify(message, type){
    notificationElement = `
        <div class="notification ${type}">
            <h2>${message}</h2>
        </div>
    `

    notificationDiv = document.createElement("div")
    notificationDiv.innerHTML = notificationElement

    document.body.appendChild(notificationDiv)
    
    setTimeout(() => {
        document.body.removeChild(notificationDiv)
    }, 3000)
}


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
let mainEmail;

const provider = new firebase.auth.GithubAuthProvider();
provider.addScope('user:email'); // This requests the user's email from GitHub.

function handleGitHubSignIn() {
    auth.signInWithPopup(provider)
        .then((result) => {
            const token = result.credential.accessToken;
            fetch('https://api.github.com/user/emails', {
                headers: {
                    'Authorization': `token ${token}`
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(emails => {
                const primaryEmail = emails.find(email => email.primary).email;
                mainEmail = primaryEmail;
                return fetch('https://api.github.com/user', {
                    headers: {
                        'Authorization': `token ${token}`
                    }
                });
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(userData => {
                const githubUrl = userData.html_url;
                saveUserEmailToWaitlist(result.user.uid, mainEmail, githubUrl);
            })
            .catch((error) => {
                console.error('Error fetching data from GitHub:', error);
                notify("Error fetching data :(", "warning");
            });
        })
        .catch((error) => {
            console.error('Error during GitHub sign-in:', error);
            notify("Error during sign in :(", "warning");
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
            notify("Error fetching user email :(", "warning")
        });
    }
    }).catch((error) => {
        // Handle errors
        console.error('Error during GitHub redirect sign-in:', error);
        notify("Error with github sign in :(", "warning")
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

function addedToWaitlistFunc(){
    document.querySelector(".github_signin").classList.add("signedIn")
    document.querySelector(".github_signin").innerHTML = "Joined Waitlist :)"
}

function saveUserEmailToWaitlist(userId, email, githubUrl) {
    // Assuming your collection is named 'waitlist'
    db.collection('waitlist').doc(userId).set({
        Email: email,
        GitHubUrl: githubUrl,
        Approved: false, // Set to false by default, as per your Firestore screenshot
        Timestamp: firebase.firestore.FieldValue.serverTimestamp() // Add this line for timestamp
    })
    .then(() => {
        console.log('User email added to waitlist with timestamp!');
        notify("Email added to waitlist!", "success");
        // Set initial values
        localStorage.setItem('addedToWaitlist', 'True');
        localStorage.setItem('approved', 'False');
        addedToWaitlistFunc();
    })
    .catch((error) => {
        console.error('Error adding user to waitlist: ', error);
        notify("Some error occured, please try again.", "warning");
        // Handle any errors here, such as showing a message to the user
    });
}


// Get values
var addedToWaitlist = localStorage.getItem('addedToWaitlist');
var approved = localStorage.getItem('approved');

document.addEventListener("DOMContentLoaded", function() {
    // Parses the query string and returns an object of parameters
    function getQueryParams() {
        var queryParams = {};
        var queryString = window.location.search.substring(1);
        var queryParamsArray = queryString.split('&');

        for (var i = 0; i < queryParamsArray.length; i++) {
            var pair = queryParamsArray[i].split('=');
            queryParams[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
        }
        return queryParams;
    }

    // Get the query parameters
    var params = getQueryParams();

    // Check if 'approved' is 'true'
    if (params.approved === "true") {
        localStorage.setItem('approved', 'True');     
        window.location.replace("https://www.goodgit.io/approved.html");
    }
});


if (addedToWaitlist == 'True'){
    addedToWaitlistFunc()
}

if (approved == 'True'){
    window.location.replace("https://www.goodgit.io/approved.html");
}


function copyFeedback(event) {
    let copyElement = event.target;
    let rect = copyElement.getBoundingClientRect();
    let copiedText = document.createElement('div');
    copiedText.innerHTML = "Copied";
    copiedText.classList.add('copied');
    copiedText.style.left = rect.left + "px";
    copiedText.style.top = rect.top + "px";
    document.body.appendChild(copiedText);
    setTimeout(() => {
      copiedText.style.opacity = 0;
    }, 100);  // Initiate fade-out right away
    setTimeout(() => {
      document.body.removeChild(copiedText);
    }, 1000);  // Remove after fade-out
  }

  document.querySelectorAll('.copy').forEach(button => {
    button.addEventListener('click', () => {
      let siblingTextElement = [...button.parentNode.children].find(child => child.classList.contains('text'));
      if (siblingTextElement) {
        let span = siblingTextElement.querySelector('span');
        if (span) {
          navigator.clipboard.writeText(span.innerText)
            .then(() => console.log('Text copied!'))
            .catch(err => console.error('Error in copying text: ', err));
        } else {
          console.error('No span element found.');
        }
      } else {
        console.error('No sibling .text element found.');
      }
    });
});


let tabs = document.querySelectorAll(".tab")
let allTerminals = document.querySelectorAll(".terminalContent")
let terminalAi = document.querySelector(".terminalContentAi")
let terminalSsh = document.querySelector(".terminalContentSsh")
let terminalTt = document.querySelector(".terminalContentTt")
let terminalMa = document.querySelector(".terminalContentMa")
let terminalMore = document.querySelector(".terminalContentMore")

tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
        document.querySelector(".activeTab").classList.remove("activeTab")
        tab.classList.add("activeTab")
        let dataValue = tab.getAttribute("value")
        if (dataValue == "AiCommits"){
            allTerminals.forEach((allTerminal) => {
                allTerminal.classList.remove('activeTerminal')
                terminalAi.classList.add("activeTerminal")
            })
        }

        else if (dataValue == "ssh"){
            allTerminals.forEach((allTerminal) => {
                allTerminal.classList.remove('activeTerminal')
                terminalSsh.classList.add("activeTerminal")
            })
        }

        else if (dataValue == "tt"){
            allTerminals.forEach((allTerminal) => {
                allTerminal.classList.remove('activeTerminal')
                terminalTt.classList.add("activeTerminal")
            })
        }

        else if (dataValue == "ma"){
            allTerminals.forEach((allTerminal) => {
                allTerminal.classList.remove('activeTerminal')
                terminalMa.classList.add("activeTerminal")
            })
        }

        else if (dataValue == "more"){
            allTerminals.forEach((allTerminal) => {
                allTerminal.classList.remove('activeTerminal')
                terminalMore.classList.add("activeTerminal")
            })
        }
    })
})


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