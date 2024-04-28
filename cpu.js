// Import the createMemory module
const createMemory = require('./create-memory');

// Import the instructions module
const instructions = require('./instructions'); 

// Define the CPU class
class CPU {
    // Constructor for the CPU class
    constructor(memory){
        // Initialize memory
        this.memory = memory;
        
        // Define register names
        this.registerNames = ["ip", "acc", "r1", "r2","r3","r4","r5","r6","r7", "r8"]
        
        // Create memory for the registers
        this.registers = createMemory(this.registerNames.length * 2);

        // Map register names to their respective memory locations
        this.registerMap = this.registerNames.reduce((map, name, i) => {
            map[name] = i * 2;
            return map;
        }, {})
    }

    // Method to print register values for debugging
    debug(){
        this.registerNames.forEach((name) => {
            console.log(`${name}: 0x${this.getRegister(name).toString(16).padStart(4, "0")}`)
        })
    }

    // Method to get the value of a register
    getRegister(name){
        // Check if the register exists
        if(!(name in this.registerMap)){
            throw new Error(`getRegister: This register does not exist ${name}`)
        }
        // Return the value of the register
        return this.registers.getUint16(this.registerMap[name]);
    }

    // Method to set the value of a register
    setRegister(name, value){
        // Check if the register exists
        if(!(name in this.registerMap)){
            throw new Error(`setRegister: This register does not exist ${name}`)
        }

        // Set the value of the register
        this.registers.setUint16(this.registerMap[name], value);
    }

    // Method to fetch the next instruction
    fetch() {
        const nextInstructionAddress = this.getRegister('ip');
        const instruction = this.memory.getUint8(nextInstructionAddress);
        this.setRegister('ip', nextInstructionAddress + 1);
        return instruction;
      }

    // Method to fetch the next 16-bit instruction
    fetch16(){
        const nextInstructionAddress = this.getRegister('ip');
        const instruction = this.memory.getUint16(nextInstructionAddress);
        this.setRegister('ip', nextInstructionAddress + 2);
        return instruction;
    }

    // Method to execute an instruction
    execute(instruction){
        switch(instruction){
            case instructions.MOV_LIT_R1: {
                const literal = this.fetch16()
                this.setRegister("r1", literal)
                return;
            }
            case instructions.MOV_LIT_R2: {
                const literal = this.fetch16()
                this.setRegister("r2", literal)
                return;
            }

            case instructions.ADD_REG_REG: {
                const r1 = this.fetch();
                const r2 = this.fetch();

                const registerValue1 = this.registers.getUint16(r1 * 2);
                const registerValue2 = this.registers.getUint16(r2 * 2);
                this.setRegister("acc", registerValue1 + registerValue2);
                return;
            }

        }
    }

    // Method to execute a single step
    step(){
        const instruction = this.fetch();
        return this.execute(instruction);
    }
} 

// Export the CPU class
module.exports = CPU;
