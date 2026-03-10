import { Answer } from "./Answer";

export const QnA = ({ qna, i }) => {
  return (
    <>
      <div className="flex flex-row-reverse w-full mb-4">
        <li className="list-none max-w-[80%] bg-zinc-700 p-2 mr-5 text-white rounded-2xl rounded-tr-none shadow-lg">
          <Answer ans={qna.query} index={i} totalRes={1} />
        </li>
      </div>
      {qna.response.map((qnares, ind) => {
        return (
          <li key={Date.now() + ind} className="text-left ml-5">
            <Answer ans={qnares} index={ind} totalRes={qna.response.length} />
          </li>
        );
      })}
    </>
  );
};
