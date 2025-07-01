import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddProject = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    projectName: '',
    type: '',
    department: '',
    status: 'INITIATED',
    client: '',
    newClientName: '',
    totalBudget: '',
    contactName: '',
    contactPhone: '',
    projectLead: '',
  });

  const [errors, setErrors] = useState({});

  const clientsList = [
    { value: '1', label: 'Acme Corp' },
    { value: '2', label: 'Globex Inc' },
    { value: 'others', label: 'Others' },
  ];

  const projectLeadsList = [
    { value: '101', label: 'Alice Johnson' },
    { value: '102', label: 'Bob Smith' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const validate = () => {
    const errs = {};
    if (!form.projectName) errs.projectName = true;
    if (!form.type) errs.type = true;
    if (!form.department) errs.department = true;
    if (!form.status) errs.status = true;

    if (!form.client) errs.client = true;
    if (form.client === 'others' && !form.newClientName.trim())
      errs.newClientName = true;

    if (
      form.totalBudget &&
      (isNaN(form.totalBudget) || Number(form.totalBudget) < 0)
    ) {
      errs.totalBudget = 'Must be a positive number';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const finalClient =
      form.client === 'others' ? form.newClientName : form.client;

    const projectData = {
      projectName: form.projectName,
      type: form.type,
      department: form.department,
      status: form.status,
      client: finalClient,
      budgets: form.totalBudget ? Number(form.totalBudget) : null,
      contactPerson: {
        name: form.contactName,
        phone: form.contactPhone,
      },
      projectLeadId: form.projectLead ? Number(form.projectLead) : null,
    };

    console.log('✅ Project Data:', projectData);
    navigate('/projects');
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-indigo-700 mb-6">➕ Add New Project</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Project Name */}
        <div>
          <label className="block text-sm mb-1">
            Project Name <span className="text-red-500">*</span>
          </label>
          <input
            name="projectName"
            value={form.projectName}
            onChange={handleChange}
            className={`w-full border px-3 py-2 rounded-md ${
              errors.projectName ? 'border-red-500' : 'border-gray-300'
            }`}
          />
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm mb-1">
            Project Type <span className="text-red-500">*</span>
          </label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className={`w-full border px-3 py-2 rounded-md ${
              errors.type ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">-- Select Type --</option>
            <option value="Development">Development</option>
            <option value="Consulting">Consulting</option>
            <option value="Support">Support</option>
          </select>
        </div>

        {/* Department */}
        <div>
          <label className="block text-sm mb-1">
            Department <span className="text-red-500">*</span>
          </label>
          <select
            name="department"
            value={form.department}
            onChange={handleChange}
            className={`w-full border px-3 py-2 rounded-md ${
              errors.department ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">-- Select Department --</option>
            <option value="Engineering">Engineering</option>
            <option value="Marketing">Marketing</option>
            <option value="Sales">Sales</option>
            <option value="HR">HR</option>
            <option value="Finance">Finance</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm mb-1">
            Status <span className="text-red-500">*</span>
          </label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className={`w-full border px-3 py-2 rounded-md ${
              errors.status ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="INITIATED">Initiated</option>
            <option value="ONGOING">Ongoing</option>
            <option value="COMPLETED">Completed</option>
            <option value="ON_HOLD">On Hold</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        {/* Client Dropdown */}
        <div>
          <label className="block text-sm mb-1">
            Client <span className="text-red-500">*</span>
          </label>
          <select
            name="client"
            value={form.client}
            onChange={handleChange}
            className={`w-full border px-3 py-2 rounded-md ${
              errors.client ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">-- Choose Client --</option>
            {clientsList.map((client) => (
              <option key={client.value} value={client.value}>
                {client.label}
              </option>
            ))}
          </select>

          {form.client === 'others' && (
            <div className="mt-2">
              <label className="block text-sm mb-1">
                New Client Name <span className="text-red-500">*</span>
              </label>
              <input
                name="newClientName"
                value={form.newClientName}
                onChange={handleChange}
                className={`w-full border px-3 py-2 rounded-md ${
                  errors.newClientName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
          )}
        </div>

        {/* Total Budget */}
        <div>
          <label className="block text-sm mb-1">Budget</label>
          <input
            type="number"
            name="totalBudget"
            value={form.totalBudget}
            onChange={handleChange}
            min="0"
            className="w-full border px-3 py-2 rounded-md border-gray-300"
          />
        </div>

        {/* Client SPOC */}
        <div>
          <label className="block text-sm mb-1">Client SPOC Name</label>
          <input
            name="contactName"
            value={form.contactName}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md border-gray-300"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Client SPOC Phone</label>
          <input
            type="tel"
            name="contactPhone"
            value={form.contactPhone}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md border-gray-300"
          />
        </div>

        {/* Project Lead */}
        <div>
          <label className="block text-sm mb-1">Project Lead</label>
          <select
            name="projectLead"
            value={form.projectLead}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md border-gray-300"
          >
            <option value="">-- Select Lead --</option>
            {projectLeadsList.map((lead) => (
              <option key={lead.value} value={lead.value}>
                {lead.label}
              </option>
            ))}
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="mt-4 bg-indigo-600 text-white py-2 px-6 rounded hover:bg-indigo-700 transition"
        >
          Create Project
        </button>
      </form>
    </div>
  );
};

export default AddProject;
