import React, { useEffect, useState } from "react";
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";

const UserProfilePage = () => {
  const [userInfo, setUserInfo] = useState({});
  const [newPassword, setNewPassword] = useState("");
  const [dob, setDob] = useState("");
  const [anniversaryDate, setAnniversaryDate] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await customFetch.get("/auth/login/user", {
          withCredentials: true,
        });

        setUserInfo(res.data.user);
      } catch (err) {
        toast.error("Failed to fetch user data");
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!userInfo.userId) return; // avoid fetch if userId not ready
    const fetchEmail = async () => {
      const resUserEmail = await customFetch.get(`/role/${userInfo.userId}`);
      console.log("email", resUserEmail);
      console.log("password", resUserEmail.data.role.password);
      // setNewPassword(resUserEmail.data.role.password);
    };
    fetchEmail();
  }, [userInfo.userId]); //  runs only once when userId is available

  const handleProfileUpdate = async () => {
    const updatePayload = {};

    // If newPassword entered
    if (newPassword) {
      if (newPassword.length < 4) {
        return toast.error("Password must be at least 4 characters long");
      }
      updatePayload.password = newPassword;
    } else {
      // If not entered, send existing password
      updatePayload.password = userInfo.password;
    }

    // Always include DOB and anniversaryDate with fallback
    updatePayload.DOB = dob || userInfo.DOB || undefined;
    updatePayload.anniversaryDate =
      anniversaryDate || userInfo.anniversaryDate || undefined;

    try {
      await customFetch.patch(
        `/role/password/${userInfo.userId}`,
        updatePayload,
        { withCredentials: true }
      );
      toast.success("Profile updated successfully");
      setNewPassword("");
      setDob("");
      setAnniversaryDate("");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || "Failed to update profile");
    }
  };

  return (
    <div className="p-16 max-w-xl mx-auto bg-white rounded-2xl shadow-lg mt-0">
      <h2 className="text-2xl font-bold mb-2 text-gray-900 text-center">
        Update Your Profile
      </h2>

      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Name:
        </label>
        <p className="text-gray-800 border border-gray-200 rounded px-3 py-2 bg-gray-50">
          {userInfo?.name || "-"}
        </p>
      </div>

      {/* <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email:
        </label>
        <p className="text-gray-800 border border-gray-200 rounded px-3 py-2 bg-gray-50">
          {userInfo?.email || "-"}
        </p>
      </div> */}

      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          New Password
        </label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter new password"
          className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date of Birth
        </label>
        <input
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Anniversary Date
        </label>
        <input
          type="date"
          value={anniversaryDate}
          onChange={(e) => setAnniversaryDate(e.target.value)}
          className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        onClick={handleProfileUpdate}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-3 rounded-lg transition-colors duration-200"
      >
        Update Profile
      </button>
    </div>
  );
};

export default UserProfilePage;
