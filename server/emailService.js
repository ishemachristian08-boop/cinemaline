const nodemailer = require('nodemailer');

// ─── Transporter ────────────────────────────────────────────────────────────────
// Uses env vars when configured; falls back to Ethereal (free test inbox) automatically.
let transporter;

const getTransporter = async () => {
    if (transporter) return transporter;

    if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        // Real SMTP (Gmail, Outlook, SendGrid, etc.)
        transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT || '587'),
            secure: process.env.EMAIL_SECURE === 'true',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        console.log('📧 Email: using SMTP transport');
    } else {
        // Auto-create a free Ethereal test account (preview URL logged to console)
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: { user: testAccount.user, pass: testAccount.pass },
        });
        console.log('📧 Email: using Ethereal test transport');
        console.log(`   → Preview emails at: https://ethereal.email`);
        console.log(`   → Login: ${testAccount.user} / ${testAccount.pass}`);
    }
    return transporter;
};

// ─── HTML Template ───────────────────────────────────────────────────────────────
const buildTicketEmail = (order) => {
    const {
        orderId, movie, hall, date, time, format,
        seats, totalPaid, userEmail, userName,
    } = order;

    const seatList = (seats || []).map(s =>
        `<span style="display:inline-block;background:#1d1c27;border:1px solid rgba(50,17,212,0.4);border-radius:6px;padding:4px 10px;margin:3px;font-size:13px;color:#fff;">${s}</span>`
    ).join('');

    const formatBadgeColor = {
        'IMAX': '#3211d4', 'Dolby Cinema': '#9b59b6',
        '4DX': '#e67e22', '3D': '#16a085', '2D': '#444455',
    }[format] || '#3211d4';

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Your cinemaline Ticket</title>
</head>
<body style="margin:0;padding:0;background:#0d0c14;font-family:'Segoe UI',Arial,sans-serif;color:#ffffff;">

  <!-- Wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d0c14;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#131022;border-radius:20px;overflow:hidden;border:1px solid rgba(255,255,255,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#3211d4,#7b5ea7);padding:32px 40px;text-align:center;">
            <p style="margin:0 0 8px;font-size:13px;letter-spacing:0.15em;text-transform:uppercase;opacity:0.8;">cinemaline</p>
            <h1 style="margin:0;font-size:28px;font-weight:900;letter-spacing:-0.02em;">🎬 Booking Confirmed!</h1>
            <p style="margin:10px 0 0;font-size:14px;opacity:0.85;">Your digital ticket is ready. Enjoy the show!</p>
          </td>
        </tr>

        <!-- Greeting -->
        <tr>
          <td style="padding:32px 40px 0;">
            <p style="margin:0;font-size:16px;">Hi <strong>${userName || 'Movie Lover'}</strong>,</p>
            <p style="margin:8px 0 0;font-size:14px;color:#a19db9;line-height:1.6;">
              Your booking for <strong style="color:#fff;">${movie}</strong> has been confirmed.
              Present this email or your QR code at the entrance gate.
            </p>
          </td>
        </tr>

        <!-- Ticket Card -->
        <tr>
          <td style="padding:24px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#1d1c27;border-radius:16px;border:1px solid rgba(255,255,255,0.08);overflow:hidden;">
              <!-- Coloured top bar -->
              <tr><td style="height:4px;background:linear-gradient(90deg,#3211d4,#7b5ea7);"></td></tr>
              <tr>
                <td style="padding:24px 28px;">
                  <!-- Movie name + format -->
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td>
                        <h2 style="margin:0 0 4px;font-size:22px;font-weight:900;">${movie}</h2>
                        <span style="display:inline-block;background:${formatBadgeColor};border-radius:6px;padding:3px 10px;font-size:12px;font-weight:800;">${format || '2D'}</span>
                      </td>
                    </tr>
                  </table>

                  <!-- Divider -->
                  <div style="border-top:1px solid rgba(255,255,255,0.07);margin:18px 0;"></div>

                  <!-- Details Grid -->
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="width:50%;padding-bottom:14px;">
                        <p style="margin:0;font-size:11px;color:#a19db9;text-transform:uppercase;letter-spacing:0.08em;">Date</p>
                        <p style="margin:4px 0 0;font-size:15px;font-weight:700;">${date || 'Today'}</p>
                      </td>
                      <td style="width:50%;padding-bottom:14px;">
                        <p style="margin:0;font-size:11px;color:#a19db9;text-transform:uppercase;letter-spacing:0.08em;">Time</p>
                        <p style="margin:4px 0 0;font-size:15px;font-weight:700;">${time}</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding-bottom:14px;">
                        <p style="margin:0;font-size:11px;color:#a19db9;text-transform:uppercase;letter-spacing:0.08em;">Hall</p>
                        <p style="margin:4px 0 0;font-size:15px;font-weight:700;">${hall}</p>
                      </td>
                      <td style="padding-bottom:14px;">
                        <p style="margin:0;font-size:11px;color:#a19db9;text-transform:uppercase;letter-spacing:0.08em;">Order ID</p>
                        <p style="margin:4px 0 0;font-size:13px;font-weight:700;font-family:monospace;color:#9d86ff;">${orderId}</p>
                      </td>
                    </tr>
                  </table>

                  <!-- Seats -->
                  <div style="background:rgba(50,17,212,0.07);border:1px solid rgba(50,17,212,0.2);border-radius:10px;padding:16px;margin-top:4px;">
                    <p style="margin:0 0 10px;font-size:11px;color:#a19db9;text-transform:uppercase;letter-spacing:0.08em;">Your Seats</p>
                    <div>${seatList}</div>
                  </div>

                  <!-- Dashed divider -->
                  <div style="border-top:2px dashed rgba(255,255,255,0.08);margin:20px -28px;position:relative;">
                    <div style="position:absolute;left:-12px;top:-12px;width:24px;height:24px;background:#131022;border-radius:50%;"></div>
                    <div style="position:absolute;right:-12px;top:-12px;width:24px;height:24px;background:#131022;border-radius:50%;"></div>
                  </div>

                  <!-- Total -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:4px;">
                    <tr>
                      <td><p style="margin:0;font-size:14px;color:#a19db9;">Total Paid</p></td>
                      <td align="right"><p style="margin:0;font-size:22px;font-weight:900;color:#3211d4;">$${totalPaid?.toFixed(2)}</p></td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Reminder -->
        <tr>
          <td style="padding:0 40px 28px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(34,197,94,0.06);border:1px solid rgba(34,197,94,0.2);border-radius:12px;padding:16px;">
              <tr>
                <td>
                  <p style="margin:0;font-size:13px;color:#22c55e;font-weight:700;">📍 Arrival Reminder</p>
                  <p style="margin:6px 0 0;font-size:13px;color:#a19db9;line-height:1.6;">
                    Please arrive at least <strong style="color:#fff;">15 minutes</strong> before showtime.
                    Doors close 5 minutes after the movie starts.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:20px 40px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
            <p style="margin:0;font-size:12px;color:#5a5670;">© ${new Date().getFullYear()} cinemaline · All rights reserved</p>
            <p style="margin:6px 0 0;font-size:12px;color:#5a5670;">This is an automated confirmation. Please do not reply.</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
};

// ─── Send Confirmation ───────────────────────────────────────────────────────────
const sendBookingConfirmation = async (order) => {
    if (!order.userEmail) {
        console.log('📧 No email address provided — skipping confirmation email.');
        return null;
    }
    try {
        const t = await getTransporter();
        const info = await t.sendMail({
            from: `"cinemaline" <${process.env.EMAIL_FROM || process.env.EMAIL_USER || 'noreply@cinemaline.cinema'}>`,
            to: order.userEmail,
            subject: `🎬 Your cinemaline ticket for ${order.movie} is confirmed!`,
            html: buildTicketEmail(order),
        });
        // For Ethereal test accounts, log the preview URL
        const previewUrl = nodemailer.getTestMessageUrl(info);
        if (previewUrl) {
            console.log(`📧 Email preview: ${previewUrl}`);
        }
        console.log(`📧 Confirmation sent → ${order.userEmail} (msgId: ${info.messageId})`);
        return { messageId: info.messageId, previewUrl };
    } catch (err) {
        console.error('📧 Email send failed:', err.message);
        return null; // non-fatal — booking still succeeds
    }
};

module.exports = { sendBookingConfirmation };
