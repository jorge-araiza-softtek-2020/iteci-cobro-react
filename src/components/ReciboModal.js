import React from "react";
import "./ReciboModal.css";

const ReciboModal = ({ recibo, onClose, onPagar }) => {
  if (!recibo) return null;

  const r = recibo;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>

        {/* Close button at top-right */}
        <button className="close-x" onClick={onClose}>×</button>

        <div className="recibo-titulo" >Recibo de Pago</div>

        <div className="modal-content">

          {/* TABLE INSTEAD OF <p> TAGS */}
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

        {/* Pagar button */}
        <button className="pay-btn" onClick={() => onPagar(r)}>
          💳 Pagar
        </button>

      </div>
    </div>
  );
};

export default ReciboModal;
