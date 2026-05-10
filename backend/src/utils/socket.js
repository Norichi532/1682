// utils/socket.js — Singleton Socket.IO instance
let io;

const setIo = (instance) => { io = instance; };
const getIo = () => io;

module.exports = { setIo, getIo };
