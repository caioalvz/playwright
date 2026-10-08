// Importa as funções principais 'test' e 'expect' da biblioteca do Playwright
import { test, expect } from '@playwright/test';

// Define a URL base da aplicação que será testada para evitar repetição de código nas navegações
const BASE_URL = 'https://alisonmelo.github.io/tioalison-pe-t4-fap26/projetos-base/01-sistema-login';

// ==========================================
// ATO 1: Validar carregamento e visibilidade
// ==========================================
test.describe('ato 1 - validar carregamento e visibilidade de elementos', () => {

    // Teste 1: Verifica se a página abre e se o título da aba está correto
    test('Validar título e carregamento da página', async ({ page }) => {
        // Acessa a página de login utilizando a URL base concatenada
        await page.goto(`${BASE_URL}/login.html`);
        
        // Valida se o título da página corresponde à expressão regular informada
        await expect(page).toHaveTitle(/LojaQA | Entrar/i);
    });

    // Teste 2: Verifica se os campos de email, senha e botão de login aparecem na tela e se o botão começa desativado
    test('Verificar exibição dos campos do form de login', async ({ page }) => {
        // Navega até a página de login
        await page.goto(`${BASE_URL}/login.html`);

        // Valida se o campo de e-mail está visível na tela
        await expect(page.locator('#email')).toBeVisible();
        // Valida se o campo de senha está visível na tela
        await expect(page.locator('#password')).toBeVisible();
        // Valida se o botão de login está visível na tela
        await expect(page.locator('#loginBtn')).toBeVisible();
        // Valida que o botão de login começa desativado por padrão (vazio)
        await expect(page.locator('#loginBtn')).toBeDisabled();
    });

});

// ==========================================
// ATO 2: Caminho feliz e validações de login
// ==========================================
test.describe('ato 2 - caminho feliz', () => {

    // Teste 1: Realiza o login com sucesso preenchendo credenciais válidas
    test('Validar acesso e redirecionar ao painel', async ({ page }) => {
        // Navega até a página de login
        await page.goto(`${BASE_URL}/login.html`);
        
        // Preenche o campo de e-mail com um usuário válido
        await page.fill('#email', 'admin@system.com');
        // Preenche o campo de senha com a senha válida
        await page.fill('#password', 'AdminPassword123');
        
        // Como os campos foram preenchidos corretamente, valida se o botão de login ficou habilitado
        await expect(page.locator('#loginBtn')).toBeEnabled();
        // Executa o clique no botão de login
        await page.click('#loginBtn');
        
        // Valida se após o clique a URL foi alterada para conter 'painel.html'
        await expect(page).toHaveURL(/painel\.html/);
    });

    // Teste 2: Valida que o botão continua bloqueado caso o formato do e-mail seja inválido
    test('Verificar botão login desativado quando e-mail incorreto.', async ({ page }) => {
        // Navega até a página de login
        await page.goto(`${BASE_URL}/login.html`);
        
        // Insere um texto que não possui estrutura de e-mail no campo correspondente
        await page.fill('#email', 'email_sem_formato');
        // Insere uma senha qualquer
        await page.fill('#password', 'senha');

        // Como o e-mail é inválido, o botão de login deve permanecer desativado
        await expect(page.locator('#loginBtn')).toBeDisabled();
    });

});

