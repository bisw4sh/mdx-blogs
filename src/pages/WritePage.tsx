import { useState } from "react";
import Write from "../components/Write";

const WritePage = () => {
  const [value, setValue] = useState<string>("");

  const handleSubmit = () => {
    setTimeout(() => {
      setValue("cleared");
    }, 2000);
  };

  return (
    <>
      <div className="min-h-screen w-full flex justify-between py-10">
        <section className="flex flex-col justify-start items-start flex-1 p-[1rem]">
          <Write value={value} setValue={setValue} />
          <button className="btn btn-outline mt-[4rem]" onClick={handleSubmit}>
            Submit
          </button>
        </section>
        <section
          dangerouslySetInnerHTML={{ __html: value }}
          className="prose prose-a:text-blue-600 prose-md max-w-none w-full flex-1 p-[1rem] border-[1px] rounded-md"
        />
      </div>
    </>
  );
};

export default WritePage;
