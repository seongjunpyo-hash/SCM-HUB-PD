/**
 * Layer Desktop — Button / IconButton / TextButton
 * --------------------------------------------------------------
 * Figma nodes:
 *   - 3:44      (Button: primary/secondary/negative)
 *   - 133:8819  (textButton)
 *   - 117:4880  (iconButton — 6 size)
 *
 * variant:    primary | accent | secondary | negative
 * appearance: filled (기본) | outlined | ghost
 * size:       xs(32) | sm(36) | md(40) | lg(44) | xl(52)
 *
 * Usage:
 *   <Button>확인</Button>
 *   <Button variant="accent">자세히</Button>
 *   <Button variant="secondary" appearance="outlined">취소</Button>
 *   <Button variant="negative" appearance="ghost" leftIcon={<TrashIcon/>}>삭제</Button>
 *   <Button as="a" href="/x">링크 버튼</Button>
 *
 *   <IconButton aria-label="검색" icon={<SearchIcon/>} size="md" />
 *   <TextButton variant="accent">자세히 보기</TextButton>
 */
import React from 'react';

const SIZE_CLASS = {
  xs: 'ld-btn-xs',
  sm: 'ld-btn-sm',
  md: 'ld-btn-md',
  lg: 'ld-btn-lg',
  xl: 'ld-btn-xl',
};

const VARIANT_APPEARANCE = {
  primary:   { filled: 'ld-btn-primary',   outlined: 'ld-btn-primary-outlined',   ghost: 'ld-btn-ghost' },
  accent:    { filled: 'ld-btn-accent',    outlined: 'ld-btn-accent-outlined',    ghost: 'ld-btn-ghost' },
  secondary: { filled: 'ld-btn-secondary', outlined: 'ld-btn-secondary-outlined', ghost: 'ld-btn-ghost' },
  negative:  { filled: 'ld-btn-negative',  outlined: 'ld-btn-negative-outlined',  ghost: 'ld-btn-ghost' },
};

export function Button({
  as: Comp = 'button',
  variant = 'primary',
  appearance = 'filled',
  size = 'md',
  leftIcon,
  rightIcon,
  loading = false,
  fullWidth = false,
  disabled,
  className = '',
  children,
  ...rest
}) {
  const variantCls = VARIANT_APPEARANCE[variant]?.[appearance] || VARIANT_APPEARANCE.primary.filled;
  const sizeCls    = SIZE_CLASS[size] || SIZE_CLASS.md;
  const cls = ['ld-btn', sizeCls, variantCls, className].filter(Boolean).join(' ');
  const isButton = Comp === 'button';

  return (
    <Comp
      className={cls}
      disabled={isButton ? (disabled || loading) : undefined}
      aria-disabled={!isButton && (disabled || loading) ? true : undefined}
      aria-busy={loading || undefined}
      style={fullWidth ? { width: '100%' } : undefined}
      {...rest}
    >
      {loading ? <Spinner size={size} /> : leftIcon ? <span aria-hidden>{leftIcon}</span> : null}
      <span>{children}</span>
      {rightIcon ? <span aria-hidden>{rightIcon}</span> : null}
    </Comp>
  );
}

// ============================================================
// IconButton — 정사각형, 아이콘만
// ============================================================
const ICON_BTN_SIZE = {
  xxs: { box: 20, icon: 16 },
  xs:  { box: 24, icon: 16 },
  s:   { box: 32, icon: 20 },
  md:  { box: 36, icon: 24 },
  l:   { box: 40, icon: 24 },
  xl:  { box: 44, icon: 24 },
};

export function IconButton({
  variant = 'secondary',
  appearance = 'ghost',
  size = 'md',
  icon,
  className = '',
  ...rest
}) {
  const variantCls = VARIANT_APPEARANCE[variant]?.[appearance] || VARIANT_APPEARANCE.secondary.ghost;
  const cls = ['ld-btn', variantCls, className].filter(Boolean).join(' ');
  const { box, icon: iconSize } = ICON_BTN_SIZE[size] || ICON_BTN_SIZE.md;
  return (
    <button
      type="button"
      className={cls}
      style={{ width: box, height: box, padding: 0, minWidth: box }}
      {...rest}
    >
      <span aria-hidden style={{ width: iconSize, height: iconSize, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </span>
    </button>
  );
}

// ============================================================
// TextButton — 텍스트만, 밑줄 없음, 색상 변형
// ============================================================
const TEXT_BTN_VARIANT = {
  primary:   { fg: 'var(--ld-fg)',          fgHover: 'var(--ld-fg-low)' },
  secondary: { fg: 'var(--ld-fg-low)',      fgHover: 'var(--ld-fg-lower)' },
  accent:    { fg: 'var(--ld-fg-accent)',   fgHover: 'rgba(36, 94, 255, 0.9)' },
  negative:  { fg: 'var(--ld-fg-critical)', fgHover: 'rgba(243, 17, 16, 0.9)' },
};

export function TextButton({
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  disabled = false,
  className = '',
  children,
  style: externalStyle,
  ...rest
}) {
  const v = TEXT_BTN_VARIANT[variant] || TEXT_BTN_VARIANT.primary;
  const sizeStyle = {
    xs: { fontSize: 13, fontWeight: 400, height: 24 },
    sm: { fontSize: 13, fontWeight: 500, height: 28 },
    md: { fontSize: 14, fontWeight: 500, height: 32 },
    lg: { fontSize: 15, fontWeight: 500, height: 36 },
  }[size] || {};
  return (
    <button
      type="button"
      disabled={disabled}
      className={className}
      style={{
        all: 'unset',
        display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: '0 4px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        color: disabled ? 'var(--ld-fg-disabled)' : v.fg,
        fontFamily: 'var(--ld-font-family-base)',
        ...sizeStyle,
        ...externalStyle,
      }}
      onMouseEnter={(e) => !disabled && (e.currentTarget.style.color = v.fgHover)}
      onMouseLeave={(e) => !disabled && (e.currentTarget.style.color = v.fg)}
      {...rest}
    >
      {leftIcon ? <span aria-hidden>{leftIcon}</span> : null}
      <span>{children}</span>
      {rightIcon ? <span aria-hidden>{rightIcon}</span> : null}
    </button>
  );
}

// ============================================================
// Spinner (loading 상태)
// ============================================================
function Spinner({ size = 'md' }) {
  const dim = ({ xs: 12, sm: 14, md: 14, lg: 16, xl: 16 })[size] || 14;
  return (
    <span
      aria-hidden
      style={{
        width: dim, height: dim,
        border: '2px solid currentColor',
        borderRightColor: 'transparent',
        borderRadius: '50%',
        display: 'inline-block',
        animation: 'ld-spin 0.7s linear infinite',
      }}
    />
  );
}

// 스피너 keyframes 주입 (한 번만)
if (typeof document !== 'undefined' && !document.getElementById('ld-spin-keyframes')) {
  const style = document.createElement('style');
  style.id = 'ld-spin-keyframes';
  style.textContent = '@keyframes ld-spin{to{transform:rotate(360deg)}}';
  document.head.appendChild(style);
}

export default Button;
