/**
 * set 1sec+ delay
 * for rendering buttons
 */
setTimeout(() => {
    
    /**
     * twitter toolbar container
     * render replymind buttons inside
     */
    const root = document.querySelector(
        "div.css-1dbjc4n.r-1iusvr4.r-16y2uox.r-1777fci.r-1h8ys4a.r-1bylmt5.r-13tjlyg.r-7qyjyx.r-1ftll1t>div>div.css-1dbjc4n"
    );  

    console.log("Generating replymind buttons...");

    // like button
    const btnLike = document.createElement("div");
    btnLike.innerText = "👍";
    btnLike.className = "twt-btn";
    btnLike.addEventListener("click", () => {
        generateComment(0);
    });

    // dislike button
    const btnDislike = document.createElement("div");
    btnDislike.innerText = "👎";
    btnDislike.className = "twt-btn";
    btnDislike.addEventListener("click", () => {
        generateComment(1);
    });

    // support button
    const btnSupport = document.createElement("div");
    btnSupport.innerText = "🫶Support";
    btnSupport.className = "twt-btn";
    btnSupport.addEventListener("click", () => {
        generateComment(2);
    });

    // joke button
    const btnJoke = document.createElement("div");
    btnJoke.innerText = "🔥Joke";
    btnJoke.className = "twt-btn";
    btnJoke.addEventListener("click", () => {
        generateComment(3);
    });

    // idea button
    const btnIdea = document.createElement("div");
    btnIdea.innerText = "💡Idea";
    btnIdea.className = "twt-btn";
    btnIdea.addEventListener("click", () => {
        generateComment(4);
    });

    // question button
    const btnQuestion = document.createElement("div");
    btnQuestion.innerText = "❓Question";
    btnQuestion.className = "twt-btn";
    btnQuestion.addEventListener("click", () => {
        generateComment(5);
    });

    // button parent conatiner
    const container = document.createElement("div");
    container.className = "twt-container";

    // insert buttons inside the parent container
    container.appendChild(btnLike);
    container.appendChild(btnDislike);
    container.appendChild(btnSupport);
    container.appendChild(btnJoke);
    container.appendChild(btnIdea);
    container.appendChild(btnQuestion);

    /**
     * check if toolbar exists
     * insert the parent conatiner
     * with buttons inside
     */
    if (root) {
        root.insertBefore(
            container,root.firstElementChild
        );
    } else {
        alert("ReplyMind: Something went wrong");
    }
}, 1300);

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

    const caption = document.querySelector(
        "div.css-901oao.r-1nao33i.r-37j5jr.r-a023e6.r-16dba41.r-rjixqe.r-bcqeeo.r-bnwqim.r-qvutc0"
    ).textContent;

    // if caption is found
    if (caption) {
        showLoadingCursor();

        await fetch("http://localhost:3000/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                type: type,
                caption: caption
            })
        })
        .then((res) => res.json())
        .then((data) => {
            console.log(data.comment);

            /**
             * trigger event insert text
             * with response text from server
             * https://stackoverflow.com/a/72935050
             */
            document.execCommand('insertText', false, data.comment);

            restoreCursor();
        });
    }
    else {
        alert("ReplyMind: Something went wrong");
    }
};