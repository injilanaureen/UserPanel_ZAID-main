import React from "react";
import ProfileSidebar from "./profilesidebar";
import PersonalContent from "./profilecontent";

function Profile() {
    return (
            <main className="flex min-h-screen">
                <ProfileSidebar />
                <div className="flex-1 bg-gray-100">
                    <PersonalContent />
                </div>
            </main>
    );
}

export default Profile;
