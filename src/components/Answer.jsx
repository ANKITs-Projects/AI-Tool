import { formatGeminiResponse, checkHeading } from "../helper/helper";

export const Answer = ({ ans, index, totalRes }) => {
  // Check if the current line is a heading for specific styling
  const isHeading = checkHeading(ans);

  return (
    <div className="w-full">
      {/* Case 1: First item in a multi-response sequence 
      */}
      {index === 0 && totalRes > 1 ? (
        <p className="pl-1 text-[18px] text-zinc-200 leading-relaxed">
          {ans}
        </p>
      ) : (
        /* Case 2: Standard AI Response with formatting 
        */
        <div 
          className={`
            pl-1 transition-all duration-300
            ${isHeading ? 'mt-4 text-lg font-bold text-white' : 'mt-1 text-[16px] ml-4 text-zinc-300'}
          `}
          // This allows the <b>, <br>, and <li> tags from our helper to work
          dangerouslySetInnerHTML={{ __html: formatGeminiResponse(ans) }}
        />
      )}
    </div>
  );
};