import { useEffect, useState } from "react";
import "./App.css";
import { Answer } from "./components/Answer";
import { QnA } from "./components/QnA";
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const URI = import.meta.env.VITE_URI;

function App() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState([]);

  const payload = {
    contents: [
      {
        parts: [
          {
            text: query,
          },
        ],
      },
    ],
  };

  const askQuery = async () => {
    try {
      const response = await fetch(URI + API_KEY, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.candidates && data.candidates[0].content.parts[0].text) {
        let response = data.candidates[0].content.parts[0].text;
        response = response.split("* ").map((item) => item.trim());
        const res = { query, response };
        setResult([...result, res]);
      } else {
        console.log("Unexpected response format:", data);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  };
  useEffect(() => {
    setResult([
      {
        query: "Hello how are you",
        response: ["Hey what's up how can i hellp you"],
      },
      { query: "Hello", response: ["Hey what's up how can i hellp you"] },
    ]);
  }, []);

  
  return (
    <div className="grid grid-cols-5 h-screen text-center">
      <div className="col-span-1 bg-zinc-700"></div>

      <div className="col-span-4 p-5 h-screen flex flex-col ">
        <div className="container  flex-1 overflow-y-auto overflow-x-hidden no-scrollbar">
          <h1 className="text-2xl text-zinc-100 font-bold mb-3 ">Hello, how cay I help you!</h1>
          <div className="">
            <ul>
              {result.length &&
                result.map((qna, i) => {
                  return (
                    <ul  key={Date.now() + i}>
                      <QnA qna = {qna} i ={i}/>
                    </ul>
                  );
                })}
            </ul>
          </div>
        </div>

        <div className=" flex justify-center items-center h-24">
          <div className="bg-zinc-700 w-1/2 text-zinc-300 p-1 pr-5 h-16 rounded-4xl border-zinc-600 border flex">
            <input
              type="text"
              placeholder="Ask me anything"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-full p-3 outline-none"
            />
            <button onClick={askQuery} className="cursor-pointer">
              Ask
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
