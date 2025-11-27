import React, { useState } from "react";
import "./ReciboModal.css";

const ReciboModal = ({ recibo, onClose, onPagar }) => {
  const [loading, setLoading] = useState(false);

  if (!recibo) return null;
  const r = recibo;

  const handlePagar = async () => {
    setLoading(true);            // Show spinner + disable button

    try {
      await onPagar(r);          // Call parent async logic (DB + print)
    } catch (err) {
      console.error("Error al pagar:", err);
      alert("Ocurrió un error al procesar el pago.");
    }

    setLoading(false);           // Restore UI
  };

  return (
    <div className="modal-overlay" onClick={loading ? null : onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>

        <button className="close-x" onClick={loading ? null : onClose}>×</button>

        <div className="recibo-titulo">Recibo de Pago</div>

        <div className="modal-content">
          <table className="recibo-table">
            <tbody>
              <tr className="monto-row">
                <th>Alumno</th>
                <td>{r.nombre} {r.apellidoPaterno} {r.apellidoMaterno}</td>
              </tr>
              <tr>
                <th>Teléfono</th>
                <td>{r.telefono}</td>
              </tr>
              <tr>
                <th>Grupo</th>
                <td>{r.idGrupo}</td>
              </tr>
              <tr>
                <th>Día</th>
                <td>{r.diaSemana}</td>
              </tr>
              <tr>
                <th>Hora Inicio</th>
                <td>{r.horaInicio}</td>
              </tr>
              <tr>
                <th>Modalidad</th>
                <td>{r.modalidad}</td>
              </tr>
              <tr className="monto-row">
                <th>Monto</th>
                <td>${r.monto}</td>
              </tr>
              <tr>
                <th>Semana</th>
                <td>{r.numeroSemana}</td>
              </tr>
              <tr>
                <th>Folio</th>
                <td>{r.folio}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* PAY BUTTON WITH LOADING STATE */}
        <button
          className={`pay-btn ${loading ? "disabled" : ""}`}
          onClick={loading ? null : handlePagar}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner"></span> Procesando...
            </>
          ) : (
            <>
              💳 Pagar
            </>
          )}
        </button>

      </div>
    </div>
  );
};

export default ReciboModal;
