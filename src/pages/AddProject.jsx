import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddProject = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    projectName: '',
    type: '',
    department: '',
    status: 'ACTIVE',
    clientId: '',
    resourceIds: '',
    highlightIds: '',
    contractId: '',
    projectRateCardId: '',
    budgets: '',
    contactPersonId: '',
    managerId: '',
    projectLeadId: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Required validations
    if (!form.projectName || !form.type || !form.department || !form.status || !form.clientId) {
      alert('Please fill all required fields: Project Name, Type, Department, Status, Client ID');
      return;
    }

    // budgets must be a valid positive number if entered
    if (form.budgets && (isNaN(form.budgets) || Number(form.budgets) < 0)) {
      alert('Budget must be a positive number');
      return;
    }

    // Parse comma separated IDs into arrays for resourceIds and highlightIds
    const resourceIdsArray = form.resourceIds
      ? form.resourceIds.split(',').map((id) => Number(id.trim())).filter((id) => !isNaN(id))
      : [];

    const highlightIdsArray = form.highlightIds
      ? form.highlightIds.split(',').map((id) => Number(id.trim())).filter((id) => !isNaN(id))
      : [];

    // Prepare final project object to submit
    const projectData = {
      projectName: form.projectName,
      type: form.type,
      department: form.department,
      status: form.status,
      clientId: Number(form.clientId),
      resourceIds: resourceIdsArray,
      highlightIds: highlightIdsArray,
      contractId: form.contractId ? Number(form.contractId) : null,
      projectRateCardId: form.projectRateCardId ? Number(form.projectRateCardId) : null,
      budgets: form.budgets ? Number(form.budgets) : null,
      contactPersonId: form.contactPersonId ? Number(form.contactPersonId) : null,
      managerId: form.managerId ? Number(form.managerId) : null,
      projectLeadId: form.projectLeadId ? Number(form.projectLeadId) : null,
    };

    console.log('✅ Project Submitted:', projectData);

    // TODO: API POST request here

    navigate('/projects');
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-indigo-700 mb-6">➕ Add New Project</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Project Name */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Project Name *</label>
          <input
            type="text"
            name="projectName"
            value={form.projectName}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md"
            required
          />
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Project Type *</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md"
            required
          >
            <option value="">-- Select Type --</option>
            <option value="Development">Development</option>
            <option value="Consulting">Consulting</option>
            <option value="Support">Support</option>
          </select>
        </div>

        {/* Department */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Department *</label>
          <select
            name="department"
            value={form.department}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md"
            required
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
          <label className="block text-sm text-gray-600 mb-1">Status *</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md"
            required
          >
            <option value="ACTIVE">Active</option>
            <option value="COMPLETED">Completed</option>
            <option value="ON_HOLD">On Hold</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        {/* Client ID */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Client ID *</label>
          <input
            type="number"
            name="clientId"
            value={form.clientId}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md"
            required
            min="1"
          />
        </div>

        {/* Resource IDs */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Resource IDs (comma-separated)</label>
          <input
            type="text"
            name="resourceIds"
            value={form.resourceIds}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md"
            placeholder="e.g. 1, 2, 3"
          />
        </div>

        {/* Highlight IDs */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Highlight IDs (comma-separated)</label>
          <input
            type="text"
            name="highlightIds"
            value={form.highlightIds}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md"
            placeholder="e.g. 1, 2, 3"
          />
        </div>

        {/* Contract ID */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Contract ID</label>
          <input
            type="number"
            name="contractId"
            value={form.contractId}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md"
            min="1"
            placeholder="Optional"
          />
        </div>

        {/* Project Rate Card ID */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Project Rate Card ID</label>
          <input
            type="number"
            name="projectRateCardId"
            value={form.projectRateCardId}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md"
            min="1"
            placeholder="Optional"
          />
        </div>

        {/* Budgets */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Budgets</label>
          <input
            type="number"
            name="budgets"
            value={form.budgets}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md"
            step="0.01"
            min="0"
            placeholder="Optional"
          />
        </div>

        {/* Contact Person ID */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Contact Person ID</label>
          <input
            type="number"
            name="contactPersonId"
            value={form.contactPersonId}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md"
            min="1"
            placeholder="Optional"
          />
        </div>

        {/* Manager ID */}
        {/* <div>
          <label className="block text-sm text-gray-600 mb-1">Manager ID</label>
          <input
            type="number"
            name="managerId"
            value={form.managerId}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md"
            min="1"
            placeholder="Optional"
          />
        </div> */}

        {/* Project Lead ID */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Project Lead ID</label>
          <input
            type="number"
            name="projectLeadId"
            value={form.projectLeadId}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md"
            min="1"
            placeholder="Optional"
          />
        </div>

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
