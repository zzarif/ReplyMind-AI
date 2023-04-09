/**
 * set 1sec+ delay
 * for rendering buttons
 */
setTimeout(() => {
    
    /**
     * producthunt root comment container
     * render replymind buttons inside
     */
    const root = document.querySelector(
        "div.styles_container__0dgmN>div.flex.direction-column.flex-1"
    );

    console.log("Generating replymind buttons...");

    // like button
    const btnLike = document.createElement("div");
    btnLike.innerText = "👍";
    btnLike.className = "replymind-ph-btn";
    btnLike.addEventListener("click", () => {
        generateComment(0);
    });

    // dislike button
    const btnDislike = document.createElement("div");
    btnDislike.innerText = "👎";
    btnDislike.className = "replymind-ph-btn";
    btnDislike.addEventListener("click", () => {
        generateComment(1);
    });

    // support button
    const btnSupport = document.createElement("div");
    btnSupport.innerText = "🫶Support";
    btnSupport.className = "replymind-ph-btn";
    btnSupport.addEventListener("click", () => {
        generateComment(2);
    });

    // joke button
    const btnJoke = document.createElement("div");
    btnJoke.innerText = "🔥Joke";
    btnJoke.className = "replymind-ph-btn";
    btnJoke.addEventListener("click", () => {
        generateComment(3);
    });

    // idea button
    const btnIdea = document.createElement("div");
    btnIdea.innerText = "💡Idea";
    btnIdea.className = "replymind-ph-btn";
    btnIdea.addEventListener("click", () => {
        generateComment(4);
    });

    // question button
    const btnQuestion = document.createElement("div");
    btnQuestion.innerText = "❓Question";
    btnQuestion.className = "replymind-ph-btn";
    btnQuestion.addEventListener("click", () => {
        generateComment(5);
    });

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

    /**
     * check if root exists
     * insert the parent container
     * with buttons inside
     */
    if (root) {
        root.appendChild(container);
    } else {
        alert("ReplyMind: Something went wrong");
    }
}, 0);

function showLoadingCursor () {
    const style = document.createElement("style");
    style.id = "cursor_wait";
    style.innerHTML = `* {cursor: wait;}`;
    document.head.insertBefore(style, null);
};
  
function restoreCursor () {
    document.getElementById("cursor_wait").remove();
};

/**
 * function to fetch response from server
 * body: caption and comment reaction (clicked button)
 * @param "type": which button was clicked
 */
async function generateComment (type) {

    const productTitle = document.querySelector(
        "h1.color-darker-grey.fontSize-24.fontWeight-700.noOfLines-undefined.styles_title__vct6Q"
    ).textContent;
    const productSubtitle = document.querySelector(
        "h2.color-lighter-grey.fontSize-24.fontWeight-300.noOfLines-undefined.styles_tagline___TmmA"
    ).textContent;
    const productDesc = document.querySelector(
        "div.styles_htmlText__d6xln.color-darker-grey.fontSize-16.fontWeight-400"
    ).textContent;

    const textarea = document.querySelector(
        "textarea.rta__textarea.styles_textArea___VXHz"
    );

    console.log(productTitle);
    console.log(productSubtitle);
    console.log(productDesc);

    
    // if all the textcontents are found
    if (productTitle&&productSubtitle&&productDesc) {
        showLoadingCursor();

        await fetch("http://localhost:3000/producthunt", {
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
            console.log(data.comment);

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

            restoreCursor();
        });
    }
    else {
        alert("ReplyMind: Something went wrong");
    }
};