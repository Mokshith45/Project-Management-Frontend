import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const stepLabels = ['Basic Info', 'Client Details', 'Budget & SPOC'];

const AddProject = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [clientsList, setClientsList] = useState([]);
  const [projectLeadsList, setProjectLeadsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState([]);

  const [form, setForm] = useState({
    projectName: '',
    type: '',
    department: '',
    status: 'ACTIVE',
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

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios
      .get('http://localhost:8080/api/contact-persons', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const unassigned = res.data.filter((c) => c.projectId == null);
        setContacts(unassigned);
      })
      .catch((err) => console.error('Error fetching contacts:', err));

    const fetchClients = axios.get('http://localhost:8080/api/clients', {
      headers: { Authorization: `Bearer ${token}` },
    });

    const fetchProjects = axios.get('http://localhost:8080/api/projects', {
      headers: { Authorization: `Bearer ${token}` },
    });

    const fetchLeads = axios.get('http://localhost:8080/api/project-leads', {
      headers: { Authorization: `Bearer ${token}` },
    });

    Promise.all([fetchClients, fetchLeads, fetchProjects])
      .then(([clientsRes, leadsRes, projectsRes]) => {
        const assignedLeadIds = new Set(projectsRes.data.map((p) => p.projectLeadId));
        const availableLeads = leadsRes.data.filter((lead) => !assignedLeadIds.has(lead.id));
        const leadsFormatted = availableLeads.map((lead) => ({
          value: lead.id.toString(),
          label: lead.userName,
        }));
        setProjectLeadsList(leadsFormatted);

        const clientsFormatted = clientsRes.data.map((c) => ({
          value: c.id,
          label: c.name,
        }));
        clientsFormatted.push({ value: 'others', label: 'Others' });
        setClientsList(clientsFormatted);

        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching data:', err);
        alert('Failed to load form data');
        setLoading(false);
      });
  }, []);

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
      if (form.totalBudget && (isNaN(form.totalBudget) || Number(form.totalBudget) < 0)) {
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
    const token = localStorage.getItem('token');
    if (!validateStep()) return;

    const projectPayload = {
      projectName: form.projectName,
      type: form.type,
      department: form.department,
      status: 'ACTIVE',
      budget: form.totalBudget ? Number(form.totalBudget) : 0,
      clientId: form.client !== 'others' ? Number(form.client) : 0,
      projectLeadId: form.projectLead ? Number(form.projectLead) : 0,
      contactName: form.contactName,
      contactPhone: form.contactPhone,
      projectRateCardId: null,
    };

    try {
      await axios.post('http://localhost:8080/api/projects', projectPayload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/projects');
    } catch (err) {
      console.error('❌ Error submitting project:', err);
      alert('Failed to create project');
    }
  };

  if (loading) return <div className="p-6">Loading form data...</div>;

  const Label = ({ children }) => (
    <label className="block text-sm mb-1 font-medium text-gray-700">
      {children} <span className="text-red-500">*</span>
    </label>
  );

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-indigo-700 mb-4">Add New Project</h2>

      <div className="flex items-center mb-6 space-x-2 text-sm text-gray-600">
        {stepLabels.map((s, i) => (
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

      <form className="space-y-4">
        {/* Step 0 */}
        {step === 0 && (
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Project Name</Label>
              <input
                name="projectName"
                value={form.projectName}
                onChange={handleChange}
                className={`w-full border px-3 py-2 rounded-md ${
                  errors.projectName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            <div>
              <Label>Type</Label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className={`w-full border px-3 py-2 rounded-md ${
                  errors.type ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">-- Select Type --</option>
                <option value="TFR">TFR</option>
                <option value="TNM">TNM</option>
              </select>
            </div>
            <div>
              <Label>Department</Label>
              <select
                name="department"
                value={form.department}
                onChange={handleChange}
                className={`w-full border px-3 py-2 rounded-md ${
                  errors.department ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">-- Select --</option>
                <option value="Engineering">Engineering</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="HR">HR</option>
                <option value="Banking">Banking</option>
              </select>
            </div>
            <div>
              <Label>Status</Label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-md border-gray-300"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="ON_HOLD">ON_HOLD</option>
              </select>
            </div>
          </div>
        )}

        {/* Step 1 */}
        {step === 1 && (
          <>
            <div>
              <Label>Client</Label>
              <select
                name="client"
                value={form.client}
                onChange={handleChange}
                className={`w-full border px-3 py-2 rounded-md ${
                  errors.client ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">-- Choose Client --</option>
                {clientsList.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            {form.client === 'others' && (
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>New Client Name</Label>
                  <input
                    name="newClientName"
                    value={form.newClientName}
                    onChange={handleChange}
                    className={`w-full border px-3 py-2 rounded-md ${
                      errors.newClientName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <input
                    type="email"
                    name="newClientEmail"
                    value={form.newClientEmail}
                    onChange={handleChange}
                    className={`w-full border px-3 py-2 rounded-md ${
                      errors.newClientEmail ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                <div>
                  <Label>Onboarded On</Label>
                  <input
                    type="date"
                    name="onboardedOn"
                    value={form.onboardedOn}
                    onChange={handleChange}
                    className={`w-full border px-3 py-2 rounded-md ${
                      errors.onboardedOn ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                <div>
                  <Label>Rating (1-5)</Label>
                  <input
                    name="rating"
                    value={form.rating}
                    onChange={handleChange}
                    className={`w-full border px-3 py-2 rounded-md ${
                      errors.rating ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
              </div>
            )}
          </>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Budget (₹)</Label>
              <input
                name="totalBudget"
                value={form.totalBudget}
                onChange={handleChange}
                className={`w-full border px-3 py-2 rounded-md ${
                  errors.totalBudget ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.totalBudget && <p className="text-sm text-red-600">{errors.totalBudget}</p>}
            </div>

            <div>
              <Label>Client SPOC Name</Label>
              <select
                name="contactName"
                value={form.contactName}
                onChange={(e) => {
                  const selectedId = e.target.value;
                  const selectedContact = contacts.find((c) => c.id.toString() === selectedId);
                  setForm({
                    ...form,
                    contactName: selectedContact?.name || '',
                    contactPhone: selectedContact?.phone || '',
                  });
                }}
                className="w-full border px-3 py-2 rounded-md border-gray-300"
              >
                <option value="">-- Select Contact Person --</option>
                {contacts.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label>Client SPOC Phone</Label>
              <input
                name="contactPhone"
                value={form.contactPhone}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-md border-gray-300"
              />
            </div>

            <div>
              <Label>Assign Project Lead</Label>
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
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
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
              type="button"
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
