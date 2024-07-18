import { useState, SyntheticEvent } from "react";
import Write from "../components/Write";
import { redirect } from "react-router-dom";

const WritePage = () => {
  const [value, setValue] = useState<string>("");
  const [filename, setFileName] = useState<string>("");

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    const response = await fetch("/api/save-mdx", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ markdown: value, filename }),
    });

    if (response.status === 201) redirect("/");
  };

  return (
    <div className="min-h-screen w-full flex justify-between py-10">
      <section className="flex flex-col justify-start items-start flex-1 p-[1rem]">
        <form
          method="post"
          className="flex flex-col justify-start items-start flex-1 p-[1rem]"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            placeholder="Type filename here"
            name="filename"
            value={filename}
            onChange={(e) => setFileName(e.target.value)}
            className="input input-bordered w-full my-4"
          />
          <Write value={value} setValue={setValue} />
          <button type="submit" className="btn btn-outline mt-[4rem]">
            Submit
          </button>
        </form>
      </section>
      <section
        dangerouslySetInnerHTML={{ __html: value }}
        className="prose prose-a:text-blue-600 prose-md max-w-none w-full flex-1 p-[1rem] border-[1px] rounded-md"
      />
    </div>
  );
};

export default WritePage;
