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

        if (root.querySelector("div.replymind-twt-container") === null) {
            const btnLike = getReplyMindButton(0, "  👍  "); // like
            const btnDislike = getReplyMindButton(1, "  👎  "); // dislike
            const btnSupport = getReplyMindButton(2, "❤️ Support"); // support
            const btnJoke = getReplyMindButton(3, "😂 Funny"); //joke
            const btnIdea = getReplyMindButton(4, "💡Thought"); // idea
            const btnQuestion = getReplyMindButton(5, "🤔 Curious"); // question
            const btnRegen = getReplyMindButton(6, "🔁 Regenerate"); // regenerate
            btnRegen.disabled = true;

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
            container.appendChild(btnRegen);
    
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

// current react button on action
var ctype = -1;

/**
 * function to get poster, caption
 * send them to the server and
 * fetch ChatGPT response
 * @param "viewClicked" : clicked button
 * @param "type" : type of reaction
 */
async function generateComment(viewClicked, type) {
    disableButtons(viewClicked);

    try {
        // name of the poster
        const poster = viewClicked.closest("[data-viewportview='true']")
                      .querySelector("[data-testid='User-Name']")
                      .children[0].textContent.trim();
        // caption of the post
        const caption = viewClicked.closest("[data-viewportview='true']")
                        .querySelector("[data-testid='tweetText']")
                        .textContent.trim();

        const contentEditableDiv = viewClicked.closest("[data-viewportview='true']")
                        .querySelector("div.notranslate.public-DraftEditor-content");
        
        // usual reply, full/completion
        if (type !== 6) {
            ctype = type;
            // reply completion
            if(contentEditableDiv.textContent) {
                const incmpltComment = contentEditableDiv.textContent;
                await fetch("https://replymind.cyclic.app/api/twitter/completion", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        poster: poster,
                        caption: caption,
                        incmpltComment: incmpltComment,
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
                    document.execCommand('selectAll', true);
                    document.execCommand('delete', true);
                    document.execCommand('insertText', true, data.comment);
                });
            }
            // full reply
            else {
                await fetch("https://replymind.cyclic.app/api/twitter/full", {
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
                    document.execCommand('insertText', true, data.comment);
                });
            }
        }
        // type === 6, that means regenerate reply
        else {
            const regenComment = contentEditableDiv.textContent;
            // fetch ChatGPT response from server
            await fetch("https://replymind.cyclic.app/api/twitter/regen", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    poster: poster,
                    caption: caption,
                    regenComment: regenComment,
                    type: ctype
                })
            })
            .then((res) => res.json())
            .then((data) => {
                /**
                 * trigger event insert text
                 * with response text from server
                 * https://stackoverflow.com/a/72935050
                 */
                document.execCommand('selectAll', true);
                document.execCommand('delete', true);
                document.execCommand('insertText', true, data.comment);
            });
        }
        
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