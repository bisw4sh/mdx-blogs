import { useState } from "react";
import { redirect, Form, useSubmit } from "react-router-dom";
import Write from "../components/Write";

// eslint-disable-next-line react-refresh/only-export-components
export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const content = formData.get("content");
  const filename = formData.get("fileName");

  const response = await fetch("/api/posts/upload/json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content, fileName: filename }),
  });

  if (response.status === 201) return redirect("/");

  return null;
};

const WritePage = () => {
  const [value, setValue] = useState<string>("");
  const [filename, setFilename] = useState<string>("");
  const [filenameError, setFilenameError] = useState<string | null>(null);
  const submit = useSubmit();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFilenameError(null);

    if (!filename.trim()) {
      setFilenameError("Filename is required.");
      return;
    }

    try {
      const checkResponse = await fetch(`/api/posts/check/${filename}`);
      if (!checkResponse.ok) {
        const errorData = await checkResponse.json();
        setFilenameError(errorData.message || "Filename already exists.");
        return;
      }
    } catch (error) {
      setFilenameError("Error checking filename. Please try again.");
      return;
    }

    const formData = new FormData();
    formData.append("content", value);
    formData.append("fileName", filename);
    submit(formData, { method: "post" });
  };

  return (
    <div className="min-h-screen w-full flex justify-between py-10">
      <section className="flex flex-col justify-start items-start flex-1 p-[1rem]">
        <Form
          method="post"
          className="flex flex-col justify-start items-start flex-1 p-[1rem]"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            placeholder="Type filename here"
            name="fileName"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            className="input input-bordered w-full my-2"
          />
          {filenameError && <p className="text-red-500">{filenameError}</p>}
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
