import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { prisma } = await import("@/lib/prisma");

    const evt = await verifyWebhook(req);
    const { id } = evt.data;
    const eventType = evt.type;

    console.log(`Received webhook with ID ${id} and event type of ${eventType}`);

    switch (eventType) {
      case "user.created": {
        const { id, email_addresses, first_name, last_name } = evt.data;

        await prisma.user.upsert({
          where: { clerkId: id },
          update: {},
          create: {
            clerkId: id,
            email: email_addresses[0].email_address,
            name: `${first_name ?? ""} ${last_name ?? ""}`.trim(),
          },
        });

        break;
      }

      case "user.updated": {
        const { id, email_addresses, first_name, last_name } = evt.data;

        await prisma.user.update({
          where: { clerkId: id },
          data: {
            email: email_addresses[0].email_address,
            name: `${first_name ?? ""} ${last_name ?? ""}`.trim(),
          },
        });

        break;
      }

      case "user.deleted": {
        const { id } = evt.data;

        await prisma.user.delete({
          where: { clerkId: id },
        });

        break;
      }

      default:
        console.log(`Unhandled event type: ${eventType}`);
    }

    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}