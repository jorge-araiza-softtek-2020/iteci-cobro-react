import React, { useState } from "react";
import "./ReciboModal.css";

const ReciboModal = ({ recibo, onClose, onPagar, waitingConfirmation }) => {
  const [loading, setLoading] = useState(false);
  const [montoEdit, setMontoEdit] = useState(false);
  const [montoNuevo, setMontoNuevo] = useState(recibo ? recibo.monto : 0);

  console.log("Alumnos recibido {}", recibo);
  if (!recibo) return null;
  const r = recibo;

  const handlePagar = async () => {
    setLoading(true); // Show spinner + disable button
    try {
      await onPagar({
        ...r,
        montoModificado: Number(montoNuevo),
        montoEditado: montoNuevo !== r.monto,
      });
    } catch (err) {
      console.error("Error al pagar:", err);
      alert("Ocurrió un error al procesar el pago.");
    }

    setLoading(false); // Restore UI
  };

  return (
    <div className="modal-overlay" onClick={loading ? null : onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-x" onClick={loading ? null : onClose}>
          ×
        </button>

        <div className="recibo-titulo">Recibo de Pago</div>

        <div className="modal-content">
          <table className="recibo-table">
            <tbody>
              <tr className="monto-row">
                <th>Alumno</th>
                <td>
                  {r.nombre} {r.apellidoPaterno} {r.apellidoMaterno}
                </td>
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
                {montoEdit ? (
                  <td>
                    <input
                      type="number"
                      value={montoNuevo}
                      onChange={(e) => setMontoNuevo(e.target.value)}
                      style={montoInputStyle}
                    />
                    <br />
                    <button
                      onClick={() => {
                        if (montoNuevo.valueOf() <= 0) {
                          alert("El monto debe ser mayor a 0");
                          return;
                        }
                        setMontoNuevo(montoNuevo);
                        setMontoEdit(false);
                        setLoading(false);
                      }}
                    >
                      Guardar
                    </button>
                    <button
                      onClick={() => {
                        setMontoEdit(false);
                        setLoading(false);
                        setMontoNuevo(r.monto);
                      }}
                    >
                      Cancelar
                    </button>
                  </td>
                ) : (
                  <td>
                    ${montoNuevo} <br />
                    <button
                      onClick={() => {
                        setMontoEdit(true);
                        setLoading(true);
                      }}
                    >
                      Editar
                    </button>
                  </td>
                )}
              </tr>
              <tr>
                <th>Semana</th>
                <td>Pago de semana # {r.numeroSemana}</td>
              </tr>
              <tr>
                <th>Folio</th>
                <td>{r.folio}</td>
              </tr>
              <tr>
                <th>Observaciones</th>
                <td>{r.observaciones}</td>
              </tr>
              <tr>
                <th>Semana actual</th>
                <td>Estamos en semana # {r.semanaActual}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* PAY BUTTON WITH LOADING STATE */}
        <button
          className={`pay-btn ${loading || waitingConfirmation ? "disabled" : ""}`}
          onClick={loading || waitingConfirmation ? null : handlePagar}
          disabled={loading || waitingConfirmation}
        >
          {loading ? (
            <>
              <span className="spinner"></span> Procesando...
            </>
          ) : waitingConfirmation ? (
            "Esperando confirmación..."
          ) : (
            <>💳 Pagar</>
          )}
        </button>
      </div>
    </div>
  );
};

const montoInputStyle = {
  fontSize: "1.2rem",
  fontWeight: "bold",
  padding: "4px 8px",
  width: "100px",
  borderRadius: "4px",
  border: "1px solid #ccc",
  textAlign: "right",
};
export default ReciboModal;
