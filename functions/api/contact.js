export async function onRequestPost(context) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "https://clicroot.com",
    "Content-Type": "application/json",
  };

  try {
    const body = await context.request.json();
    const { name, email, website, message } = body;

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${context.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "clicroot <noreply@clicroot.com>",
        to: ["hello@clicroot.com"],
        subject: `New lead: ${name} — ${website || "No website"}`,
        reply_to: email,
        html: `
          <h2>New contact from clicroot.com</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Website:</strong> ${website || "Not provided"}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, "<br>")}</p>
        `,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return new Response(JSON.stringify({ error: "Email failed", detail: err }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "https://clicroot.com",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
