import { useEffect, useState } from "react";
import { checkHeading, replaceHeading } from "../helper/helper";

export const Answer = ({ ans, index, totalRes }) => {
  const [heading, setHeading] = useState(false);
  useEffect(() => {
    if (checkHeading(ans)) setHeading(true);
  });

  return (
    <div>
      {index == 0 && totalRes > 1? (
        <p className="pl-1 text-[18px] text-zinc-200">{ans}</p>
      ) : heading ? (
        <span className="pl-1 mt-4 text-lg block text-zinc-200">
          {replaceHeading(ans)}
        </span>
      ) : (
        <span className="pl-3 mt-1 text-[16px] text-zinc-300">{ans}</span>
      )}
    </div>
  );
};
