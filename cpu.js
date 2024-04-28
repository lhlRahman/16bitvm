// Import the createMemory module
const createMemory = require('./create-memory');

// Import the instructions module
const instructions = require('./instructions');

// Define the CPU class
class CPU {
    constructor(memory) {
        // Initialize CPU with memory
        this.memory = memory;

        // Define register names
        this.registerNames = ["ip", "acc", "r1", "r2", "r3", "r4", "r5", "r6", "r7", "r8"];

        // Create memory for the registers
        this.registers = createMemory(this.registerNames.length * 2);

        // Map register names to their respective memory locations
        this.registerMap = this.registerNames.reduce((map, name, i) => {
            map[name] = i * 2;
            return map;
        }, {});
    }

    // Method to print register values for debugging
    debug() {
        this.registerNames.forEach(name => {
            console.log(`${name}: 0x${this.getRegister(name).toString(16).padStart(4, "0")}`);
        });
    }

    // Method to view memory at a specific address
    viewMemoryAt(address) {
        const nextEightBytes = Array.from({ length: 8 }, (_, i) => this.memory.getUint8(address + i))
            .map(v => `0x${v.toString(16).padStart(2, '0')}`);
        console.log(`0x${address.toString(16).padStart(4, '0')}: ${nextEightBytes.join(' ')}`);
    }

    // Method to get the value of a register
    getRegister(name) {
        if (!(name in this.registerMap)) {
            throw new Error(`getRegister: This register does not exist ${name}`);
        }
        return this.registers.getUint16(this.registerMap[name]);
    }

    // Method to set the value of a register
    setRegister(name, value) {
        if (!(name in this.registerMap)) {
            throw new Error(`setRegister: This register does not exist ${name}`);
        }
        this.registers.setUint16(this.registerMap[name], value);
    }

    // Method to fetch the next instruction (8-bit)
    fetch() {
        const nextInstructionAddress = this.getRegister('ip');
        const instruction = this.memory.getUint8(nextInstructionAddress);
        this.setRegister('ip', nextInstructionAddress + 1);
        return instruction;
    }

    // Method to fetch the next instruction (16-bit)
    fetch16() {
        const nextInstructionAddress = this.getRegister('ip');
        const instruction = this.memory.getUint16(nextInstructionAddress, true); // assuming little-endian
        this.setRegister('ip', nextInstructionAddress + 2);
        return instruction;
    }

    // Method to execute an instruction
    execute(instruction) {
        switch (instruction) {
            case instructions.MOV_LIT_REG: {
                const literal = this.fetch16();
                const registerIndex = this.fetch();
                const registerName = this.registerNames[registerIndex];
                this.setRegister(registerName, literal);
                break;
            }
            case instructions.MOV_REG_REG: {
                const fromIndex = this.fetch();
                const toIndex = this.fetch();
                const value = this.getRegister(this.registerNames[fromIndex]);
                this.setRegister(this.registerNames[toIndex], value);
                break;
            }
            case instructions.MOV_REG_MEM: {
                const registerIndex = this.fetch();
                const address = this.fetch16();
                const value = this.getRegister(this.registerNames[registerIndex]);
                this.memory.setUint16(address, value, true); // assuming little-endian
                break;
            }
            case instructions.MOV_MEM_REG: {
                const address = this.fetch16();
                const registerIndex = this.fetch();
                const value = this.memory.getUint16(address, true); // assuming little-endian
                this.setRegister(this.registerNames[registerIndex], value);
                break;
            }
            case instructions.ADD_REG_REG: {
                const r1Index = this.fetch();
                const r2Index = this.fetch();
                const value1 = this.getRegister(this.registerNames[r1Index]);
                const value2 = this.getRegister(this.registerNames[r2Index]);
                this.setRegister('acc', value1 + value2);
                break;
            }
            case instructions.JMP_NOT_EQ: {
                const value = this.fetch16();
                const address = this.fetch16();
                if (value !== this.getRegister('acc')) {
                    this.setRegister('ip', address);
                }
                break;
            }
        }
    }

    // Method to execute a single step
    step() {
        const instruction = this.fetch();
        this.execute(instruction);
    }
}

// Export the CPU class
module.exports = CPU;
