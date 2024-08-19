import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  Center,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Select,
  Checkbox,
  Textarea,
  useToast,
  Alert,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { areaCodes } from "utils/area-codes";
import {
  type BookingFormData,
  type PatientBookingFormData,
} from "utils/used-types";

export default function Booking({
  isOpen,
  onOpen,
  onClose,
  role,
  handler,
}: {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  role: string;
  handler: number | undefined;
}) {
  const [isClient, setIsClient] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [residence, setResidence] = useState("");
  const [areaCode, setAreaCode] = useState("");
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<BookingFormData>();

  const { data: session, status } = useSession();
  const toast = useToast();
  useEffect(() => {
    setIsClient(true);
  }, []);
  const onSubmit: SubmitHandler<BookingFormData> = async (data) => {
    console.log(data);
    if (handler && session?.user?.email) {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("email", session?.user?.email);
      formData.append("handler", `${handler}`);
      formData.append("handlerRole", role);

      formData.append("reasonForAppointment", data.reasonForAppointment);
      fetch("/api/create-booking", { method: "POST", body: formData })
        .then((data) => data.json())
        .then((data: { status: string }) => {
          if (data.status === "Booking Created") {
            toast({
              description: data.status,
              status: "success",
              duration: 9000,
              isClosable: true,
            });
            onClose();
          } else {
            toast({
              description: data.status,
              status: "error",
              duration: 9000,
              isClosable: true,
            });
          }
          setIsSubmitting(false);
        })
        .catch((err) => console.error(err));
    } else {
      toast({ description: "booking handler missing", status: "error" });
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Book Appointment</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Center>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="form-control m-4"
              >
                <FormControl
                  className="mb-6"
                  isInvalid={Boolean(errors.reasonForAppointment)}
                >
                  <FormLabel className="font-bold text-black" htmlFor="name">
                    Reason for booking appointment
                  </FormLabel>
                  <Textarea
                    className="w-full"
                    placeholder="reason"
                    {...register("reasonForAppointment", {
                      required: "Reason for appointment is required",
                    })}
                  />
                  <FormErrorMessage>
                    {errors?.reasonForAppointment?.message}
                  </FormErrorMessage>
                </FormControl>
                <div className="flex flex-row">
                  <Button
                    isLoading={isSubmitting}
                    loadingText="Submitting"
                    bgColor="#285430"
                    type="submit"
                  >
                    Book
                  </Button>
                  <Button variant="ghost" onClick={onClose}>
                    Close
                  </Button>
                </div>
              </form>
            </Center>

            <div role="alert" className="alert alert-info">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="h-6 w-6 shrink-0 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span>You have to be logged in as a patient to book</span>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
