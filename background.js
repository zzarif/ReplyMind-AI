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
        if(/^https:\/\/www\.linkedin\.com\/feed\/*/.test(tab.url)) {
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
         * inject foreground content script: producthunt.js
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
                    files: ["./scripts/producthunt.js"]
                })
                .then(() => {
                    console.log("injected producthunt script");
                });
            })
            .catch(err => console.log(err));
        }
    }
});