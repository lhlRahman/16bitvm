// Define the CPU class
class CPU {
    // Constructor for the CPU class
    constructor(memory){
        // Initialize memory
        this.memory = memory;
        
        // Define register names
        this.registerNames = ["pc", "acc", "r1", "r2","r3","r4","r5","r6","r7", "r8"]
        // Create memory for the registers
        this.registers = createMemory(this.registerNames.length * 2);

        // Map register names to their respective memory locations
        this.registerMap = this.registerNames.reduce((map, name, i) => {
            map[name] = i * 2;
            return map;
        }, {})
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
}

// Export the CPU class
module.export = CPU;