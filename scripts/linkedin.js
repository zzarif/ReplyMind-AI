


document.addEventListener("focusin", (e) => {
    const viewOnFocus = e.target;
    const commentDivClass = "ql-editor ql-blank";
    console.log(viewOnFocus);
    if (viewOnFocus.nodeName === "div" || 
        viewOnFocus.className === commentDivClass) {
        generateReplyMindButtons(viewOnFocus);
    }
});

/**
 * 
 * @param "viewOnFocus": current focused comment
 */
function generateReplyMindButtons(viewOnFocus) {

    const form_comments = 
        viewOnFocus.closest("form.comments-comment-box__form");

    if (form_comments.childElementCount < 2) {
        
        console.log("Generating ReplyMind Buttons...");
        // like button
        const btnLike = document.createElement("div");
        btnLike.innerText = "👍";
        btnLike.className = "replymind-linkedin-btn";
        btnLike.addEventListener("click", (e) => {
            generateComment(e.target, 0);
        });
    
        // dislike button
        const btnDislike = document.createElement("div");
        btnDislike.innerText = "👎";
        btnDislike.className = "replymind-linkedin-btn";
        btnDislike.addEventListener("click", (e) => {
            generateComment(e.target, 1);
        });
    
        // support button
        const btnSupport = document.createElement("div");
        btnSupport.innerText = "🫶Support";
        btnSupport.className = "replymind-linkedin-btn";
        btnSupport.addEventListener("click", (e) => {
            generateComment(e.target, 2);
        });
    
        // joke button
        const btnJoke = document.createElement("div");
        btnJoke.innerText = "🔥Joke";
        btnJoke.className = "replymind-linkedin-btn";
        btnJoke.addEventListener("click", (e) => {
            generateComment(e.target, 3);
        });
    
        // idea button
        const btnIdea = document.createElement("div");
        btnIdea.innerText = "💡Idea";
        btnIdea.className = "replymind-linkedin-btn";
        btnIdea.addEventListener("click", (e) => {
            generateComment(e.target, 4);
        });
    
        // question button
        const btnQuestion = document.createElement("div");
        btnQuestion.innerText = "❓Question";
        btnQuestion.className = "replymind-linkedin-btn";
        btnQuestion.addEventListener("click", () => {
            generateComment(5);
        });
    
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


async function generateComment(viewClicked, type) {
    console.log("Generating comment...");

    showLoadingCursor();

    try {
        // name of the poster
        const poster = viewClicked.closest("div.feed-shared-update-v2")
                   .querySelector("span.update-components-actor__name")
                   .children[0].textContent.trim();
        // caption of the post
        const caption = viewClicked.closest("div.feed-shared-update-v2")
                        .querySelector("div.update-components-text")
                        .textContent.trim();
        // comment box to put ChatGPT response
        const contentEditableDiv = viewClicked.closest("form.comments-comment-box__form")
                                   .querySelector("div.ql-editor.ql-blank");

        // fetch ChatGPT response from server
        await fetch("http://localhost:3000/linkedin", {
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
            console.log(data.comment);

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
        console.log(err);
    } finally {
        restoreCursor();
    }
};


function showLoadingCursor () {
    const style = document.createElement("style");
    style.id = "cursor_wait";
    style.innerHTML = `* {cursor: wait;}`;
    document.head.insertBefore(style, null);
};
  
function restoreCursor () {
    document.getElementById("cursor_wait").remove();
};



// setTimeout(() => {
//     document.addEventListener("focus", (e) => {
//         console.log("FFOOOOCUSSSSSSSSSS  999");
//         console.log(e.target.nodeName);
//     }, true);
// }, 2000);



// const selector = "comments-comment-box__form";

// const observer = new MutationObserver((mutations) => {
//     mutations.forEach((mutation) => {
//         console.log(mutation);
//         if (mutation.addedNodes.nodeType === Node.ELEMENT_NODE && mutation.target.matches(selector)) {
//             console.log("FOUND BITCH!!!!!");
            
//         }
//     })
// });

// observer.observe(document.body, {
//     childList: true,
//     subtree: true
// });

// const startDoingWhatYouShouldDo = () => {
//     const postList = document.querySelectorAll(
//       `div.scaffold-finite-scroll__content>div`
//     );

//     console.log(postList[0]);
//     console.log(postList.length);

//     for (let i=0; i<postList.length; i++) {
//         // if (postList[i].querySelector("div.relative>div.feed-shared-update-v2")) {
//         //     var button = postList[i].querySelector(
//         //       `div.relative>div.feed-shared-update-v2>div>div.social-details-social-activity>
//         //       div.feed-shared-social-actions>span.comment>span.artdeco-hoverable-trigger>
//         //       div>button.artdeco-button`
//         //     );
//         // } else {
//         //     var button = postList[i].querySelector(
//         //       `div.relative>div.ember-view>div.feed-shared-update-v2>div>div.social-details-social-activity>
//         //       div.feed-shared-social-actions>span.comment>span.artdeco-hoverable-trigger>div>
//         //       button.artdeco-button`
//         //     );
//         // }
//         var button = postList[i].querySelector(
//           `span.comment>span.artdeco-hoverable-trigger>div>button.artdeco-button`
//         );
//         if (button) {
//             console.log("GOOTTTCCHAAAAAAAAAAA!!");
//         }
//     }
// } 

// // body>div.application-outlet>div.authentication-outlet>div#voyager-feed>div#ember23>div.scaffold-layout>div.scaffold-layout__inner>div.scaffold-layout__row>main#main>div>div.scaffold-finite-scroll>div.scaffold-finite-scroll__content>div

// // setTimeout(() => {
// //   console.log("HEEEEYYYYYYYYYY  YOOOOOOO");
// //   console.log("GGGGGGGGGGGGGGGGGGGGGGG");

// //   const postList = document.querySelectorAll(
// //     `body>div.application-outlet>div.authentication-outlet>div#voyager-feed>div#ember23>
// //     div.scaffold-layout>div.scaffold-layout__inner>div.scaffold-layout__row>main#main>div>
// //     div.scaffold-finite-scroll>div.scaffold-finite-scroll__content>div`
// //   );

// //   const caption0 = postList[0].querySelector(
// //     `div.relative>div.feed-shared-update-v2>div>div.feed-shared-update-v2__description-wrapper>
// //     div.feed-shared-inline-show-more-text>div.update-components-text>span.break-words>span>span`
// //   ).innerText;

// //   console.log(caption0);

// //   // const comment0 = postList[0].querySelector(
// //   //   `div.relative>div.feed-shared-update-v2>div>div.social-details-social-activity>div.feed-shared-update-v2__comments-container`
// //   // ).innerHTML;

// //   // console.log(comment0);

// //   for (let i = 1; i < 3; i++) {
// //     var caption = postList[i].querySelector(
// //       `div.relative>div.ember-view>div.feed-shared-update-v2>div>div.feed-shared-update-v2__description-wrapper>
// //       div.feed-shared-inline-show-more-text>div.update-components-text>span.break-words>span>span`
// //     ).innerText;

// //     console.log(caption);


// //     // var comment = postList[i].querySelector(
// //     //   `div.relative>div.ember-view>div.feed-shared-update-v2>div>div.social-details-social-activity>
// //     //   div.feed-shared-update-v2__comments-container`
// //     // ).innerHTML;
  
// //     // console.log(comment);
// //   }
  
// // }, 8000);



// // div.relative>div.ember-view>div.feed-shared-update-v2>div>div.social-details-social-activity>
// //       div.feed-shared-update-v2__comments-container>div.comments-comment-box>div.comments-comment-box__form-container>
// //       form.comments-comment-box__form>div.comments-comment-texteditor>
// //       div.display-flex>div.comments-comment-box-comment__text-editor>
// //       div>div.editor-container>div>div.editor-content


// // const getChatGPTResponse = async (prompt) => {
// //   const sysMsg =
// //     "You are a Comment Writer for LinkedIn posts that appear on the feed. You will be given the caption of a LinkedIn post. You have to generate an appropriate comment for that post.";
// //   const completion = await openai.createChatCompletion({
// //     messages: [
// //       {
// //         role: "system",
// //         content: sysMsg,
// //       },
// //       {
// //         role: "user",
// //         content: prompt,
// //       },
// //     ],
// //     model: "gpt-3.5-turbo-0301",
// //     temperature: 0.8,
// //     max_tokens: 800,
// //     top_p: 1,
// //     frequency_penalty: 0.2,
// //     presence_penalty: 0.2,
// //   });

// //   if (completion.data.choices[0].message.content) {
// //     console.log(completion.data.choices[0].message.content.trim());
// //   }
// // };

// // /html/body/div[5]/div[3]/div/div/div[2]/div/div/main/div[3]/div/div[1]

// // 