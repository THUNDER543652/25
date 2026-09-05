'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import SiteHeader from '@/components/ui/SiteHeader';
import SiteFooter from '@/components/ui/SiteFooter';

// ─── Types ────────────────────────────────────────────────────────────────────

type Platform = 'windows' | 'macos' | 'linux';
type Region = 'ansi' | 'iso';
type Theme = 'dark' | 'light';
type LayoutId =
  | 'full' |'96' |'tkl' |'75' |'68' |'65' |'60' |'40' |'mac' |'macbook' |'laptop' |'compact';

interface KeyDef {
  code: string;
  label: string;
  altLabel?: string;
  width?: number; // in units (1 = ~1u)
  height?: number;
  isSpecial?: boolean;
}

interface KeyRow {
  keys: KeyDef[];
  marginLeft?: number;
}

interface KeyboardLayout {
  id: LayoutId;
  name: string;
  rows: KeyRow[];
  hasNumpad?: boolean;
  numpadRows?: KeyRow[];
}

// ─── Layout Definitions ───────────────────────────────────────────────────────

const FULL_SIZE_ROWS_WINDOWS_ANSI: KeyRow[] = [
  {
    keys: [
      { code: 'Escape', label: 'Esc', width: 1 },
      { code: 'F1', label: 'F1', width: 1 },
      { code: 'F2', label: 'F2', width: 1 },
      { code: 'F3', label: 'F3', width: 1 },
      { code: 'F4', label: 'F4', width: 1 },
      { code: 'F5', label: 'F5', width: 1 },
      { code: 'F6', label: 'F6', width: 1 },
      { code: 'F7', label: 'F7', width: 1 },
      { code: 'F8', label: 'F8', width: 1 },
      { code: 'F9', label: 'F9', width: 1 },
      { code: 'F10', label: 'F10', width: 1 },
      { code: 'F11', label: 'F11', width: 1 },
      { code: 'F12', label: 'F12', width: 1 },
      { code: 'PrintScreen', label: 'PrtSc', width: 1 },
      { code: 'ScrollLock', label: 'Scrl', width: 1 },
      { code: 'Pause', label: 'Pause', width: 1 },
    ],
  },
  {
    keys: [
      { code: 'Backquote', label: '`', altLabel: '~', width: 1 },
      { code: 'Digit1', label: '1', altLabel: '!', width: 1 },
      { code: 'Digit2', label: '2', altLabel: '@', width: 1 },
      { code: 'Digit3', label: '3', altLabel: '#', width: 1 },
      { code: 'Digit4', label: '4', altLabel: '$', width: 1 },
      { code: 'Digit5', label: '5', altLabel: '%', width: 1 },
      { code: 'Digit6', label: '6', altLabel: '^', width: 1 },
      { code: 'Digit7', label: '7', altLabel: '&', width: 1 },
      { code: 'Digit8', label: '8', altLabel: '*', width: 1 },
      { code: 'Digit9', label: '9', altLabel: '(', width: 1 },
      { code: 'Digit0', label: '0', altLabel: ')', width: 1 },
      { code: 'Minus', label: '-', altLabel: '_', width: 1 },
      { code: 'Equal', label: '=', altLabel: '+', width: 1 },
      { code: 'Backspace', label: 'Backspace', width: 2 },
      { code: 'Insert', label: 'Ins', width: 1 },
      { code: 'Home', label: 'Home', width: 1 },
      { code: 'PageUp', label: 'PgUp', width: 1 },
    ],
  },
  {
    keys: [
      { code: 'Tab', label: 'Tab', width: 1.5 },
      { code: 'KeyQ', label: 'Q', width: 1 },
      { code: 'KeyW', label: 'W', width: 1 },
      { code: 'KeyE', label: 'E', width: 1 },
      { code: 'KeyR', label: 'R', width: 1 },
      { code: 'KeyT', label: 'T', width: 1 },
      { code: 'KeyY', label: 'Y', width: 1 },
      { code: 'KeyU', label: 'U', width: 1 },
      { code: 'KeyI', label: 'I', width: 1 },
      { code: 'KeyO', label: 'O', width: 1 },
      { code: 'KeyP', label: 'P', width: 1 },
      { code: 'BracketLeft', label: '[', altLabel: '{', width: 1 },
      { code: 'BracketRight', label: ']', altLabel: '}', width: 1 },
      { code: 'Backslash', label: '\\', altLabel: '|', width: 1.5 },
      { code: 'Delete', label: 'Del', width: 1 },
      { code: 'End', label: 'End', width: 1 },
      { code: 'PageDown', label: 'PgDn', width: 1 },
    ],
  },
  {
    keys: [
      { code: 'CapsLock', label: 'Caps Lock', width: 1.75 },
      { code: 'KeyA', label: 'A', width: 1 },
      { code: 'KeyS', label: 'S', width: 1 },
      { code: 'KeyD', label: 'D', width: 1 },
      { code: 'KeyF', label: 'F', width: 1 },
      { code: 'KeyG', label: 'G', width: 1 },
      { code: 'KeyH', label: 'H', width: 1 },
      { code: 'KeyJ', label: 'J', width: 1 },
      { code: 'KeyK', label: 'K', width: 1 },
      { code: 'KeyL', label: 'L', width: 1 },
      { code: 'Semicolon', label: ';', altLabel: ':', width: 1 },
      { code: 'Quote', label: "'", altLabel: '"', width: 1 },
      { code: 'Enter', label: 'Enter', width: 2.25 },
    ],
  },
  {
    keys: [
      { code: 'ShiftLeft', label: 'Shift', width: 2.25 },
      { code: 'KeyZ', label: 'Z', width: 1 },
      { code: 'KeyX', label: 'X', width: 1 },
      { code: 'KeyC', label: 'C', width: 1 },
      { code: 'KeyV', label: 'V', width: 1 },
      { code: 'KeyB', label: 'B', width: 1 },
      { code: 'KeyN', label: 'N', width: 1 },
      { code: 'KeyM', label: 'M', width: 1 },
      { code: 'Comma', label: ',', altLabel: '<', width: 1 },
      { code: 'Period', label: '.', altLabel: '>', width: 1 },
      { code: 'Slash', label: '/', altLabel: '?', width: 1 },
      { code: 'ShiftRight', label: 'Shift', width: 2.75 },
      { code: 'ArrowUp', label: '↑', width: 1 },
    ],
  },
  {
    keys: [
      { code: 'ControlLeft', label: 'Ctrl', width: 1.25 },
      { code: 'MetaLeft', label: 'Win', width: 1.25 },
      { code: 'AltLeft', label: 'Alt', width: 1.25 },
      { code: 'Space', label: '', width: 6.25 },
      { code: 'AltRight', label: 'Alt', width: 1.25 },
      { code: 'MetaRight', label: 'Win', width: 1.25 },
      { code: 'ContextMenu', label: '☰', width: 1.25 },
      { code: 'ControlRight', label: 'Ctrl', width: 1.25 },
      { code: 'ArrowLeft', label: '←', width: 1 },
      { code: 'ArrowDown', label: '↓', width: 1 },
      { code: 'ArrowRight', label: '→', width: 1 },
    ],
  },
];

