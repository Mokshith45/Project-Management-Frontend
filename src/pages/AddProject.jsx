import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const clientsList = [
  { value: '1', label: 'Acme Corp' },
  { value: '2', label: 'Globex Inc' },
  { value: 'others', label: 'Others' },
];

const projectLeadsList = [
  { value: '101', label: 'Alice Johnson' },
  { value: '102', label: 'Bob Smith' },
];

const steps = ['Basic Info', 'Client Details', 'Budget & SPOC'];

const AddProject = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const [form, setForm] = useState({
    projectName: '',
    type: '',
    department: '',
    status: 'INITIATED',
    client: '',
    newClientName: '',
    newClientEmail: '',
    onboardedOn: '',
    rating: '',
    totalBudget: '',
    contactName: '',
    contactPhone: '',
    projectLead: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const validateStep = () => {
    const errs = {};
    if (step === 0) {
      if (!form.projectName) errs.projectName = true;
      if (!form.type) errs.type = true;
      if (!form.department) errs.department = true;
    }

    if (step === 1) {
      if (!form.client) errs.client = true;
      if (form.client === 'others') {
        if (!form.newClientName.trim()) errs.newClientName = true;
        if (!form.newClientEmail.trim()) errs.newClientEmail = true;
        if (!form.onboardedOn) errs.onboardedOn = true;
        if (!form.rating || isNaN(form.rating)) errs.rating = true;
      }
    }

    if (step === 2) {
      if (
        form.totalBudget &&
        (isNaN(form.totalBudget) || Number(form.totalBudget) < 0)
      ) {
        errs.totalBudget = 'Must be a positive number';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) setStep(step + 1);
  };

  const handlePrev = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    const finalClient =
      form.client === 'others'
        ? {
            name: form.newClientName,
            email: form.newClientEmail,
            onboardedOn: form.onboardedOn,
            rating: Number(form.rating),
          }
        : form.client;

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

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
      });

      if (!res.ok) throw new Error('Failed to save project');

      // Success: Redirect to project list
      navigate('/projects');
    } catch (error) {
      alert('Error submitting project: ' + error.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-indigo-700 mb-4">Add New Project</h2>

      {/* Step Progress UI */}
      <div className="flex items-center mb-6 space-x-2 text-sm text-gray-600">
        {steps.map((s, i) => (
          <div
            key={i}
            className={`px-3 py-1 rounded-full border ${
              step === i ? 'bg-indigo-600 text-white' : 'border-gray-300'
            }`}
          >
            {s}
          </div>
        ))}
      </div>

      <form className='space-y-4'>
        {/* Step 0: Basic Info */}
        {step === 0 && (
          <>
            {/* Project Name */}
            <div>
              <label className="block text-sm mb-1">Project Name <span className='text-red-500'>*</span></label>
              <input
                name="projectName"
                value={form.projectName}
                onChange={handleChange}
                className={`w-full border px-3 py-2 rounded-md ${errors.projectName ? 'border-red-500' : 'border-gray-300'}`}
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm mb-1">Type <span className='text-red-500'>*</span></label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className={`w-full border px-3 py-2 rounded-md ${errors.type ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">-- Select Type --</option>
                <option value="Development">Development</option>
                <option value="Consulting">Consulting</option>
                <option value="Support">Support</option>
              </select>
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm mb-1">Department <span className='text-red-500'>*</span></label>
              <select
                name="department"
                value={form.department}
                onChange={handleChange}
                className={`w-full border px-3 py-2 rounded-md ${errors.department ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">-- Select --</option>
                <option value="Engineering">Engineering</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="HR">HR</option>
                <option value="Banking">Banking</option>
              </select>
            </div>

            {/* Status dropdown */}
            <div>
            <label className="block text-sm mb-1">Status<span className='text-red-500'>*</span></label>
                <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className={`w-full border px-3 py-2 rounded-md ${errors.status ? 'border-red-500' : 'border-gray-300'}`}
                >
                    <option value="Initiated">Initiated</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                    <option value="On Hold">On Hold</option>
                </select>
            </div>
          </>
        )}

        {/* Step 1: Client Details */}
        {step === 1 && (
          <>
            <div>
              <label className="block text-sm mb-1">Client <span className='text-red-500'>*</span></label>
              <select
                name="client"
                value={form.client}
                onChange={handleChange}
                className={`w-full border px-3 py-2 rounded-md ${errors.client ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">-- Choose Client --</option>
                {clientsList.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            {form.client === 'others' && (
              <>
                <div>
                  <label className="block text-sm mb-1">New Client Name <span className='text-red-500'>*</span></label>
                  <input
                    name="newClientName"
                    value={form.newClientName}
                    onChange={handleChange}
                    className={`w-full border px-3 py-2 rounded-md ${errors.newClientName ? 'border-red-500' : 'border-gray-300'}`}
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">Email <span className='text-red-500'>*</span></label>
                  <input
                    type="email"
                    name="newClientEmail"
                    value={form.newClientEmail}
                    onChange={handleChange}
                    className={`w-full border px-3 py-2 rounded-md ${errors.newClientEmail ? 'border-red-500' : 'border-gray-300'}`}
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">Onboarded On <span className='text-red-500'>*</span></label>
                  <input
                    type="date"
                    name="onboardedOn"
                    value={form.onboardedOn}
                    onChange={handleChange}
                    className={`w-full border px-3 py-2 rounded-md ${errors.onboardedOn ? 'border-red-500' : 'border-gray-300'}`}
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">Rating (1-5) <span className='text-red-500'>*</span></label>
                  <input
                    name="rating"
                    value={form.rating}
                    onChange={handleChange}
                    className={`w-full border px-3 py-2 rounded-md ${errors.rating ? 'border-red-500' : 'border-gray-300'}`}
                  />
                </div>
              </>
            )}
          </>
        )}

        {/* Step 2: Budget & SPOC */}
        {step === 2 && (
          <>
            <div>
              <label className="block text-sm mb-1">Budget (₹) <span className='text-red-500'>*</span></label>
              <input
                name="totalBudget"
                value={form.totalBudget}
                onChange={handleChange}
                className={`w-full border px-3 py-2 rounded-md ${errors.totalBudget ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.totalBudget && (
                <p className="text-sm text-red-600">{errors.totalBudget}</p>
              )}
            </div>

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
                name="contactPhone"
                value={form.contactPhone}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-md border-gray-300"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Assign Project Lead</label>
              <select
                name="projectLead"
                value={form.projectLead}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-md border-gray-300"
              >
                <option value="">-- Select Lead --</option>
                {projectLeadsList.map((lead) => (
                  <option key={lead.value} value={lead.value}>{lead.label}</option>
                ))}
              </select>
            </div>
          </>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4">
          {step > 0 && (
            <button
              type="button"
              onClick={handlePrev}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm"
            >
              ⬅ Back
            </button>
          )}

            {step < 2 ? (
            <button
                type="button"
                onClick={handleNext}
                className="ml-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-sm"
            >
                Next ➡
            </button>
            ) : (
            <button
                type="button" // Not a submit type to prevent accidental submission
                onClick={handleSubmit}
                className="ml-auto px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm"
            >
             Submit
            </button>
            )}

        </div>
      </form>
    </div>
  );
};

export default AddProject;
