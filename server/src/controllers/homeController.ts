import { Request, Response } from "express";
import nodemailer from "nodemailer";
import Contact from "../models/Contact";
import AdminSettings from "../models/AdminSettings";

export const submitContactForm = async (req: Request, res: Response) => {
  try {
    const { Firstname, Lastname, Email, Mobile, Message } = req.body;

    /* ---------------- VALIDATION ---------------- */
    if (!Firstname || !Lastname || !Email || !Mobile || !Message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    /* ---------------- SAVE TO DATABASE ---------------- */
    const contact = await Contact.create({
      Firstname,
      Lastname,
      Email,
      Mobile,
      Message,
    });

    /* ---------------- EMAIL TRANSPORT ---------------- */
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    // Formatting for the email
    const fullName = `${Firstname} ${Lastname}`;
    const submissionDate = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short'
    });

    /* ---------------- PROFESSIONAL HTML TEMPLATE ---------------- */
    const emailTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Inquiry Notification</title>
        <style>
          /* Base Resets */
          body { margin: 0; padding: 0; background-color: #f6f9fc; font-family: 'Segoe UI', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
          table { border-collapse: collapse; width: 100%; }
          
          /* Container */
          .wrapper { max-width: 600px; margin: 0 auto; background-color: #ffffff; margin-top: 40px; margin-bottom: 40px; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
          
          /* Header */
          .header { background-color: #005596; padding: 30px 40px; text-align: left; }
          .header h1 { color: #ffffff; margin: 0; font-size: 20px; font-weight: 600; letter-spacing: 0.5px; }
          .header p { color: #e1efff; margin: 5px 0 0 0; font-size: 13px; }
          
          /* Content Body */
          .content { padding: 40px; }
          
          /* Section Titles */
          .section-title { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #8898aa; font-weight: 700; margin-bottom: 10px; border-bottom: 1px solid #edf2f7; padding-bottom: 5px; }
          
          /* Contact Grid */
          .info-grid { width: 100%; margin-bottom: 30px; }
          .info-label { width: 30%; color: #525f7f; font-size: 14px; padding: 8px 0; vertical-align: top; }
          .info-value { width: 70%; color: #32325d; font-size: 14px; font-weight: 500; padding: 8px 0; vertical-align: top; }
          
          /* Message Box */
          .message-container { background-color: #fcfcfc; border: 1px solid #e9ecef; border-left: 4px solid #005596; border-radius: 4px; padding: 20px; margin-bottom: 30px; }
          .message-text { color: #525f7f; font-size: 15px; line-height: 1.6; white-space: pre-wrap; margin: 0; }
          
          /* Button */
          .btn-container { text-align: left; }
          .btn { background-color: #005596; color: #ffffff !important; padding: 12px 25px; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: 600; display: inline-block; transition: background 0.2s; }
          
          /* Footer */
          .footer { background-color: #f6f9fc; padding: 20px 40px; border-top: 1px solid #edf2f7; text-align: center; }
          .footer-text { font-size: 11px; color: #8898aa; line-height: 1.5; margin: 0; }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="header">
            <h1>New Enquiry Received</h1>
            <p>SIST ACM SIGAI • Website Contact Form</p>
          </div>

          <div class="content">
            
            <div class="section-title">Applicant / Sender Details</div>
            <table class="info-grid">
              <tr>
                <td class="info-label">Full Name</td>
                <td class="info-value">${fullName}</td>
              </tr>
              <tr>
                <td class="info-label">Email Address</td>
                <td class="info-value">
                  <a href="mailto:${Email}" style="color: #005596; text-decoration: none;">${Email}</a>
                </td>
              </tr>
              <tr>
                <td class="info-label">Mobile</td>
                <td class="info-value">${Mobile}</td>
              </tr>
            </table>

            <div class="section-title">Inquiry Message</div>
            <div class="message-container">
              <p class="message-text">${Message}</p>
            </div>

            <div class="btn-container">
              <a href="mailto:${Email}?subject=Re: Inquiry: ${fullName} (SIST ACM SIGAI)" class="btn">
                Reply via Email
              </a>
            </div>
          </div>

          <div class="footer">
            <p class="footer-text">
              Reference ID: <strong>${contact._id}</strong><br>
              Time Received: ${submissionDate}<br>
              <span style="opacity: 0.7;">This is an automated notification from the SIST ACM SIGAI server.</span>
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    /* ---------------- SEND EMAIL ---------------- */
    await transporter.sendMail({
      from: `"SIST ACM SIGAI System" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_TO || process.env.MAIL_USER,
      replyTo: Email, 
      // Professional Subject Line
      subject: `[Enquiry] New message from ${fullName}`, 
      html: emailTemplate,
    });

    /* ---------------- RESPONSE ---------------- */
    return res.status(201).json({
      success: true,
      message: "Form submitted successfully",
      submissionId: contact._id,
      timestamp: contact.createdAt,
    });
  } catch (error) {
    console.error("Contact form submission error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


export const getAdminSettings = async (_req: Request, res: Response) => {
  try {
    let settings = await AdminSettings.findOne();

    // If no settings exist, create default
    if (!settings) {
      settings = await AdminSettings.create({
        orgName: "SIST ACM SIGAI",
        about: "",
        mission: "",
        vision: "",
        ideology: "",
        contact: {
          location: "",
          email: "",
          phone: "",
        },
        socials: {
          instagram: "",
          linkedin: "",
          twitter: "",
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error("Error fetching admin settings:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch admin settings",
    });
  }
};