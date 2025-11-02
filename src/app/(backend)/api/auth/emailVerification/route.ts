import EmailVerificationModel from "@/mongodb/models/emailVerification.model";
import UserAuthModel from "@/mongodb/models/UserAuth.model";
import { NextRequest, NextResponse } from "next/server";

interface reqBodyI {
    uuid: string;
}

export async function POST(req: NextRequest) {
    try {
        const body: reqBodyI = await req.json();

        const isMappingPresent = await EmailVerificationModel.findOne({ uuid: body.uuid });

        if (!isMappingPresent) {
            return NextResponse.json(
                { success: false, error: "This verification link is invalid or has expired. Please request a new verification email." },
                { status: 401 }
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

            return NextResponse.json(
                {
                    success: true,
                    message: `🎉 Congratulations ${updatedUser.fName} ${updatedUser.lName}! Your email has been successfully verified. You can now enjoy full access to online play.`,
                },
                { status: 200 }
            );
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
