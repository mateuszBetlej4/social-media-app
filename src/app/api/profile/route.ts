import { NextRequest, NextResponse } from "next/server";
import { addDocument, getDocuments, updateDocument } from "@/lib/firebase/firebaseUtils";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    // Query Firestore for the user's profile
    const q = query(collection(db, "profiles"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return NextResponse.json({ profile: null });
    }
    
    // Return the first matching profile
    const profileDoc = querySnapshot.docs[0];
    return NextResponse.json({ 
      profile: {
        id: profileDoc.id,
        ...profileDoc.data()
      }
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, profile } = await request.json();

    if (!userId || !profile) {
      return NextResponse.json({ error: "User ID and profile data are required" }, { status: 400 });
    }

    // Check if profile already exists
    const q = query(collection(db, "profiles"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      // Create new profile
      const profileData = {
        userId,
        ...profile,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      
      const docRef = await addDocument("profiles", profileData);
      
      return NextResponse.json({ 
        success: true, 
        message: "Profile created successfully",
        profileId: docRef.id
      });
    } else {
      // Update existing profile
      const profileDoc = querySnapshot.docs[0];
      const profileData = {
        ...profile,
        updatedAt: Date.now(),
      };
      
      await updateDocument("profiles", profileDoc.id, profileData);
      
      return NextResponse.json({ 
        success: true, 
        message: "Profile updated successfully",
        profileId: profileDoc.id
      });
    }
  } catch (error) {
    console.error("Error saving profile:", error);
    return NextResponse.json({ error: "Failed to save profile" }, { status: 500 });
  }
}