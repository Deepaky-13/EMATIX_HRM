// import React, { useState, useEffect, use } from "react";
// import {
//   Calendar,
//   Clock,
//   Users,
//   Car,
//   MapPin,
//   Building,
//   CheckCircle,
//   X,
//   Loader2,
// } from "lucide-react";
// import customFetch from "../../utils/customFetch";
// import { toast } from "react-toastify";

// const MarketingForm = ({ open, handleClose, editData }) => {
//   const [currentUser, setCurrentUser] = useState("");

//   //*---get the current user-------
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const response = await customFetch.get("auth/login/user");

//         console.log("user", response.data.user.name);

//         setCurrentUser(response.data.user.name);
//       } catch (err) {
//         console.error("Error fetching user data:", err);
//       }
//     };
//     fetchUser();
//   }, []);

//   const [form, setForm] = useState({
//     date: "",
//     intime: "",
//     meetings: "",
//     names: currentUser || "",
//     startKM: "",
//     officeOutTime: "",
//     officeOutLocation: null,
//     siteReachedTime: "",
//     siteReachedLocation: null,
//     siteDetails: "",
//     siteOutTime: "",
//     siteOutLocation: null,
//     officeReachedTime: "",
//     officeReachedLocation: null,
//     endingKM: "",
//     verifyAuthority: "",
//   });

//   const [isSubmitting, setIsSubmitting] = useState(false);

