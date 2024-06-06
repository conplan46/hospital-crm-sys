import { Stat, StatLabel, StatNumber, WrapItem } from "@chakra-ui/react";

export default function InventoryItem({
	title,
	id,
	description,
	invCount
}: {
	title: string;
	id: number;
	description: string;
	invCount: number;
}) {
	return (
		<WrapItem>
			<div className="card m-2 w-96 bg-base-100 shadow-xl">
				<div className="skeleton h-32 w-96"></div>
				<div className="card-body">
					<h2 className="card-title">{title}</h2>
					<p>{description}</p>
					<Stat>
						<StatLabel>inventory count</StatLabel>
						<StatNumber>{invCount}</StatNumber>
					</Stat>
					<div className="card-actions justify-end">
						<button className="btn bg-[#285430]">Edit</button>

						<button className="btn bg-red-600">Delete</button>
					</div>
				</div>
			</div>
		</WrapItem>
	);
}