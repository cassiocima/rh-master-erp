const Database = require('better-sqlite3');
const path = require('path');
const crypto = require('crypto');

const db = new Database(path.join(__dirname, 'data', 'folha.db'));

function seed() {
    console.log("🌱 Iniciando carga de dados de teste...");

    // 1. Limpar dados antigos (para não duplicar)
    db.prepare('DELETE FROM dependents').run();
    db.prepare('DELETE FROM employees').run();
    db.prepare('DELETE FROM entities').run();

    // 2. Criar a Empresa (Doc 02)
    const entityId = 'entity-demo';
    db.prepare(`
        INSERT INTO entities (id, name, cnpj, type, regime) 
        VALUES (?, 'RH Master Tech Ltda', '12.345.678/0001-99', 'private', 'clt')
    `).run(entityId);

    // 3. Criar Funcionários (Doc 03)
    const employees = [
        { name: 'Carlos Alberto (Diretor)', cpf: '111.111.111-11', salary: 15000, dep: 2 },
        { name: 'Ana Souza (Analista)', cpf: '222.222.222-22', salary: 5500, dep: 1 },
        { name: 'Bruno Lima (Assistente)', cpf: '333.333.333-33', salary: 2200, dep: 0 }
    ];

    for (const emp of employees) {
        const empId = crypto.randomUUID();
        
        // Inserir Funcionário
        db.prepare(`
            INSERT INTO employees (id, entity_id, name, cpf, birth_date, hire_date, employment_type, pension_regime, base_salary)
            VALUES (?, ?, ?, ?, '1990-01-01', '2024-01-01', 'clt', 'rgps', ?)
        `).run(empId, entityId, emp.name, emp.cpf, emp.salary);

        // Inserir Dependentes para teste de IRRF (Doc 04)
        for (let i = 0; i < emp.dep; i++) {
            db.prepare(`
                INSERT INTO dependents (id, employee_id, name, birth_date, ir_deduction)
                VALUES (?, ?, ?, '2015-05-10', 1)
            `).run(crypto.randomUUID(), empId, `Dependente ${i+1} de ${emp.name}`);
        }
    }

    console.log("✅ Carga finalizada! 1 Empresa, 3 Funcionários e Dependentes criados.");
}

seed();
