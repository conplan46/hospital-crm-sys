import { patients } from "drizzle/schema";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Center,
  FormErrorMessage,
  Input,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { Wrap, WrapItem } from "@chakra-ui/react";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
const patientVitals = z.object({
  height: z.number(),
  weight: z.number(),
  temperature: z.number(),
  bloodPressure: z.number(),
  resp: z.number(),
  allergies: z.string(),
  medication: z.string(),
  vaccinations: z.string(),
});
export type PatientVitalsForm = z.infer<typeof patientVitals>;
export default function PatientVitals({
  patient,
  isOpen,
  onOpen,
  onClose,
}: {
  patient: typeof patients.$inferSelect;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const [isLoading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PatientVitalsForm>();
  const [toogleEdit, setToogleEdit] = useState(false);
  const onSubmit: SubmitHandler<PatientVitalsForm> = async (data) => {
    setToogleEdit(false);
    setLoading(true);
    console.log(data);
    const formData = new FormData();
    formData.append("height", `${data?.height}`);
    formData.append("bloodPressure", `${data?.bloodPressure}`);
    formData.append("temperature", `${data?.temperature}`);
    formData.append("resp", `${data?.resp}`);
    formData.append(
      "allergies",
      JSON.stringify(
        patient?.allergies?.push(...data.allergies.split(",")) ?? [],
      ),
    );

    formData.append(
      "medications",
      JSON.stringify(
        patient?.medication?.push(...data.medication.split(",")) ?? [],
      ),
    );

    formData.append(
      "vaccinations",
      JSON.stringify(
        patient?.vaccinations?.push(...data.vaccinations.split(",")) ?? [],
      ),
    );
    void fetch("/api/set-patients-vitals", { method: "POST", body: formData })
      .then((data) => data.json())
      .then((data: { status: string }) => {
        setLoading(false);
        if (data.status === "updated successfully") {
          void queryClient.invalidateQueries({ queryKey: ["user-bookings"] });
          toast({ status: "success", description: data.status });
        } else {
          toast({ status: "error", description: data.status });
        }
      })
      .catch((e) => {
        setLoading(false);
        console.error(e);

        toast({ status: "error", description: "something went wrong" });
      });
  };
 
 /*  useEffect(() => {
    setValue("height", patient?.height ?? 0);
    setValue("weight", patient?.weight ?? 0);
    setValue("resp", patient?.resp ?? 0);
    setValue("temperature", patient?.temperature ?? 0);
    setValue("bloodPressure", patient?.blood_pressure ?? 0);
    setValue("vaccinations", patient?.vaccinations?.join() ?? "");
    setValue("medication", patient?.medication?.join() ?? "");
    setValue("allergies", patient?.allergies?.join() ?? "");
  }, [patient]); */
  const toast = useToast();
  const queryClient = useQueryClient();
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalOverlay />

      <form onSubmit={handleSubmit(onSubmit)} className="form-control m-4">
        <ModalContent>
          <ModalHeader>
            <div className="flex items-baseline">
              <h2 className="m-2">Patient Vitals</h2>
              <Button
                onClick={() => {
                  setValue("height", patient.height ?? 0);
                  setValue("weight", patient.weight ?? 0);
                  setValue("resp", patient.resp ?? 0);
                  setValue("temperature", patient.temperature ?? 0);
                  setValue("bloodPressure", patient.blood_pressure ?? 0);
                  setValue("vaccinations", patient.vaccinations?.join() ?? "");
                  setValue("medication", patient.medication?.join() ?? "");
                  setValue("allergies", patient.allergies?.join() ?? "");
                  setToogleEdit(!toogleEdit);
                }}
                className="m-2"
              >
                {toogleEdit ? "Cancel" : "Edit Vitals"}
              </Button>
            </div>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Wrap>
              <WrapItem>
                <Center>
                  <FormControl className="mb-6">
                    <FormLabel className="font-bold text-black" htmlFor="name">
                      Height in Metres
                    </FormLabel>
                    <Input
                      {...register("height")}
                      disabled={!toogleEdit}
                      type="number"
                      placeholder="enter height in metres"
                    />
                  </FormControl>
                </Center>
              </WrapItem>
              <WrapItem>
                <Center>
                  <FormControl className="mb-6">
                    <FormLabel className="font-bold text-black" htmlFor="name">
                      Weight in Kgs
                    </FormLabel>
                    <Input
                      {...register("weight")}
                      disabled={!toogleEdit}
                      type="number"
                      placeholder="enter weight in kilograms"
                    />
                  </FormControl>
                </Center>
              </WrapItem>
              <WrapItem>
                <Center>
                  <FormControl className="mb-6">
                    <FormLabel className="font-bold text-black" htmlFor="name">
                      Temperature in degrees Celcius
                    </FormLabel>
                    <Input
                      {...register("temperature")}
                      disabled={!toogleEdit}
                      type="number"
                      placeholder="Temperature in degrees Celcius"
                    />
                  </FormControl>
                </Center>
              </WrapItem>
              <WrapItem>
                <Center>
                  <FormControl className="mb-6">
                    <FormLabel className="font-bold text-black" htmlFor="name">
                      Blood Pressure in mmHg
                    </FormLabel>
                    <Input
                      type="number"
                      disabled={!toogleEdit}
                      {...register("bloodPressure")}
                      placeholder="Blood Pressure in mmHg"
                    />
                  </FormControl>
                </Center>
              </WrapItem>
              <WrapItem>
                <Center>
                  <FormControl className="mb-6">
                    <FormLabel className="font-bold text-black" htmlFor="name">
                      Respiratory Rate in Breaths per Minute
                    </FormLabel>
                    <Input
                      {...register("resp")}
                      disabled={!toogleEdit}
                      type="number"
                      placeholder="Respiratory Rate in Breaths per Minute"
                    />
                  </FormControl>
                </Center>
              </WrapItem>
            </Wrap>
            <Center>
              <FormControl className="mb-6">
                <FormLabel className="font-bold text-black" htmlFor="name">
                  Allergies (comma separated)
                </FormLabel>
                <Textarea
                  disabled={!toogleEdit}
                  {...register("allergies")}
                  placeholder="Allergies comma separated"
                />
              </FormControl>
            </Center>
            <Center>
              <FormControl className="mb-6">
                <FormLabel className="font-bold text-black" htmlFor="name">
                  Medication (comma separated)
                </FormLabel>
                <Textarea
                  disabled={!toogleEdit}
                  {...register("medication")}
                  placeholder="medication comma separated"
                />
              </FormControl>
            </Center>
            <Center>
              <FormControl className="mb-6">
                <FormLabel className="font-bold text-black" htmlFor="name">
                  Vacination (comma separated)
                </FormLabel>
                <Textarea
                  disabled={!toogleEdit}
                  {...register("vaccinations")}
                  placeholder="Vacination (comma separated)"
                />
              </FormControl>
            </Center>
          </ModalBody>

          <ModalFooter>
            <Button
              isLoading={isLoading}
              colorScheme="blue"
              mr={3}
              onClick={onClose}
            >
              Close
            </Button>
            <Button isLoading={isLoading} type="submit" variant="ghost">
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
}