const FULL_SIZE_ROWS_WINDOWS_ISO: KeyRow[] = [
  FULL_SIZE_ROWS_WINDOWS_ANSI[0],
  {
    keys: [
      { code: 'Backquote', label: '`', altLabel: '¬', width: 1 },
      { code: 'Digit1', label: '1', altLabel: '!', width: 1 },
      { code: 'Digit2', label: '2', altLabel: '"', width: 1 },
      { code: 'Digit3', label: '3', altLabel: '£', width: 1 },
      { code: 'Digit4', label: '4', altLabel: '$', width: 1 },
      { code: 'Digit5', label: '5', altLabel: '%', width: 1 },
      { code: 'Digit6', label: '6', altLabel: '^', width: 1 },
      { code: 'Digit7', label: '7', altLabel: '&', width: 1 },
      { code: 'Digit8', label: '8', altLabel: '*', width: 1 },
      { code: 'Digit9', label: '9', altLabel: '(', width: 1 },
      { code: 'Digit0', label: '0', altLabel: ')', width: 1 },
      { code: 'Minus', label: '-', altLabel: '_', width: 1 },
      { code: 'Equal', label: '=', altLabel: '+', width: 1 },
      { code: 'Backspace', label: 'Backspace', width: 2 },
      { code: 'Insert', label: 'Ins', width: 1 },
      { code: 'Home', label: 'Home', width: 1 },
      { code: 'PageUp', label: 'PgUp', width: 1 },
    ],
  },
  {
    keys: [
      { code: 'Tab', label: 'Tab', width: 1.5 },
      { code: 'KeyQ', label: 'Q', width: 1 },
      { code: 'KeyW', label: 'W', width: 1 },
      { code: 'KeyE', label: 'E', width: 1 },
      { code: 'KeyR', label: 'R', width: 1 },
      { code: 'KeyT', label: 'T', width: 1 },
      { code: 'KeyY', label: 'Y', width: 1 },
      { code: 'KeyU', label: 'U', width: 1 },
      { code: 'KeyI', label: 'I', width: 1 },
      { code: 'KeyO', label: 'O', width: 1 },
      { code: 'KeyP', label: 'P', width: 1 },
      { code: 'BracketLeft', label: '[', altLabel: '{', width: 1 },
      { code: 'BracketRight', label: ']', altLabel: '}', width: 1 },
      { code: 'Delete', label: 'Del', width: 1 },
      { code: 'End', label: 'End', width: 1 },
      { code: 'PageDown', label: 'PgDn', width: 1 },
    ],
  },
  {
    keys: [
      { code: 'CapsLock', label: 'Caps Lock', width: 1.75 },
      { code: 'KeyA', label: 'A', width: 1 },
      { code: 'KeyS', label: 'S', width: 1 },
      { code: 'KeyD', label: 'D', width: 1 },
      { code: 'KeyF', label: 'F', width: 1 },
      { code: 'KeyG', label: 'G', width: 1 },
      { code: 'KeyH', label: 'H', width: 1 },
      { code: 'KeyJ', label: 'J', width: 1 },
      { code: 'KeyK', label: 'K', width: 1 },
      { code: 'KeyL', label: 'L', width: 1 },
      { code: 'Semicolon', label: ';', altLabel: ':', width: 1 },
      { code: 'Quote', label: "'", altLabel: '@', width: 1 },
      { code: 'Backslash', label: '#', altLabel: '~', width: 1 },
      { code: 'Enter', label: 'Enter', width: 1.25, isSpecial: true },
    ],
  },
  {
    keys: [
      { code: 'ShiftLeft', label: 'Shift', width: 1.25 },
      { code: 'IntlBackslash', label: '\\', altLabel: '|', width: 1 },
      { code: 'KeyZ', label: 'Z', width: 1 },
      { code: 'KeyX', label: 'X', width: 1 },
      { code: 'KeyC', label: 'C', width: 1 },
      { code: 'KeyV', label: 'V', width: 1 },
      { code: 'KeyB', label: 'B', width: 1 },
      { code: 'KeyN', label: 'N', width: 1 },
      { code: 'KeyM', label: 'M', width: 1 },
      { code: 'Comma', label: ',', altLabel: '<', width: 1 },
      { code: 'Period', label: '.', altLabel: '>', width: 1 },
      { code: 'Slash', label: '/', altLabel: '?', width: 1 },
      { code: 'ShiftRight', label: 'Shift', width: 2.75 },
      { code: 'ArrowUp', label: '↑', width: 1 },
    ],
  },
  FULL_SIZE_ROWS_WINDOWS_ANSI[5],
];

const NUMPAD_ROWS: KeyRow[] = [
  {
    keys: [
      { code: 'NumLock', label: 'Num', width: 1 },
      { code: 'NumpadDivide', label: '/', width: 1 },
      { code: 'NumpadMultiply', label: '*', width: 1 },
      { code: 'NumpadSubtract', label: '-', width: 1 },
    ],
  },
  {
    keys: [
      { code: 'Numpad7', label: '7', width: 1 },
      { code: 'Numpad8', label: '8', width: 1 },
      { code: 'Numpad9', label: '9', width: 1 },
      { code: 'NumpadAdd', label: '+', width: 1, height: 2 },
    ],
  },
  {
    keys: [
      { code: 'Numpad4', label: '4', width: 1 },
      { code: 'Numpad5', label: '5', width: 1 },
      { code: 'Numpad6', label: '6', width: 1 },
    ],
  },
  {
    keys: [
      { code: 'Numpad1', label: '1', width: 1 },
      { code: 'Numpad2', label: '2', width: 1 },
      { code: 'Numpad3', label: '3', width: 1 },
      { code: 'NumpadEnter', label: 'Enter', width: 1, height: 2 },
    ],
  },
  {
    keys: [
      { code: 'Numpad0', label: '0', width: 2 },
      { code: 'NumpadDecimal', label: '.', width: 1 },
    ],
  },
];

const MAC_ROWS_ANSI: KeyRow[] = [
  {
    keys: [
      { code: 'Escape', label: 'esc', width: 1 },
      { code: 'F1', label: 'F1', width: 1 },
      { code: 'F2', label: 'F2', width: 1 },
      { code: 'F3', label: 'F3', width: 1 },
      { code: 'F4', label: 'F4', width: 1 },
      { code: 'F5', label: 'F5', width: 1 },
      { code: 'F6', label: 'F6', width: 1 },
      { code: 'F7', label: 'F7', width: 1 },
      { code: 'F8', label: 'F8', width: 1 },
      { code: 'F9', label: 'F9', width: 1 },
      { code: 'F10', label: 'F10', width: 1 },
      { code: 'F11', label: 'F11', width: 1 },
      { code: 'F12', label: 'F12', width: 1 },
      { code: 'PrintScreen', label: '⏏', width: 1 },
    ],
  },
  {
    keys: [
      { code: 'Backquote', label: '`', altLabel: '~', width: 1 },
      { code: 'Digit1', label: '1', altLabel: '!', width: 1 },
      { code: 'Digit2', label: '2', altLabel: '@', width: 1 },
      { code: 'Digit3', label: '3', altLabel: '#', width: 1 },
      { code: 'Digit4', label: '4', altLabel: '$', width: 1 },
      { code: 'Digit5', label: '5', altLabel: '%', width: 1 },
      { code: 'Digit6', label: '6', altLabel: '^', width: 1 },
      { code: 'Digit7', label: '7', altLabel: '&', width: 1 },
      { code: 'Digit8', label: '8', altLabel: '*', width: 1 },
      { code: 'Digit9', label: '9', altLabel: '(', width: 1 },
      { code: 'Digit0', label: '0', altLabel: ')', width: 1 },
      { code: 'Minus', label: '-', altLabel: '_', width: 1 },
      { code: 'Equal', label: '=', altLabel: '+', width: 1 },
      { code: 'Backspace', label: 'delete', width: 2 },
    ],
  },
  {
    keys: [
      { code: 'Tab', label: 'tab', width: 1.5 },
      { code: 'KeyQ', label: 'Q', width: 1 },
      { code: 'KeyW', label: 'W', width: 1 },
      { code: 'KeyE', label: 'E', width: 1 },
      { code: 'KeyR', label: 'R', width: 1 },
      { code: 'KeyT', label: 'T', width: 1 },
      { code: 'KeyY', label: 'Y', width: 1 },
      { code: 'KeyU', label: 'U', width: 1 },
      { code: 'KeyI', label: 'I', width: 1 },
      { code: 'KeyO', label: 'O', width: 1 },
      { code: 'KeyP', label: 'P', width: 1 },
      { code: 'BracketLeft', label: '[', altLabel: '{', width: 1 },
      { code: 'BracketRight', label: ']', altLabel: '}', width: 1 },
      { code: 'Backslash', label: '\\', altLabel: '|', width: 1.5 },
    ],
  },
  {
    keys: [
      { code: 'CapsLock', label: 'caps lock', width: 1.75 },
      { code: 'KeyA', label: 'A', width: 1 },
      { code: 'KeyS', label: 'S', width: 1 },
      { code: 'KeyD', label: 'D', width: 1 },
      { code: 'KeyF', label: 'F', width: 1 },
      { code: 'KeyG', label: 'G', width: 1 },
      { code: 'KeyH', label: 'H', width: 1 },
      { code: 'KeyJ', label: 'J', width: 1 },
      { code: 'KeyK', label: 'K', width: 1 },
      { code: 'KeyL', label: 'L', width: 1 },
      { code: 'Semicolon', label: ';', altLabel: ':', width: 1 },
      { code: 'Quote', label: "'", altLabel: '"', width: 1 },
      { code: 'Enter', label: 'return', width: 2.25 },
    ],
  },
  {
    keys: [
      { code: 'ShiftLeft', label: 'shift', width: 2.25 },
      { code: 'KeyZ', label: 'Z', width: 1 },
      { code: 'KeyX', label: 'X', width: 1 },
      { code: 'KeyC', label: 'C', width: 1 },
      { code: 'KeyV', label: 'V', width: 1 },
      { code: 'KeyB', label: 'B', width: 1 },
      { code: 'KeyN', label: 'N', width: 1 },
      { code: 'KeyM', label: 'M', width: 1 },
      { code: 'Comma', label: ',', altLabel: '<', width: 1 },
      { code: 'Period', label: '.', altLabel: '>', width: 1 },
      { code: 'Slash', label: '/', altLabel: '?', width: 1 },
      { code: 'ShiftRight', label: 'shift', width: 2.75 },
    ],
  },
  {
    keys: [
      { code: 'Fn', label: 'fn', width: 1.25 },
      { code: 'ControlLeft', label: 'control', width: 1.25 },
      { code: 'AltLeft', label: '⌥ option', width: 1.25 },
      { code: 'MetaLeft', label: '⌘ command', width: 1.75 },
      { code: 'Space', label: '', width: 5.5 },
      { code: 'MetaRight', label: '⌘ command', width: 1.75 },
      { code: 'AltRight', label: '⌥ option', width: 1.25 },
      { code: 'ArrowLeft', label: '←', width: 1 },
      { code: 'ArrowUp', label: '↑', width: 0.75 },
      { code: 'ArrowDown', label: '↓', width: 0.75 },
      { code: 'ArrowRight', label: '→', width: 1 },
    ],
  },
];

