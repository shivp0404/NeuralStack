require('dotenv').config()

async function openaiRequest(codeSnippet) {
  const response = await fetch("https://api.perplexity.ai/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "sonar-pro",
      messages: [
        { role: "system", content: "You are a code explainer. Explain code simply." },
        { role: "user", content: codeSnippet },
      ],
    }),
  });

  const text = await response.text(); // get raw response
  // console.log("Raw API response:", text);

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} - ${text}`);
  }

  const data = JSON.parse(text);
  if (!data.choices || !data.choices.length) {
    throw new Error("No choices returned from API");
  }

  return data.choices[0].message.content;
}


// openaiRequest(" 2+2 == 4 ")

module.exports = { openaiRequest };



