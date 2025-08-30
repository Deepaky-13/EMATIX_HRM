// import React, { useState, useEffect } from "react";
// import { Users, Phone, Briefcase, PlusCircle, Trash2, X } from "lucide-react";
// import customFetch from "../../utils/customFetch";

// const LeadsModal = ({ open, handleClose, log }) => {
//   const [leads, setLeads] = useState([]);
//   const [newLead, setNewLead] = useState({
//     leadName: "",
//     leadDesignation: "",
//     leadContactNumber: "",
//   });

//   useEffect(() => {
//     if (log) setLeads(log.leads || []);
//   }, [log]);

//   const handleAddLead = async () => {
//     try {
//       const res = await customFetch.post(
//         `/marketing/${log._id}/leads`,
//         newLead
//       );
//       setLeads(res.data.leads);
//       setNewLead({
//         leadName: "",
//         leadDesignation: "",
//         leadContactNumber: "",
//       });
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleDeleteLead = async (id) => {
//     try {
//       const res = await customFetch.delete(`/marketing/${log._id}/leads/${id}`);
//       setLeads(res.data.leads);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 z-50 overflow-y-auto">
//       {/* Backdrop */}
//       <div
//         className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
//         onClick={handleClose}
//       />

//       {/* Modal */}
//       <div className="flex min-h-full items-center justify-center p-2 sm:p-6">
//         <div className="relative w-full max-w-7xl transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all duration-300">
//           {/* Header */}
//           <div className="border-b border-gray-200 px-4 sm:px-10 py-6 sm:py-8">
//             <div className="flex items-center justify-between">
//               <div className="space-y-2">
//                 <h2 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//                   Manage Leads
//                 </h2>
//                 <p className="text-sm sm:text-lg text-gray-600 max-w-xl">
//                   Leads for{" "}
//                   <span className="font-semibold text-gray-800">
//                     "{log?.names || log?.meetings}"
//                   </span>
//                 </p>
//               </div>
//               <button
//                 onClick={handleClose}
//                 className="rounded-full p-2 sm:p-3 hover:bg-gray-100 transition-colors duration-200 group"
//               >
//                 <X
//                   size={24}
//                   className="text-gray-400 group-hover:text-gray-600"
//                 />
//               </button>
//             </div>
//           </div>

//           {/* Content */}
//           <div className="max-h-[75vh] overflow-y-auto px-4 sm:px-10 py-6 sm:py-8 space-y-10">
//             {/* Leads List */}
//             <div className="space-y-4">
//               {leads.length > 0 ? (
//                 leads.map((lead) => (
//                   <div
//                     key={lead._id}
//                     className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200"
//                   >
//                     <div>
//                       <h4 className="text-lg font-semibold text-gray-800">
//                         {lead.leadName}{" "}
//                         <span className="text-sm text-gray-500">
//                           ({lead.leadDesignation})
//                         </span>
//                       </h4>
//                       <p className="text-sm text-gray-600">
//                         Contact: {lead.leadContactNumber}
//                       </p>
//                       <p className="text-xs text-gray-400">
//                         Added by: {lead.User?.name || "Unknown"}
//                       </p>
//                     </div>
//                     <button
//                       onClick={() => handleDeleteLead(lead._id)}
//                       className="flex items-center gap-2 text-red-600 hover:text-red-800 font-medium transition-colors"
//                     >
//                       <Trash2 size={18} />
//                       Delete
//                     </button>
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-gray-500 text-sm italic">
//                   No leads added yet.
//                 </p>
//               )}
//             </div>

//             {/* Add New Lead */}
//             <div className="space-y-4 bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 sm:p-6">
//               <h3 className="text-lg font-bold text-blue-700 flex items-center gap-2">
//                 <PlusCircle size={20} className="text-blue-600" />
//                 Add New Lead
//               </h3>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
//                     <Users size={18} className="text-blue-500" />
//                   </div>
//                   <input
//                     type="text"
//                     placeholder="Lead Name"
//                     value={newLead.leadName}
//                     onChange={(e) =>
//                       setNewLead({ ...newLead, leadName: e.target.value })
//                     }
//                     className="w-full rounded-xl border-2 border-gray-300 pl-10 pr-4 py-3 text-base shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
//                   />
//                 </div>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
//                     <Briefcase size={18} className="text-purple-500" />
//                   </div>
//                   <input
//                     type="text"
//                     placeholder="Designation"
//                     value={newLead.leadDesignation}
//                     onChange={(e) =>
//                       setNewLead({
//                         ...newLead,
//                         leadDesignation: e.target.value,
//                       })
//                     }
//                     className="w-full rounded-xl border-2 border-gray-300 pl-10 pr-4 py-3 text-base shadow-sm focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all"
//                   />
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={async (e) => {
//                       const file = e.target.files[0];
//                       if (file) {
//                         const formData = new FormData();
//                         formData.append("file", file);
//                         formData.append("upload_preset", "your_upload_preset"); // Cloudinary preset

//                         const res = await fetch(
//                           "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload",
//                           { method: "POST", body: formData }
//                         );
//                         const data = await res.json();

//                         // Save URL in form
//                         setForm((prev) => ({
//                           ...prev,
//                           leads: [
//                             ...prev.leads,
//                             { ...newLead, photoUrl: data.secure_url },
//                           ],
//                         }));
//                       }
//                     }}
//                   />
//                 </div>
//                 <div className="relative sm:col-span-2">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
//                     <Phone size={18} className="text-green-500" />
//                   </div>
//                   <input
//                     type="text"
//                     placeholder="Contact Number"
//                     value={newLead.leadContactNumber}
//                     onChange={(e) =>
//                       setNewLead({
//                         ...newLead,
//                         leadContactNumber: e.target.value,
//                       })
//                     }
//                     className="w-full rounded-xl border-2 border-gray-300 pl-10 pr-4 py-3 text-base shadow-sm focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all"
//                   />
//                 </div>
//               </div>
//               <button
//                 onClick={handleAddLead}
//                 className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
//               >
//                 <PlusCircle size={18} />
//                 Add Lead
//               </button>
//             </div>
//           </div>

//           {/* Footer */}
//           <div className="border-t border-gray-200 px-4 sm:px-10 py-6 sm:py-8 flex justify-end">
//             <button
//               onClick={handleClose}
//               className="px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all duration-200"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LeadsModal;

import React, { useState, useEffect } from "react";
import { Users, Phone, Briefcase, PlusCircle, Trash2, X } from "lucide-react";
import customFetch from "../../utils/customFetch";

const LeadsModal = ({ open, handleClose, log }) => {
  const [leads, setLeads] = useState([]);
  const [newLead, setNewLead] = useState({
    leadName: "",
    leadDesignation: "",
    leadContactNumber: "",
  });
  const [selectedFiles, setSelectedFiles] = useState({}); // For image previews

  useEffect(() => {
    if (log) setLeads(log.leads || []);
  }, [log]);

  // Add new lead
  const handleAddLead = async () => {
    if (!newLead.leadName) return; // Require at least a name
    try {
      const res = await customFetch.post(
        `/marketing/${log._id}/leads`,
        newLead
      );
      setLeads(res.data.leads);
      setNewLead({ leadName: "", leadDesignation: "", leadContactNumber: "" });
    } catch (err) {
      console.error(err);
    }
  };

  // Delete lead
  const handleDeleteLead = async (id) => {
    try {
      const res = await customFetch.delete(`/marketing/${log._id}/leads/${id}`);
      setLeads(res.data.leads);
    } catch (err) {
      console.error(err);
    }
  };

  // Upload lead image
  const handleUploadImage = async (leadId, file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await customFetch.post(
        `/marketing/${log._id}/lead/${leadId}/upload-image`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setLeads(res.data.data.leads || []);

      setSelectedFiles((prev) => {
        const updated = { ...prev };
        delete updated[leadId];
        return updated;
      });
    } catch (err) {
      console.error(err);
    }
  };

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
          <div className="border-b border-gray-200 px-4 sm:px-10 py-6 sm:py-8">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Manage Leads
                </h2>
                <p className="text-sm sm:text-lg text-gray-600 max-w-xl">
                  Leads for{" "}
                  <span className="font-semibold text-gray-800">
                    "{log?.names || log?.meetings}"
                  </span>
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
          </div>

          {/* Content */}
          <div className="max-h-[75vh] overflow-y-auto px-4 sm:px-10 py-6 sm:py-8 space-y-10">
            {/* Existing Leads */}
            <div className="space-y-4">
              {leads.length > 0 ? (
                leads.map((lead) => (
                  <div
                    key={lead._id}
                    className="flex items-center justify-between border rounded-xl p-4"
                  >
                    <div className="space-y-2">
                      <h4 className="text-lg font-semibold text-gray-800">
                        {lead.leadName}{" "}
                        <span className="text-sm text-gray-500">
                          ({lead.leadDesignation})
                        </span>
                      </h4>
                      <p className="text-sm text-gray-600">
                        Contact: {lead.leadContactNumber}
                      </p>
                      <p className="text-xs text-gray-400">
                        Added by: {lead.User?.name || "Unknown"}
                      </p>

                      {/* Show lead photo */}
                      {lead.image && (
                        <img
                          src={lead.image}
                          alt="lead"
                          className="mt-2 w-24 h-24 rounded-lg object-cover border"
                        />
                      )}
                      {selectedFiles[lead._id] && (
                        <img
                          src={URL.createObjectURL(selectedFiles[lead._id])}
                          alt="preview"
                          className="mt-2 w-24 h-24 rounded-lg object-cover border-2 border-dashed border-blue-400"
                        />
                      )}

                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={(e) =>
                          setSelectedFiles({
                            ...selectedFiles,
                            [lead._id]: e.target.files[0],
                          })
                        }
                        className="mt-2"
                      />
                      {selectedFiles[lead._id] && (
                        <button
                          onClick={() =>
                            handleUploadImage(lead._id, selectedFiles[lead._id])
                          }
                          className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                        >
                          Upload Image
                        </button>
                      )}
                    </div>

                    <button
                      onClick={() => handleDeleteLead(lead._id)}
                      className="text-red-600 hover:text-red-800 flex items-center gap-1"
                    >
                      <Trash2 size={18} /> Delete
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm italic">
                  No leads added yet.
                </p>
              )}
            </div>

            {/* Add New Lead */}
            <div className="space-y-4 bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 sm:p-6">
              <h3 className="text-lg font-bold text-blue-700 flex items-center gap-2">
                <PlusCircle size={20} className="text-blue-600" />
                Add New Lead
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <Users size={18} className="text-blue-500" />
                  </div>
                  <input
                    type="text"
                    placeholder="Lead Name"
                    value={newLead.leadName}
                    onChange={(e) =>
                      setNewLead({ ...newLead, leadName: e.target.value })
                    }
                    className="w-full rounded-xl border-2 border-gray-300 pl-10 pr-4 py-3 text-base shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <Briefcase size={18} className="text-purple-500" />
                  </div>
                  <input
                    type="text"
                    placeholder="Designation"
                    value={newLead.leadDesignation}
                    onChange={(e) =>
                      setNewLead({
                        ...newLead,
                        leadDesignation: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border-2 border-gray-300 pl-10 pr-4 py-3 text-base shadow-sm focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all"
                  />
                </div>
                <div className="relative sm:col-span-2">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <Phone size={18} className="text-green-500" />
                  </div>
                  <input
                    type="text"
                    placeholder="Contact Number"
                    value={newLead.leadContactNumber}
                    onChange={(e) =>
                      setNewLead({
                        ...newLead,
                        leadContactNumber: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border-2 border-gray-300 pl-10 pr-4 py-3 text-base shadow-sm focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all"
                  />
                </div>
              </div>
              <button
                onClick={handleAddLead}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                <PlusCircle size={18} />
                Add Lead
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-4 sm:px-10 py-6 sm:py-8 flex justify-end">
            <button
              onClick={handleClose}
              className="px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadsModal;
