/**
 * focus event listener
 * to check if an element is focused
 */
document.addEventListener("focusin", (e) => {
    const viewOnFocus = e.target;
    const commentDivClass = "notranslate public-DraftEditor-content";

    /**
     * if the focused element is the comment box
     * then generate ReplyMind buttons below
     */
    if (viewOnFocus.nodeName === "div" || 
        viewOnFocus.className === commentDivClass) {
        
        const root = document.querySelector("[data-testid='toolBar']").parentNode;

        if (root.firstElementChild.className !== "replymind-twt-container") {
            const btnLike = getReplyMindButton(0, "  👍  "); // like
            const btnDislike = getReplyMindButton(1, "  👎  "); // dislike
            const btnSupport = getReplyMindButton(2, "🫶Support"); // support
            const btnJoke = getReplyMindButton(3, "🔥Joke"); //joke
            const btnIdea = getReplyMindButton(4, "💡Idea"); // idea
            const btnQuestion = getReplyMindButton(5, "❓Question"); // question
    
            // button parent conatiner
            const container = document.createElement("div");
            container.className = "replymind-twt-container";
    
            // insert buttons inside the parent container
            container.appendChild(btnLike);
            container.appendChild(btnDislike);
            container.appendChild(btnSupport);
            container.appendChild(btnJoke);
            container.appendChild(btnIdea);
            container.appendChild(btnQuestion);
    
            root.insertBefore(container, root.firstElementChild);
        }
    }
});


/**
 * function to generate ReplyMind button
 * @param "which" : which button (like/support/...)
 * @param "text" : text of the button
 * @returns generated button
 */
function getReplyMindButton(which, text) { 
    var rmButton = document.createElement("button");
    rmButton.className = "replymind-twt-btn";
    var txtNode = document.createTextNode(text);
    rmButton.appendChild(txtNode);
    rmButton.addEventListener("click", (e) => {
        generateComment(e.target, which);
    });
    return rmButton;
}

/**
 * function to get poster, caption
 * send them to the server and
 * fetch ChatGPT response
 * @param "viewClicked" : clicked button
 * @param "type" : type of reaction
 */
async function generateComment(viewClicked, type) {
    console.log("Generating comment...");

    disableButtons(viewClicked);

    try {
        // name of the poster
        const poster = viewClicked.closest("div.css-1dbjc4n.r-iphfwy")
                      .querySelector("[data-testid='User-Name']")
                      .children[0].textContent.trim();
        // caption of the post
        const caption = viewClicked.closest("div.css-1dbjc4n.r-iphfwy")
                        .querySelector("[data-testid='tweetText']")
                        .textContent.trim();

        // fetch ChatGPT response from server
        await fetch("http://localhost:3000/twitter", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                poster: poster,
                caption: caption,
                type: type
            })
        })
        .then((res) => res.json())
        .then((data) => {
            /**
             * trigger event insert text
             * with response text from server
             * https://stackoverflow.com/a/72935050
             */
            document.execCommand('insertText', false, data.comment);
        });
        
    } catch(err) {
        alert("REPLYMIND: Something went wrong!");
    } finally {
        restoreButtons(viewClicked);
    }
};

function disableButtons (viewClicked) {
  const pDiv = viewClicked.parentNode;
  for (i=0; i<pDiv.childElementCount; i++) 
      pDiv.children[i].disabled = true;
};

function restoreButtons (viewClicked) {
  const pDiv = viewClicked.parentNode;
  for (i=0; i<pDiv.childElementCount; i++) 
      pDiv.children[i].disabled = false;
};