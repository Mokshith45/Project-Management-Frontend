// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const AddClient = () => {
//   const navigate = useNavigate();
//   const [form, setForm] = useState({
//     name: '',
//     email: '',
//     contactPerson: '',
//     logoUrl: '',
//   });

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!form.name || !form.email || !form.contactPerson) {
//       alert('Please fill all required fields');
//       return;
//     }

//     console.log('✅ Client Submitted:', form);
//     navigate('/clients');
//   };

//   return (
//     <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
//       <h2 className="text-xl font-bold text-indigo-700 mb-6">📁 Add New Client</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block text-sm text-gray-600 mb-1">Client Name *</label>
//           <input
//             type="text"
//             name="name"
//             value={form.name}
//             onChange={handleChange}
//             className="w-full border px-3 py-2 rounded-md"
//           />
//         </div>
//         <div>
//           <label className="block text-sm text-gray-600 mb-1">Contact Email *</label>
//           <input
//             type="email"
//             name="email"
//             value={form.email}
//             onChange={handleChange}
//             className="w-full border px-3 py-2 rounded-md"
//           />
//         </div>
//         <div>
//           <label className="block text-sm text-gray-600 mb-1">Contact Person *</label>
//           <input
//             type="text"
//             name="contactPerson"
//             value={form.contactPerson}
//             onChange={handleChange}
//             className="w-full border px-3 py-2 rounded-md"
//           />
//         </div>
//         <div>
//           <label className="block text-sm text-gray-600 mb-1">Logo URL (optional)</label>
//           <input
//             type="text"
//             name="logoUrl"
//             value={form.logoUrl}
//             onChange={handleChange}
//             className="w-full border px-3 py-2 rounded-md"
//           />
//         </div>

//         <button
//           type="submit"
//           className="mt-4 bg-purple-600 text-white py-2 px-6 rounded hover:bg-purple-700 transition"
//         >
//           Add Client
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AddClient;


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddClient = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    onBoardedOn: '',
    clientRating: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!form.name || !form.email || !form.onBoardedOn) {
      alert('Please fill all required fields: Name, Email, and Onboard Date.');
      return;
    }

    // clientRating should be number between 0 and 10 if provided
    if (
      form.clientRating !== '' &&
      (isNaN(form.clientRating) ||
        form.clientRating < 0 ||
        form.clientRating > 10)
    ) {
      alert('Client rating must be a number between 0 and 10.');
      return;
    }

    // Format data to send
    const clientData = {
      name: form.name,
      email: form.email,
      onBoardedOn: form.onBoardedOn,
      clientRating: form.clientRating ? Number(form.clientRating) : null,
    };

    console.log('✅ Client Submitted:', clientData);
    // You can do your API POST request here

    navigate('/clients');
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-indigo-700 mb-6">👤 Add New Client</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Client Name *</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Contact Email *</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Onboarded On *</label>
          <input
            type="date"
            name="onBoardedOn"
            value={form.onBoardedOn}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Client Rating (0-10)</label>
          <input
            type="number"
            name="clientRating"
            min="0"
            max="10"
            value={form.clientRating}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md"
            placeholder="Optional"
          />
        </div>

        <button
          type="submit"
          className="mt-4 bg-purple-600 text-white py-2 px-6 rounded hover:bg-purple-700 transition"
        >
          Add Client
        </button>
      </form>
    </div>
  );
};

export default AddClient;
