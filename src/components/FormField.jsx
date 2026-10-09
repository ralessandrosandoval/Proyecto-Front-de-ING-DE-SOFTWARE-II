// Etiqueta + campo + mensaje de error
export default function FormField({ label, htmlFor, error, children }) {
  return (
    <div className="form-field">
      <label htmlFor={htmlFor}>{label}</label>
      {children}
      {error && <p className="field-error">{error}</p>}
    </div>
  )
}
