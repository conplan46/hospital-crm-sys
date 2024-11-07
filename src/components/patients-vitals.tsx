import { patientVitalsRecords, patients } from "drizzle/schema";
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
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
  patientId,
  isOpen,
  onOpen,
  onClose,
}: {
  patientId: number;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [isLoading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PatientVitalsForm>();
  const [toogleEdit, setToogleEdit] = useState(false);

  const toast = useToast();
  const onSubmit: SubmitHandler<PatientVitalsForm> = async (data) => {
    setToogleEdit(false);
    setLoading(true);
    console.log(data);
    const formData = new FormData();
    formData.append("id", `${patientId}`);
    formData.append("height", `${data?.height}`);
    formData.append("bloodPressure", `${data?.bloodPressure}`);
    formData.append("temperature", `${data?.temperature}`);
    formData.append("resp", `${data?.resp}`);
    formData.append(
      "allergies",
      JSON.stringify(data.allergies.split(",") ?? []),
    );

    formData.append(
      "medications",
      JSON.stringify(data.medication.split(",") ?? []),
    );

    formData.append(
      "vaccinations",
      JSON.stringify(data.vaccinations.split(",") ?? []),
    );
    void fetch("/api/set-patients-vitals", { method: "POST", body: formData })
      .then((data) => data.json())
      .then((data: { status: string }) => {
        setLoading(false);
        if (data.status === "updated successfully") {
          void queryClient.invalidateQueries({ queryKey: ["patient-vitals"] });
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
  const patientVitalsQuery = useQuery({
    queryKey: ["patient-vitals"],
    queryFn: async () => {
      try {
        const formData = new FormData();
        formData.append("id", `${patientId}`);
        const req = await fetch("/api/get-patients-vitals", {
          method: "POST",
          body: formData,
        });
        const res = (await req.json()) as {
          vitals: Array<typeof patientVitalsRecords.$inferSelect>;
          status: string;
        };
        return res.vitals;
      } catch (e) {
        console.error(e);
      }
    },
  });
  console.log({ patientVitalsQuery });
  const [pageIndex, setPageIndex] = useState(0);

  const nextPage = () => {
    if (pageIndex < (patientVitalsQuery?.data?.length ?? 0) - 1) {
      setPageIndex((x) => x + 1);
    }
  };

  const prevPage = () => {
    if (pageIndex != 0) {
      setPageIndex((x) => x - 1);
    }
  };
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
                  setToogleEdit(!toogleEdit);
                }}
                className="m-2"
              >
                {toogleEdit ? "Cancel" : "Add Vitals Entry"}
              </Button>
            </div>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {!toogleEdit ? (
              patientVitalsQuery?.data?.length ?? 0 > 0 ? (
                <>
                  <h2 className="my-3 text-xl">
                    {" "}
                    {new Date(
                      patientVitalsQuery?.data?.[pageIndex]?.createdAt ?? "",
                    ).toString()}{" "}
                  </h2>
                  <Wrap>
                    <WrapItem>
                      <Center>
                        <FormControl className="mb-6">
                          <FormLabel
                            className="font-bold text-black"
                            htmlFor="name"
                          >
                            Height in Metres
                          </FormLabel>
                          <Input
                            value={
                              patientVitalsQuery?.data?.[pageIndex]?.height ?? 0
                            }
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
                          <FormLabel
                            className="font-bold text-black"
                            htmlFor="name"
                          >
                            Weight in Kgs
                          </FormLabel>
                          <Input
                            value={
                              patientVitalsQuery?.data?.[pageIndex]?.weight ?? 0
                            }
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
                          <FormLabel
                            className="font-bold text-black"
                            htmlFor="name"
                          >
                            Temperature in degrees Celcius
                          </FormLabel>
                          <Input
                            value={
                              patientVitalsQuery?.data?.[pageIndex]
                                ?.temperature ?? 0
                            }
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
                          <FormLabel
                            className="font-bold text-black"
                            htmlFor="name"
                          >
                            Blood Pressure in mmHg
                          </FormLabel>
                          <Input
                            type="number"
                            disabled={!toogleEdit}
                            value={
                              patientVitalsQuery?.data?.[pageIndex]
                                ?.blood_pressure ?? 0
                            }
                            placeholder="Blood Pressure in mmHg"
                          />
                        </FormControl>
                      </Center>
                    </WrapItem>
                    <WrapItem>
                      <Center>
                        <FormControl className="mb-6">
                          <FormLabel
                            className="font-bold text-black"
                            htmlFor="name"
                          >
                            Respiratory Rate in Breaths per Minute
                          </FormLabel>
                          <Input
                            value={
                              patientVitalsQuery?.data?.[pageIndex]?.resp ?? 0
                            }
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
                      <FormLabel
                        className="font-bold text-black"
                        htmlFor="name"
                      >
                        Allergies (comma separated)
                      </FormLabel>
                      <Textarea
                        disabled={!toogleEdit}
                        value={
                          patientVitalsQuery?.data?.[pageIndex]?.allergies ?? 0
                        }
                        placeholder="Allergies comma separated"
                      />
                    </FormControl>
                  </Center>
                  <Center>
                    <FormControl className="mb-6">
                      <FormLabel
                        className="font-bold text-black"
                        htmlFor="name"
                      >
                        Medication (comma separated)
                      </FormLabel>
                      <Textarea
                        disabled={!toogleEdit}
                        value={
                          patientVitalsQuery?.data?.[pageIndex]?.medication ?? 0
                        }
                        placeholder="medication comma separated"
                      />
                    </FormControl>
                  </Center>
                  <Center>
                    <FormControl className="mb-6">
                      <FormLabel
                        className="font-bold text-black"
                        htmlFor="name"
                      >
                        Vacination (comma separated)
                      </FormLabel>
                      <Textarea
                        disabled={!toogleEdit}
                        value={
                          patientVitalsQuery?.data?.[pageIndex]?.vaccinations ??
                          0
                        }
                        placeholder="Vacination (comma separated)"
                      />
                    </FormControl>
                  </Center>

                  <Center className="m-2">
                    <div className="flex items-baseline ">
                      <Button onClick={nextPage} className="m-2">
                        previous
                      </Button>
                      <Button onClick={prevPage} className="m-2">
                        next
                      </Button>
                    </div>
                  </Center>
                </>
              ) : (
                <Center>
                  <h2 className="m-2">No Patient Vitals entries</h2>
                </Center>
              )
            ) : (
              <>
                <Wrap>
                  <WrapItem>
                    <Center>
                      <FormControl className="mb-6">
                        <FormLabel
                          className="font-bold text-black"
                          htmlFor="name"
                        >
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
                        <FormLabel
                          className="font-bold text-black"
                          htmlFor="name"
                        >
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
                        <FormLabel
                          className="font-bold text-black"
                          htmlFor="name"
                        >
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
                        <FormLabel
                          className="font-bold text-black"
                          htmlFor="name"
                        >
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
                        <FormLabel
                          className="font-bold text-black"
                          htmlFor="name"
                        >
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
              </>
            )}
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
