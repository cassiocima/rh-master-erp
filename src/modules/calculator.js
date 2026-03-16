// src/modules/calculator.js
// Baseado rigorosamente no Doc 04
function calculatePayroll({ baseSalary, dependents = 0, events = [] }) {
    const IR_DEDUCTION_PER_DEP = 189.59;
    
    // 1. Cálculo do INSS Progressivo 2025
    let inss = 0;
    if (baseSalary <= 1518) inss = baseSalary * 0.075;
    else if (baseSalary <= 2793.88) inss = (baseSalary * 0.09) - 22.77;
    else if (baseSalary <= 4190.83) inss = (baseSalary * 0.12) - 106.59;
    else inss = (Math.min(baseSalary, 8157.41) * 0.14) - 190.41;

    // 2. Base de Cálculo IRRF
    const irrfBase = baseSalary - inss - (dependents * IR_DEDUCTION_PER_DEP);
    
    // 3. Cálculo IRRF 2025 (Simplificado para o exemplo)
    let irrf = 0;
    if (irrfBase > 2826.65) irrf = (irrfBase * 0.075) - 169.44;

    return {
        grossSalary: baseSalary,
        inssAmount: inss,
        irrfAmount: irrf,
        netSalary: baseSalary - inss - irrf
    };
}

module.exports = { calculatePayroll };