const MACBOOK_ROWS: KeyRow[] = [
  {
    keys: [
      { code: 'Escape', label: 'esc', width: 1 },
      { code: 'F1', label: 'F1', width: 1 },
      { code: 'F2', label: 'F2', width: 1 },
      { code: 'F3', label: 'F3', width: 1 },
      { code: 'F4', label: 'F4', width: 1 },
      { code: 'F5', label: 'F5', width: 1 },
      { code: 'F6', label: 'F6', width: 1 },
      { code: 'F7', label: 'F7', width: 1 },
      { code: 'F8', label: 'F8', width: 1 },
      { code: 'F9', label: 'F9', width: 1 },
      { code: 'F10', label: 'F10', width: 1 },
      { code: 'F11', label: 'F11', width: 1 },
      { code: 'F12', label: 'F12', width: 1 },
    ],
  },
  {
    keys: [
      { code: 'Backquote', label: '`', altLabel: '~', width: 1 },
      { code: 'Digit1', label: '1', altLabel: '!', width: 1 },
      { code: 'Digit2', label: '2', altLabel: '@', width: 1 },
      { code: 'Digit3', label: '3', altLabel: '#', width: 1 },
      { code: 'Digit4', label: '4', altLabel: '$', width: 1 },
      { code: 'Digit5', label: '5', altLabel: '%', width: 1 },
      { code: 'Digit6', label: '6', altLabel: '^', width: 1 },
      { code: 'Digit7', label: '7', altLabel: '&', width: 1 },
      { code: 'Digit8', label: '8', altLabel: '*', width: 1 },
      { code: 'Digit9', label: '9', altLabel: '(', width: 1 },
      { code: 'Digit0', label: '0', altLabel: ')', width: 1 },
      { code: 'Minus', label: '-', altLabel: '_', width: 1 },
      { code: 'Equal', label: '=', altLabel: '+', width: 1 },
      { code: 'Backspace', label: 'delete', width: 2 },
    ],
  },
  {
    keys: [
      { code: 'Tab', label: 'tab', width: 1.5 },
      { code: 'KeyQ', label: 'Q', width: 1 },
      { code: 'KeyW', label: 'W', width: 1 },
      { code: 'KeyE', label: 'E', width: 1 },
      { code: 'KeyR', label: 'R', width: 1 },
      { code: 'KeyT', label: 'T', width: 1 },
      { code: 'KeyY', label: 'Y', width: 1 },
      { code: 'KeyU', label: 'U', width: 1 },
      { code: 'KeyI', label: 'I', width: 1 },
      { code: 'KeyO', label: 'O', width: 1 },
      { code: 'KeyP', label: 'P', width: 1 },
      { code: 'BracketLeft', label: '[', altLabel: '{', width: 1 },
      { code: 'BracketRight', label: ']', altLabel: '}', width: 1 },
      { code: 'Backslash', label: '\\', altLabel: '|', width: 1.5 },
    ],
  },
  {
    keys: [
      { code: 'CapsLock', label: 'caps lock', width: 1.75 },
      { code: 'KeyA', label: 'A', width: 1 },
      { code: 'KeyS', label: 'S', width: 1 },
      { code: 'KeyD', label: 'D', width: 1 },
      { code: 'KeyF', label: 'F', width: 1 },
      { code: 'KeyG', label: 'G', width: 1 },
      { code: 'KeyH', label: 'H', width: 1 },
      { code: 'KeyJ', label: 'J', width: 1 },
      { code: 'KeyK', label: 'K', width: 1 },
      { code: 'KeyL', label: 'L', width: 1 },
      { code: 'Semicolon', label: ';', altLabel: ':', width: 1 },
      { code: 'Quote', label: "'", altLabel: '"', width: 1 },
      { code: 'Enter', label: 'return', width: 2.25 },
    ],
  },
  {
    keys: [
      { code: 'ShiftLeft', label: 'shift', width: 2.25 },
      { code: 'KeyZ', label: 'Z', width: 1 },
      { code: 'KeyX', label: 'X', width: 1 },
      { code: 'KeyC', label: 'C', width: 1 },
      { code: 'KeyV', label: 'V', width: 1 },
      { code: 'KeyB', label: 'B', width: 1 },
      { code: 'KeyN', label: 'N', width: 1 },
      { code: 'KeyM', label: 'M', width: 1 },
      { code: 'Comma', label: ',', altLabel: '<', width: 1 },
      { code: 'Period', label: '.', altLabel: '>', width: 1 },
      { code: 'Slash', label: '/', altLabel: '?', width: 1 },
      { code: 'ShiftRight', label: 'shift', width: 2.75 },
    ],
  },
  {
    keys: [
      { code: 'Fn', label: 'fn', width: 1 },
      { code: 'ControlLeft', label: 'control', width: 1 },
      { code: 'AltLeft', label: '⌥', width: 1 },
      { code: 'MetaLeft', label: '⌘', width: 1.25 },
      { code: 'Space', label: '', width: 6.25 },
      { code: 'MetaRight', label: '⌘', width: 1.25 },
      { code: 'AltRight', label: '⌥', width: 1 },
      { code: 'ArrowLeft', label: '←', width: 0.75 },
      { code: 'ArrowUp', label: '↑', width: 0.75 },
      { code: 'ArrowDown', label: '↓', width: 0.75 },
      { code: 'ArrowRight', label: '→', width: 0.75 },
    ],
  },
];

