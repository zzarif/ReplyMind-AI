const express = require("express");
const dotenv = require("dotenv").config();
const OpenAI = require("openai");
const cors = require("cors");

const port = process.env.PORT || 3000;
const { Configuration, OpenAIApi } = OpenAI;

const configuration = new Configuration({
  apiKey: process.env.API_KEY,
});
const openai = new OpenAIApi(configuration);

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


/**
 * Handle API POST request for twitter
 */
app.post('/twitter', async (req, res) => {
    const { type, caption } = req.body;

    var prompt = `Caption: ${caption}\n\n${getReaction(type)}\n\nWrite a comment.`;
    console.log(prompt);

    const completion = await openai.createChatCompletion({
        messages: [
          {
            role: "system",
            content: "You are a commenter who comments on Twitter posts. You will be given the caption of a Twitter post and the reaction of the comment.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        model: "gpt-3.5-turbo-0301",
        temperature: 0.8,
        max_tokens: 500,
        top_p: 1,
        frequency_penalty: 0.1,
        presence_penalty: 0.1,
    });
      
    if(completion.data.choices[0].message.content) {
        console.log(completion.data.choices[0].message);
        res.status(200).json({
            comment: completion.data.choices[0].message.content.trim(),
        });
    }
    else throw new Error("Something went wrong");
});


/**
 * Handle API POST request for linkedin
 */
app.post('/linkedin', async (req, res) => {
    const { poster, caption, type } = req.body;

    var prompt = `Poster Name: ${poster}\nCaption: ${caption}\n\n${getReaction(type)}\n\nWrite a comment.`;
    console.log(prompt);

    const completion = await openai.createChatCompletion({
        messages: [
          {
            role: "system",
            content: "You are a commenter who comments on LinkedIn posts. You will be given the name of the poster, caption of the LinkedIn post and the reaction of comment.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        model: "gpt-3.5-turbo-0301",
        temperature: 0.8,
        max_tokens: 500,
        top_p: 1,
        frequency_penalty: 0.1,
        presence_penalty: 0.1,
    });
      
    if(completion.data.choices[0].message.content) {
        console.log(completion.data.choices[0].message);
        res.status(200).json({
            comment: completion.data.choices[0].message.content.trim(),
        });
    }
    else throw new Error("Something went wrong");
});

/**
 * Handle API POST request for producthunt
 */
app.post('/producthunt', async (req, res) => {
    const { productTitle, productSubtitle, productDesc, type } = req.body;

    var prompt = `Product Title: ${productTitle}\nProduct Subtitle: ${productSubtitle}\nProduct Description: ${productDesc}\n\n${getReaction(type)}\n\nWrite a comment.`;
    console.log(prompt);

    const completion = await openai.createChatCompletion({
        messages: [
          {
            role: "system",
            content: "You are a commenter who comments on ProductHunt posts. You will be given the Product Title, Product Subtitle, Product Description and the reaction of the comment.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        model: "gpt-3.5-turbo-0301",
        temperature: 0.8,
        max_tokens: 500,
        top_p: 1,
        frequency_penalty: 0.1,
        presence_penalty: 0.1,
    });
      
    if(completion.data.choices[0].message.content) {
        console.log(completion.data.choices[0].message);
        res.status(200).json({
            comment: completion.data.choices[0].message.content.trim(),
        });
    }
    else throw new Error("Something went wrong");
});

app.listen(port, () => {
    console.log(`Listening on ${port}`);
});


function getReaction(type) {
    let reaction = "Reaction: ";
    switch(type) {
        case 0: reaction+="You like this post"; break;
        case 1: reaction+="You dislike this post"; break;
        case 2: reaction+="You support this post"; break;
        case 3: reaction+="You find this post funny"; break;
        case 4: reaction+="You find this post insightful"; break;
        case 5: reaction+="You are curious about this post"; break;
        default: reaction=null; break;
    }
    return reaction;
}