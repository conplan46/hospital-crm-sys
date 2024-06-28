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
import { type PatientBookingFormData } from "utils/used-types";

export default function PatientsBooking({
  isOpen,
  onOpen,
  onClose,
}: {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
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
  } = useForm<PatientBookingFormData>();
  const toast = useToast();
  useEffect(() => {
    setIsClient(true);
    setValue("requestLabTest", false);

    setValue("nurseVisit", false);
    setValue("requestMedicalExam", false);
  }, []);
  const onSubmit: SubmitHandler<PatientBookingFormData> = async (data) => {
    console.log(data);
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("patientName", data.patientName);
    formData.append("doctor", data.doctor);
    formData.append("nurseVisit", `${data.nurseVisit}`);
    formData.append("requestLabTest", `${data.requestLabTest}`);
    formData.append("phoneNumber", `${data.phoneNumber}`);
    formData.append("requestPrescription", data.requestPrescription);
    formData.append("patientComplaint", data.patientComplaint);
    formData.append("requestMedicalExam", `${data.requestMedicalExam}`);
    fetch("/api/create-patient", { method: "POST", body: formData })
      .then((data) => data.json())
      .then((data: { status: string }) => {
        if (data.status === "patient added") {
          toast({
            description: "Patient Booked",
            status: "success",
            duration: 9000,
            isClosable: true,
          });
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
                <FormControl
                  className="mb-6"
                  isInvalid={Boolean(errors.patientName)}
                >
                  <FormLabel className="font-bold text-black" htmlFor="name">
                    Patient Name
                  </FormLabel>
                  <Input
                    className="w-full"
                    placeholder="Patient Name"
                    {...register("patientName", {
                      required: "name is required",
                    })}
                  />
                  <FormErrorMessage>
                    {errors?.patientName?.message}
                  </FormErrorMessage>
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
                <FormControl
                  className="mb-6"
                  isInvalid={Boolean(errors.doctor)}
                >
                  <FormLabel className="font-bold text-black" htmlFor="name">
                    Request Doctor or specialist
                  </FormLabel>
                  <Input
                    {...register("doctor", {
                      required: "doctor is required",
                    })}
                    placeholder="request doctor or specialist"
                  />

                  <FormErrorMessage>{errors?.doctor?.message}</FormErrorMessage>
                </FormControl>
                <FormControl
                  className="mb-6"
                  isInvalid={Boolean(errors.nurseVisit)}
                >
                  <FormLabel className="font-bold text-black" htmlFor="name">
                    Nurse visit
                  </FormLabel>
                  <Checkbox {...register("nurseVisit")}>Nurse Visit</Checkbox>

                  <FormErrorMessage>
                    {errors?.requestLabTest?.message}
                  </FormErrorMessage>
                </FormControl>

                <FormControl
                  className="mb-6"
                  isInvalid={Boolean(errors.requestLabTest)}
                >
                  <FormLabel className="font-bold text-black" htmlFor="name">
                    Request Lab Test
                  </FormLabel>
                  <Checkbox {...register("requestLabTest")}>Lab Test</Checkbox>

                  <FormErrorMessage>
                    {errors?.requestLabTest?.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl
                  className="mb-6"
                  isInvalid={Boolean(errors.requestMedicalExam)}
                >
                  <FormLabel className="font-bold text-black" htmlFor="name">
                    Request Medical Exam
                  </FormLabel>
                  <Checkbox {...register("requestMedicalExam")}>
                    Medical Exam
                  </Checkbox>

                  <FormErrorMessage>
                    {errors?.requestMedicalExam?.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl
                  className="mb-6"
                  isInvalid={Boolean(errors.requestPrescription)}
                >
                  <FormLabel className="font-bold text-black" htmlFor="name">
                    Request Prescription
                  </FormLabel>
                  <Textarea
                    className="w-full"
                    placeholder="prescription"
                    {...register("requestPrescription", {
                      required: "name is required",
                    })}
                  />
                  <FormErrorMessage>
                    {errors?.patientName?.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl
                  className="mb-6"
                  isInvalid={Boolean(errors.patientComplaint)}
                >
                  <FormLabel className="font-bold text-black" htmlFor="name">
                    Patient Complaint
                  </FormLabel>
                  <Textarea
                    className="w-full"
                    placeholder="Enter patient complaint"
                    {...register("patientComplaint", {
                      required: "complaint is required",
                    })}
                  />
                  <FormErrorMessage>
                    {errors?.patientComplaint?.message}
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