const TKL_ROWS: KeyRow[] = [
  {
    keys: [
      { code: 'Escape', label: 'Esc', width: 1 },
      { code: 'F1', label: 'F1', width: 1 },
      { code: 'F2', label: 'F2', width: 1 },
      { code: 'F3', label: 'F3', width: 1 },
      { code: 'F4', label: 'F4', width: 1 },
      { code: 'F5', label: 'F5', width: 1 },
      { code: 'F6', label: 'F6', width: 1 },
      { code: 'F7', label: 'F7', width: 1 },
      { code: 'F8', label: 'F8', width: 1 },
      { code: 'F9', label: 'F9', width: 1 },
      { code: 'F10', label: 'F10', width: 1 },
      { code: 'F11', label: 'F11', width: 1 },
      { code: 'F12', label: 'F12', width: 1 },
      { code: 'PrintScreen', label: 'PrtSc', width: 1 },
      { code: 'ScrollLock', label: 'Scrl', width: 1 },
      { code: 'Pause', label: 'Pause', width: 1 },
    ],
  },
  {
    keys: [
      { code: 'Backquote', label: '`', altLabel: '~', width: 1 },
      { code: 'Digit1', label: '1', altLabel: '!', width: 1 },
      { code: 'Digit2', label: '2', altLabel: '@', width: 1 },
      { code: 'Digit3', label: '3', altLabel: '#', width: 1 },
      { code: 'Digit4', label: '4', altLabel: '$', width: 1 },
      { code: 'Digit5', label: '5', altLabel: '%', width: 1 },
      { code: 'Digit6', label: '6', altLabel: '^', width: 1 },
      { code: 'Digit7', label: '7', altLabel: '&', width: 1 },
      { code: 'Digit8', label: '8', altLabel: '*', width: 1 },
      { code: 'Digit9', label: '9', altLabel: '(', width: 1 },
      { code: 'Digit0', label: '0', altLabel: ')', width: 1 },
      { code: 'Minus', label: '-', altLabel: '_', width: 1 },
      { code: 'Equal', label: '=', altLabel: '+', width: 1 },
      { code: 'Backspace', label: 'Backspace', width: 2 },
      { code: 'Insert', label: 'Ins', width: 1 },
      { code: 'Home', label: 'Home', width: 1 },
      { code: 'PageUp', label: 'PgUp', width: 1 },
    ],
  },
  {
    keys: [
      { code: 'Tab', label: 'Tab', width: 1.5 },
      { code: 'KeyQ', label: 'Q', width: 1 },
      { code: 'KeyW', label: 'W', width: 1 },
      { code: 'KeyE', label: 'E', width: 1 },
      { code: 'KeyR', label: 'R', width: 1 },
      { code: 'KeyT', label: 'T', width: 1 },
      { code: 'KeyY', label: 'Y', width: 1 },
      { code: 'KeyU', label: 'U', width: 1 },
      { code: 'KeyI', label: 'I', width: 1 },
      { code: 'KeyO', label: 'O', width: 1 },
      { code: 'KeyP', label: 'P', width: 1 },
      { code: 'BracketLeft', label: '[', altLabel: '{', width: 1 },
      { code: 'BracketRight', label: ']', altLabel: '}', width: 1 },
      { code: 'Backslash', label: '\\', altLabel: '|', width: 1.5 },
      { code: 'Delete', label: 'Del', width: 1 },
      { code: 'End', label: 'End', width: 1 },
      { code: 'PageDown', label: 'PgDn', width: 1 },
    ],
  },
  {
    keys: [
      { code: 'CapsLock', label: 'Caps Lock', width: 1.75 },
      { code: 'KeyA', label: 'A', width: 1 },
      { code: 'KeyS', label: 'S', width: 1 },
      { code: 'KeyD', label: 'D', width: 1 },
      { code: 'KeyF', label: 'F', width: 1 },
      { code: 'KeyG', label: 'G', width: 1 },
      { code: 'KeyH', label: 'H', width: 1 },
      { code: 'KeyJ', label: 'J', width: 1 },
      { code: 'KeyK', label: 'K', width: 1 },
      { code: 'KeyL', label: 'L', width: 1 },
      { code: 'Semicolon', label: ';', altLabel: ':', width: 1 },
      { code: 'Quote', label: "'", altLabel: '"', width: 1 },
      { code: 'Enter', label: 'Enter', width: 2.25 },
    ],
  },
  {
    keys: [
      { code: 'ShiftLeft', label: 'Shift', width: 2.25 },
      { code: 'KeyZ', label: 'Z', width: 1 },
      { code: 'KeyX', label: 'X', width: 1 },
      { code: 'KeyC', label: 'C', width: 1 },
      { code: 'KeyV', label: 'V', width: 1 },
      { code: 'KeyB', label: 'B', width: 1 },
      { code: 'KeyN', label: 'N', width: 1 },
      { code: 'KeyM', label: 'M', width: 1 },
      { code: 'Comma', label: ',', altLabel: '<', width: 1 },
      { code: 'Period', label: '.', altLabel: '>', width: 1 },
      { code: 'Slash', label: '/', altLabel: '?', width: 1 },
      { code: 'ShiftRight', label: 'Shift', width: 2.75 },
      { code: 'ArrowUp', label: '↑', width: 1 },
    ],
  },
  {
    keys: [
      { code: 'ControlLeft', label: 'Ctrl', width: 1.25 },
      { code: 'MetaLeft', label: 'Win', width: 1.25 },
      { code: 'AltLeft', label: 'Alt', width: 1.25 },
      { code: 'Space', label: '', width: 6.25 },
      { code: 'AltRight', label: 'Alt', width: 1.25 },
      { code: 'MetaRight', label: 'Win', width: 1.25 },
      { code: 'ContextMenu', label: '☰', width: 1.25 },
      { code: 'ControlRight', label: 'Ctrl', width: 1.25 },
      { code: 'ArrowLeft', label: '←', width: 1 },
      { code: 'ArrowDown', label: '↓', width: 1 },
      { code: 'ArrowRight', label: '→', width: 1 },
    ],
  },
];

const LAYOUT_75_ROWS: KeyRow[] = [
  {
    keys: [
      { code: 'Escape', label: 'Esc', width: 1 },
      { code: 'F1', label: 'F1', width: 1 },
      { code: 'F2', label: 'F2', width: 1 },
      { code: 'F3', label: 'F3', width: 1 },
      { code: 'F4', label: 'F4', width: 1 },
      { code: 'F5', label: 'F5', width: 1 },
      { code: 'F6', label: 'F6', width: 1 },
      { code: 'F7', label: 'F7', width: 1 },
      { code: 'F8', label: 'F8', width: 1 },
      { code: 'F9', label: 'F9', width: 1 },
      { code: 'F10', label: 'F10', width: 1 },
      { code: 'F11', label: 'F11', width: 1 },
      { code: 'F12', label: 'F12', width: 1 },
      { code: 'Delete', label: 'Del', width: 1 },
    ],
  },
  {
    keys: [
      { code: 'Backquote', label: '`', altLabel: '~', width: 1 },
      { code: 'Digit1', label: '1', altLabel: '!', width: 1 },
      { code: 'Digit2', label: '2', altLabel: '@', width: 1 },
      { code: 'Digit3', label: '3', altLabel: '#', width: 1 },
      { code: 'Digit4', label: '4', altLabel: '$', width: 1 },
      { code: 'Digit5', label: '5', altLabel: '%', width: 1 },
      { code: 'Digit6', label: '6', altLabel: '^', width: 1 },
      { code: 'Digit7', label: '7', altLabel: '&', width: 1 },
      { code: 'Digit8', label: '8', altLabel: '*', width: 1 },
      { code: 'Digit9', label: '9', altLabel: '(', width: 1 },
      { code: 'Digit0', label: '0', altLabel: ')', width: 1 },
      { code: 'Minus', label: '-', altLabel: '_', width: 1 },
      { code: 'Equal', label: '=', altLabel: '+', width: 1 },
      { code: 'Backspace', label: 'Bksp', width: 2 },
    ],
  },
  {
    keys: [
      { code: 'Tab', label: 'Tab', width: 1.5 },
      { code: 'KeyQ', label: 'Q', width: 1 },
      { code: 'KeyW', label: 'W', width: 1 },
      { code: 'KeyE', label: 'E', width: 1 },
      { code: 'KeyR', label: 'R', width: 1 },
      { code: 'KeyT', label: 'T', width: 1 },
      { code: 'KeyY', label: 'Y', width: 1 },
      { code: 'KeyU', label: 'U', width: 1 },
      { code: 'KeyI', label: 'I', width: 1 },
      { code: 'KeyO', label: 'O', width: 1 },
      { code: 'KeyP', label: 'P', width: 1 },
      { code: 'BracketLeft', label: '[', altLabel: '{', width: 1 },
      { code: 'BracketRight', label: ']', altLabel: '}', width: 1 },
      { code: 'Backslash', label: '\\', altLabel: '|', width: 1.5 },
    ],
  },
  {
    keys: [
      { code: 'CapsLock', label: 'Caps', width: 1.75 },
      { code: 'KeyA', label: 'A', width: 1 },
      { code: 'KeyS', label: 'S', width: 1 },
      { code: 'KeyD', label: 'D', width: 1 },
      { code: 'KeyF', label: 'F', width: 1 },
      { code: 'KeyG', label: 'G', width: 1 },
      { code: 'KeyH', label: 'H', width: 1 },
      { code: 'KeyJ', label: 'J', width: 1 },
      { code: 'KeyK', label: 'K', width: 1 },
      { code: 'KeyL', label: 'L', width: 1 },
      { code: 'Semicolon', label: ';', altLabel: ':', width: 1 },
      { code: 'Quote', label: "'", altLabel: '"', width: 1 },
      { code: 'Enter', label: 'Enter', width: 2.25 },
    ],
  },
  {
    keys: [
      { code: 'ShiftLeft', label: 'Shift', width: 2.25 },
      { code: 'KeyZ', label: 'Z', width: 1 },
      { code: 'KeyX', label: 'X', width: 1 },
      { code: 'KeyC', label: 'C', width: 1 },
      { code: 'KeyV', label: 'V', width: 1 },
      { code: 'KeyB', label: 'B', width: 1 },
      { code: 'KeyN', label: 'N', width: 1 },
      { code: 'KeyM', label: 'M', width: 1 },
      { code: 'Comma', label: ',', altLabel: '<', width: 1 },
      { code: 'Period', label: '.', altLabel: '>', width: 1 },
      { code: 'Slash', label: '/', altLabel: '?', width: 1 },
      { code: 'ShiftRight', label: 'Shift', width: 1.75 },
      { code: 'ArrowUp', label: '↑', width: 1 },
    ],
  },
  {
    keys: [
      { code: 'ControlLeft', label: 'Ctrl', width: 1.25 },
      { code: 'MetaLeft', label: 'Win', width: 1.25 },
      { code: 'AltLeft', label: 'Alt', width: 1.25 },
      { code: 'Space', label: '', width: 5.75 },
      { code: 'AltRight', label: 'Alt', width: 1.25 },
      { code: 'ControlRight', label: 'Ctrl', width: 1.25 },
      { code: 'ArrowLeft', label: '←', width: 1 },
      { code: 'ArrowDown', label: '↓', width: 1 },
      { code: 'ArrowRight', label: '→', width: 1 },
    ],
  },
];

