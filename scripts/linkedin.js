/**
 * focus event listener
 * to check if an element is focused
 */
document.addEventListener("focusin", (e) => {
    const viewOnFocus = e.target;
    const commentDivClass = "ql-editor ql-blank";
    /**
     * if the focused element is the comment box
     * then generate ReplyMind buttons below
     */
    if (viewOnFocus.nodeName === "div" || 
        viewOnFocus.className === commentDivClass) {
        
        // closest form parent
        const form_comments = 
            viewOnFocus.closest("form.comments-comment-box__form");

        // if the buttons does NOT already exist
        // then generate the buttons
        if (form_comments.querySelector("div.replymind-linkedin-container") === null) {
            
            const btnLike = getReplyMindButton(0, "  👍  "); // like
            const btnDislike = getReplyMindButton(1, "  👎  "); // dislike
            const btnSupport = getReplyMindButton(2, "❤️ Support"); // support
            const btnJoke = getReplyMindButton(3, "😂 Funny"); //joke
            const btnIdea = getReplyMindButton(4, "💡Thought"); // idea
            const btnQuestion = getReplyMindButton(5, "🤔 Curious"); // question

            // button parent conatiner
            const container = document.createElement("div");
            container.className = "replymind-linkedin-container";

            // insert buttons inside the parent container
            container.appendChild(btnLike);
            container.appendChild(btnDislike);
            container.appendChild(btnSupport);
            container.appendChild(btnJoke);
            container.appendChild(btnIdea);
            container.appendChild(btnQuestion);

            form_comments.appendChild(container);
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
    rmButton.className = "replymind-linkedin-btn";
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
    disableButtons(viewClicked);

    try {
        var poster, caption;
        // if it is a comment
        if (viewClicked.closest("div.comments-comment-box").nextElementSibling) {
            // name of the poster
            poster = viewClicked.closest("div.feed-shared-update-v2")
                   .querySelector("span.update-components-actor__name")
                   .children[0].textContent.trim();
            // caption of the post
            caption = viewClicked.closest("div.feed-shared-update-v2")
                      .querySelector("div.update-components-text")
                      .textContent.trim();
        } 
        // if it is a reply to a comment
        else {
            // name of the commenter
            poster = viewClicked.closest("article.comments-comment-item")
                     .querySelector("span.comments-post-meta__name-text")
                     .textContent.trim();
            // content of the comment
            caption = viewClicked.closest("article.comments-comment-item")
                      .querySelector("span.comments-comment-item__main-content")
                      .textContent.trim();

        }

        // comment box to put ChatGPT response
        const contentEditableDiv = viewClicked.closest("form.comments-comment-box__form")
                                   .querySelector("div.ql-editor");

        // fetch ChatGPT response from server
        await fetch("https://replymind.cyclic.app/linkedin", {
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
            contentEditableDiv.focus();
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