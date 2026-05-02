/**
 * Layer Desktop — Form primitives
 * --------------------------------------------------------------
 * Figma nodes: 318:16096 (fieldLabel), 174:2 / 174:2202 (groups), 8096:4360 (forms)
 *
 * Field — label + input + helper 통합
 * FormCard — 카드 컨테이너
 * FormRow  — 라벨/입력 grid layout
 *
 * Usage:
 *   <Field label="SKU 명" required helper="100자 이내">
 *     <TextField placeholder="입력하세요" />
 *   </Field>
 *
 *   <FormCard title="기본 정보" meta="필수 항목 *">
 *     <FormRow label="SKU 명" required>
 *       <TextField />
 *     </FormRow>
 *     <FormRow label="카테고리">
 *       <Select options={[...]} />
 *     </FormRow>
 *   </FormCard>
 */
import React from 'react';

// ============================================================
// Field — label + helper + child input
// ============================================================
export function Field({
  label,
  required = false,
  optional = false,
  info,
  helper,
  invalid = false,
  className = '',
  children,
  htmlFor,
  ...rest
}) {
  const successHelper = !invalid && rest.success;
  return (
    <div className={`ld-field ${className}`}>
      {label ? (
        <label className="ld-field-label" htmlFor={htmlFor}>
          {label}
          {required ? <span className="ld-field-required">*</span> : null}
          {optional ? <span className="ld-field-optional">(선택)</span> : null}
          {info ? <span className="ld-field-info" title={typeof info === 'string' ? info : undefined}>ⓘ</span> : null}
        </label>
      ) : null}
      {children}
      {helper ? (
        <p className={`ld-helper ${invalid ? 'ld-helper-critical' : ''} ${successHelper ? 'ld-helper-success' : ''}`}>{helper}</p>
      ) : null}
    </div>
  );
}

// ============================================================
// FormCard — 카드 컨테이너 + 헤더 + 내부 폼 행
// ============================================================
export function FormCard({ title, meta, actions, className = '', children, ...rest }) {
  return (
    <section className={`ld-form-card ${className}`} {...rest}>
      {(title || actions) ? (
        <header className="ld-form-card-header">
          <div>
            {title ? <h3 className="ld-form-card-title">{title}</h3> : null}
            {meta ? <p className="ld-form-card-meta">{meta}</p> : null}
          </div>
          {actions ? <div style={{ display: 'flex', gap: 8 }}>{actions}</div> : null}
        </header>
      ) : null}
      <div>{children}</div>
    </section>
  );
}

// ============================================================
// FormRow — 라벨/입력 2-column grid
// ============================================================
export function FormRow({ label, required = false, optional = false, helper, invalid = false, info, className = '', children, ...rest }) {
  return (
    <div className={`ld-form-row ${className}`} {...rest}>
      <div>
        {label ? (
          <label className="ld-field-label">
            {label}
            {required ? <span className="ld-field-required">*</span> : null}
            {optional ? <span className="ld-field-optional">(선택)</span> : null}
            {info ? <span className="ld-field-info" title={typeof info === 'string' ? info : undefined}>ⓘ</span> : null}
          </label>
        ) : null}
      </div>
      <div>
        {children}
        {helper ? (
          <p className={`ld-helper ${invalid ? 'ld-helper-critical' : ''}`} style={{ marginTop: 6 }}>{helper}</p>
        ) : null}
      </div>
    </div>
  );
}

export default Field;
