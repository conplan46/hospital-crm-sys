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
} from "@chakra-ui/react";
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
  handler,
}: {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  handler: string;
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
  const toast = useToast();
  useEffect(() => {
    setIsClient(true);
  }, []);
  const onSubmit: SubmitHandler<BookingFormData> = async (data) => {
    console.log(data);
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("handler", handler);
    formData.append("phoneNumber", `${data.phoneNumber}`);
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
                <FormControl className="mb-6" isInvalid={Boolean(errors.name)}>
                  <FormLabel className="font-bold text-black" htmlFor="name">
                    Patient Name
                  </FormLabel>
                  <Input
                    className="w-full"
                    placeholder="Name"
                    {...register("name", {
                      required: "name is required",
                    })}
                  />
                  <FormErrorMessage>{errors?.name?.message}</FormErrorMessage>
                </FormControl>
                <FormControl
                  className="mb-6"
                  isInvalid={Boolean(errors.phoneNumber)}
                >
                  <FormLabel htmlFor="name">Phone Number</FormLabel>
                  <div className="join">
                    <Select
                      className="join-item"
                      onChange={(e) => {
                        setAreaCode(e.target.value);
                        areaCodes.forEach(
                          (val: { code: string; name: string }, index) => {
                            if (val.code == e.target.value) {
                              setResidence(val.name);
                            }
                          },
                        );
                      }}
                    >
                      <option disabled selected>
                        Area Code
                      </option>
                      {areaCodes.map(
                        (val: { code: string; name: string }, index) => {
                          return (
                            <option key={index} value={val.code}>
                              {val.name} {val.code}
                            </option>
                          );
                        },
                      )}
                    </Select>
                    <Input
                      id="name"
                      className="join-item"
                      placeholder="phoneNumber"
                      {...register("phoneNumber", {
                        required: "Phone number is required",
                      })}
                    />
                  </div>
                  <FormErrorMessage>
                    {errors?.phoneNumber?.message}
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
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
