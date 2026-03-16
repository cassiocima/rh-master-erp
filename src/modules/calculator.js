// src/modules/calculator.js
const CONSTANTES = {
    IR_DEP: 189.59,
    TETO_INSS: 8157.41
};

function calculatePayroll({ baseSalary, dependents = 0, events = [] }) {
    let gross = baseSalary;
    let details = [{ desc: 'Salário Base', valor: baseSalary, tipo: 'C' }];

    // 1. Soma Proventos (Horas extras, etc)
    events.filter(e => e.nature === 'earning').forEach(e => {
        gross += e.amount;
        details.push({ desc: e.description, valor: e.amount, tipo: 'C' });
    });

    // 2. INSS Progressivo 2025 (Doc 02)
    const inss = calcInss(gross);
    details.push({ desc: 'INSS', valor: inss, tipo: 'D' });

    // 3. IRRF com Dedução de Dependente (Doc 04)
    const baseIRRF = gross - inss - (dependents * CONSTANTES.IR_DEP);
    const irrf = calcIrrf(baseIRRF);
    if (irrf > 0) details.push({ desc: 'IRRF', valor: irrf, tipo: 'D' });

    const totalD = details.filter(d => d.tipo === 'D').reduce((a, b) => a + b.valor, 0);

    return {
        grossSalary: gross,
        netSalary: gross - totalD,
        inssAmount: inss,
        irrfAmount: irrf,
        details
    };
}

function calcInss(base) {
    const b = Math.min(base, CONSTANTES.TETO_INSS);
    let t = 0;
    if (b <= 1518) return b * 0.075;
    t += 1518 * 0.075;
    if (b > 1518) t += (Math.min(b, 2793.88) - 1518) * 0.09;
    if (b > 2793.88) t += (Math.min(b, 4190.83) - 2793.88) * 0.12;
    if (b > 4190.83) t += (Math.min(b, 8157.41) - 4190.83) * 0.14;
    return t;
}

function calcIrrf(base) {
    if (base <= 2428.80) return 0;
    if (base <= 2826.65) return (base * 0.075) - 182.16;
    if (base <= 3751.05) return (base * 0.15) - 394.16;
    if (base <= 4664.68) return (base * 0.225) - 675.49;
    return (base * 0.275) - 908.74;
}

module.exports = { calculatePayroll };
