"use client";

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  getProviders,
  signIn,
  useSession,
  getCsrfToken,
} from "next-auth/react";
import Head from "next/head";
import {
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  InputRightElement,
  InputGroup,
  Flex,
  Link,
  useToast,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import type { InferGetServerSidePropsType } from "next";
import type { CtxOrReq } from "next-auth/client/_utils";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { IoIosLogOut } from "react-icons/io";
const FormSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export default function SignUp() {
  const toast = useToast();
  const { data: session, status } = useSession();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const router = useRouter();
  type FormSchemaType = z.infer<typeof FormSchema>;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchemaType>();
  console.log(status);

  const onSubmit: SubmitHandler<FormSchemaType> = (data) => {
    console.log(data);
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("email", data?.email);
    formData.append("password", data?.password);
    fetch("/api/create-user", { method: "POST", body: formData })
      .then((data) => data.json())
      .then((result: { status: string }) => {
        if (result.status == "user added") {
          setIsSubmitting(false);
          toast({
            title: "Account created.",
            description: "We've created your account for you.",
            status: "success",
            duration: 9000,
            isClosable: true,
          });
          //if user was added successfully sign up with new use and redirect to new-user page
          void signIn("credentials", {
            email: data.email,
            password: data.password,
            redirect: false,
          }).then((res) => {
            void router.push("/auth/new-user");

            if (res?.ok) {
              toast({
                title: "Signed in",
                description: "We've logged you in .",
                status: "success",
                duration: 9000,
                isClosable: true,
              });
            }
          });
        } else if (result.status == "email exists") {
          setIsSubmitting(false);
          toast({
            title: "Error creating account",
            description: "User with email exists",
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        } else {
          setIsSubmitting(false);

          toast({
            title: "Error creating account",
            description: result.status,
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        }
      })
      .catch((err) => console.error(err));
  };

  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  /* if (status === "authenticated") {
    router.push("/", {
      query: {
        callbackUrl: router.query.callbackUrl,
      },
    });
  }*/

  return (
    <div data-theme="light">
      <div className="grid h-screen items-center justify-center rounded-lg bg-white lg:col-end-3">
        <div className="msd">
          <div>
            <h1 className="mb-5 text-2xl font-bold text-black">
              Create Account
            </h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl mb={5} isInvalid={Boolean(errors.email)}>
              <FormLabel className="font-bold text-black" htmlFor="name">
                Email
              </FormLabel>
              <Input
                className="w-full"
                placeholder="Enter Email"
                {...register("email", {
                  required: "email is required",
                })}
              />
              <FormErrorMessage>{errors?.email?.message}</FormErrorMessage>
            </FormControl>

            <FormControl mb={5} isInvalid={Boolean(errors?.password)}>
              <FormLabel className="font-bold text-black" htmlFor="name">
                Password
              </FormLabel>
              <InputGroup className="w-full">
                <Input
                  pr="4.5rem"
                  type={show ? "text" : "password"}
                  placeholder="Enter password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={handleClick}>
                    {show ? <FaEye /> : <FaEyeSlash />}
                  </Button>
                </InputRightElement>
              </InputGroup>{" "}
              <FormErrorMessage>{errors?.password?.message}</FormErrorMessage>
            </FormControl>
            <Flex className="flex justify-between">
              <Button
                m={0}
                bgColor="#285430"
                type="submit"
                isLoading={isSubmitting}
                loadingText={"Signing you up"}
                variant="solid"
                size="md"
                color="#FFFFFF"
                w="100%"
              >
                Jump in
              </Button>
              {/*<Button
              m={2}
              onClick={() =>
                signIn("google", {
                  callbackUrl: router.query.callbackUrl as string,
                })
              }
              leftIcon={<FcGoogle />}
              bgColor="#F15A29"
              variant="solid"
            >
              {toogleSignIn ? "Sign in with Google" : "Sign up with google"}
            </Button>*/}
            </Flex>
          </form>
          {/* <div className="mt-4 items-center pb-3">
            <div className="flex flex-col items-center">
              <p>Or Register with</p>
            </div>
          </div>

          <div className="mb-5 mt-4 flex flex-row items-center justify-center space-x-4">
            <button className="rounded-md border px-4 py-2 text-black">
              <FaSpotify />
            </button>
            <button className="rounded-md border px-4 py-2 text-black">
              <FaGoogle />
            </button>
            <button className="rounded-md border px-4 py-2 text-black">
              <FaApple />
            </button>
          </div>*/}
          <Link
            href="/auth/signin"
            className="btn m-2 flex flex-row items-center p-1"
          >
            Already Have an account? Sign In
            <IoIosLogOut className="m-2" />
          </Link>
        </div>
      </div>
    </div>
  );
}
