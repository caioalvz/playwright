import { test, expect } from '@playwright/test';

const BASE_URL = 'https://alisonmelo.github.io/tioalison-pe-t4-fap26/projetos-base/01-sistema-login';

test.describe('Efetua login como Administrador e clica nas abas Usuários, Lojas e Produtos, respectivamente.', () => {

    test.beforeEach('Validar título e carregamento da página', async ({ page }) => {
        await page.goto(`${BASE_URL}/login.html`);
        await expect(page).toHaveTitle(/LojaQA | Entrar/i);
        await expect(page.locator('#email')).toBeVisible();
        await expect(page.locator('#password')).toBeVisible();
        await expect(page.locator('#loginBtn')).toBeVisible();
        await expect(page.locator('#loginBtn')).toBeDisabled();
        await page.fill('#email', 'admin@system.com');
        await page.fill('#password', 'AdminPassword123');
        await expect(page.locator('#loginBtn')).toBeEnabled();
        await page.click('#loginBtn');
        await expect(page).toHaveURL(/painel\.html/);
    })

    test('Acessa aba usuários', async ({ page }) => {
        await page.getByRole('button', { name: 'Usuários' }).click();
        await page.waitForTimeout(3000);
        await page.getByRole('button', {name: 'Usuário Padrão'}).click();
    })

    test('Acessa aba lojas', async ({ page }) => {
        await page.getByRole('button', {name: 'Lojas' }).click();
        await page.waitForTimeout(3000);
        await page.getByRole('button', {name: 'Vitrine Tech'}).click();
        
    })

    test('Acessa aba produtos', async ({ page }) => {
        await page.getByRole('button', {name: 'Produtos' }).click();
        await page.waitForTimeout(3000);
        await page.getByRole('button', {name: 'Mouse Óptico Atlas'}).click();
    })
})
