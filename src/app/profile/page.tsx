"use client";
import { Button, Card, Col, Flex, Form, Input, message, Row } from "antd";
import { useState } from "react";
import { useSession } from "next-auth/react";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";

type FieldType = {
  email?: string;
  password?: string;
};

export default function UpdateForm() {
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const axiosAuth = useAxiosAuth();
  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      const res = await axiosAuth.post("/api/update-profile", values);

      await messageApi.open({
        type: "success",
        content: "Password Updated",
      });
    } catch {
      await messageApi.open({
        type: "error",
        content: "Update error",
      });
    }

    setLoading(false);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div>
      {contextHolder}
      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Update Password / APP Password
          </h1>
          <Form
            name="sign-up-form"
            layout="vertical"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            requiredMark={true}
          >
            <Row gutter={[8, 8]}>
              <Col xs={24}>
                <Form.Item<FieldType>
                  label="Password"
                  name="password"
                  help={"Keep Blank to not change"}
                >
                  <Input.Password />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item<FieldType>
                  label="App Password"
                  name="app_password"
                  help={"Keep Blank to not change"}
                >
                  <Input.Password />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item>
              <Flex align="center" justify="space-between">
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  loading={loading}
                  className={"mt-4"}
                >
                  Update Password
                </Button>
              </Flex>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}
