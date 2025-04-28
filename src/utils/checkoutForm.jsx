"use client";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function CheckoutForm({ onSubmit, isLoading }) {
  const validationSchema = Yup.object({
    byName: Yup.string().required("Please filled by name"),
    comment: Yup.string(),
  });

  return (
    <Formik initialValues={{ byName: "", comment: "" }} validationSchema={validationSchema} onSubmit={onSubmit}>
      <Form className="space-y-4 mt-4">
        <div>
          <label className="block text-sm font-medium">By Name</label>
          <Field name="byName" type="text" className="border w-full p-2 rounded" />
          <ErrorMessage name="byName" component="div" className="text-red-500 text-sm" />
        </div>

        <div>
          <label className="block text-sm font-medium">Comment</label>
          <Field name="comment" type="text" className="border w-full p-2 rounded" />
          <ErrorMessage name="comment" component="div" className="text-red-500 text-sm" />
        </div>
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Payment Method</h2>
          <p>please pay at the cashier</p>
        </div>

        <button type="submit" disabled={isLoading} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded w-full">
          {isLoading ? "Processing..." : "Confirm & Pay"}
        </button>
      </Form>
    </Formik>
  );
}
