import { useEffect, useLayoutEffect, useRef, useState } from "react";
import "./App.css";
import { QnA } from "./components/QnA";
import { MdDelete } from "react-icons/md";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const URI = import.meta.env.VITE_URI;

function App() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState([]);
  const [resentHistory, setResentHistory] = useState(() => {
    const saved = localStorage.getItem("history");
    // Check if it exists AND is valid JSON array
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  });

  const textareaRef = useRef(null);
  const bottomRef = useRef(null);

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

  const addToHistory = () => {
    if (!query) return;

    const saved = localStorage.getItem("history");
    let history = [];

    try {
      const parsed = JSON.parse(saved);
      history = Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      history = [];
    }

    // Add new query, keep unique values, and limit to 10 items
    const updatedHistory = [...new Set([query, ...history])].slice(0, 10);

    localStorage.setItem("history", JSON.stringify(updatedHistory));
    setResentHistory(updatedHistory);
  };

  const askQuery = async () => {
    if(!query) return
    try {
      addToHistory();
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
        setQuery("");
      } else {
        console.log("Unexpected response format:", data);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  };

  const clearHistory = () => {
    localStorage.clear("history");
    setResentHistory([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      askQuery();
    }
  };

useEffect(() => {
  bottomRef.current?.scrollIntoView({ behavior: "smooth" });
}, [result]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }, [query]);

  // useEffect(() => {
  //   setResult([
  //     {
  //       query: "Hello how are you",
  //       response: ["Hey what's up how can i hellp you"],
  //     },
  //     { query: "Hello", response: ["Hey what's up how can i hellp you"] },
  //   ]);
  // }, []);

  return (
    <div className="grid grid-cols-5 h-screen text-center">
      <div className="col-span-1 bg-zinc-700">
        <h1 className="text-zinc-200 text-lg flex justify-center gap-3">
          <span>Recent searches</span>
          <MdDelete className="my-auto cursor-pointer" onClick={clearHistory} />
        </h1>
        <ul className="text-left text-zinc-300 px-2 mt-4 overflow-auto text-md">
          {Array.isArray(resentHistory) && resentHistory.length > 0 ? (
            resentHistory.map((ele, i) => (
              <li
                key={i}
                className="p-2 hover:bg-zinc-800 rounded cursor-pointer truncate"
              >
                {ele.replace(/\b\w/g, (char) => char.toUpperCase())}
              </li>
            ))
          ) : (
            <h1 className="bg-zinc-600 text-center rounded font-bold my-auto py-1.5 text-sm ">
              No Recent Searches
            </h1>
          )}
        </ul>
      </div>

      <div className="col-span-4 p-5 h-screen flex flex-col ">
        <div className="container  flex-1 overflow-y-auto overflow-x-hidden no-scrollbar">
          <h1 className="text-2xl text-zinc-100 font-bold mb-3 ">
            Hello! How can I help you today?
          </h1>
          <div className="">
            <ul>
              {result.length > 0 &&
                result.map((qna, i) => {
                  return (
                    <ul key={Date.now() + i}>
                      <QnA qna={qna} i={i} />
                    </ul>
                  );
                })}
            </ul>
            <div ref={bottomRef}></div>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="bg-zinc-700 w-1/2 text-zinc-300 px-3 pr-4 min-h-15 rounded-3xl border border-zinc-600 flex items-end">
            <textarea
              ref={textareaRef}
              placeholder="Ask me anything"
              value={query}
              rows={1}
              onKeyDown={handleKeyDown}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 resize-none outline-none bg-transparent px-3 py-3 leading-6 max-h-50 overflow-y-auto"
            />

            <button
              onClick={askQuery}
              className="cursor-pointer self-center bg-zinc-600 hover:bg-zinc-500 px-4 py-1 rounded-full"
            >
              Ask
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
