import { Create, useForm, useSelect } from "@refinedev/antd";
import MDEditor from "@uiw/react-md-editor";
import { Form, Input, Select } from "antd";
import { CATEGORIES_SELECT_QUERY, POST_CREATE_MUTATION } from "./queries";

export const BlogPostCreate = () => {
  const { formProps, saveButtonProps } = useForm({
    meta: {
      gqlMutation: POST_CREATE_MUTATION,
    },
  });

  const { selectProps: categorySelectProps } = useSelect({
    resource: "categories",
    meta: {
      gqlQuery: CATEGORIES_SELECT_QUERY,
    },
  });

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label={"Title"}
          name={["title"]}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={"Content"}
          name="content"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <MDEditor data-color-mode="light" />
        </Form.Item>
        <Form.Item
          label={"Category"}
          name={"categoryId"}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select {...categorySelectProps} />
        </Form.Item>
        <Form.Item
          label={"Status"}
          name={["status"]}
          initialValue={"DRAFT"}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select
            defaultValue={"DRAFT"}
            options={[
              { value: "DRAFT", label: "Draft" },
              { value: "PUBLISHED", label: "Published" },
              { value: "REJECTED", label: "Rejected" },
            ]}
            style={{ width: 120 }}
          />
        </Form.Item>
      </Form>
    </Create>
  );
};
