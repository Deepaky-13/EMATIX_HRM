// // src/components/marketing/ClientsModal.jsx
// import React, { useState, useEffect } from "react";
// import { Users, Phone, StickyNote, PlusCircle, Trash2, X } from "lucide-react";
// import customFetch from "../../utils/customFetch";

// const ClientsModal = ({ open, handleClose, log }) => {
//   const [clients, setClients] = useState([]);
//   const [newClient, setNewClient] = useState({
//     clientName: "",
//     clientRemarks: "",
//     clientContactNumber: "",
//   });

//   useEffect(() => {
//     if (log) setClients(log.clients || []);
//   }, [log]);

//   const handleAddClient = async () => {
//     if (!newClient.clientName) return; // Require only name
//     try {
//       const res = await customFetch.post(
//         `/marketing/${log._id}/clients`,
//         newClient
//       );
//       setClients(res.data.clients);
//       setNewClient({
//         clientName: "",
//         clientRemarks: "",
//         clientContactNumber: "",
//       });
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleDeleteClient = async (id) => {
//     try {
//       const res = await customFetch.delete(
//         `/marketing/${log._id}/clients/${id}`
//       );
//       setClients(res.data.clients);
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
//                 <h2 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
//                   Manage Clients
//                 </h2>
//                 <p className="text-sm sm:text-lg text-gray-600 max-w-xl">
//                   Clients for{" "}
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
//             {/* Existing Clients */}
//             <div className="space-y-4">
//               <h3 className="text-lg font-semibold text-gray-800">
//                 Existing Clients
//               </h3>
//               {clients.length > 0 ? (
//                 clients.map((client) => (
//                   <div
//                     key={client._id}
//                     className="flex items-center justify-between ..."
//                   >
//                     <div>
//                       <h4 className="text-lg font-semibold text-gray-800">
//                         {client.clientName}
//                         {client.clientContactNumber && (
//                           <span className="text-sm text-gray-500">
//                             ({client.clientContactNumber})
//                           </span>
//                         )}
//                       </h4>
//                       <p className="text-sm text-gray-600">
//                         {client.clientRemarks || "No remarks"}
//                       </p>
//                       {/* Show client photo if exists */}
//                       {client.image && (
//                         <img
//                           src={client.image}
//                           alt="client"
//                           className="mt-2 w-24 h-24 rounded-lg object-cover"
//                         />
//                       )}
//                       {/* Upload single photo */}
//                       <input
//                         type="file"
//                         accept="image/*"
//                         capture="environment"
//                         onChange={async (e) => {
//                           if (!e.target.files[0]) return;
//                           const formData = new FormData();
//                           formData.append("image", e.target.files[0]); // 👈 must match backend .single("image")

//                           try {
//                             await customFetch.post(
//                               `/marketing/${log._id}/client/${client._id}/upload-image`, // ✅ correct route
//                               formData,
//                               {
//                                 headers: {
//                                   "Content-Type": "multipart/form-data",
//                                 },
//                               }
//                             );

//                             // refresh clients after upload
//                             const refreshed = await customFetch.get(
//                               `/marketing`
//                             );
//                             const updatedLog = refreshed.data.find(
//                               (l) => l._id === log._id
//                             );
//                             setClients(updatedLog.clients || []);
//                           } catch (err) {
//                             console.error(err);
//                           }
//                         }}
//                       />
//                     </div>

//                     <button onClick={() => handleDeleteClient(client._id)}>
//                       <Trash2 size={18} /> Delete
//                     </button>
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-gray-500 text-sm italic">
//                   No clients added yet.
//                 </p>
//               )}
//             </div>

//             {/* Add New Client */}
//             <div className="space-y-4 bg-green-50 border-2 border-green-200 rounded-2xl p-4 sm:p-6">
//               <h3 className="text-lg font-bold text-green-700 flex items-center gap-2">
//                 <PlusCircle size={20} className="text-green-600" />
//                 Add New Client
//               </h3>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                 {/* Name */}
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
//                     <Users size={18} className="text-green-500" />
//                   </div>
//                   <input
//                     type="text"
//                     placeholder="Client Name"
//                     value={newClient.clientName}
//                     onChange={(e) =>
//                       setNewClient({ ...newClient, clientName: e.target.value })
//                     }
//                     className="w-full rounded-xl border-2 border-gray-300 pl-10 pr-4 py-3 text-base shadow-sm focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all"
//                   />
//                 </div>

//                 {/* Contact */}
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
//                     <Phone size={18} className="text-blue-500" />
//                   </div>
//                   <input
//                     type="text"
//                     placeholder="Contact Number"
//                     value={newClient.clientContactNumber}
//                     onChange={(e) =>
//                       setNewClient({
//                         ...newClient,
//                         clientContactNumber: e.target.value,
//                       })
//                     }
//                     className="w-full rounded-xl border-2 border-gray-300 pl-10 pr-4 py-3 text-base shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
//                   />
//                 </div>

//                 {/* Remarks */}
//                 <div className="relative sm:col-span-2">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
//                     <StickyNote size={18} className="text-purple-500" />
//                   </div>
//                   <input
//                     type="text"
//                     placeholder="Remarks"
//                     value={newClient.clientRemarks}
//                     onChange={(e) =>
//                       setNewClient({
//                         ...newClient,
//                         clientRemarks: e.target.value,
//                       })
//                     }
//                     className="w-full rounded-xl border-2 border-gray-300 pl-10 pr-4 py-3 text-base shadow-sm focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all"
//                   />
//                 </div>
//               </div>

//               {/* Add button */}
//               <button
//                 onClick={handleAddClient}
//                 className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
//               >
//                 <PlusCircle size={18} />
//                 Add Client
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

// export default ClientsModal;

// src/components/marketing/ClientsModal.jsx
import React, { useState, useEffect } from "react";
import { Users, Phone, StickyNote, PlusCircle, Trash2, X } from "lucide-react";
import customFetch from "../../utils/customFetch";

const ClientsModal = ({ open, handleClose, log }) => {
  const [clients, setClients] = useState([]);
  const [newClient, setNewClient] = useState({
    clientName: "",
    clientRemarks: "",
    clientContactNumber: "",
  });

  const [selectedFiles, setSelectedFiles] = useState({}); // store pending image uploads

  // load clients from log when modal opens
  useEffect(() => {
    if (log) setClients(log.clients || []);
  }, [log]);

  // Add new client
  const handleAddClient = async () => {
    if (!newClient.clientName) return; // Require at least name
    try {
      const res = await customFetch.post(
        `/marketing/${log._id}/clients`,
        newClient
      );
      setClients(res.data.clients); // backend returns updated clients array
      setNewClient({
        clientName: "",
        clientRemarks: "",
        clientContactNumber: "",
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Delete client
  const handleDeleteClient = async (id) => {
    try {
      const res = await customFetch.delete(
        `/marketing/${log._id}/clients/${id}`
      );
      setClients(res.data.clients);
    } catch (err) {
      console.error(err);
    }
  };

  // Upload image for client
  const handleUploadImage = async (clientId, file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await customFetch.post(
        `/marketing/${log._id}/client/${clientId}/upload-image`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // backend returns updated log with all clients
      setClients(res.data.data.clients || []);

      // clear selected file after upload
      setSelectedFiles((prev) => {
        const updated = { ...prev };
        delete updated[clientId];
        return updated;
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-2 sm:p-6">
        <div className="relative w-full max-w-7xl transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all duration-300">
          {/* Header */}
          <div className="border-b border-gray-200 px-4 sm:px-10 py-6 sm:py-8">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                  Manage Clients
                </h2>
                <p className="text-sm sm:text-lg text-gray-600 max-w-xl">
                  Clients for{" "}
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
            {/* Existing Clients */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Existing Clients
              </h3>
              {clients.length > 0 ? (
                clients.map((client) => (
                  <div
                    key={client._id}
                    className="flex items-center justify-between border rounded-xl p-4"
                  >
                    <div className="space-y-2">
                      <h4 className="text-lg font-semibold text-gray-800">
                        {client.clientName}
                        {client.clientContactNumber && (
                          <span className="text-sm text-gray-500">
                            ({client.clientContactNumber})
                          </span>
                        )}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {client.clientRemarks || "No remarks"}
                      </p>

                      {/* Show client photo */}
                      {/* Show uploaded image from backend */}
                      {client.images && (
                        <img
                          src={client.images}
                          alt="client"
                          className="mt-2 w-24 h-24 rounded-lg object-cover border"
                        />
                      )}

                      {/* Show preview of newly selected file */}
                      {selectedFiles[client._id] && (
                        <img
                          src={URL.createObjectURL(selectedFiles[client._id])}
                          alt="preview"
                          className="mt-2 w-24 h-24 rounded-lg object-cover border-2 border-dashed border-blue-400"
                        />
                      )}

                      {/* Select new photo */}
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={(e) =>
                          setSelectedFiles({
                            ...selectedFiles,
                            [client._id]: e.target.files[0],
                          })
                        }
                        className="mt-2"
                      />

                      {/* Upload button */}
                      {selectedFiles[client._id] && (
                        <button
                          onClick={() =>
                            handleUploadImage(
                              client._id,
                              selectedFiles[client._id]
                            )
                          }
                          className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                        >
                          Upload Image
                        </button>
                      )}
                    </div>

                    <button
                      onClick={() => handleDeleteClient(client._id)}
                      className="text-red-600 hover:text-red-800 flex items-center gap-1"
                    >
                      <Trash2 size={18} /> Delete
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm italic">
                  No clients added yet.
                </p>
              )}
            </div>

            {/* Add New Client */}
            <div className="space-y-4 bg-green-50 border-2 border-green-200 rounded-2xl p-4 sm:p-6">
              <h3 className="text-lg font-bold text-green-700 flex items-center gap-2">
                <PlusCircle size={20} className="text-green-600" />
                Add New Client
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Name */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <Users size={18} className="text-green-500" />
                  </div>
                  <input
                    type="text"
                    placeholder="Client Name"
                    value={newClient.clientName}
                    onChange={(e) =>
                      setNewClient({ ...newClient, clientName: e.target.value })
                    }
                    className="w-full rounded-xl border-2 border-gray-300 pl-10 pr-4 py-3 text-base shadow-sm focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all"
                  />
                </div>

                {/* Contact */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <Phone size={18} className="text-blue-500" />
                  </div>
                  <input
                    type="text"
                    placeholder="Contact Number"
                    value={newClient.clientContactNumber}
                    onChange={(e) =>
                      setNewClient({
                        ...newClient,
                        clientContactNumber: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border-2 border-gray-300 pl-10 pr-4 py-3 text-base shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                  />
                </div>

                {/* Remarks */}
                <div className="relative sm:col-span-2">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <StickyNote size={18} className="text-purple-500" />
                  </div>
                  <input
                    type="text"
                    placeholder="Remarks"
                    value={newClient.clientRemarks}
                    onChange={(e) =>
                      setNewClient({
                        ...newClient,
                        clientRemarks: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border-2 border-gray-300 pl-10 pr-4 py-3 text-base shadow-sm focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all"
                  />
                </div>
              </div>

              {/* Add button */}
              <button
                onClick={handleAddClient}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                <PlusCircle size={18} />
                Add Client
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

export default ClientsModal;
