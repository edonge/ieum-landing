type NotifyPayload = {
  subject: string;
  text: string;
};

export async function notifyByEmail({ subject, text }: NotifyPayload) {
  const to = process.env.NOTIFY_EMAIL_TO;
  const apiKey = process.env.RESEND_API_KEY;
  if (!to || !apiKey) return;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "ieum <onboarding@resend.dev>",
      to,
      subject,
      text,
    }),
  }).catch(() => {});
}
