import { NextRequest, NextResponse } from "next/server";
import nodemailer from 'nodemailer';

interface reqBodyI {
    sendTo: string;
    otp: string;
    fName: string;
    lName: string;
    uniqueUserName: string;
};

export async function POST(req: NextRequest) {
    try {
        const body: reqBodyI = await req.json();

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.USER_EMAIL,
                pass: process.env.PASSWORD,
            },
        });

        await transporter.sendMail({
            from: '"Multiplayer Chess Game" <no-reply@multiplayerchess.com>',
            to: body.sendTo,
            subject: "Your OTP for Multiplayer Chess Game",
            html: `
            <div style="background-color:#f8f6f2;padding:40px 0;text-align:center;
            font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">

            <div style="max-width:550px;margin:auto;background:#fbfaf8;
            border:1px solid #ddd;border-radius:14px;padding:30px 25px;
            box-shadow:0 8px 20px rgba(0,0,0,0.1);">

                <h2 style="font-size:24px;font-weight:800;color:#000;margin-bottom:5px;">
                OTP Verification
                </h2>

                <p style="font-size:15px;font-weight:600;color:#444;margin:0;">
                Multiplayer Chess Game
                </p>

                <hr style="border:none;height:1px;background:#e5e5e5;margin:20px 0;" />

                <p style="font-size:15px;color:#333;line-height:1.7;
                font-weight:500;text-align:left;">
                Hello <strong>${body.fName} ${body.lName}</strong>,<br /><br />
                Your account (<strong>@${body.uniqueUserName}</strong>) has requested
                an OTP to continue authentication.
                </p>

                <div style="margin:30px 0;">
                <div style="font-size:32px;letter-spacing:6px;
                font-weight:800;color:#000;background:#f1f1f1;
                padding:15px 20px;border-radius:10px;display:inline-block;">
                    ${body.otp}
                </div>
                </div>

                <p style="font-size:14px;color:#444;line-height:1.6;">
                ⏱️ This OTP is valid for <strong>10 minutes</strong> only.<br />
                Please do not share this OTP with anyone.
                </p>

                <p style="font-size:13px;color:#777;margin-top:25px;">
                If you did not request this OTP, you can safely ignore this email.
                </p>
            </div>

            <p style="margin-top:25px;font-size:12px;color:#aaa;">
                © ${new Date().getFullYear()} Multiplayer Chess Game. All rights reserved.
            </p>
            </div>
            `,
        });

        return NextResponse.json({
            success: true,
            message: "OTP sent successfully to your email",
        });

    } catch (error) {
        console.log("Something went wrong in /api/email/sendOTP/ route", error);
        return Response.json({ success: false, error: "Something went wrong" }, { status: 500 });
    }
}