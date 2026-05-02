const toEmail = process.env.CONTACT_TO_EMAIL || "21guevarrajohnlloyd@gmail.com";
const fromEmail = process.env.RESEND_FROM_EMAIL || "FlowPilot AI <onboarding@resend.dev>";

function clean(value) {
  return typeof value === "string" ? value.trim() : "";
}

function escapeHtml(value) {
  return clean(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function buildMessage(fields) {
  return [
    `Name: ${fields.name || "Not provided"}`,
    `Email: ${fields.email}`,
    `Company: ${fields.company || "Not provided"}`,
    `Priority: ${fields.priority || "Not provided"}`,
    "",
    "Message:",
    fields.message
  ].join("\n");
}

module.exports = async function handler(request, response) {
  if (request.method === "OPTIONS") {
    response.status(204).end();
    return;
  }

  if (request.method !== "POST") {
    response.status(405).json({ error: "Method not allowed" });
    return;
  }

  if (!process.env.RESEND_API_KEY) {
    response.status(500).json({ error: "Email service is not configured" });
    return;
  }

  const body = typeof request.body === "string" ? JSON.parse(request.body || "{}") : request.body || {};
  const fields = {
    name: clean(body.name),
    email: clean(body.email),
    company: clean(body.company),
    priority: clean(body.priority),
    message: clean(body.message)
  };

  if (!fields.email || !fields.message) {
    response.status(400).json({ error: "Email and message are required" });
    return;
  }

  const subject = `New contact request from ${fields.name || fields.email}`;
  const text = buildMessage(fields);
  const html = `
    <h2>New contact request</h2>
    <p><strong>Name:</strong> ${escapeHtml(fields.name || "Not provided")}</p>
    <p><strong>Email:</strong> ${escapeHtml(fields.email)}</p>
    <p><strong>Company:</strong> ${escapeHtml(fields.company || "Not provided")}</p>
    <p><strong>Priority:</strong> ${escapeHtml(fields.priority || "Not provided")}</p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(fields.message).replace(/\n/g, "<br>")}</p>
  `;

  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      reply_to: fields.email,
      subject,
      text,
      html
    })
  });

  if (!resendResponse.ok) {
    response.status(502).json({ error: "Email delivery failed" });
    return;
  }

  response.status(200).json({ ok: true });
};
