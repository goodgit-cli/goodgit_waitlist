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


window.onload = function() {
  var emails = ['saket@goodgit.io', 'shubham@goodgit.io']; // Array of emails
  var randomEmail = emails[Math.floor(Math.random() * emails.length)]; // Get a random email
  document.getElementById('email').textContent = randomEmail; // Set the random email
};

document.getElementById('email').addEventListener('click', function(event) {
  // Copy email to clipboard
  navigator.clipboard.writeText(event.target.textContent).then(function() {
    // Create the "Copied!" message element
    var copiedMsg = document.createElement('span');
    copiedMsg.textContent = 'Copied!';
    copiedMsg.classList.add('copied-message'); // Refer to this class in your CSS
    document.body.appendChild(copiedMsg);

    // Position the message right above the email
    var emailRect = event.target.getBoundingClientRect();
    copiedMsg.style.left = emailRect.left + 'px';
    copiedMsg.style.top = emailRect.top - emailRect.height + 'px';

    // Animation part: fade out or fly away
    // Remove the message after animation is complete
    setTimeout(function() {
      copiedMsg.remove();
    }, 2000); // Adjust time as needed for your animation
  }).catch(function(error) {
    console.error('Error copying text: ', error);
  });
});


let hamburger = document.querySelector(".hamburger")
let cross = document.querySelector(".cross")
let menuActive = false;
let menu = document.querySelector(".menu")
let linkItemMobiles = document.querySelectorAll(".link-item-mobile")


hamburger.addEventListener("click", () => {
  if (menuActive == false){
    menu.classList.add("menuvisible")
    menuActive = true
  }
})

cross.addEventListener("click", () => {
  if (menuActive == true){
    menu.classList.remove("menuvisible")
    menuActive = false
  }
})

linkItemMobiles.forEach((linkItemMobile) => {
  linkItemMobile.addEventListener("click", () => {
    if (menuActive == true){
      menu.classList.remove("menuvisible")
      menuActive = false
    }
  })
})

