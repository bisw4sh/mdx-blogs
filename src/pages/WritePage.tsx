import { useState } from "react";
import { redirect, Form, useSubmit } from "react-router-dom";
import Write from "../components/Write";

// eslint-disable-next-line react-refresh/only-export-components
export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const markdown = formData.get("markdown");
  const filename = formData.get("filename");
  const response = await fetch("/api/save-mdx", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ markdown, filename }),
  });

  if (response.status === 201) redirect("/");

  return null;
};

const WritePage = () => {
  const [value, setValue] = useState<string>("");
  const submit = useSubmit();

  return (
    <div className="min-h-screen w-full flex justify-between py-10">
      <section className="flex flex-col justify-start items-start flex-1 p-[1rem]">
        <Form
          method="post"
          className="flex flex-col justify-start items-start flex-1 p-[1rem]"
          onSubmit={(e) => {
            e.preventDefault();
            console.log(e.currentTarget.filename.value);
            const formData = new FormData();
            formData.append("markdown", value);
            formData.append("filename", e.currentTarget.filename.value);
            submit(formData, { method: "post" });
          }}
        >
          <input
            type="text"
            placeholder="Type filename here"
            name="filename"
            className="input input-bordered w-full my-4"
          />
          <Write value={value} setValue={setValue} />
          <button type="submit" className="btn btn-outline mt-[4rem]">
            Submit
          </button>
        </Form>
      </section>
      <section
        dangerouslySetInnerHTML={{ __html: value }}
        className="prose prose-a:text-blue-600 prose-md max-w-none w-full flex-1 p-[1rem] border-[1px] rounded-md"
      />
    </div>
  );
};

export default WritePage;
