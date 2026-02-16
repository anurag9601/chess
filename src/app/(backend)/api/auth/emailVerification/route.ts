import { generateJWT, generateJWTDataType } from "@/lib/jsonWebtoken";
import { connectMongoDB } from "@/mongodb/connectDB";
import EmailVerificationModel from "@/mongodb/models/EmailVerification.model";
import UserAuthModel from "@/mongodb/models/UserAuth.model";
import { NextRequest, NextResponse } from "next/server";

interface reqBodyI {
    uuid: string;
}

export async function POST(req: NextRequest) {
    try {

        await connectMongoDB();

        const body: reqBodyI = await req.json();

        const isMappingPresent = await EmailVerificationModel.findOne({ uuid: body.uuid });

        if (!isMappingPresent) {
            return NextResponse.json(
                {
                    success: false,
                    invalid: true,
                    error:
                        "This verification link is invalid. Please create a new account to receive a new verification email."
                },
                { status: 401 }
            );
        }

        if (isMappingPresent.isActive === false) {
            return NextResponse.json(
                {
                    success: true,
                    message:
                        "This email address has already been used and is no longer eligible for verification."
                }
                ,
                { status: 200 }
            );
        }

        try {
            const updatedUser = await UserAuthModel.findOneAndUpdate(
                { _id: isMappingPresent.userId },
                { isEmailVerified: true },
                { new: true }
            );

            if (!updatedUser) {
                return NextResponse.json(
                    { success: false, error: "User account not found. Please sign up again." },
                    { status: 404 }
                );
            }

            await EmailVerificationModel.findOneAndUpdate(
                { _id: isMappingPresent._id },
                { isActive: false },
                { isDeleted: true }
            );

            const tokenPayload: generateJWTDataType = {
                _id: updatedUser._id,
                fName: updatedUser.fName,
                lName: updatedUser.lName,
                userEmail: updatedUser.userEmail,
                uniqueUserName: updatedUser.uniqueUserName,
                isEmailVerified: updatedUser.isEmailVerified
            };

            const token = generateJWT(tokenPayload);

            const response = NextResponse.json(
                {
                    success: true,
                    message: `🎉 Congratulations ${updatedUser.fName} ${updatedUser.lName}! Your email has been successfully verified. You can now enjoy full access to online play.`,
                },
                { status: 200 }
            );

            response.cookies.set("auth-token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 90 * 24 * 60 * 60,
                path: "/"
            });

            return response;

        } catch (error) {
            console.error("Error verifying email:", error);
            return NextResponse.json(
                {
                    success: false,
                    error: "An unexpected error occurred while verifying your email. Please try again later.",
                },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("Something went wrong in /api/auth/emailVerification/ route:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Internal server error. Please try again later.",
            },
            { status: 500 }
        );
    }
}
