import { SetStateAction, Dispatch } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Write = ({
  value,
  setValue,
}: {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
}) => {
  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={setValue}
      className="w-full h-[10rem] rounded-md"
    />
  );
};

export default Write;
