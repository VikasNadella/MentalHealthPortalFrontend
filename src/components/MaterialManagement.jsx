import { useState, useEffect } from 'react';
import axios from 'axios';

const MaterialManagement = () => {
  const [materials, setMaterials] = useState([]);
  const [newMaterial, setNewMaterial] = useState({ title: '', type: 'music', url: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/materials', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setMaterials(response.data);
      } catch (err) {
        setError('Failed to fetch materials');
      }
    };
    fetchMaterials();
  }, []);

  const handleMaterialSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:3001/api/materials',
        newMaterial,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setMaterials([response.data, ...materials]);
      setNewMaterial({ title: '', type: 'music', url: '' });
      setError('');
    } catch (err) {
      setError('Failed to add material');
    }
  };

  const handleApprove = async (materialId) => {
    try {
      const response = await axios.put(
        `http://localhost:3001/api/materials/${materialId}/approve`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setMaterials(materials.map(material => material._id === materialId ? response.data : material));
      setError('');
    } catch (err) {
      setError('Failed to approve material');
    }
  };

  const styled = {
    container: {
      padding: '2rem',
    },
    form: {
      marginBottom: '2rem',
    },
    input: {
      width: '100%',
      padding: '0.8rem',
      margin: '0.5rem 0',
      border: '1px solid #ccc',
      borderRadius: '4px',
    },
    select: {
      width: '100%',
      padding: '0.8rem',
      margin: '0.5rem 0',
      border: '1px solid #ccc',
      borderRadius: '4px',
    },
    button: {
      padding: '0.8rem 1.5rem',
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      margin: '0.5rem 0',
    },
    material: {
      border: '1px solid #ccc',
      padding: '1rem',
      marginBottom: '1rem',
      borderRadius: '4px',
    },
    error: {
      color: 'red',
      fontSize: '0.9rem',
    },
  };

  return (
    <div style={styled.container}>
      <h2>Material Management</h2>
      {error && <p style={styled.error}>{error}</p>}
      <form style={styled.form} onSubmit={handleMaterialSubmit}>
        <input
          style={styled.input}
          type="text"
          placeholder="Title"
          value={newMaterial.title}
          onChange={(e) => setNewMaterial({ ...newMaterial, title: e.target.value })}
          required
        />
        <select
          style={styled.select}
          value={newMaterial.type}
          onChange={(e) => setNewMaterial({ ...newMaterial, type: e.target.value })}
        >
          <option value="music">Music</option>
          <option value="reading">Reading</option>
        </select>
        <input
          style={styled.input}
          type="url"
          placeholder="URL"
          value={newMaterial.url}
          onChange={(e) => setNewMaterial({ ...newMaterial, url: e.target.value })}
          required
        />
        <button style={styled.button} type="submit">Add Material</button>
      </form>
      {materials.map(material => (
        <div key={material._id} style={styled.material}>
          <p><strong>{material.title}</strong> ({material.type})</p>
          <p><a href={material.url} target="_blank" rel="noopener noreferrer">{material.url}</a></p>
          <p>Submitted by: {material.user.fullName}</p>
          <p>Status: {material.isApproved ? 'Approved' : 'Pending'}</p>
          {localStorage.getItem('token') && JSON.parse(atob(localStorage.getItem('token').split('.')[1])).isPsychiatrist && !material.isApproved && (
            <button
              style={styled.button}
              onClick={() => handleApprove(material._id)}
            >
              Approve
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default MaterialManagement;