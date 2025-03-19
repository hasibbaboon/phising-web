"use client";
import { Button, Card, Col, Flex, Form, Input, message, Row } from "antd";
import { useEffect, useState } from "react";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type FieldType = {
  email?: string;
  password?: string;
};

export default function SignInPage() {
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const user: any = session?.user as any;
  const router = useRouter();
  useEffect(() => {
    if (user?.email) {
      router.push("/");
    }
  }, [user?.email]);
  const onFinish = async (values: any) => {
    setLoading(true);
    const result = await signIn("email-password", {
      redirect: false,
      email: values.email,
      password: values.password,
      callbackUrl: "/",
    });

    if (result?.error) {
      message.error("Credentials Failed");
    }
    setLoading(false);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <section className="bg-gray-500 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <Link
          href="/login"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <img src="/icons/logo.svg" alt="logo" className={"mr-2"} />
          Login
        </Link>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
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
              <Row gutter={[8, 0]}>
                <Col xs={24}>
                  <Form.Item<FieldType>
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: "Please input your email" },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  <Form.Item<FieldType>
                    label="App Password"
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: "Please input your password!",
                      },
                    ]}
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
                  >
                    Login
                  </Button>
                </Flex>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
}
