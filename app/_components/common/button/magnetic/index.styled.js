'use client';

import { styled } from 'styled-components';

export const MagneticItem = styled.span`
  position: relative;
  z-index: 1;
  display: block;
  width: max-content;
  max-width: 14ch;
  word-break: break-all;

  button[data-no-wrap='true'] & {
    max-width: none;
    white-space: nowrap;
    word-break: normal;
  }
`;
