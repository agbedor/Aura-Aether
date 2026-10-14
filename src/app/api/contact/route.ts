import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
};

export async function POST(request: Request) {
  let payload: ContactPayload;

  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: "Please submit a valid message." }, { status: 400 });
  }

  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";
  const subject =
    typeof payload.subject === "string"
      ? payload.subject.replace(/[\r\n]+/g, " ").trim().slice(0, 120)
      : "";
  const message = typeof payload.message === "string" ? payload.message.trim() : "";

  if (!name || name.length > 100) {
    return NextResponse.json({ error: "Please enter your name (up to 100 characters)." }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  if (!subject || subject.length > 120) {
    return NextResponse.json({ error: "Please choose a message subject." }, { status: 400 });
  }

  if (!message || message.length > 5000) {
    return NextResponse.json({ error: "Your message must be between 1 and 5,000 characters." }, { status: 400 });
  }

  try {
    const savedMessage = await prisma.contactMessage.create({
      data: { name, email, subject, message },
      select: { id: true, createdAt: true },
    });

    // Email alerts are optional. Messages are still saved to PostgreSQL if email is not configured.
    const resendApiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_TO_EMAIL;
    const fromEmail = process.env.CONTACT_FROM_EMAIL;

    if (resendApiKey && toEmail && fromEmail) {
      try {
        const emailResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: fromEmail,
            to: [toEmail],
            reply_to: email,
            subject: `Aura & Aether contact: ${subject}`,
            text: [
              "A new message was submitted through the Aura & Aether contact form.",
              "",
              `Name: ${name}`,
              `Email: ${email}`,
              `Subject: ${subject}`,
              "",
              "Message:",
              message,
              "",
              `Message ID: ${savedMessage.id}`,
            ].join("\n"),
          }),
        });

        if (!emailResponse.ok) {
          const errorBody = await emailResponse.text().catch(() => "Could not read response body");
          console.error("Contact email notification failed:", {
            status: emailResponse.status,
            body: errorBody,
          });
        } else {
          console.log("Contact email sent successfully via Resend.");
        }
      } catch (error) {
        console.error("Contact email notification could not be sent:", error);
      }
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Failed to save contact message:", error);
    return NextResponse.json(
      { error: "We couldn't save your message right now. Please try again in a moment." },
      { status: 500 }
    );
  }
}
