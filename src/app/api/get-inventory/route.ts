import { client, pool } from "utils/db-pool";
import { getServerAuthSession } from "~/server/auth";

export async function POST(request: Request) {
	const client = await pool.connect();
  try {
    const session = await getServerAuthSession();
    console.log({serverSesh:session});
    const body = (await request.json()) as { estId: string };
    const inventory = await client.query(
      "SELECT * FROM inventory INNER JOIN products ON product_id = products.id WHERE est_id = $1 ",
      [body.estId],
    );
    console.log({inventory:inventory.rows})

    return Response.json({ inventory: inventory.rows, status: "success" });
  } catch (e) {
    console.error(e);
    return Response.json({ status: "An internal error occured" });
  }finally{
		 client.release();
	}
}
