type NotifyPayload = {
  subject: string;
  text: string;
  /** 받은 메일에서 "답장"을 누르면 자동으로 들어갈 주소 */
  replyTo?: string;
};

export async function notifyByEmail({ subject, text, replyTo }: NotifyPayload) {
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
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
  }).catch(() => {});
}