const LAYOUT_65_ROWS: KeyRow[] = [
  {
    keys: [
      { code: 'Escape', label: 'Esc', width: 1 },
      { code: 'Digit1', label: '1', altLabel: '!', width: 1 },
      { code: 'Digit2', label: '2', altLabel: '@', width: 1 },
      { code: 'Digit3', label: '3', altLabel: '#', width: 1 },
      { code: 'Digit4', label: '4', altLabel: '$', width: 1 },
      { code: 'Digit5', label: '5', altLabel: '%', width: 1 },
      { code: 'Digit6', label: '6', altLabel: '^', width: 1 },
      { code: 'Digit7', label: '7', altLabel: '&', width: 1 },
      { code: 'Digit8', label: '8', altLabel: '*', width: 1 },
      { code: 'Digit9', label: '9', altLabel: '(', width: 1 },
      { code: 'Digit0', label: '0', altLabel: ')', width: 1 },
      { code: 'Minus', label: '-', altLabel: '_', width: 1 },
      { code: 'Equal', label: '=', altLabel: '+', width: 1 },
      { code: 'Backspace', label: 'Bksp', width: 2 },
      { code: 'Delete', label: 'Del', width: 1 },
    ],
  },
  {
    keys: [
      { code: 'Tab', label: 'Tab', width: 1.5 },
      { code: 'KeyQ', label: 'Q', width: 1 },
      { code: 'KeyW', label: 'W', width: 1 },
      { code: 'KeyE', label: 'E', width: 1 },
      { code: 'KeyR', label: 'R', width: 1 },
      { code: 'KeyT', label: 'T', width: 1 },
      { code: 'KeyY', label: 'Y', width: 1 },
      { code: 'KeyU', label: 'U', width: 1 },
      { code: 'KeyI', label: 'I', width: 1 },
      { code: 'KeyO', label: 'O', width: 1 },
      { code: 'KeyP', label: 'P', width: 1 },
      { code: 'BracketLeft', label: '[', altLabel: '{', width: 1 },
      { code: 'BracketRight', label: ']', altLabel: '}', width: 1 },
      { code: 'Backslash', label: '\\', altLabel: '|', width: 1.5 },
      { code: 'PageUp', label: 'PgUp', width: 1 },
    ],
  },
  {
    keys: [
      { code: 'CapsLock', label: 'Caps', width: 1.75 },
      { code: 'KeyA', label: 'A', width: 1 },
      { code: 'KeyS', label: 'S', width: 1 },
      { code: 'KeyD', label: 'D', width: 1 },
      { code: 'KeyF', label: 'F', width: 1 },
      { code: 'KeyG', label: 'G', width: 1 },
      { code: 'KeyH', label: 'H', width: 1 },
      { code: 'KeyJ', label: 'J', width: 1 },
      { code: 'KeyK', label: 'K', width: 1 },
      { code: 'KeyL', label: 'L', width: 1 },
      { code: 'Semicolon', label: ';', altLabel: ':', width: 1 },
      { code: 'Quote', label: "'", altLabel: '"', width: 1 },
      { code: 'Enter', label: 'Enter', width: 2.25 },
      { code: 'PageDown', label: 'PgDn', width: 1 },
    ],
  },
  {
    keys: [
      { code: 'ShiftLeft', label: 'Shift', width: 2.25 },
      { code: 'KeyZ', label: 'Z', width: 1 },
      { code: 'KeyX', label: 'X', width: 1 },
      { code: 'KeyC', label: 'C', width: 1 },
      { code: 'KeyV', label: 'V', width: 1 },
      { code: 'KeyB', label: 'B', width: 1 },
      { code: 'KeyN', label: 'N', width: 1 },
      { code: 'KeyM', label: 'M', width: 1 },
      { code: 'Comma', label: ',', altLabel: '<', width: 1 },
      { code: 'Period', label: '.', altLabel: '>', width: 1 },
      { code: 'Slash', label: '/', altLabel: '?', width: 1 },
      { code: 'ShiftRight', label: 'Shift', width: 1.75 },
      { code: 'ArrowUp', label: '↑', width: 1 },
      { code: 'End', label: 'End', width: 1 },
    ],
  },
  {
    keys: [
      { code: 'ControlLeft', label: 'Ctrl', width: 1.25 },
      { code: 'MetaLeft', label: 'Win', width: 1.25 },
      { code: 'AltLeft', label: 'Alt', width: 1.25 },
      { code: 'Space', label: '', width: 6.25 },
      { code: 'AltRight', label: 'Alt', width: 1.25 },
      { code: 'ControlRight', label: 'Ctrl', width: 1.25 },
      { code: 'ArrowLeft', label: '←', width: 1 },
      { code: 'ArrowDown', label: '↓', width: 1 },
      { code: 'ArrowRight', label: '→', width: 1 },
    ],
  },
];

const LAYOUT_60_ROWS: KeyRow[] = [
  {
    keys: [
      { code: 'Escape', label: 'Esc', width: 1 },
      { code: 'Digit1', label: '1', altLabel: '!', width: 1 },
      { code: 'Digit2', label: '2', altLabel: '@', width: 1 },
      { code: 'Digit3', label: '3', altLabel: '#', width: 1 },
      { code: 'Digit4', label: '4', altLabel: '$', width: 1 },
      { code: 'Digit5', label: '5', altLabel: '%', width: 1 },
      { code: 'Digit6', label: '6', altLabel: '^', width: 1 },
      { code: 'Digit7', label: '7', altLabel: '&', width: 1 },
      { code: 'Digit8', label: '8', altLabel: '*', width: 1 },
      { code: 'Digit9', label: '9', altLabel: '(', width: 1 },
      { code: 'Digit0', label: '0', altLabel: ')', width: 1 },
      { code: 'Minus', label: '-', altLabel: '_', width: 1 },
      { code: 'Equal', label: '=', altLabel: '+', width: 1 },
      { code: 'Backspace', label: 'Backspace', width: 2 },
    ],
  },
  {
    keys: [
      { code: 'Tab', label: 'Tab', width: 1.5 },
      { code: 'KeyQ', label: 'Q', width: 1 },
      { code: 'KeyW', label: 'W', width: 1 },
      { code: 'KeyE', label: 'E', width: 1 },
      { code: 'KeyR', label: 'R', width: 1 },
      { code: 'KeyT', label: 'T', width: 1 },
      { code: 'KeyY', label: 'Y', width: 1 },
      { code: 'KeyU', label: 'U', width: 1 },
      { code: 'KeyI', label: 'I', width: 1 },
      { code: 'KeyO', label: 'O', width: 1 },
      { code: 'KeyP', label: 'P', width: 1 },
      { code: 'BracketLeft', label: '[', altLabel: '{', width: 1 },
      { code: 'BracketRight', label: ']', altLabel: '}', width: 1 },
      { code: 'Backslash', label: '\\', altLabel: '|', width: 1.5 },
    ],
  },
  {
    keys: [
      { code: 'CapsLock', label: 'Caps', width: 1.75 },
      { code: 'KeyA', label: 'A', width: 1 },
      { code: 'KeyS', label: 'S', width: 1 },
      { code: 'KeyD', label: 'D', width: 1 },
      { code: 'KeyF', label: 'F', width: 1 },
      { code: 'KeyG', label: 'G', width: 1 },
      { code: 'KeyH', label: 'H', width: 1 },
      { code: 'KeyJ', label: 'J', width: 1 },
      { code: 'KeyK', label: 'K', width: 1 },
      { code: 'KeyL', label: 'L', width: 1 },
      { code: 'Semicolon', label: ';', altLabel: ':', width: 1 },
      { code: 'Quote', label: "'", altLabel: '"', width: 1 },
      { code: 'Enter', label: 'Enter', width: 2.25 },
    ],
  },
  {
    keys: [
      { code: 'ShiftLeft', label: 'Shift', width: 2.25 },
      { code: 'KeyZ', label: 'Z', width: 1 },
      { code: 'KeyX', label: 'X', width: 1 },
      { code: 'KeyC', label: 'C', width: 1 },
      { code: 'KeyV', label: 'V', width: 1 },
      { code: 'KeyB', label: 'B', width: 1 },
      { code: 'KeyN', label: 'N', width: 1 },
      { code: 'KeyM', label: 'M', width: 1 },
      { code: 'Comma', label: ',', altLabel: '<', width: 1 },
      { code: 'Period', label: '.', altLabel: '>', width: 1 },
      { code: 'Slash', label: '/', altLabel: '?', width: 1 },
      { code: 'ShiftRight', label: 'Shift', width: 2.75 },
    ],
  },
  {
    keys: [
      { code: 'ControlLeft', label: 'Ctrl', width: 1.25 },
      { code: 'MetaLeft', label: 'Win', width: 1.25 },
      { code: 'AltLeft', label: 'Alt', width: 1.25 },
      { code: 'Space', label: '', width: 6.25 },
      { code: 'AltRight', label: 'Alt', width: 1.25 },
      { code: 'MetaRight', label: 'Win', width: 1.25 },
      { code: 'ContextMenu', label: '☰', width: 1.25 },
      { code: 'ControlRight', label: 'Ctrl', width: 1.25 },
    ],
  },
];

