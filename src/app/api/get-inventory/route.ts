import { client, pool } from "utils/db-pool";
import { getServerAuthSession } from "~/server/auth";

export async function POST(request: Request) {
	const client = await pool.connect();
	try {
		const session = await getServerAuthSession();
		console.log({ serverSesh: session });
		const body = (await request.json()) as { estId: string };
		const inventory = await client.query("SELECT * from inventory WHERE est_id = $1", [body.estId]);
		return Response.json({ inventory: inventory.rows, status: "success" });
	} catch (e) {
		console.error(e);
		return Response.json({ status: "An internal error occured" });
	} finally {
		client.release();
	}
}
