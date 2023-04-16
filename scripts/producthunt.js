var observer = new MutationObserver(function (mutations) {
    mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
            if(document.querySelector("div.styles_container__0dgmN")) {
                observer.disconnect();
                const root = 
                    node.querySelector("div.styles_container__0dgmN").children[1];

                const btnLike = getReplyMindButton(0, "  👍  "); // like
                const btnDislike = getReplyMindButton(1, "  👎  "); // dislike
                const btnSupport = getReplyMindButton(2, "❤️ Support"); // support
                const btnJoke = getReplyMindButton(3, "😂 Funny"); //joke
                const btnIdea = getReplyMindButton(4, "💡Thought"); // idea
                const btnQuestion = getReplyMindButton(5, "🤔 Curious"); // question

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

                root.appendChild(container);
            }
        });
    })
});

observer.observe(document, {
    attributes: false,
    childList: true,
    characterData: false,
    subtree: true,
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
        const productTitle = document.querySelector("h1.color-darker-grey").textContent.trim();
        const productSubtitle = document.querySelector("h2.color-lighter-grey").textContent.trim();
        const productDesc = document.querySelector("div.styles_htmlText__d6xln").textContent.trim();

        // textarea to put ChatGPT response
        const textarea = document.querySelector("textarea.rta__textarea");

        // fetch ChatGPT response from server
        await fetch("https://replymind.cyclic.app/producthunt", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                productTitle: productTitle,
                productSubtitle: productSubtitle,
                productDesc: productDesc,
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