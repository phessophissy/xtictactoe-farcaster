import { describe, it, expect } from 'vitest';
import { checkWinner, checkDraw, getAvailableMoves, getAIMove, Board } from '../game';

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
        const board: Board = [
            'X', 'X', 'X',
            'O', 'O', 'X',
            'O', 'X', 'O'
        ];
        expect(checkDraw(board)).toBe(false);
    });
});

describe('getAvailableMoves', () => {
    it('should return all indices for an empty board', () => {
        const board: Board = Array(9).fill(null);
        expect(getAvailableMoves(board)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
    });

    it('should return empty array for full board', () => {
        const board: Board = Array(9).fill('X');
        expect(getAvailableMoves(board)).toEqual([]);
    });

    it('should return correct indices for partial board', () => {
        const board: Board = [
            'X', null, 'O',
            null, 'X', null,
            'O', null, 'X'
        ];
        // Indices 1, 3, 5, 7 are null
        expect(getAvailableMoves(board)).toEqual([1, 3, 5, 7]);
    });
});

describe('AI Logic', () => {
    it('Hard AI should block immediate threat', () => {
        // X has two in a row, O should block
        const board: Board = [
            'X', 'X', null,
            null, 'O', null,
            null, null, null
        ];
        // In this board, X is about to win at index 2.
        // getAIMove(board, 'hard') returns the move index.
        const move = getAIMove(board, 'hard');
        expect(move).toBe(2);
    });

    it('Hard AI should take winning move', () => {
        // O has two in a row, should take the win
        const board: Board = [
            'O', 'O', null,
            'X', 'X', null,
            null, null, null
        ];
        // O wins at 2
        const move = getAIMove(board, 'hard');
        expect(move).toBe(2);
    });

    it('Easy AI should return a valid move', () => {
        const board: Board = Array(9).fill(null);
        const move = getAIMove(board, 'easy');
        expect(move).toBeGreaterThanOrEqual(0);
        expect(move).toBeLessThan(9);
    });

    it('Medium AI should return a valid move', () => {
        const board: Board = Array(9).fill(null);
        const move = getAIMove(board, 'medium');
        expect(move).toBeGreaterThanOrEqual(0);
        expect(move).toBeLessThan(9);
    });
});
