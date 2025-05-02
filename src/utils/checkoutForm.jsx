"use client";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function CheckoutForm({ onSubmit, isLoading }) {
  const validationSchema = Yup.object({
    byName: Yup.string().required("Please filled by name"),
    comment: Yup.string(),
  });

  return (
    <Formik
      initialValues={{ byName: "", comment: "" }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      <Form className="space-y-4 mt-4">
        <div>
          <label className="block text-sm font-medium">By Name</label>
          <Field
            name="byName"
            type="text"
            placeholder="Enter your name"
            className="border w-full p-2 rounded"
          />
          <ErrorMessage
            name="byName"
            component="div"
            className="text-red-500 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Notes</label>
          <Field
            name="comment"
            type="text"
            placeholder="e.g Less sugar for ice americano"
            as="textarea"
            className="border w-full p-2 rounded"
          />
          <ErrorMessage
            name="comment"
            component="div"
            className="text-red-500 text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-4 bg-yellow-700 text-white px-4 py-2 rounded w-full"
        >
          {isLoading ? "Processing..." : "Confirm"}
        </button>
      </Form>
    </Formik>
  );
}
