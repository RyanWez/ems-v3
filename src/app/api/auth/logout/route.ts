import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import type { 
  LogoutResponse, 
  LogoutSuccessResponse, 
  LogoutErrorResponse 
} from '@/types/auth';

export async function POST(_request: NextRequest): Promise<NextResponse<LogoutResponse>> {
  try {
    const cookieStore = await cookies();

    // Delete the session cookie
    cookieStore.delete("session");

    const successResponse: LogoutSuccessResponse = {
      success: true,
      message: "Logged out successfully",
    };

    return NextResponse.json(successResponse);
  } catch (error) {
    console.error("Logout API error:", error);
    const errorResponse: LogoutErrorResponse = {
      error: "Internal server error"
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

export async function GET(request: NextRequest): Promise<NextResponse<LogoutResponse>> {
  // Support GET method for logout as well
  return POST(request);
}
