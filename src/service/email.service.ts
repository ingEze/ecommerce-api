import nodemailer from 'nodemailer'
import { config } from '../config/index.js'

export class EmailService {
  private transporter
  private URL

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    })
    this.URL = config.url.APP_URL
  }

  async sendResetEmail(email: string, token: string): Promise<void> {
    const URL = this.URL
    const resetURL = `${URL}/auth/reset-password/${token}`

    const mailOptions = {
      from: `"EcommerceAPI" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Password Reset - EcommerceAPI',
      html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
      </head>
      <body style="
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        line-height: 1.6;
        color: #f7f7f7ff;
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #242424;
      ">
        <div style="
          background-color: white;
          padding: 40px;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        ">
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="
              color: #2E86C1;
              margin: 0;
              font-size: 28px;
              font-weight: 600;
            ">EcommerceAPI</h1>
          </div>

          <!-- Main content -->
          <h2 style="
            color: #2c3e50;
            margin-bottom: 20px;
            font-size: 24px;
          ">Password Reset</h2>
          
          <p style="margin-bottom: 20px; font-size: 16px;">
            Hello,
          </p>
          
          <p style="margin-bottom: 20px; font-size: 16px;">
            We received a request to reset the password for your <strong>EcommerceAPI</strong> account.
          </p>
          
          <p style="margin-bottom: 30px; font-size: 16px;">
            Click the button below to create a new password:
          </p>

          <!-- Button -->
          <div style="text-align: center; margin: 40px 0;">
            <a href="${resetURL}" style="
              background-color: #2E86C1;
              color: white !important;
              padding: 16px 32px;
              text-decoration: none;
              border-radius: 8px;
              font-size: 16px;
              font-weight: 600;
              display: inline-block;
              box-shadow: 0 4px 12px rgba(46, 134, 193, 0.3);
              transition: all 0.3s ease;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            ">
              🔐 Reset Password
            </a>
          </div>

          <!-- Alternative link -->
          <div style="
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 6px;
            margin: 30px 0;
            border-left: 4px solid #2E86C1;
          ">
            <p style="margin: 0; font-size: 14px; color: #666;">
              <strong>Can’t click the button?</strong><br>
              Copy and paste this link into your browser:
            </p>
            <p style="
              word-break: break-all;
              font-size: 13px;
              color: #2E86C1;
              margin: 10px 0 0 0;
              padding: 8px;
              background-color: white;
              border-radius: 4px;
              border: 1px solid #ddd;
            ">
              ${resetURL}
            </p>
          </div>

          <!-- Security info -->
          <div style="
            border-top: 1px solid #eee;
            padding-top: 20px;
            margin-top: 30px;
          ">
            <p style="font-size: 14px; color: #666; margin-bottom: 10px;">
              ⏰ <strong>This link will expire in 15 minutes</strong> for security reasons.
            </p>
            
            <p style="font-size: 14px; color: #666; margin-bottom: 10px;">
              🔒 If you did not request this reset, you can safely ignore this email.
            </p>
            
            <p style="font-size: 14px; color: #666; margin: 0;">
              ❓ If you need help, please contact our support team.
            </p>
          </div>

          <!-- Footer -->
          <div style="
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #999;
            font-size: 12px;
          ">
            <p style="margin: 0;">
              © ${new Date().getFullYear()} EcommerceAPI. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `
    }

    await this.transporter.sendMail(mailOptions)
  }

  async sendVerificationAccountEmail(email: string, token: string): Promise<void> {
    const URL = this.URL
    const validateUrl = `${URL}/users/verify/${token}`

    const mailOptions = {
      from: `"EcommerceAPI" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Account Verification - EcommerceAPI',
      html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Account Verification</title>
      </head>
      <body style="
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        line-height: 1.6;
        color: #f1f1f1ff;
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        border-radius: 10px;
        background-color: #242424;
      ">
        <div style="
          background-color: #323232;
          padding: 40px;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        ">
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="
              color: #2E86C1;
              margin: 0;
              font-size: 28px;
              font-weight: 600;
            ">EcommerceAPI</h1>
          </div>

          <!-- Main content -->
          <h2 style="
            color: #2c3e50;
            margin-bottom: 20px;
            font-size: 24px;
          ">Confirm Your Account</h2>
          
          <p style="margin-bottom: 20px; font-size: 16px;">
            Welcome! Thank you for signing up for <strong>EcommerceAPI</strong>.
          </p>
          
          <p style="margin-bottom: 30px; font-size: 16px;">
            To activate your account and start using our services, please click the button below:
          </p>

          <!-- Button -->
          <div style="text-align: center; margin: 40px 0;">
            <a href="${validateUrl}" style="
              background-color: #28a745;
              color: white !important;
              padding: 16px 32px;
              text-decoration: none;
              border-radius: 8px;
              font-size: 16px;
              font-weight: 600;
              display: inline-block;
              box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
              transition: all 0.3s ease;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            ">
              ✅ Verify Account
            </a>
          </div>

          <!-- Alternative link -->
          <div style="
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 6px;
            margin: 30px 0;
            border-left: 4px solid #28a745;
          ">
            <p style="margin: 0; font-size: 14px; color: #666;">
              <strong>Can’t click the button?</strong><br>
              Copy and paste this link into your browser:
            </p>
            <p style="
              word-break: break-all;
              font-size: 13px;
              color: #28a745;
              margin: 10px 0 0 0;
              padding: 8px;
              background-color: white;
              border-radius: 4px;
              border: 1px solid #ddd;
            ">
              ${validateUrl}
            </p>
          </div>

          <!-- Security info -->
          <div style="
            border-top: 1px solid #eee;
            padding-top: 20px;
            margin-top: 30px;
          ">
            <p style="font-size: 14px; color: #666; margin-bottom: 10px;">
              ⏰ <strong>This link will expire in 30 minutes</strong> for security reasons.
            </p>
            
            <p style="font-size: 14px; color: #666; margin: 0;">
              ❓ If you need help, please contact our support team.
            </p>
          </div>

          <!-- Footer -->
          <div style="
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #999;
            font-size: 12px;
          ">
            <p style="margin: 0;">
              © ${new Date().getFullYear()} EcommerceAPI. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `
    }

    await this.transporter.sendMail(mailOptions)
  }

}
