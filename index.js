const express = require('express');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
app.use(express.json());

// Criar pasta data se não existir
const dbDir = path.join(__dirname, 'data');
if (!require('fs').existsSync(dbDir)) require('fs').mkdirSync(dbDir);

const db = new Database(path.join(dbDir, 'folha.db'));

// Inicialização das Tabelas (Baseado no Doc 02 e 03)
db.exec(`
  CREATE TABLE IF NOT EXISTS entities (
    id TEXT PRIMARY KEY, name TEXT, cnpj TEXT UNIQUE, type TEXT, regime TEXT
  );

  CREATE TABLE IF NOT EXISTS employees (
    id TEXT PRIMARY KEY, 
    entity_id TEXT, 
    name TEXT, 
    cpf TEXT UNIQUE, 
    birth_date TEXT, 
    hire_date TEXT,
    employment_type TEXT, 
    pension_regime TEXT, 
    base_salary REAL, 
    active INTEGER DEFAULT 1,
    FOREIGN KEY(entity_id) REFERENCES entities(id)
  );

  CREATE TABLE IF NOT EXISTS payroll_periods (
    id TEXT PRIMARY KEY, 
    entity_id TEXT, 
    year INTEGER, 
    month INTEGER, 
    status TEXT DEFAULT 'open'
  );
`);

console.log("✅ Fundação do Banco de Dados pronta.");
app.listen(3001, () => console.log("🚀 Servidor rodando na porta 3001"));
