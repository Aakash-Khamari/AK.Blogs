import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { marked } from 'marked'

// Configure marked to be safe and use breaks
marked.setOptions({
  breaks: true,
  gfm: true
})

export async function POST(req) {
  try {
    const supabase = await createClient()

    // 1. Authenticate user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Verify admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // 3. Parse request body
    const { subject, content } = await req.json()
    if (!subject || !content) {
      return NextResponse.json({ error: 'Subject and content are required' }, { status: 400 })
    }

    // 4. Check Resend API Key
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: 'RESEND_API_KEY is not configured in environment variables' }, { status: 500 })
    }
    const resend = new Resend(process.env.RESEND_API_KEY)

    // 5. Fetch all subscribers
    const { data: subscribers, error: subError } = await supabase
      .from('newsletter_subscribers')
      .select('email')

    if (subError) throw subError
    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({ error: 'No subscribers found' }, { status: 400 })
    }

    // 6. Convert Markdown to HTML for the email body
    const htmlContent = marked.parse(content)
    
    // Style the email slightly
    const styledHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-w-xl; margin: 0 auto; color: #111; line-height: 1.6;">
        ${htmlContent}
        <hr style="border: none; border-top: 1px solid #eaeaea; margin: 32px 0;" />
        <p style="font-size: 12px; color: #666; text-align: center;">
          You received this email because you subscribed to the Observations newsletter at AakashKhamari.com.
        </p>
      </div>
    `

    // 7. Batch send emails using Resend
    // Resend allows batch sending up to 100 emails at a time.
    // For simplicity, we chunk them into arrays of 100.
    const CHUNK_SIZE = 100
    const emailsSent = []
    
    for (let i = 0; i < subscribers.length; i += CHUNK_SIZE) {
      const chunk = subscribers.slice(i, i + CHUNK_SIZE)
      const batchPayload = chunk.map(sub => ({
        from: 'Aakash Khamari <newsletter@aakashkhamari.com>',
        to: sub.email,
        subject: subject,
        html: styledHtml,
      }))

      const { data, error } = await resend.batch.send(batchPayload)
      if (error) {
        console.error('Resend Batch Error:', error)
        throw new Error(error.message)
      }
      emailsSent.push(...chunk)
    }

    return NextResponse.json({ 
      success: true, 
      sentCount: emailsSent.length 
    })

  } catch (error) {
    console.error('Newsletter Send Error:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
