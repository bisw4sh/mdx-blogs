import type React from "react";
import { useState } from "react";
import { redirect, Form, useSubmit } from "react-router-dom";
import Write from "../components/Write";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
    <div className="h-[calc(100vh-4rem)] w-full flex flex-col lg:flex-row">
      <section className="w-full lg:w-1/2 p-4 border-b lg:border-b-0 lg:border-r flex flex-col">
        <Form
          method="post"
          className="flex-grow flex flex-col"
          onSubmit={handleSubmit}
        >
          <div className="mb-4">
            <input
              type="text"
              placeholder="Type filename here"
              name="fileName"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              className="input input-bordered w-full"
            />
            {filenameError && (
              <p className="text-error text-sm mt-1">{filenameError}</p>
            )}
          </div>
          <div className="flex-grow mb-4 h-[calc(100vh-200px)] lg:h-[calc(100vh-170px)]">
            <Write setValue={setValue} />
          </div>
          <button type="submit" className="btn btn-primary w-full">
            Submit
          </button>
        </Form>
      </section>
      <section className="w-full lg:w-1/2 p-4 flex flex-col">
        <h2 className="text-xl font-bold mb-2">Preview</h2>
        <div className="prose prose-sm max-w-none flex-grow overflow-auto border rounded-box p-4">
          <Markdown remarkPlugins={[remarkGfm]}>{value}</Markdown>
        </div>
      </section>
    </div>
  );
};

export default WritePage;
