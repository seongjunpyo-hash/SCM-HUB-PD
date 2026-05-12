/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable no-unused-vars */
/**
 *  radix-ui 방식
 *  https://github.com/radix-ui/primitives/blob/7101e7d6efb2bff13cc6761023ab85aeec73539e/packages/react/polymorphic/src/forwardRefWithAs.ts
 */
import type React from 'react';
import type { ComponentPropsWithRef, ElementType, ForwardRefExoticComponent, ReactElement } from 'react';

type Merge<P1 = {}, P2 = {}> = Omit<P1, keyof P2> & P2;

type MergeProps<E, P = {}> = P & Merge<E extends ElementType ? ComponentPropsWithRef<E> : never, P>;

/**
 *  완벽하게 잡을 순 없음
 *  - 실제 <div> HTMLInputElement ref를 넣어도 오류발생 X
 *  - 기본 html tag에 기반한 타입추론까지만 가능함
 */
export interface PolymorphicComponentWithForwardRef<IntrinsicElementString, OwnProps = {}>
  extends ForwardRefExoticComponent<MergeProps<IntrinsicElementString, OwnProps & { as?: IntrinsicElementString }>> {
  <As extends keyof React.JSX.IntrinsicElements>(props: MergeProps<As, OwnProps & { as: As }>): ReactElement | null;

  <As extends ElementType<unknown>, _AsWithProps = As extends ElementType<infer P> ? ElementType<P> : never>(
    props: MergeProps<_AsWithProps, OwnProps & { as: _AsWithProps }>,
  ): ReactElement | null;
}
