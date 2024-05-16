import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
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
} from "@chakra-ui/react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { areaCodes } from "utils/area-codes";
import { PatientBookingFormData } from "utils/used-types";

export default function PatientsBooking({
	isOpen,
	onOpen,
	onClose,
}: {
	isOpen: boolean;
	onOpen: () => void;
	onClose: () => void;
}) {
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [residence, setResidence] = useState("");
	const [areaCode, setAreaCode] = useState("");
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<PatientBookingFormData>();

	const onSubmit: SubmitHandler<PatientBookingFormData> = async (data) => {
		console.log(data);
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
									isInvalid={Boolean(errors.requestDiagnosticTest)}
								>
									<FormLabel className="font-bold text-black" htmlFor="name">
										Request Diagnostic test
									</FormLabel>
									<Checkbox
										{...register("requestDiagnosticTest", {
											required: "doctor is required",
										})}
									>
										Diagnostic test
									</Checkbox>

									<FormErrorMessage>
										{errors?.requestDiagnosticTest?.message}
									</FormErrorMessage>
								</FormControl>
								<FormControl
									className="mb-6"
									isInvalid={Boolean(errors.requestLabTest)}
								>
									<FormLabel className="font-bold text-black" htmlFor="name">
										Request Lab Test
									</FormLabel>
									<Checkbox
										{...register("requestLabTest", {
											required: "doctor is required",
										})}
									>
										Lab test
									</Checkbox>

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
									<Checkbox
										{...register("requestMedicalExam", {
											required: "doctor is required",
										})}
									>
										Diagnostic test
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
