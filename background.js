// on first install
chrome.runtime.onInstalled.addListener(() => {
    console.log("from background");
});

// listen to visited url
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // on load complete
    if(changeInfo.status === "complete") {
        /**
         * on visit url: https://www.linkedin.com/feed/*
         * inject foreground content style: linkedin.css
         * inject foreground content script: linkedin.js
         */
        if(/^https:\/\/www\.linkedin\.com\/*/.test(tab.url)) {
            chrome.scripting.insertCSS({
                target: { tabId: tabId },
                files: ["./styles/linkedin.css"]
            })
            .then(() => {
                console.log("injected linkedin styles");

                chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    files: ["./scripts/linkedin.js"]
                })
                .then(() => {
                    console.log("injected linkedin script");
                });
            })
            .catch(err => console.log(err));
        }

        /**
         * on visit url: https://twitter.com/compose/tweet
         * inject foreground content style: twitter.css
         * inject foreground content script: twitter.js
         */
        else if (/^https:\/\/twitter\.com\/compose\/tweet/.test(tab.url)) {
            chrome.scripting.insertCSS({
                target: { tabId: tabId },
                files: ["./styles/twitter.css"]
            })
            .then(() => {
                console.log("injected twitter styles");

                chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    files: ["./scripts/twitter.js"]
                })
                .then(() => {
                    console.log("injected twitter script");
                });
            })
            .catch(err => console.log(err));
        }

        /**
         * on visit url: https://www.producthunt.com/posts/*
         * inject foreground content style: producthunt.css
         * inject foreground content script: producthunt_posts.js
         */
        else if (/^https:\/\/www\.producthunt\.com\/post\/*/.test(tab.url)) {
            chrome.scripting.insertCSS({
                target: { tabId: tabId },
                files: ["./styles/producthunt.css"]
            })
            .then(() => {
                console.log("injected producthunt styles");

                chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    files: ["./scripts/producthunt_posts.js"]
                })
                .then(() => {
                    console.log("injected producthunt posts script");
                });
            })
            .catch(err => console.log(err));
        }

        /**
         * on visit url: https://www.producthunt.com/discussions/*
         * inject foreground content style: producthunt.css
         * inject foreground content script: producthunt_discussions.js
         */
        else if (/^https:\/\/www\.producthunt\.com\/discussions\/*/.test(tab.url)) {
            chrome.scripting.insertCSS({
                target: { tabId: tabId },
                files: ["./styles/producthunt.css"]
            })
            .then(() => {
                console.log("injected producthunt styles");

                chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    files: ["./scripts/producthunt_discs.js"]
                })
                .then(() => {
                    console.log("injected producthunt discussions script");
                });
            })
            .catch(err => console.log(err));
        }
    }
});

/**
 * storage sync
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "setData") {
        chrome.storage.sync.get(["replymind"], (result) => {
            var count = result.replymind;
            count++;
            chrome.storage.sync.set({ replymind:  count}, () => {
                sendResponse({
                    "response_code": 200,
                    "payload": count
                });
            });
        });
    }

    else if (request.action === "getData") {
        chrome.storage.sync.get(["replymind"], (result) => {
            // if the variable exists
            if (result.replymind) {
                sendResponse({
                    "response_code": 200,
                    "payload": result.replymind
                });
            }
            // if does not exist create new entry
            else {
                chrome.storage.sync.set({ replymind:  0}, () => {
                    sendResponse({
                        "response_code": 200,
                        "payload": 0
                    });
                });
            }
        });
        return true;
    }

    else {
        sendResponse({"response_code": 404});
    }
});  