const createMemory = require('./create-memory');
const CPU = require('./cpu');
const instructions = require('./instructions');

const memory = createMemory(256);
const writableByte = new Uint8Array(memory.buffer);

const cpu = new CPU(memory);

writableByte[0] = instructions.MOV_LIT_R1;
writableByte[1] = 0x12;
writableByte[2] = 0x34;

writableByte[3] = instructions.MOV_LIT_R2;
writableByte[4] = 0xAB;
writableByte[5] = 0x34;

writableByte[6] = instructions.ADD_REG_REG;
writableByte[7] = 2;
writableByte[8] = 3;

cpu.step()
cpu.debug()
cpu.step()
cpu.debug()
cpu.step()
cpu.debug()

