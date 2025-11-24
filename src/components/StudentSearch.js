import React, { useState, useEffect } from "react";
import axios from "axios";
import "./StudentSearch.css";

import ReciboModal from "./ReciboModal"; // <-- NEW

const StudentSearch = () => {
  const [nombre, setNombre] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [recibo, setRecibo] = useState(null); // <-- NEW
  const [modalOpen, setModalOpen] = useState(false); // <-- NEW

  useEffect(() => {
    if (!nombre.trim()) {
      setStudents([]);
      setError("");
      return;
    }

    const timeout = setTimeout(() => {
      searchStudents(nombre);
    }, 400);

    return () => clearTimeout(timeout);
  }, [nombre]);

  const searchStudents = async (text) => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(
        "http://localhost:8080/api/students/nombre",
        { params: { nombre: text } }
      );

      setStudents(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch students.");
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = async (id) => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/students/recibo",
        { params: { id } }
      );

      const reciboData = response.data?.[0];
      if (!reciboData) {
        alert("No recibo found!");
        return;
      }

      setRecibo(reciboData);
      setModalOpen(true);
    } catch (err) {
      console.error(err);
      alert("Error fetching recibo!");
    }
  };

  

    const handlePagar = async (recibo) => {
      console.log("Recibo recibido:", recibo);

      try {
        const response = await axios.post(
          "http://localhost:8080/api/students/pagar",
          recibo
        );

        alert(response.data); // shows the backend success message
        setModalOpen(false);

      } catch (err) {
        console.error(err);

        if (err.response) {
          // Server sent a non-200 error
          alert("Error: " + err.response.data);
        } else {
          // Network error, CORS, etc.
          alert("Error realizando el pago (no se pudo conectar con el servidor)");
        }
      }
    };



  return (
    <div style={{ padding: 20 }}>
      <input
        type="text"
        placeholder="Search by name"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />

      {loading && <p>Searching...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <table className="students-table">
        <thead>
          <tr>
            <th>Name</th>
          </tr>
        </thead>

        <tbody>
          {students.map((s, index) => (
            <tr
              key={s.id}
              className="table-row"
              onClick={() => handleRowClick(s.id)}
            >
              <td>{s.fullName}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalOpen && (
        <ReciboModal
          recibo={recibo}
          onClose={() => setModalOpen(false)}

          // NEW — pagar handler
          onPagar={handlePagar}
          
         
        />
      )}

    </div>
  );
};

export default StudentSearch;
