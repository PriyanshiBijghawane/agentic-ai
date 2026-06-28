import { db } from "@/lib/prisma";
import { WorkspaceUser } from "@/types/workspace";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

type WorkspaceData = {
    id: string;
    title: string | null;
    messages: any;
    fileData: any;
};

export async function getWorkspaceUser(): Promise<WorkspaceUser> {
    const { userId: clerkId } = await auth();
    if(!clerkId) redirect("/");

    const user = await db.user.findUnique({
        where: { clerkId },
        select: { id: true, credits: true, plan: true},
    });
    
    if (!user) redirect("/");
    return user;
}

export async function getWorkspaceById(
    workspaceId: string,
    userId: string,
    ): Promise<WorkspaceData> {
        const workspace = await db.workSpace.findUnique({
            where: { id: workspaceId, userId },
            select: { id: true, title: true, messages: true, fileData: true },
        });

        if (!workspace) redirect("/");
        return workspace;
    }