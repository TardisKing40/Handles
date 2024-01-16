import OpenAI from 'openai';
import dotenv from 'dotenv';
import { readFileSync } from 'node:fs';

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// set gptprompt to the contents of gptprompt.txt
const gptprompt = readFileSync('./gptprompt.txt', 'utf8');

var conversation = [
    {
        "role": "system", 
        "content": gptprompt
    }
];

async function getGptResponse(messageinput) {
    conversation.push({
        "role": "user",
        "content": messageinput
    })

    const response = await openai.chat.completions.create({
        messages: conversation,
        model: 'gpt-4',
    });
    const gptResponse = response.choices[0].message.content.replace(/['"]+/g, '');
    
    conversation.push({
        "role": "assistant",
        "content": gptResponse
    })

    return gptResponse;
}

export {
    getGptResponse
};