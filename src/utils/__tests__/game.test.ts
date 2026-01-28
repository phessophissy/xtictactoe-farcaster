import { describe, it, expect } from 'vitest';
import { checkWinner, checkDraw, Board } from '../game';

describe('checkWinner', () => {
    it('should return null for an empty board', () => {
        const board: Board = Array(9).fill(null);
        expect(checkWinner(board)).toEqual({ winner: null, winningLine: null });
    });

    it('should detect X winning locally (row 1)', () => {
        const board: Board = [
            'X', 'X', 'X',
            null, null, null,
            null, null, null
        ];
        expect(checkWinner(board)).toEqual({ winner: 'X', winningLine: [0, 1, 2] });
    });

    it('should detect O winning (column 2)', () => {
        const board: Board = [
            null, 'O', null,
            null, 'O', null,
            null, 'O', null
        ];
        expect(checkWinner(board)).toEqual({ winner: 'O', winningLine: [1, 4, 7] });
    });

    it('should detect X winning (diagonal)', () => {
        const board: Board = [
            'X', null, null,
            null, 'X', null,
            null, null, 'X'
        ];
        expect(checkWinner(board)).toEqual({ winner: 'X', winningLine: [0, 4, 8] });
    });

    it('should return null if no winner yet', () => {
        const board: Board = [
            'X', 'O', 'X',
            'O', 'X', 'O',
            null, null, null
        ];
        expect(checkWinner(board)).toEqual({ winner: null, winningLine: null });
    });
});

describe('checkDraw', () => {
    it('should return false for an empty board', () => {
        const board: Board = Array(9).fill(null);
        expect(checkDraw(board)).toBe(false);
    });

    it('should return false for a partially filled board with no winner', () => {
        const board: Board = [
            'X', 'O', 'X',
            null, null, null,
            null, null, null
        ];
        expect(checkDraw(board)).toBe(false);
    });

    it('should return true for a full board with no winner', () => {
        const board: Board = [
            'X', 'O', 'X',
            'X', 'X', 'O',
            'O', 'X', 'O'
        ];
        expect(checkDraw(board)).toBe(true);
    });

    it('should return false for a full board with a winner', () => {
        // X wins on first row, but board is full
        const board: Board = [
            'X', 'X', 'X',
            'O', 'O', 'X',
            'O', 'X', 'O'
        ];
        expect(checkDraw(board)).toBe(false);
    });
});
