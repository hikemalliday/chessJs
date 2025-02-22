import { Pawn } from "../classes/pawn.js";
import { Rook } from "../classes/rook.js";
import { Bishop } from "../classes/bishop.js";
import { Queen } from "../classes/queen.js";
import { King } from "../classes/king.js";
import { Knight } from "../classes/knight.js";

export function doubleCheck(y, x, board) {
  const pieceLookup = {
    "0-0": null,
    "0-1": new King("king", "black", board, y, x),
    "0-2": null,
    "0-3": null,
    "0-4": new Rook("rook", "black", board, y, x),
    "0-5": null,
    "0-6": null,
    "0-7": null,
    "1-0": new Pawn("pawn", "black", board, y, x),
    "1-1": new Pawn("pawn", "black", board, y, x),
    "1-2": null,
    "1-3": null,
    "1-4": null,
    "1-5": null,
    "1-6": null,
    "1-7": null,
    "2-3": new Rook("rook", "white", board, y, x),
    "5-6": new Bishop("bishop", "white", board, y, x),
    "6-0": null,
    "6-1": null,
    "6-2": null,
    "6-3": null,
    "6-4": new Pawn("pawn", "white", board, y, x),
    "6-5": null,
    "6-6": null,
    "6-7": null,
    "7-0": null,
    "7-1": new Knight("knight", "white", board, y, x),
    "7-2": new Bishop("bishop", "white", board, y, x),
    "7-3": new Queen("queen", "white", board, y, x),
    "7-4": new King("king", "white", board, y, x),
    "7-5": new Bishop("bishop", "white", board, y, x),
    "7-6": new Knight("knight", "white", board, y, x),
    "7-7": new Rook("rook", "white", board, y, x),
  };
  return pieceLookup[`${y}-${x}`];
}

export function castle(y, x, board) {
  const pieceLookup = {
    "0-0": new Rook("rook", "black", board, y, x),
    "0-1": null,
    "0-2": null,
    "0-3": null,
    "0-4": new King("king", "black", board, y, x),
    "0-5": new Bishop("bishop", "black", board, y, x),
    "0-6": null,
    "0-7": new Rook("rook", "black", board, y, x),
    "1-0": new Pawn("pawn", "black", board, y, x),
    "1-1": new Pawn("pawn", "black", board, y, x),
    "1-2": new Pawn("pawn", "black", board, y, x),
    "1-3": new Pawn("pawn", "black", board, y, x),
    "1-4": new Pawn("pawn", "black", board, y, x),
    "1-5": new Pawn("pawn", "black", board, y, x),
    "1-6": new Pawn("pawn", "black", board, y, x),
    "1-7": new Pawn("pawn", "black", board, y, x),
    "5-2": null,
    "5-3": null,
    "5-4": new Queen("queen", "black", board, y, x),
    "5-5": null,
    "6-0": new Pawn("pawn", "white", board, y, x),
    "6-1": new Pawn("pawn", "white", board, y, x),
    "6-2": null,
    "6-3": new Pawn("pawn", "white", board, y, x),
    "6-4": null,
    "6-5": new Pawn("pawn", "white", board, y, x),
    "6-6": null,
    "6-7": null,
    "7-0": new Rook("rook", "white", board, y, x),
    "7-1": null,
    "7-2": null,
    "7-3": null,
    "7-4": new King("king", "white", board, y, x),
    "7-5": null,
    "7-6": null,
    "7-7": new Rook("rook", "white", board, y, x),
  };
  return pieceLookup[`${y}-${x}`];
}
