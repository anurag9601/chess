import { NextRequest } from "next/server";
import nodemailer from 'nodemailer';
import { success } from "zod";

interface reqBodyI {
    userName: string;
    sendTo: string;
    verifyLink: string;
}

export async function POST(req: NextRequest) {
    try {
        const body: reqBodyI = await req.json();

        const transporter = nodemailer.createTransport({
            host: "smtp.example.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.USER_EMAIL,
                pass: process.env.PASSWORD
            }
        });

        try {
            const info = await transporter.sendMail({
                from: '"Multiplayer Chess Game" <no-reply@multiplayerchess.com>',
                to: body.sendTo,
                subject: "Confirm your email to start playing online",
                html: `
                <div style="font-family: 'Nunito', 'Open Sans', Arial, sans-serif; background-color: #f8f6f2; padding: 40px 0; text-align: center;">
                    <div style="max-width: 550px; margin: auto; background: #fbfaf8; border: 1px solid #ddd; border-radius: 14px; padding: 30px 25px; box-shadow: 0 8px 20px rgba(0,0,0,0.1);">
                    
                    <h2 style="font-size: 24px; font-weight: 800; color: #000; margin-bottom: 5px;">
                        Confirm Your Email
                    </h2>
                    <p style="font-size: 15px; font-weight: 600; color: #444; margin: 0;">
                        Multiplayer Chess Game
                    </p>

                    <hr style="border: none; height: 1px; background: #e5e5e5; margin: 20px 0;" />

                    <p style="font-size: 15px; color: #333; line-height: 1.7; font-weight: 500; text-align: left;">
                        Hello <strong>${body.userName}</strong>,<br /><br />
                        This is an email confirmation from <strong>Multiplayer Chess Game</strong>.<br />
                        Please verify your email to unlock full access and start playing real-time chess matches online with your friends.<br /><br />
                        Once verified, you’ll be able to:
                    </p>

                    <ul style="text-align: left; color: #444; font-size: 14px; line-height: 1.7; margin-top: 0;">
                        <li>Challenge your friends</li>
                        <li>Join global chess rooms</li>
                    </ul>

                    <div style="margin-top: 30px; margin-bottom: 25px;">
                        <a href="${body.verifyLink}" 
                            style="display: inline-block; padding: 12px 28px; background: #000; color: #fff; font-weight: 700; border-radius: 8px; text-decoration: none; letter-spacing: 0.3px; transition: background 0.3s;">
                            Verify My Email
                        </a>
                    </div>

                    <p style="font-size: 13px; color: #777; text-align: center;">
                        If you didn’t create an account on Multiplayer Chess Game, you can safely ignore this email.
                    </p>
                    </div>

                    <p style="margin-top: 25px; font-size: 12px; color: #aaa;">
                    © ${new Date().getFullYear()} Multiplayer Chess Game. All rights reserved.
                    </p>
                </div>
                `,
            });

            console.log("sendEmailURL", nodemailer.getTestMessageUrl(info));

            return Response.json({ success: true, message: "Email confirmation mail send successfully 🎉!" }, { status: 200 });

        } catch (error) {
            return Response.json({
                success: false,
                error: error
            }, { status: 400 });
        }
    } catch (error) {
        console.log("Something went wrong in /api/email/emailVerification/ route", error);
        return Response.json({ success: false, error: "Something went wrong" }, { status: 500 });
    }
}