//   useEffect(() => {
//     if (editData) {
//       setForm({
//         date: editData.date ? editData.date.split("T")[0] : "",
//         intime: editData.intime || "",
//         meetings: editData.meetings || "",
//         names: editData.names || currentUser || "",
//         startKM: editData.startKM || "",
//         officeOutTime: editData.officeOutTime || "",
//         officeOutLocation: editData.officeOutLocation || null,
//         siteReachedTime: editData.siteReachedTime || "",
//         siteReachedLocation: editData.siteReachedLocation || null,
//         siteDetails: editData.siteDetails || "",
//         siteOutTime: editData.siteOutTime || "",
//         siteOutLocation: editData.siteOutLocation || null,
//         officeReachedTime: editData.officeReachedTime || "",
//         officeReachedLocation: editData.officeReachedLocation || null,
//         endingKM: editData.endingKM || "",
//         verifyAuthority: editData.verifyAuthority || "",
//       });
//     } else {
//       setForm({
//         date: "",
//         intime: "",
//         meetings: "",
//         names: currentUser || "",
//         startKM: "",
//         officeOutTime: "",
//         officeOutLocation: null,
//         siteReachedTime: "",
//         siteReachedLocation: null,
//         siteDetails: "",
//         siteOutTime: "",
//         siteOutLocation: null,
//         officeReachedTime: "",
//         officeReachedLocation: null,
//         endingKM: "",
//         verifyAuthority: "",
//       });
//     }
//   }, [editData, open]);

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const captureLocation = (field) => {
//     if (!navigator.geolocation) {
//       console.error("Geolocation not supported");
//       return;
//     }

//     navigator.geolocation.getCurrentPosition(
//       (pos) => {
//         const { latitude, longitude } = pos.coords;

//         let locationField = "";
//         switch (field) {
//           case "officeOutTime":
//             locationField = "officeOutLocation";
//             break;
//           case "siteReachedTime":
//             locationField = "siteReachedLocation";
//             break;
//           case "siteOutTime":
//             locationField = "siteOutLocation";
//             break;
//           case "officeReachedTime":
//             locationField = "officeReachedLocation";
//             break;
//           default:
//             return;
//         }

//         // ✅ Save only lat/lng (matches schema)
//         setForm((prev) => ({
//           ...prev,
//           [locationField]: {
//             lat: latitude,
//             lng: longitude,
//           },
//         }));
//       },
//       (err) => {
//         console.warn("⚠️ Location not captured:", err.message);
//       },
//       { enableHighAccuracy: true, timeout: 10000 }
//     );
//   };

//   const handleSubmit = async () => {
//     setIsSubmitting(true);
//     try {
//       const payload = { ...form, names: currentUser };
//       const response = editData
//         ? await customFetch.put(`/marketing/${editData._id}`, payload)
//         : await customFetch.post("/marketing", payload);

//       if (response.ok || response.status === 201) {
//         handleClose();
//       } else {
//         console.error("Failed to submit form");
//       }
//     } catch (err) {
//       console.error("Error submitting form:", err);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const getFieldIcon = (key) => {
//     const iconProps = { size: 20, className: "text-gray-500" };
//     switch (key) {
//       case "date":
//         return <Calendar {...iconProps} className="text-blue-500" />;
//       case "intime":
//       case "officeOutTime":
//       case "siteReachedTime":
//       case "siteOutTime":
//       case "officeReachedTime":
//         return <Clock {...iconProps} className="text-green-500" />;
//       case "meetings":
//       case "names":
//         return <Users {...iconProps} className="text-purple-500" />;
//       case "startKM":
//       case "endingKM":
//         return <Car {...iconProps} className="text-orange-500" />;
//       case "siteDetails":
//         return <MapPin {...iconProps} className="text-red-500" />;
//       case "verifyAuthority":
//         return <Building {...iconProps} className="text-slate-500" />;
//       default:
//         return null;
//     }
//   };

//   const getFieldLabel = (key) => {
//     const labels = {
//       date: "Date",
//       intime: "In Time",
//       meetings: "Meetings",
//       names: "Names",
//       startKM: "Starting KM",
//       officeOutTime: "Office Out Time",
//       siteReachedTime: "Site Reached Time",
//       siteDetails: "Site Details",
//       siteOutTime: "Site Out Time",
//       officeReachedTime: "Office Reached Time",
//       endingKM: "Ending KM",
//       verifyAuthority: "Verify Authority",
//     };
//     return labels[key] || key;
//   };

//   const fieldSections = [
//     {
//       title: "Basic Information",
//       fields: ["date", "intime"],
//       bgColor: "bg-blue-50",
//       titleColor: "text-blue-700",
//       borderColor: "border-blue-200",
//       accentColor: "bg-blue-500",
//     },
//     {
//       title: "Travel Details",
//       fields: [
//         "startKM",
//         "officeOutTime",
//         "siteReachedTime",
//         "siteOutTime",
//         "officeReachedTime",
//         "endingKM",
//       ],
//       bgColor: "bg-green-50",
//       titleColor: "text-green-700",
//       borderColor: "border-green-200",
//       accentColor: "bg-green-500",
//     },
//     {
//       title: "Meeting & Site Information",
//       fields: ["meetings", "siteDetails", "verifyAuthority"],
//       bgColor: "bg-purple-50",
//       titleColor: "text-purple-700",
//       borderColor: "border-purple-200",
//       accentColor: "bg-purple-500",
//     },
//   ];

//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 z-50 overflow-y-auto">
//       <div
//         className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
//         onClick={handleClose}
//       />
//       <div className="flex min-h-full items-center justify-center p-2 sm:p-6">
//         <div className="relative w-full max-w-7xl transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all duration-300">
//           {/* Header */}
//           <div className="border-b border-gray-200 px-4 sm:px-10 py-6 sm:py-8 flex justify-between items-center">
//             <div className="space-y-3">
//               <h2 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//                 {editData ? "Edit Marketing Log" : "Add Marketing Log"}
//               </h2>
//               <p className="text-sm sm:text-lg text-gray-600 max-w-2xl">
//                 {editData
//                   ? "Update marketing activity details below."
//                   : "Fill in the comprehensive details for your marketing activity and site visits."}
//               </p>
//             </div>
//             <button
//               onClick={handleClose}
//               className="rounded-full p-2 sm:p-3 hover:bg-gray-100 transition-colors duration-200 group"
//             >
//               <X
//                 size={24}
//                 className="text-gray-400 group-hover:text-gray-600"
//               />
//             </button>
//           </div>

//           {/* Content */}
//           <div className="max-h-[75vh] overflow-y-auto px-4 sm:px-10 py-6 sm:py-8">
//             <div className="space-y-10">
//               {fieldSections.map((section, sectionIndex) => (
//                 <div
//                   key={sectionIndex}
//                   className={`${section.bgColor} rounded-2xl border-2 ${section.borderColor} p-4 sm:p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
//                 >
//                   <h3
//                     className={`${section.titleColor} mb-6 sm:mb-8 text-xl sm:text-2xl font-bold flex items-center`}
//                   >
//                     <div
//                       className={`w-3 h-3 rounded-full ${section.accentColor} mr-3 sm:mr-4`}
//                     />
//                     {section.title}
//                   </h3>

//                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
//                     {section.fields.map((key) => (
//                       <div
//                         key={key}
//                         className={`${
//                           key === "meetings" || key === "siteDetails"
//                             ? "lg:col-span-2"
//                             : ""
//                         }`}
//                       >
//                         <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
//                           {getFieldLabel(key)}
//                         </label>
//                         <div className="relative">
//                           <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-start pt-3 sm:pt-4">
//                             {/* {getFieldIcon(key)} */}
//                           </div>
//                           {key === "siteDetails" || key === "meetings" ? (
//                             <textarea
//                               id={key}
//                               name={key}
//                               value={form[key]}
//                               onChange={handleChange}
//                               rows={4}
//                               className="block w-full rounded-xl border-2 border-gray-300 pl-10 sm:pl-12 pr-4 py-3 sm:py-4 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-base bg-white hover:border-gray-400"
//                               placeholder={`Enter ${getFieldLabel(
//                                 key
//                               ).toLowerCase()}...`}
//                             />
//                           ) : (
//                             <input
//                               type={
//                                 key.includes("KM")
//                                   ? "number"
//                                   : key === "date"
//                                   ? "date"
//                                   : "time"
//                               }
//                               id={key}
//                               name={key}
//                               value={form[key]}
//                               onChange={(e) => {
//                                 handleChange(e);
//                                 captureLocation(key); // capture location for time fields
//                               }}
//                             />
//                           )}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Footer */}
//           <div className="border-t border-gray-200 px-4 sm:px-10 py-6 sm:py-8 flex justify-end space-x-4 sm:space-x-6">
//             <button
//               type="button"
//               onClick={handleClose}
//               disabled={isSubmitting}
//               className="px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
//             >
//               Cancel
//             </button>
//             <button
//               type="button"
//               onClick={handleSubmit}
//               disabled={isSubmitting}
//               className="px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center space-x-2 sm:space-x-3"
//             >
//               {isSubmitting ? (
//                 <>
//                   <Loader2 size={20} className="animate-spin" />
//                   <span>{editData ? "Updating..." : "Creating..."}</span>
//                 </>
//               ) : (
//                 <>
//                   <CheckCircle size={20} />
//                   <span>{editData ? "Update Log" : "Create Log"}</span>
//                 </>
//               )}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MarketingForm;

import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Users,
  Car,
  MapPin,
  Building,
  CheckCircle,
  X,
  Loader2,
} from "lucide-react";
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";
const MarketingForm = ({ open, handleClose, editData }) => {
  const [currentUser, setCurrentUser] = useState("");

  //*---get the current user-------
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await customFetch.get("auth/login/user");

        console.log("user", response.data.user.name);

        setCurrentUser(response.data.user.name);
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };
    fetchUser();
  }, []);

  const today = new Date().toISOString().split("T")[0]; // ✅ today's date

  const [form, setForm] = useState({
    date: today,
    intime: "",
    meetings: "",
    startKM: "",
    officeOutTime: "",
    officeOutLocation: null,
    siteReachedTime: "",
    siteReachedLocation: null,
    siteDetails: "",
    siteOutTime: "",
    siteOutLocation: null,
    officeReachedTime: "",
    officeReachedLocation: null,
    endingKM: "",
    verifyAuthority: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationError, setLocationError] = useState(false); // ✅ track location error

  useEffect(() => {
    if (editData) {
      setForm({
        date: editData.date ? editData.date.split("T")[0] : today,
        intime: editData.intime || "",
        meetings: editData.meetings || "",
        startKM: editData.startKM || "",
        officeOutTime: editData.officeOutTime || "",
        officeOutLocation: editData.officeOutLocation || null,
        siteReachedTime: editData.siteReachedTime || "",
        siteReachedLocation: editData.siteReachedLocation || null,
        siteDetails: editData.siteDetails || "",
        siteOutTime: editData.siteOutTime || "",
        siteOutLocation: editData.siteOutLocation || null,
        officeReachedTime: editData.officeReachedTime || "",
        officeReachedLocation: editData.officeReachedLocation || null,
        endingKM: editData.endingKM || "",
        verifyAuthority: editData.verifyAuthority || "",
      });
    } else {
      setForm((prev) => ({ ...prev, date: today }));
    }
  }, [editData, open, today]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const captureLocation = (field) => {
    if (!navigator.geolocation) {
      console.error("Geolocation not supported");
      setLocationError(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        let locationField = "";
        switch (field) {
          case "intime":
            locationField = "intimeLocation";
            break;
          case "officeOutTime":
            locationField = "officeOutLocation";
            break;
          case "siteReachedTime":
            locationField = "siteReachedLocation";
            break;
          case "siteOutTime":
            locationField = "siteOutLocation";
            break;
          case "officeReachedTime":
            locationField = "officeReachedLocation";
            break;
          default:
            return;
        }
        setForm((prev) => ({
          ...prev,
          [locationField]: { lat: latitude, lng: longitude },
        }));
        setLocationError(false); // ✅ location captured successfully
      },
      (err) => {
        console.warn("Location not captured:", err.message);
        setLocationError(true); // ✅ mark error if denied or failed
      }
    );
  };

  const handleSubmit = async () => {
    // ✅ block submission if location not available
    if (
      !form.intimeLocation &&
      !form.officeOutLocation &&
      !form.siteReachedLocation &&
      !form.siteOutLocation &&
      !form.officeReachedLocation
    ) {
      toast.info("Please Enable Location");
      return;
    }

    if (locationError) {
      toast.info("Location permission is required to submit the form.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = { ...form, names: currentUser };
      const response = editData
        ? await customFetch.put(`/marketing/${editData._id}`, payload)
        : await customFetch.post("/marketing", payload);

      if (response.ok || response.status === 201) {
        handleClose();
      } else {
        console.error("Failed to submit form");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldIcon = (key) => {
    const iconProps = { size: 20, className: "text-gray-500" };
    switch (key) {
      case "date":
        return <Calendar {...iconProps} className="text-blue-500" />;
      case "intime":
      case "officeOutTime":
      case "siteReachedTime":
      case "siteOutTime":
      case "officeReachedTime":
        return <Clock {...iconProps} className="text-green-500" />;
      case "meetings":
        return <Users {...iconProps} className="text-purple-500" />;
      case "startKM":
      case "endingKM":
        return <Car {...iconProps} className="text-orange-500" />;
      case "siteDetails":
        return <MapPin {...iconProps} className="text-red-500" />;
      case "verifyAuthority":
        return <Building {...iconProps} className="text-slate-500" />;
      default:
        return null;
    }
  };

  const getFieldLabel = (key) => {
    const labels = {
      date: "Date",
      intime: "In Time",
      meetings: "Meetings",
      startKM: "Starting KM",
      officeOutTime: "Office Out Time",
      siteReachedTime: "Site Reached Time",
      siteDetails: "Site Details",
      siteOutTime: "Site Out Time",
      officeReachedTime: "Office Reached Time",
      endingKM: "Ending KM",
      verifyAuthority: "Verify Authority",
    };
    return labels[key] || key;
  };

  const fieldSections = [
    {
      title: "Basic Information",
      fields: ["date", "intime"], // ✅ removed "names"
      bgColor: "bg-blue-50",
      titleColor: "text-blue-700",
      borderColor: "border-blue-200",
      accentColor: "bg-blue-500",
    },
    {
      title: "Travel Details",
      fields: [
        "startKM",
        "officeOutTime",
        "siteReachedTime",
        "siteOutTime",
        "officeReachedTime",
        "endingKM",
      ],
      bgColor: "bg-green-50",
      titleColor: "text-green-700",
      borderColor: "border-green-200",
      accentColor: "bg-green-500",
    },
    {
      title: "Meeting & Site Information",
      fields: ["meetings", "siteDetails", "verifyAuthority"],
      bgColor: "bg-purple-50",
      titleColor: "text-purple-700",
      borderColor: "border-purple-200",
      accentColor: "bg-purple-500",
    },
  ];

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
        onClick={handleClose}
      />
      <div className="flex min-h-full items-center justify-center p-2 sm:p-6">
        <div className="relative w-full max-w-7xl transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all duration-300">
          {/* Header */}
          <div className="border-b border-gray-200 px-4 sm:px-10 py-6 sm:py-8 flex justify-between items-center">
            <div className="space-y-3">
              <h2 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {editData ? "Edit Marketing Log" : "Add Marketing Log"}
              </h2>
              <p className="text-sm sm:text-lg text-gray-600 max-w-2xl">
                {editData
                  ? "Update marketing activity details below."
                  : "Fill in the comprehensive details for your marketing activity and site visits."}
              </p>
            </div>

            <button
              onClick={handleClose}
              className="rounded-full p-2 sm:p-3 hover:bg-gray-100 transition-colors duration-200 group"
            >
              <X
                size={24}
                className="text-gray-400 group-hover:text-gray-600"
              />
            </button>
          </div>

          {/* Content */}
          <div className="max-h-[75vh] overflow-y-auto px-4 sm:px-10 py-6 sm:py-8">
            <div className="space-y-10">
              {fieldSections.map((section, sectionIndex) => (
                <div
                  key={sectionIndex}
                  className={`${section.bgColor} rounded-2xl border-2 ${section.borderColor} p-4 sm:p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
                >
                  <h3
                    className={`${section.titleColor} mb-6 sm:mb-8 text-xl sm:text-2xl font-bold flex items-center`}
                  >
                    <div
                      className={`w-3 h-3 rounded-full ${section.accentColor} mr-3 sm:mr-4`}
                    />
                    {section.title}
                  </h3>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                    {section.fields.map((key) => (
                      <div
                        key={key}
                        className={`${
                          key === "meetings" || key === "siteDetails"
                            ? "lg:col-span-2"
                            : ""
                        }`}
                      >
                        <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                          {getFieldLabel(key)}
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-start pt-3 sm:pt-4">
                            {getFieldIcon(key)}
                          </div>
                          {key === "siteDetails" || key === "meetings" ? (
                            <textarea
                              id={key}
                              name={key}
                              value={form[key]}
                              onChange={handleChange}
                              rows={4}
                              className="block w-full rounded-xl border-2 border-gray-300 pl-10 sm:pl-12 pr-4 py-3 sm:py-4 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-base bg-white hover:border-gray-400"
                              placeholder={`Enter ${getFieldLabel(
                                key
                              ).toLowerCase()}...`}
                            />
                          ) : (
                            <input
                              type={
                                key.includes("KM")
                                  ? "number"
                                  : key === "date"
                                  ? "date"
                                  : "time"
                              }
                              id={key}
                              name={key}
                              value={form[key]}
                              onChange={(e) => {
                                handleChange(e);
                                if (key !== "date" && !key.includes("KM")) {
                                  captureLocation(key); // ✅ ask location on time input
                                }
                              }}
                              disabled={key === "date"} // ✅ date can't be clicked
                              className={`block w-full rounded-xl border-2 border-gray-300 pl-10 sm:pl-12 pr-4 py-3 sm:py-4 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-base bg-white ${
                                key === "date"
                                  ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                                  : "hover:border-gray-400"
                              }`}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-4 sm:px-10 py-6 sm:py-8 flex justify-end space-x-4 sm:space-x-6">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center space-x-2 sm:space-x-3"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>{editData ? "Updating..." : "Creating..."}</span>
                </>
              ) : (
                <>
                  <CheckCircle size={20} />
                  <span>{editData ? "Update Log" : "Create Log"}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketingForm;
