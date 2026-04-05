import React, { useState, useEffect } from "react";
import axios from "axios";
import "./StudentSearch.css";
import logo from '../logo.png';

import ReciboModal from "./ReciboModal"; // <-- NEW

const StudentSearch = () => {
  const [nombre, setNombre] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [recibo, setRecibo] = useState(null); // <-- NEW
  const [modalOpen, setModalOpen] = useState(false); // <-- NEW

  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [pendingRecibo, setPendingRecibo] = useState(null);

  const [waitingConfirmation, setWaitingConfirmation] = useState(false);

  const API_BASE_URL = 'http://localhost:8080'; // <-- IGNORE ---
  
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
        `${API_BASE_URL}/api/students/nombre`,
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
        `${API_BASE_URL}/api/students/recibo`,
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
          const validation = await axios.post(
            `${API_BASE_URL}/api/students/validar-pago-previo`,
            recibo
          );

          const message = validation.data;
          console.log("Validation data:", validation.data);
          console.log("Type of data:", typeof validation.data);

          await realizarPago(recibo);

        } catch (err) {
          const status = err.response?.status;
          const message = err.response?.data;

          if (status === 409 && typeof message === "string" && message.includes("ALERTA")) {
            // Conflict → show confirmation UI
            setNeedsConfirmation(true);
            setPendingRecibo(recibo);
            setWaitingConfirmation(true);
            return;
          }
          console.error(err);
          alert("Error: " + (err.response?.data || "No se pudo conectar con el servidor"));
        }
  };
const realizarPago = async (recibo) => {
  try {
    const pagoResponse = await axios.post(
      `${API_BASE_URL}/api/students/registrar-pago`,
      recibo
    );

    alert(pagoResponse.data);
    setModalOpen(false);

    // PDF download
    const pdfResponse = await fetch(
      "/api/students/recibo/pdf/" + recibo.folio
    );

    const blob = await pdfResponse.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `Recibo_${recibo.folio}.pdf`;
    a.click();

    window.URL.revokeObjectURL(url);

    setNeedsConfirmation(false);
    setPendingRecibo(null);

  } catch (err) {
    console.error(err);
    alert("Error realizando el pago: " + (err.response?.data || ""));
  } finally{
    setWaitingConfirmation(false);
  }
};


  return (
    <div style={{ padding: 20 }}>
     <div className="header-container">
      <img
        src={logo}
        alt="logo"
        width={240}
        height={250}
      />

      <div className="header-right">
        <p>Version 1.2 — Febrero 02 2026</p>
        <h2>Búsqueda de alumnos</h2>
        <input
          type="text"
          placeholder="Search by name"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
      </div>
       <img
        src={logo}
        alt="logo"
        width={240}
        height={250}
      />
    </div>



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
          waitingConfirmation={waitingConfirmation}
          
         
        />
      )}

      {needsConfirmation && (
        <div className="alerta-duplicado">
          <div className="alerta-box">
            <p>⚠️ El sistema detectó un posible pago duplicado.</p>

            <button
              className="btn-cancelar"
              onClick={() => {
                setNeedsConfirmation(false);
                setPendingRecibo(null);
                setWaitingConfirmation(false);
              }}
            >
              Cancelar
            </button>

            <button
              className="btn-confirmar"
              onClick={() => {realizarPago(pendingRecibo)
                 setNeedsConfirmation(false);
                setPendingRecibo(null);
                setWaitingConfirmation(true);
              }}
            >
              Confirmar Pago
            </button>
          </div>
        </div>
      )}



    </div>
  );
};

export default StudentSearch;