// ==========================================
// ATO 3: Cadastro de Usuário Comum (Cliente)
// ==========================================
test.describe('ato 3 - Cadastrar usuário', () => {

    // O 'beforeEach' executa este bloco automaticamente ANTES de cada teste deste describe
    test.beforeEach(async ({ page }) => {
        // Vai para a tela de login
        await page.goto(`${BASE_URL}/login.html`);
        // Clica no link de "Criar conta" para ir à tela de cadastro (utilizando busca por texto/role)
        await page.getByRole('link', { name: /criar conta/i }).click();
    });

    // Teste 1: Valida se a página de cadastro carregou com o título correto
    test('Validar título e carregamento da página de cadastro.', async ({ page }) => {
        await expect(page).toHaveTitle(/QA System - Cadastro/i);
    });

    // Teste 2: Verifica se todos os campos básicos de cadastro estão visíveis
    test('Verificar exibição dos campos do form de login', async ({ page }) => {
        await expect(page.locator('#reg-name')).toBeVisible();
        await expect(page.locator('#reg-email')).toBeVisible();
        await expect(page.locator('#reg-password')).toBeVisible();
        await expect(page.locator('#reg-role')).toBeVisible();
    });

    // Teste 3: Preenche o formulário de cadastro gerando dados randômicos para evitar e-mails duplicados
    test('Preencher campos de criação de conta como usuário', async ({ page }) => {
        // Pega o timestamp atual (milissegundos) para garantir que os dados sejam únicos a cada execução
        const randomId = Date.now();
        const usuarioAleatorio = `Usuário ${randomId}`;
        const emailAleatorio = `user_${randomId}@test.com`;
        const senhaAleatoria = `senha${randomId}`;
        
        // Preenche os campos do cadastro com as variáveis dinâmicas
        await page.fill('#reg-name', usuarioAleatorio);
        await page.fill('#reg-email', emailAleatorio);
        await page.fill('#reg-password', senhaAleatoria);
        // Seleciona a opção "Cliente" no campo de seleção (select/dropdown)
        await page.selectOption('#reg-role', 'Cliente');

        // Valida se o botão de registro final está ativo para clique
        await expect(page.locator('#registerBtn')).toBeEnabled();
        // Clica no botão de registrar
        await page.click('#registerBtn');
    });

});

// ==========================================
// ATO 4: Cadastro de Lojista/Vendedor
// ==========================================
test.describe('ato 4 - Cadastrar Loja', () => {

    // Executa a navegação e o clique no link de cadastro antes de cada teste deste bloco
    test.beforeEach(async ({ page }) => {
        await page.goto(`${BASE_URL}/login.html`);
        await page.getByRole('link', { name: /criar conta/i }).click();
    });

    // Teste 1: Validação do título da página de cadastro
    test('Validar título e carregamento da página de cadastro.', async ({ page }) => {
        await expect(page).toHaveTitle(/QA System - Cadastro/i);
    });

    // Teste 2: Validação da visibilidade dos campos básicos
    test('Verificar exibição dos campos do form de login', async ({ page }) => {
        await expect(page.locator('#reg-name')).toBeVisible();
        await expect(page.locator('#reg-email')).toBeVisible();
        await expect(page.locator('#reg-password')).toBeVisible();
        await expect(page.locator('#reg-role')).toBeVisible();
    });

    // Teste 3: Preenche o cadastro selecionando o perfil de lojista (que abre um campo dinâmico de nome da loja)
    test('Preencher campos de criação de conta como lojista', async ({ page }) => {
        // Gera identificadores únicos baseados no momento exato do teste
        const randomId = Date.now();
        const lojistaAleatorio = `Lojista ${randomId}`;
        const emailLojista = `lojista_${randomId}@test.com`;
        const senhaLojista = `senha${randomId}`;
        const nomeLoja = `Loja ${randomId}`;

        // Preenche as informações pessoais do lojista
        await page.fill('#reg-name', lojistaAleatorio);
        await page.fill('#reg-email', emailLojista);
        await page.fill('#reg-password', senhaLojista);
        
        // Seleciona o perfil de lojista no dropdown (isso geralmente faz aparecer o campo extra da loja na tela)
        await page.selectOption('#reg-role', 'Lojista / vendedor');

        // Aguarda/valida se o campo específico de nome da loja se tornou visível após selecionar o perfil
        await expect(page.locator('#reg-store-name')).toBeVisible();
        // Preenche o nome da loja
        await page.fill('#reg-store-name', nomeLoja);

        // Valida se o botão de cadastro está habilitado e clica nele
        await expect(page.locator('#registerBtn')).toBeEnabled();
        await page.click('#registerBtn');
    });

});