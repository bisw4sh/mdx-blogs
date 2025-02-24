import type { SetStateAction, Dispatch } from "react";

const Write = ({
  setValue,
}: {
  setValue: Dispatch<SetStateAction<string>>;
}) => {
  return (
    <textarea
      className="w-full h-[32rem] rounded-md p-4 textarea textarea-info"
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

export default Write;