const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3002/api/testing/reset')
    await request.post('http://localhost:3002/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await request.post('http://localhost:3002/api/users', {
      data: {
        name: 'Digonto',
        username: 'nightwolf',
        password: 'hello'
      }
    })
    

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown after clicking the login button', async ({ page }) => {
    const usernameField = await page.getByTestId('username')
    const passwordField = await page.getByTestId('password')

    await expect(usernameField).not.toBeVisible()
    await expect(passwordField).not.toBeVisible()

    const loginButton = await page.getByRole('button', { name: 'log in' })
    await loginButton.click()

    await expect(usernameField).toBeVisible()
    await expect(passwordField).toBeVisible()
  })

  test('user can login with correct credentials', async ({ page }) => {
    await loginWith(page, 'mluukkai', 'salainen')
  
    await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
  })

  test('login fails with wrong password', async ({ page }) => {
    await loginWith(page, 'mluukkai', 'wrong')

    const errorDiv = await page.locator('.notification')
    await expect(errorDiv).toContainText('Wrong credentials')
    await expect(errorDiv).toHaveCSS('border-style', 'solid')
    await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
    await expect(await page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
  })

  test('only the user who created the blog can see the delete button', async ({ page }) => {
    await loginWith(page, 'mluukkai', 'salainen')
    await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    const blogTitle = 'Blog to Like'
    const blogAuthor = 'Author Name'
    const blogUrl = 'https://example.com'
    
    await createBlog(page, blogTitle, blogAuthor, blogUrl)
    await expect(page.getByText(`${blogTitle} by ${blogAuthor}`)).toBeVisible()
    
    await page.getByRole('button', { name: 'view' }).click()
    const deleteButton = page.getByRole('button', { name: 'Delete' })
    await expect(deleteButton).toBeVisible()

    const logoutButton = page.getByRole('button', { name: 'logout' })
    await expect(logoutButton).toBeVisible()

    await logoutButton.click()
    
    const loginButton = page.getByRole('button', { name: 'login' })
    await expect(loginButton).toBeVisible()

    await page.getByTestId('username').fill('nightwolf')
    await page.getByTestId('password').fill('hello')
    await page.getByRole('button', { name: 'login' }).click()
    await expect(page.getByText('Digonto logged in')).toBeVisible()
    
    await expect(page.getByText(`${blogTitle} by ${blogAuthor}`)).toBeVisible()
    await expect(deleteButton).not.toBeVisible()
  })

  

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
    })
  
    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'Hello World', 'Digonto Shahniaz', 'https://playwright.dev')
      await expect(page.getByText('Hello World by Digonto Shahniaz')).toBeVisible()
    })

    describe('and blogs exist', () => {
      beforeEach(async ({ page }) => {
        const blogTitle = 'Blog to Like'
        const blogAuthor = 'Author Name'
        const blogUrl = 'https://example.com'
        await createBlog(page, blogTitle, blogAuthor, blogUrl)
      })
      
      test('a blog can be liked', async ({ page }) => {
        await expect(page.getByText('Blog to Like by Author Name')).toBeVisible()
        await page.getByRole('button', { name: 'view' }).click()

        const likeButton = page.getByRole('button', { name: 'like' })
        await expect(likeButton).toBeVisible()
  
        const likesElement = page.getByText('Likes: 0')
        await expect(likesElement).toBeVisible()
  
        await likeButton.click()
  
        const updatedLikes = page.getByText('Likes: 1')
        await expect(updatedLikes).toBeVisible()
      })

      test('user who created a blog can delete it', async ({ page, request }) => {
        await expect(page.getByText('Blog to Like by Author Name')).toBeVisible()
        await page.getByRole('button', { name: 'view' }).click()

        const button = page.getByRole('button', { name: 'Delete' })
        await expect(button).toBeVisible()
        await button.click()

        page.on('dialog', async (dialog) => {
          expect(dialog.message()).toBe('Are you sure you want to delete "Blog to Like"?')
          await dialog.accept()
        })

        await expect(page.getByText('Blog to Like by Author Name')).not.toBeVisible()
      })
    })

  }) 
})