const LAYOUT_40_ROWS: KeyRow[] = [
  {
    keys: [
      { code: 'Tab', label: 'Tab', width: 1.5 },
      { code: 'KeyQ', label: 'Q', width: 1 },
      { code: 'KeyW', label: 'W', width: 1 },
      { code: 'KeyE', label: 'E', width: 1 },
      { code: 'KeyR', label: 'R', width: 1 },
      { code: 'KeyT', label: 'T', width: 1 },
      { code: 'KeyY', label: 'Y', width: 1 },
      { code: 'KeyU', label: 'U', width: 1 },
      { code: 'KeyI', label: 'I', width: 1 },
      { code: 'KeyO', label: 'O', width: 1 },
      { code: 'KeyP', label: 'P', width: 1 },
      { code: 'Backspace', label: 'Bksp', width: 1.5 },
    ],
  },
  {
    keys: [
      { code: 'Escape', label: 'Esc', width: 1.75 },
      { code: 'KeyA', label: 'A', width: 1 },
      { code: 'KeyS', label: 'S', width: 1 },
      { code: 'KeyD', label: 'D', width: 1 },
      { code: 'KeyF', label: 'F', width: 1 },
      { code: 'KeyG', label: 'G', width: 1 },
      { code: 'KeyH', label: 'H', width: 1 },
      { code: 'KeyJ', label: 'J', width: 1 },
      { code: 'KeyK', label: 'K', width: 1 },
      { code: 'KeyL', label: 'L', width: 1 },
      { code: 'Enter', label: 'Enter', width: 1.75 },
    ],
  },
  {
    keys: [
      { code: 'ShiftLeft', label: 'Shift', width: 2.25 },
      { code: 'KeyZ', label: 'Z', width: 1 },
      { code: 'KeyX', label: 'X', width: 1 },
      { code: 'KeyC', label: 'C', width: 1 },
      { code: 'KeyV', label: 'V', width: 1 },
      { code: 'KeyB', label: 'B', width: 1 },
      { code: 'KeyN', label: 'N', width: 1 },
      { code: 'KeyM', label: 'M', width: 1 },
      { code: 'ShiftRight', label: 'Shift', width: 2.25 },
    ],
  },
  {
    keys: [
      { code: 'ControlLeft', label: 'Ctrl', width: 1.25 },
      { code: 'MetaLeft', label: 'Win', width: 1.25 },
      { code: 'AltLeft', label: 'Alt', width: 1.25 },
      { code: 'Space', label: '', width: 6.25 },
      { code: 'AltRight', label: 'Alt', width: 1.25 },
      { code: 'ControlRight', label: 'Ctrl', width: 1.25 },
    ],
  },
];

const LAPTOP_ROWS: KeyRow[] = [
  {
    keys: [
      { code: 'Escape', label: 'Esc', width: 1 },
      { code: 'F1', label: 'F1', width: 1 },
      { code: 'F2', label: 'F2', width: 1 },
      { code: 'F3', label: 'F3', width: 1 },
      { code: 'F4', label: 'F4', width: 1 },
      { code: 'F5', label: 'F5', width: 1 },
      { code: 'F6', label: 'F6', width: 1 },
      { code: 'F7', label: 'F7', width: 1 },
      { code: 'F8', label: 'F8', width: 1 },
      { code: 'F9', label: 'F9', width: 1 },
      { code: 'F10', label: 'F10', width: 1 },
      { code: 'F11', label: 'F11', width: 1 },
      { code: 'F12', label: 'F12', width: 1 },
      { code: 'Delete', label: 'Del', width: 1 },
    ],
  },
  {
    keys: [
      { code: 'Backquote', label: '`', altLabel: '~', width: 1 },
      { code: 'Digit1', label: '1', altLabel: '!', width: 1 },
      { code: 'Digit2', label: '2', altLabel: '@', width: 1 },
      { code: 'Digit3', label: '3', altLabel: '#', width: 1 },
      { code: 'Digit4', label: '4', altLabel: '$', width: 1 },
      { code: 'Digit5', label: '5', altLabel: '%', width: 1 },
      { code: 'Digit6', label: '6', altLabel: '^', width: 1 },
      { code: 'Digit7', label: '7', altLabel: '&', width: 1 },
      { code: 'Digit8', label: '8', altLabel: '*', width: 1 },
      { code: 'Digit9', label: '9', altLabel: '(', width: 1 },
      { code: 'Digit0', label: '0', altLabel: ')', width: 1 },
      { code: 'Minus', label: '-', altLabel: '_', width: 1 },
      { code: 'Equal', label: '=', altLabel: '+', width: 1 },
      { code: 'Backspace', label: 'Bksp', width: 2 },
    ],
  },
  {
    keys: [
      { code: 'Tab', label: 'Tab', width: 1.5 },
      { code: 'KeyQ', label: 'Q', width: 1 },
      { code: 'KeyW', label: 'W', width: 1 },
      { code: 'KeyE', label: 'E', width: 1 },
      { code: 'KeyR', label: 'R', width: 1 },
      { code: 'KeyT', label: 'T', width: 1 },
      { code: 'KeyY', label: 'Y', width: 1 },
      { code: 'KeyU', label: 'U', width: 1 },
      { code: 'KeyI', label: 'I', width: 1 },
      { code: 'KeyO', label: 'O', width: 1 },
      { code: 'KeyP', label: 'P', width: 1 },
      { code: 'BracketLeft', label: '[', altLabel: '{', width: 1 },
      { code: 'BracketRight', label: ']', altLabel: '}', width: 1 },
      { code: 'Backslash', label: '\\', altLabel: '|', width: 1.5 },
    ],
  },
  {
    keys: [
      { code: 'CapsLock', label: 'Caps', width: 1.75 },
      { code: 'KeyA', label: 'A', width: 1 },
      { code: 'KeyS', label: 'S', width: 1 },
      { code: 'KeyD', label: 'D', width: 1 },
      { code: 'KeyF', label: 'F', width: 1 },
      { code: 'KeyG', label: 'G', width: 1 },
      { code: 'KeyH', label: 'H', width: 1 },
      { code: 'KeyJ', label: 'J', width: 1 },
      { code: 'KeyK', label: 'K', width: 1 },
      { code: 'KeyL', label: 'L', width: 1 },
      { code: 'Semicolon', label: ';', altLabel: ':', width: 1 },
      { code: 'Quote', label: "'", altLabel: '"', width: 1 },
      { code: 'Enter', label: 'Enter', width: 2.25 },
    ],
  },
  {
    keys: [
      { code: 'ShiftLeft', label: 'Shift', width: 2.25 },
      { code: 'KeyZ', label: 'Z', width: 1 },
      { code: 'KeyX', label: 'X', width: 1 },
      { code: 'KeyC', label: 'C', width: 1 },
      { code: 'KeyV', label: 'V', width: 1 },
      { code: 'KeyB', label: 'B', width: 1 },
      { code: 'KeyN', label: 'N', width: 1 },
      { code: 'KeyM', label: 'M', width: 1 },
      { code: 'Comma', label: ',', altLabel: '<', width: 1 },
      { code: 'Period', label: '.', altLabel: '>', width: 1 },
      { code: 'Slash', label: '/', altLabel: '?', width: 1 },
      { code: 'ShiftRight', label: 'Shift', width: 1.75 },
      { code: 'ArrowUp', label: '↑', width: 1 },
    ],
  },
  {
    keys: [
      { code: 'ControlLeft', label: 'Ctrl', width: 1.25 },
      { code: 'Fn', label: 'Fn', width: 1.25 },
      { code: 'MetaLeft', label: 'Win', width: 1.25 },
      { code: 'AltLeft', label: 'Alt', width: 1.25 },
      { code: 'Space', label: '', width: 5.5 },
      { code: 'AltRight', label: 'Alt', width: 1.25 },
      { code: 'ControlRight', label: 'Ctrl', width: 1.25 },
      { code: 'ArrowLeft', label: '←', width: 1 },
      { code: 'ArrowDown', label: '↓', width: 1 },
      { code: 'ArrowRight', label: '→', width: 1 },
    ],
  },
];

