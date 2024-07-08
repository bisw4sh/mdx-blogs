import { Form, ActionFunctionArgs } from "react-router-dom";

// eslint-disable-next-line react-refresh/only-export-components
export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  console.log(formData);
  return formData;
};

const Write = () => {
  return (
    <>
      <Form method="post" action="">
        <textarea
          name="post"
          placeholder="Write the blog in markdown"
          className="textarea textarea-bordered textarea-lg w-full max-w-xs"
        ></textarea>
        <button type="submit" className="btn btn-success">
          Post
        </button>
      </Form>
    </>
  );
};

export default Write;
