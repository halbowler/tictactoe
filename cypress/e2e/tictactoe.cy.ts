/// <reference types="cypress" />

describe("Tic Tac Toe App", () => {
    beforeEach(() => {
        cy.visit("https://roomy-fire-houseboat.glitch.me/")
    })

    function createBoard(size) {
        cy.get("#number").type(size.toString())
        cy.get("#start").click()
    }

    function validateBoard(size) {
        // Validate correct number of cells equals size * size before iterating
        cy.get("#table td").its("length").should("eq", size * size)
        cy.get("#table tr").each(($el, index, $list) => { 
            // Validate each row has columns equal to size
            cy.wrap($el).find("td").its("length").should("eq", size)
        }).its("length").should("eq", size)  // Validate # of rows is equal to size
    }

    it("Displays an input form with a play button", () => {
        cy.get("#number").should("exist")
        cy.get("#start").should("exist")
        cy.get("#table").contains("td").should("not.exist")
    })

    it("Accepts 3 as a valid input", () => {
        createBoard(3)
        validateBoard(3)
    })

    it("Accepts 9 as a valid input", () => {
        createBoard(9)
        validateBoard(9)
    })

    it("Accepts 90 as a valid input", () => {
        createBoard(90)
        validateBoard(90)
    })

    it("Does not accept hello as a valid input", () => {
        createBoard("hello")
        cy.get("#table").contains("td").should("not.exist")
    })

    it("Follows X -> O order", () => {
        createBoard(3)
        cy.get("#table td").eq(0).click()
        cy.get("#table td").eq(0).should("have.text", "X")
        cy.get("#table td").eq(1).click()
        cy.get("#table td").eq(1).should("have.text", "O")
    })

    it("Replaces current board with new board", () => {
        // Known failure: appends rows to bottom of current table
        createBoard(3)
        cy.get("#number").clear()
        createBoard(5)
        validateBoard(5)
    })

    it("Obeys simple win condition", () => {
        createBoard(3)
        // X O -
        // O X -
        // - - X
        cy.get("#table td").eq(0).click()
        cy.get("#table td").eq(1).click()
        cy.get("#table td").eq(4).click()
        cy.get("#table td").eq(3).click()
        cy.get("#table td").eq(8).click()
        // Known failure: end game prompt congratulates wrong player
        cy.get("#endgame").should("include.text", "player X")
    })

    it("Obeys tie condition", () => {
        createBoard(3)
        // TBD: should game end as soon as tie is inevitable, or once board is full
        // O X O
        // X X O
        // X O X
        cy.get("#table td").eq(4).click()
        cy.get("#table td").eq(2).click()
        cy.get("#table td").eq(8).click()
        cy.get("#table td").eq(0).click()
        cy.get("#table td").eq(3).click()
        cy.get("#table td").eq(5).click()
        cy.get("#table td").eq(6).click()
        cy.get("#table td").eq(7).click()
        cy.get("#table td").eq(1).click()
        // Known failure: game does not recognize tie condition
        cy.get("#endgame").should("include.text", "tie game")
    })
    
})