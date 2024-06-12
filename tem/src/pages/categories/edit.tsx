import { Edit, useForm } from "@refinedev/antd";
import { Form, Input } from "antd";
import { CATEGORY_EDIT_MUTATION } from "./queries";

export const CategoryEdit = () => {
  const { formProps, saveButtonProps } = useForm({
    meta: {
      gqlMutation: CATEGORY_EDIT_MUTATION,
    },
  });

  return (
    <Edit saveButtonProps={saveButtonProps}>
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
      </Form>
    </Edit>
  );
};
