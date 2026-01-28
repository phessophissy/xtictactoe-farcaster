import { describe, it, expect } from 'vitest';
import { checkWinner, Board } from '../game';

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
