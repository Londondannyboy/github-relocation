import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { name, email, subject, message } = data;

    // Basic validation
    if (!name || !email || !message) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Please fill in all required fields' 
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Please enter a valid email address' 
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Store submission (you can add Sanity or Resend integration here)
    const submission = {
      name,
      email,
      subject: subject || 'General Inquiry',
      message,
      timestamp: new Date().toISOString(),
      source: 'relocation.quest'
    };

    // For now, just log it (in production, you'd send email or store in database)
    console.log('Contact form submission:', submission);

    // In the future, you can:
    // 1. Send email via Resend API
    // 2. Store in Sanity CMS
    // 3. Send to a webhook
    // 4. Store in Vercel KV

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Thank you for your message! We\'ll get back to you soon.'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Something went wrong. Please try again later.' 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};