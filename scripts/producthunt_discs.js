/**
 * focus event listener
 * to check if an element is focused
 */
document.addEventListener("focusin", (e) => {
    const viewOnFocus = e.target;
    if (viewOnFocus.nodeName === "TEXTAREA") {

        if (viewOnFocus.parentNode.parentNode
            .querySelector("div.replymind-ph-container") === null) {

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

            // button parent conatiner
            const container = document.createElement("div");
            container.className = "replymind-ph-container";

            // insert buttons inside the parent container
            container.appendChild(btnLike);
            container.appendChild(btnDislike);
            container.appendChild(btnSupport);
            container.appendChild(btnJoke);
            container.appendChild(btnIdea);
            container.appendChild(btnQuestion);
            container.appendChild(btnComplete);
            container.appendChild(btnRegen);
            
            viewOnFocus.parentNode.insertAdjacentElement("afterend",container);
            
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
    if (viewClicked.nodeName === "div" ||
        viewClicked.textContent === "Reply") {
        // name of the commenter
        commenter = viewClicked.parentNode.parentNode.parentNode.parentNode
                    .firstChild.firstChild.firstChild.firstChild.textContent.trim();
        // content of the comment
        comment = viewClicked.parentNode.parentNode.parentNode
                    .firstChild.textContent.trim();
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
    rmButton.className = "replymind-ph-btn";
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
        const discTitle = document.querySelector("h1.color-darker-grey").textContent.trim();
        const discDesc = document.querySelector("div.styles_htmlText__d6xln").textContent.trim();

        const textarea = viewClicked.closest("form")
                            .querySelector("textarea");
                            
        /**
         * COMMENTING on products
         */
        const form_comments = viewClicked.closest("form");
        if (form_comments.parentNode.firstChild === form_comments) {
            // comment complete
            if (type === 6) {
                const incmpltComment = textarea.textContent;
                await fetch("https://replymind.cyclic.app/api/producthunt-discs/completion", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        discTitle: discTitle,
                        discDesc: discDesc,
                        incmpltComment: incmpltComment
                    })
                })
                .then((res) => res.json())
                .then((data) => {
                    /**
                     * trigger event input
                     * with response text from server
                     * https://stackoverflow.com/a/50589655
                     */
                    textarea.focus();
                    const inputEvent = new Event("input", {
                        bubbles: true,
                        cancelable: true
                    });
                    textarea.value = data.comment;
                    textarea.dispatchEvent(inputEvent);
                });
            }
            // regenerate comment
            else if (type === 7) {
                const regenComment = textarea.textContent;
                await fetch("https://replymind.cyclic.app/api/producthunt-discs/regen", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        discTitle: discTitle,
                        discDesc: discDesc,
                        regenComment: regenComment
                    })
                })
                .then((res) => res.json())
                .then((data) => {
                    /**
                     * trigger event input
                     * with response text from server
                     * https://stackoverflow.com/a/50589655
                     */
                    textarea.focus();
                    const inputEvent = new Event("input", {
                        bubbles: true,
                        cancelable: true
                    });
                    textarea.value = data.comment;
                    textarea.dispatchEvent(inputEvent);
                });
            }
            // full comment
            else {
                await fetch("https://replymind.cyclic.app/api/producthunt-discs/full", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        discTitle: discTitle,
                        discDesc: discDesc,
                        type: type
                    })
                })
                .then((res) => res.json())
                .then((data) => {
                    /**
                     * trigger event input
                     * with response text from server
                     * https://stackoverflow.com/a/50589655
                     */
                    textarea.focus();
                    const inputEvent = new Event("input", {
                        bubbles: true,
                        cancelable: true
                    });
                    textarea.value = data.comment;
                    textarea.dispatchEvent(inputEvent);
                });
            }
        }

        /**
         * REPLYING to comments on products
         */
        else {
            // reply complete
            if (type === 6) {
                const incmpltComment = textarea.textContent;
                await fetch("https://replymind.cyclic.app/api/producthunt-discs/reply-completion", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        discTitle: discTitle,
                        discDesc: discDesc,
                        incmpltComment: incmpltComment,
                        commenter: commenter,
                        comment: comment
                    })
                })
                .then((res) => res.json())
                .then((data) => {
                    /**
                     * trigger event input
                     * with response text from server
                     * https://stackoverflow.com/a/50589655
                     */
                    textarea.focus();
                    const inputEvent = new Event("input", {
                        bubbles: true,
                        cancelable: true
                    });
                    textarea.value = data.comment;
                    textarea.dispatchEvent(inputEvent);
                });
            }
            // regenerate reply
            else if (type === 7) {
                const regenComment = textarea.textContent;
                await fetch("https://replymind.cyclic.app/api/producthunt-discs/reply-regen", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        discTitle: discTitle,
                        discDesc: discDesc,
                        regenComment: regenComment,
                        commenter: commenter,
                        comment: comment
                    })
                })
                .then((res) => res.json())
                .then((data) => {
                    /**
                     * trigger event input
                     * with response text from server
                     * https://stackoverflow.com/a/50589655
                     */
                    textarea.focus();
                    const inputEvent = new Event("input", {
                        bubbles: true,
                        cancelable: true
                    });
                    textarea.value = data.comment;
                    textarea.dispatchEvent(inputEvent);
                });
            }
            // usual reply
            else {
                await fetch("https://replymind.cyclic.app/api/producthunt-discs/reply-full", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        discTitle: discTitle,
                        discDesc: discDesc,
                        commenter: commenter,
                        comment: comment,
                        type: type
                    })
                })
                .then((res) => res.json())
                .then((data) => {
                    /**
                     * trigger event input
                     * with response text from server
                     * https://stackoverflow.com/a/50589655
                     */
                    textarea.focus();
                    const inputEvent = new Event("input", {
                        bubbles: true,
                        cancelable: true
                    });
                    textarea.value = data.comment;
                    textarea.dispatchEvent(inputEvent);
                });
            }
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