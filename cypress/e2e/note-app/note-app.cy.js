describe('Note app', function () {
    beforeEach(function (){
        cy.request('POST', 'http://localhost:3001/api/testing/reset')
        const user = {
            name: 'HGX',
            username: 'sece1024',
            password: '123456'
        }
        cy.request('POST', 'http://localhost:3001/api/users', user)
        cy.visit('http://localhost:3000')
    })
    it('login page can be opened', function () {
        cy.contains('Notes')
        cy.contains('Note app, Department of Computer Science, University of Helsinki 2023')
    })

    it('login form can be opened', function () {
        cy.contains('login').click()
    })

    it('user can login', function () {
        cy.login({ username: 'sece1024', password: '123456' })
    })

    describe('when logged in', function () {
        beforeEach(function (){
            cy.login({ username: 'sece1024', password: '123456' })
        })
        it('a new note can be created', function () {
            cy.contains('new note').click()
            cy.get('input').type('a note created by cypress')
            cy.contains('save').click()
            cy.contains('a note created by cypress')
        })

        describe('add a note exists', function () {
            beforeEach(function (){
                cy.createNote({
                    content: 'another note cypress',
                    important: false
                })
            })

            it('it can be made important', function () {
                cy.contains('another note cypress')
                    .contains('make important')
                    .click()

                cy.contains('another note cypress')
                    .contains('make not important')
            })
        })
    })

    it('login fails with wrong password', function (){
        cy.contains('login').click()
        cy.get('#username').type('sece1024')
        cy.get('#password').type('12345')
        cy.get('#login-btn').click()

        cy.contains('Wrong credentials')
        cy.get('.error')
            .should('contain', 'Wrong credentials')
            .and('have.css', 'color', 'rgb(255, 0, 0)')
            .and('have.css', 'border-style', 'solid')

        cy.get('html').should('not.contain', 'HGX logged-in')
    })
})