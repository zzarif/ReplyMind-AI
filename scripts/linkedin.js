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
            
            const btnLike = getReplyMindButton(0, " 👍 "); // like
            const btnDislike = getReplyMindButton(1, " 👎 "); // dislike
            const btnSupport = getReplyMindButton(2, "❤️ Support"); // support
            const btnJoke = getReplyMindButton(3, "😂 Funny"); //joke
            const btnIdea = getReplyMindButton(4, "💡 Thought"); // idea
            const btnQuestion = getReplyMindButton(5, "❓ Question"); // question
            const btnComplete = getReplyMindButton(6, "✍️ Complete"); // complete
            const btnRegen = getReplyMindButton(7, "🔁 Regenerate"); // regenerate
            btnComplete.disabled = true;
            btnRegen.disabled = true;


            const txtCount = document.createElement("div");
            txtCount.className = "replymind-linkedin-txt";
            setCountOnView(txtCount);

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
            container.appendChild(btnComplete);
            container.appendChild(btnRegen);
            container.appendChild(txtCount);

            form_comments.appendChild(container);

            viewOnFocus.addEventListener("keyup", (e) => {
                if (viewOnFocus.textContent) {
                    btnComplete.disabled = false;
                    btnRegen.disabled = false;
                } else {
                    btnComplete.disabled = true;
                    btnRegen.disabled = true;
                }
            });
        }
    }
});

var commenter = "";
var comment = "";
document.addEventListener("click", (e) => {
    const viewClicked = e.target;
    if (viewClicked.nodeName === "span" ||
        viewClicked.textContent === "Reply") {
        // name of the commenter
        commenter = viewClicked.closest("article.comments-comment-item")
                    .querySelector("span.comments-post-meta__name-text")
                    .textContent.trim();
        // content of the comment
        comment = viewClicked.closest("article.comments-comment-item")
                    .querySelector("span.comments-comment-item__main-content")
                    .textContent.trim();
    }
})

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

        // chrome.runtime.sendMessage({ action: "getData" }, (response) => {
        //     if (response.response_code === 200 && response.message < 20) {
        //         generateComment(e.target, which);
        //     } else {
        //         alert("REPLYMIND: Get more replies!");
        //     }
        // });
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
        // name of the poster
        var poster = viewClicked.closest("div.feed-shared-update-v2")
                .querySelector("span.update-components-actor__name")
                .children[0].textContent.trim();
        // caption of the post
        var caption = viewClicked.closest("div.feed-shared-update-v2")
                    .querySelector("div.update-components-text")
                    .textContent.trim();
        // comment box to put ChatGPT response
        const contentEditableDiv = viewClicked.closest("form.comments-comment-box__form")
                                   .querySelector("div.ql-editor");
                                
        /**
         * COMMENTING to the post
         */
        if (viewClicked.closest("article.comments-comment-item") === null) {
            // complete comment
            if (type === 6) {
                const incmpltComment = contentEditableDiv.textContent;
                await fetch("https://replymind.cyclic.app/api/linkedin/completion", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        poster: poster,
                        caption: caption,
                        incmpltComment: incmpltComment
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
                    document.execCommand('selectAll', false);
                    document.execCommand('delete', false);
                    document.execCommand('insertText', false, data.comment);
                    updateCountOnView(viewClicked.parentNode.lastChild);
                });
            }
            // regenarate comment
            else if (type === 7) {
                const regenComment = contentEditableDiv.textContent;
                await fetch("https://replymind.cyclic.app/api/linkedin/regen", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        poster: poster,
                        caption: caption,
                        regenComment: regenComment
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
                    document.execCommand('selectAll', false);
                    document.execCommand('delete', false);
                    document.execCommand('insertText', false, data.comment);
                    updateCountOnView(viewClicked.parentNode.lastChild);
                });
            }
            // full comment (type 0 to 5)
            else {
                await fetch("https://replymind.cyclic.app/api/linkedin/full", {
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
                    document.execCommand('selectAll', false);
                    document.execCommand('delete', false);
                    document.execCommand('insertText', false, data.comment);
                    updateCountOnView(viewClicked.parentNode.lastChild);
                });
            }
        }


        /**
         * REPLYING to a comment
         */
        else {
            //
            // complete comment
            if (type === 6) {
                const incmpltComment = contentEditableDiv.textContent;
                await fetch("https://replymind.cyclic.app/api/linkedin/reply-completion", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        poster: poster,
                        caption: caption,
                        commenter: commenter,
                        comment: comment,
                        incmpltComment: incmpltComment
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
                    document.execCommand('selectAll', false);
                    document.execCommand('delete', false);
                    document.execCommand('insertText', false, data.comment);
                    updateCountOnView(viewClicked.parentNode.lastChild);
                });
            }
            // regenarate comment
            else if (type === 7) {
                const regenComment = contentEditableDiv.textContent;
                await fetch("https://replymind.cyclic.app/api/linkedin/reply-regen", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        poster: poster,
                        caption: caption,
                        commenter: commenter,
                        comment: comment,
                        regenComment: regenComment
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
                    document.execCommand('selectAll', false);
                    document.execCommand('delete', false);
                    document.execCommand('insertText', false, data.comment);
                    updateCountOnView(viewClicked.parentNode.lastChild);
                });
            }
            // full comment (type 0 to 5)
            else {
                await fetch("https://replymind.cyclic.app/api/linkedin/reply-full", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        poster: poster,
                        caption: caption,
                        commenter: commenter,
                        comment: comment,
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
                    document.execCommand('selectAll', false);
                    document.execCommand('delete', false);
                    document.execCommand('insertText', false, data.comment);
                    updateCountOnView(viewClicked.parentNode.lastChild);
                });
            }
        }
        
    } catch(err) {
        console.log(err);
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

function setCountOnView (view) {
    chrome.runtime.sendMessage({ action: "getData" }, (response) => {
        if (response.response_code === 200) {
            view.textContent = `${response.message}`;
        }
    });
};

function updateCountOnView (view) {
    chrome.runtime.sendMessage({ action: "setData" }, (response) => {
        setCountOnView(view);
    });
};