// ─── Layout Map ───────────────────────────────────────────────────────────────

const LAYOUT_OPTIONS: { id: LayoutId; name: string }[] = [
  { id: 'full', name: 'Full Size (104/105 Keys)' },
  { id: 'tkl', name: 'TKL (87 Keys)' },
  { id: '75', name: '75% Keyboard' },
  { id: '65', name: '65% Keyboard' },
  { id: '60', name: '60% Keyboard' },
  { id: 'mac', name: 'Mac Keyboard' },
  { id: 'macbook', name: 'MacBook Keyboard' },
  { id: 'laptop', name: 'Laptop Keyboard' },
  { id: 'compact', name: 'Compact Keyboard (40%)' },
  { id: '96', name: '96% Keyboard' },
];

function getLayoutRows(
  layoutId: LayoutId,
  platform: Platform,
  region: Region
): { rows: KeyRow[]; numpadRows?: KeyRow[] } {
  const isMac = platform === 'macos';
  const isISO = region === 'iso';

  if (layoutId === 'mac' || (isMac && layoutId === 'full')) {
    return { rows: MAC_ROWS_ANSI };
  }
  if (layoutId === 'macbook') {
    return { rows: MACBOOK_ROWS };
  }
  if (layoutId === 'laptop') {
    return { rows: LAPTOP_ROWS };
  }
  if (layoutId === 'compact' || layoutId === '40') {
    return { rows: LAYOUT_40_ROWS };
  }
  if (layoutId === '60') {
    return { rows: LAYOUT_60_ROWS };
  }
  if (layoutId === '65') {
    return { rows: LAYOUT_65_ROWS };
  }
  if (layoutId === '75') {
    return { rows: LAYOUT_75_ROWS };
  }
  if (layoutId === 'tkl') {
    return { rows: isISO ? FULL_SIZE_ROWS_WINDOWS_ISO : TKL_ROWS };
  }
  if (layoutId === '96') {
    return {
      rows: isISO ? FULL_SIZE_ROWS_WINDOWS_ISO : FULL_SIZE_ROWS_WINDOWS_ANSI,
      numpadRows: NUMPAD_ROWS,
    };
  }
  // full
  return {
    rows: isISO ? FULL_SIZE_ROWS_WINDOWS_ISO : FULL_SIZE_ROWS_WINDOWS_ANSI,
    numpadRows: NUMPAD_ROWS,
  };
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface KeyboardTestClientProps {
  initialLayout?: LayoutId;
  initialPlatform?: Platform;
  initialRegion?: Region;
  initialTheme?: Theme;
  pageTitle?: string;
  pageDescription?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function KeyboardTestClient({
  initialLayout = 'full',
  initialPlatform = 'windows',
  initialRegion = 'ansi',
  initialTheme = 'dark',
  pageTitle = 'Keyboard Tester',
  pageDescription = 'Test every key on your keyboard in real time.',
}: KeyboardTestClientProps) {
  const [layout, setLayout] = useState<LayoutId>(initialLayout);
  const [platform, setPlatform] = useState<Platform>(initialPlatform);
  const [region, setRegion] = useState<Region>(initialRegion);
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const [testStarted, setTestStarted] = useState(false);

  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [testedKeys, setTestedKeys] = useState<Set<string>>(new Set());
  const [rgbKeys, setRgbKeys] = useState<Map<string, number>>(new Map());

  const rgbTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!testStarted) return;
      e.preventDefault();
      const code = e.code;
      setPressedKeys((prev) => new Set(prev).add(code));
      setTestedKeys((prev) => new Set(prev).add(code));
      setRgbKeys((prev) => {
        const next = new Map(prev);
        next.set(code, Date.now());
        return next;
      });
      if (rgbTimers.current.has(code)) {
        clearTimeout(rgbTimers.current.get(code)!);
      }
      const t = setTimeout(() => {
        setRgbKeys((prev) => {
          const next = new Map(prev);
          next.delete(code);
          return next;
        });
      }, 600);
      rgbTimers.current.set(code, t);
    },
    [testStarted]
  );

  const handleKeyUp = useCallback(
    (e: KeyboardEvent) => {
      if (!testStarted) return;
      const code = e.code;
      setPressedKeys((prev) => {
        const next = new Set(prev);
        next.delete(code);
        return next;
      });
    },
    [testStarted]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  const handleReset = () => {
    setPressedKeys(new Set());
    setTestedKeys(new Set());
    setRgbKeys(new Map());
    rgbTimers.current.forEach((t) => clearTimeout(t));
    rgbTimers.current.clear();
  };

  const { rows, numpadRows } = getLayoutRows(layout, platform, region);

  const isDark = theme === 'dark';

  const KEY_UNIT = 44;

  const renderKey = (key: KeyDef, rowIdx: number, keyIdx: number) => {
    const w = key.width ?? 1;
    const isPressed = pressedKeys.has(key.code);
    const isTested = testedKeys.has(key.code);
    const isRgb = rgbKeys.has(key.code);

    let keyClass = 'key-cap text-foreground/60';
    if (isPressed) {
      keyClass = 'key-cap key-cap-pressed';
    } else if (isTested) {
      keyClass = 'key-cap key-cap-tested';
    } else if (isRgb) {
      keyClass = 'key-cap animate-rgb-pulse text-foreground/60';
    }

    return (
      <div
        key={`${rowIdx}-${keyIdx}-${key.code}`}
        className={`relative flex flex-col items-center justify-center text-xs font-mono font-medium transition-all duration-75 select-none ${keyClass}`}
        style={{
          width: `${w * KEY_UNIT - 4}px`,
          minWidth: `${w * KEY_UNIT - 4}px`,
          height: '36px',
          margin: '3px',
          fontSize: w >= 1.5 ? '10px' : '11px',
        }}
        title={key.code}
      >
        {key.altLabel ? (
          <>
            <span className="leading-none text-center" style={{ fontSize: '9px' }}>
              {key.altLabel}
            </span>
            <span className="leading-none text-center">{key.label}</span>
          </>
        ) : (
          <span className="leading-none text-center px-1 truncate w-full text-center">
            {key.label}
          </span>
        )}
        {isTested && !isPressed && (
          <span
            className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400"
            title="Tested"
          />
        )}
      </div>
    );
  };

  const renderRow = (row: KeyRow, rowIdx: number) => (
    <div key={rowIdx} className="flex flex-row flex-nowrap">
      {row.keys.map((key, keyIdx) => renderKey(key, rowIdx, keyIdx))}
    </div>
  );

  const totalKeys =
    rows.reduce((acc, r) => acc + r.keys.length, 0) +
    (numpadRows ? numpadRows.reduce((acc, r) => acc + r.keys.length, 0) : 0);

  const pressedList = Array.from(pressedKeys);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <SiteHeader />

      {/* Page Hero */}
      <div className="pt-24 pb-8 px-6 lg:px-8 border-b border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-2 glass-card rounded-full px-3 py-1.5 text-xs font-semibold text-primary uppercase tracking-widest mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-glow" />
                Live Testing
              </span>
              <h1 className="text-hero-sm font-bold text-foreground">
                {pageTitle.split(' ').slice(0, -1).join(' ')}{' '}
                <span className="text-primary">{pageTitle.split(' ').slice(-1)[0]}</span>
              </h1>
              <p className="text-muted-foreground text-sm mt-2 max-w-md">{pageDescription}</p>
            </div>
            <div className="text-xs text-muted-foreground font-mono">
              {testedKeys.size} / {totalKeys} keys tested
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 space-y-6">
        {/* Controls + Keyboard Card */}
        <div className="glass-card rounded-2xl p-6 md:p-8">
          {/* Card Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" />
                </svg>
                {pageTitle}
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Press any key to test. Keys light up cyan when pressed.
              </p>
            </div>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-border transition-all"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              Reset
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="glass-card rounded-xl p-3 text-center">
              <div className="font-mono text-2xl font-bold text-primary">{testedKeys.size}</div>
              <div className="text-xs text-muted-foreground mt-1">Keys Tested</div>
            </div>
            <div className="glass-card rounded-xl p-3 text-center">
              <div className="font-mono text-2xl font-bold text-violet-400">{totalKeys}</div>
              <div className="text-xs text-muted-foreground mt-1">Total Keys</div>
            </div>
            <div className="glass-card rounded-xl p-3 text-center">
              <div className="font-mono text-2xl font-bold text-amber-400">
                {totalKeys - testedKeys.size}
              </div>
              <div className="text-xs text-muted-foreground mt-1">Remaining</div>
            </div>
            <div className="glass-card rounded-xl p-3 text-center">
              <div className="font-mono text-2xl font-bold text-emerald-400">
                {totalKeys > 0 ? Math.round((testedKeys.size / totalKeys) * 100) : 0}%
              </div>
              <div className="text-xs text-muted-foreground mt-1">Progress</div>
            </div>
          </div>

          {/* Layout selector and key legend are kept next to the keyboard. */}
          <div className="mb-5 flex flex-col gap-4 rounded-xl border border-border bg-secondary/30 p-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="w-full lg:max-w-xs">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Keyboard Layout</label>
              <select value={layout} onChange={(e) => setLayout(e.target.value as LayoutId)} className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                {LAYOUT_OPTIONS.map((opt) => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
              </select>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-2"><i className="h-5 w-6 rounded key-cap key-cap-pressed" />Pressed</span>
              <span className="flex items-center gap-2"><i className="h-5 w-6 rounded key-cap key-cap-tested" />Tested</span>
              <span className="flex items-center gap-2"><i className="h-5 w-6 rounded key-cap animate-rgb-pulse" />RGB highlight</span>
            </div>
          </div>

          {/* Keyboard */}
          <div className="overflow-x-auto pb-2">
            <div className="inline-block min-w-max">
              <div className="flex gap-4">
                {/* Main keys */}
                <div className="flex flex-col gap-0">
                  {rows.map((row, rowIdx) => renderRow(row, rowIdx))}
                </div>
                {/* Numpad */}
                {numpadRows && (
                  <div className="flex flex-col gap-0 ml-2 pl-2 border-l border-border">
                    {numpadRows.map((row, rowIdx) => (
                      <div key={rowIdx} className="flex flex-row flex-nowrap">
                        {row.keys.map((key, keyIdx) => renderKey(key, rowIdx + 100, keyIdx))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Prompt / Active indicator */}
          {!testStarted ? (
            <div className="mt-6 text-center py-8 border-t border-border">
              <div className="text-4xl mb-3 opacity-30">⌨️</div>
              <p className="text-muted-foreground text-sm">
                Click on this area and start pressing keys on your keyboard
              </p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                Keys will highlight in cyan as you press them
              </p>
              <button
                onClick={() => setTestStarted(true)}
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary-foreground bg-primary rounded-full px-6 py-2.5 hover:opacity-90 active:scale-95 transition-all duration-150 glow-cyan"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 3l14 9-14 9V3z" />
                </svg>
                Start Test
              </button>
            </div>
          ) : (
            <div className="mt-6 border-t border-border pt-4">
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-card text-primary text-sm font-medium">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
                  Test Active — Press any key
                </span>
                <span className="text-xs text-muted-foreground font-mono">
                  {pressedList.length} key{pressedList.length !== 1 ? 's' : ''} held
                </span>
              </div>
              {pressedList.length > 0 && (
                <div className="flex flex-wrap gap-2 min-h-[40px]">
                  {pressedList.map((code) => (
                    <span
                      key={code}
                      className="px-3 py-1 rounded-lg glass-card border border-primary/40 text-primary text-sm font-mono font-medium animate-pulse"
                    >
                      {code}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Controls Panel */}
        <div className="hidden">
          <h2 className="text-lg font-bold text-foreground mb-5 flex items-center gap-2">
            <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
            </svg>
            Settings
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Layout */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-muted-foreground">
                Keyboard Layout
              </label>
              <select
                value={layout}
                onChange={(e) => setLayout(e.target.value as LayoutId)}
                className="w-full rounded-lg border border-border bg-secondary text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {LAYOUT_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Platform */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-muted-foreground">
                Platform
              </label>
              <div className="flex flex-col gap-1.5">
                {(['windows', 'macos', 'linux'] as Platform[]).map((p) => (
                  <label key={p} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="platform"
                      value={p}
                      checked={platform === p}
                      onChange={() => setPlatform(p)}
                      className="accent-primary"
                    />
                    <span className="text-sm text-foreground/80">
                      {p === 'macos' ? 'macOS' : p.charAt(0).toUpperCase() + p.slice(1)}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Region */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-muted-foreground">
                Region
              </label>
              <div className="flex flex-col gap-1.5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="region"
                    value="ansi"
                    checked={region === 'ansi'}
                    onChange={() => setRegion('ansi')}
                    className="accent-primary"
                  />
                  <span className="text-sm text-foreground/80">ANSI (US)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="region"
                    value="iso"
                    checked={region === 'iso'}
                    onChange={() => setRegion('iso')}
                    className="accent-primary"
                  />
                  <span className="text-sm text-foreground/80">ISO (UK/EU)</span>
                </label>
              </div>
            </div>

            {/* Theme */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-muted-foreground">
                Theme
              </label>
              <div className="flex flex-col gap-1.5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="theme"
                    value="dark"
                    checked={theme === 'dark'}
                    onChange={() => setTheme('dark')}
                    className="accent-primary"
                  />
                  <span className="text-sm text-foreground/80">🌙 Dark</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="theme"
                    value="light"
                    checked={theme === 'light'}
                    onChange={() => setTheme('light')}
                    className="accent-primary"
                  />
                  <span className="text-sm text-foreground/80">☀️ Light</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="glass-card rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Legend</h3>
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-7 rounded key-cap key-cap-pressed flex items-center justify-center text-xs font-mono" />
              <span className="text-muted-foreground">Currently Pressed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-7 rounded key-cap key-cap-tested flex items-center justify-center text-xs font-mono" />
              <span className="text-muted-foreground">Tested ✓</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-7 rounded key-cap animate-rgb-pulse flex items-center justify-center text-xs font-mono" />
              <span className="text-muted-foreground">RGB Highlight</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-7 rounded key-cap flex items-center justify-center text-xs font-mono" />
              <span className="text-muted-foreground">Not Tested</span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="glass-card rounded-2xl p-5">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-muted-foreground">Test Progress</span>
            <span className="text-primary font-medium font-mono">
              {testedKeys.size} / {totalKeys} keys
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${totalKeys > 0 ? (testedKeys.size / totalKeys) * 100 : 0}%`,
                background: 'linear-gradient(90deg, #00D4FF, #10b981)',
                boxShadow: '0 0 8px rgba(0,212,255,0.5)',
              }}
            />
          </div>
        </div>

        {/* Keyboard layouts grid */}
        <div className="hidden">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">More Keyboard Layouts</h2>
            <span className="text-xs text-muted-foreground font-mono">8 layouts available</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {[
              { href: '/keyboard-test', emoji: '⌨️', label: 'Full Size', desc: '104/108 key layout', color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20' },
              { href: '/tkl-keyboard-test', emoji: '⌨️', label: 'TKL', desc: 'Tenkeyless layout', color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
              { href: '/65-percent-keyboard-test', emoji: '⌨️', label: '65%', desc: 'Compact with arrows', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
              { href: '/60-percent-keyboard-test', emoji: '⌨️', label: '60%', desc: 'Ultra compact layout', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
              { href: '/mac-keyboard-test', emoji: '🍎', label: 'Mac', desc: 'Apple keyboard layout', color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/20' },
              { href: '/laptop-keyboard-test', emoji: '💻', label: 'Laptop', desc: 'Built-in laptop keys', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
              { href: '/iso-keyboard-test', emoji: '🇬🇧', label: 'ISO', desc: 'UK/EU standard layout', color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
              { href: '/ansi-keyboard-test', emoji: '🇺🇸', label: 'ANSI', desc: 'US standard layout', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="glass-card-hover rounded-xl p-4 flex flex-col items-center text-center gap-2 group"
              >
                <div className={`w-10 h-10 ${item.bg} border ${item.border} rounded-xl flex items-center justify-center text-lg`}>
                  {item.emoji}
                </div>
                <div>
                  <p className={`text-xs font-semibold ${item.color} group-hover:opacity-90 transition-opacity leading-tight`}>
                    {item.label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-tight hidden sm:block">
                    {item.desc}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
