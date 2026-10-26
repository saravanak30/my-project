import { useState } from 'react';
import {
  Link,
  Route,
  Routes,
  useParams,
} from 'react-router';

const internships = [
  {
    id: 1,
    title: 'Frontend Developer Intern',
    company: 'Bright Labs',
    location: 'Remote',
    description: 'Build user interfaces and learn modern frontend development.',
  },
  {
    id: 2,
    title: 'Backend Developer Intern',
    company: 'Northstar Tech',
    location: 'Coimbatore',
    description: 'Work with APIs, databases, and server-side JavaScript.',
  },
  {
    id: 3,
    title: 'Data Analyst Intern',
    company: 'Greenfield Analytics',
    location: 'Chennai',
    description: 'Explore datasets and help turn information into insights.',
  },
];

function InternshipList() {
  return (
    <main>
      <h1>Student Internship Portal</h1>
      <p>Explore internships and find one that fits your interests.</p>

      {internships.map((internship) => (
        <article key={internship.id}>
          <h2>{internship.title}</h2>
          <p>
            {internship.company} · {internship.location}
          </p>
          <Link to={`/internships/${internship.id}`}>View details</Link>
        </article>
      ))}
    </main>
  );
}

function InternshipDetails() {
  const { id } = useParams();
  const internship = internships.find((item) => item.id === Number(id));

  if (!internship) {
    return (
      <main>
        <h1>Internship not found</h1>
        <Link to="/">Back to internships</Link>
      </main>
    );
  }

  return (
    <main>
      <Link to="/">← Back to internships</Link>
      <h1>{internship.title}</h1>
      <p>
        <strong>Company:</strong> {internship.company}
      </p>
      <p>
        <strong>Location:</strong> {internship.location}
      </p>
      <p>{internship.description}</p>
      <Link to={`/apply/${internship.id}`}>Apply for this internship</Link>
    </main>
  );
}

function ApplicationForm() {
  const { id } = useParams();
  const initialInternship = internships.find(
    (item) => item.id === Number(id),
  );
  const [message, setMessage] = useState('');
  const [selectedId, setSelectedId] = useState(id);

  if (!initialInternship) {
    return (
      <main>
        <h1>Internship not found</h1>
        <Link to="/">Back to internships</Link>
      </main>
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const internshipId = Number(formData.get('internshipId'));
    const selectedInternship = internships.find(
      (item) => item.id === internshipId,
    );

    if (!selectedInternship) {
      setMessage('Please select an internship.');
      return;
    }

    const application = {
      name: String(formData.get('name') || '').trim(),
      email: String(formData.get('email') || '').trim(),
      rollNumber: String(formData.get('rollNumber') || '').trim(),
      internship: `${selectedInternship.title} — ${selectedInternship.company}`,
    };

    setMessage('Submitting application...');

    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(application),
      });

      const result = await response.json();

      if (!response.ok) {
        const details = result.errors?.join(' ');
        throw new Error(
          details || result.message || 'Could not submit the application.',
        );
      }

      setMessage(result.message || 'Application submitted successfully.');
    } catch (error) {
      setMessage(
        error.message || 'Could not reach the server. Please try again.',
      );
    }
  }

  return (
    <main>
      <Link to={`/internships/${id}`}>← Back to internship details</Link>
      <h1>Apply for an internship</h1>

      <form onSubmit={handleSubmit}>
        <p>
          <label>
            Student name
            <br />
            <input name="name" type="text" required />
          </label>
        </p>

        <p>
          <label>
            Email address
            <br />
            <input name="email" type="email" required />
          </label>
        </p>

        <p>
          <label>
            Roll number
            <br />
            <input name="rollNumber" type="text" required />
          </label>
        </p>

        <p>
          <label>
            Selected internship
            <br />
            <select
              name="internshipId"
              value={selectedId}
              onChange={(event) => setSelectedId(event.target.value)}
              required
            >
              {internships.map((internship) => (
                <option key={internship.id} value={internship.id}>
                  {internship.title} — {internship.company}
                </option>
              ))}
            </select>
          </label>
        </p>

        <button type="submit">Submit application</button>
      </form>

      {message && <p role="status">{message}</p>}
    </main>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<InternshipList />} />
      <Route path="/internships/:id" element={<InternshipDetails />} />
      <Route path="/apply/:id" element={<ApplicationForm />} />
    </Routes>
  );
}

export default App;