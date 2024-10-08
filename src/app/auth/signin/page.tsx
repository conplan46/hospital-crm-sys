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
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { InferGetServerSidePropsType } from "next";
import { CtxOrReq } from "next-auth/client/_utils";
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
} from "@chakra-ui/react";
import Head from "next/head";
import { useState } from "react";
import { z } from "zod";
import {
  FaEye,
  FaEyeSlash,
  FaSpotify,
  FaApple,
  FaGoogle,
} from "react-icons/fa";
import { IoIosLogOut } from "react-icons/io";

const FormSchema = z.object({
  email: z.string(),
  password: z.string(),
});

type FormSchemaType = z.infer<typeof FormSchema>;
export default function SignIn() {
  const router = useRouter();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchemaType>();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const callBackUrl = useSearchParams().get("callbackUrl");
  const onSubmit: SubmitHandler<FormSchemaType> = (data: FormSchemaType) => {
    console.log(data);
    setIsSubmitting(true);
    signIn("credentials", {
      email: data?.email,
      password: data.password,
      redirect: false,
    })
      .then((res) => {
        setIsSubmitting(false);
        if (res?.ok) {
          toast({
            title: "Signed in",
            description: "We've logged you in .",
            status: "success",
            duration: 9000,
            isClosable: true,
          });
          if (callBackUrl) {
            void router.push(callBackUrl);
          } else {
            void router.push("/");
          }
        }
        if (res?.error) {
          setIsSubmitting(false);
          toast({
            title: "Error Signing in",
            description:
              "Something went wrong, credentials used might be invalid or a server error might occured ",
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        }
        console.log({ authresponse: res }); //DEBUG remove debug logs
      })
      .catch((err) => console.error(err));
  };
  return (
    <div data-theme="light">
      <div className="flex h-screen items-center justify-center rounded-lg bg-white lg:col-end-3">
        <div className="msd">
          <h1 className="text-2xl font-bold text-black">Sign in</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl mt={4} isInvalid={Boolean(errors.email)}>
              <FormLabel htmlFor="name">Email</FormLabel>
              <Input
                placeholder="Enter Email"
                {...register("email", {
                  required: "email is required",
                })}
              />
              <FormErrorMessage>{errors?.email?.message}</FormErrorMessage>
            </FormControl>

            <FormControl mt={4} isInvalid={Boolean(errors.password)}>
              <FormLabel htmlFor="name">Password</FormLabel>
              <InputGroup size="md">
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
            <div className="mb-2 mt-2 flex w-full flex-row justify-end">
              <Link className="m-1 self-end" href="/reset-password/send-link">
                Forgot password?
              </Link>
            </div>
            <Flex>
              <Button
                mb={3}
                bgColor="#285430"
                type="submit"
                isLoading={isSubmitting}
                loadingText={"Signing you in"}
                variant="solid"
                color="#FFFFFF"
                w="100%"
              >
                Sign in
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

          <div>
            <Link
              className="btn m-1 flex flex-row items-center"
              href="/auth/signup"
            >
              Sign up
              <IoIosLogOut className="m-2" />
            </Link>
          </div>
          {/* <div className="items-center mt-4 pb-3">
        <div className="flex flex-col items-center">
        <p>Or Login with</p>
        </div>
      </div>
      <div className="items-center justify-center mt-4 flex flex-row space-x-4">
  <button className="px-4 py-2 border text-black rounded-md"><FaSpotify /></button>
  <button className="px-4 py-2 border text-black rounded-md"><FaGoogle /></button>
  <button className="px-4 py-2 border text-black rounded-md"><FaApple /></button>
</div>*/}
        </div>
      </div>
    </div>
  );
}
/* export const getServerSideProps = async (context: CtxOrReq | undefined) => {
  const providers = await getProviders();
  return {
    props: {
      csrfToken: await getCsrfToken(context),
      providers,
    },
  };
}; */
