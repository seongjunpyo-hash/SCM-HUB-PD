/**
 * Layer Desktop — Tag / StatusTag / LabelTag
 * --------------------------------------------------------------
 * StatusTag: 상태 표시 (success / warning / critical / progress 1~3 / default)
 * LabelTag:  컬러 라벨 (gray / blue / green / red / yellow)
 * FilterTag: 필터 토글
 */
import React from 'react';

// ============================================================
// StatusTag — 상태 (진행 단계 / 결과)
// ============================================================
const STATUS_VARIANTS = {
  default:   'ld-status-tag-default',
  progress1: 'ld-status-tag-progress-1',
  progress2: 'ld-status-tag-progress-2',
  progress3: 'ld-status-tag-progress-3',
  success:   'ld-status-tag-success',
  warning:   'ld-status-tag-warning',
  critical:  'ld-status-tag-critical',
};

const SIZE_CLASS = {
  xs: 'ld-status-tag-xs',
  s:  '',
  m:  'ld-status-tag-m',
};

export function StatusTag({ variant = 'default', size = 's', className = '', children, ...rest }) {
  const cls = [
    'ld-status-tag',
    STATUS_VARIANTS[variant] || STATUS_VARIANTS.default,
    SIZE_CLASS[size] || '',
    className,
  ].filter(Boolean).join(' ');
  return <span className={cls} {...rest}>{children}</span>;
}

// ============================================================
// LabelTag — 단순 컬러 라벨
// ============================================================
const LABEL_BG = {
  gray:   'var(--ld-lt-bg-gray)',
  blue:   'var(--ld-lt-bg-blue)',
  green:  'var(--ld-lt-bg-green)',
  red:    'var(--ld-lt-bg-red)',
  yellow: 'var(--ld-lt-bg-yellow)',
};

const LABEL_HEIGHT = { xs: 20, s: 24, m: 28 };
const LABEL_FONT_SIZE = { xs: 12, s: 13, m: 14 };

export function LabelTag({ color = 'gray', size = 'xs', className = '', children, ...rest }) {
  const style = {
    display: 'inline-flex',
    alignItems: 'center',
    height: `${LABEL_HEIGHT[size]}px`,
    padding: '0 8px',
    background: LABEL_BG[color] || LABEL_BG.gray,
    color: 'var(--ld-lt-fg)',
    fontSize: `${LABEL_FONT_SIZE[size]}px`,
    fontWeight: 500,
    lineHeight: size === 'xs' ? 1.5 : (size === 'm' ? 1.4 : 1.5),
    borderRadius: 'var(--ld-radius-xs)',
    border: color === 'gray' ? '1px solid var(--ld-border-low)' : 'none',
  };
  return <span className={className} style={style} {...rest}>{children}</span>;
}

// ============================================================
// FilterTag — 토글 가능한 필터
// ============================================================
export function FilterTag({ selected = false, disabled = false, onClick, className = '', children, ...rest }) {
  const cls = ['ld-tag-filter', className].filter(Boolean).join(' ');
  return (
    <button
      type="button"
      className={cls}
      aria-pressed={selected || undefined}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
}

// ============================================================
// RemovableTag — 닫기(×) 버튼이 달린 태그
// ============================================================
const REMOVABLE_SIZE_CLASS = {
  xs: 'ld-tag-removable-xs',
  s:  'ld-tag-removable-s',
  m:  'ld-tag-removable-m',
};

export function RemovableTag({
  size = 's',
  onRemove,
  removable = true,
  className = '',
  children,
  ...rest
}) {
  const cls = [
    'ld-tag-removable',
    REMOVABLE_SIZE_CLASS[size] || REMOVABLE_SIZE_CLASS.s,
    className,
  ].filter(Boolean).join(' ');
  return (
    <span className={cls} {...rest}>
      <span>{children}</span>
      {removable ? (
        <button
          type="button"
          className="ld-tag-remove"
          aria-label="태그 제거"
          onClick={onRemove}
        >
          ×
        </button>
      ) : null}
    </span>
  );
}

export default StatusTag;
