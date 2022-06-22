import { expect } from 'chai'
import Hangman, { FillInGaps, HangmanOutput, HangmanState, IHangman } from "../src/Hangman"

describe('with fill in gaps', () => {
    describe('when given a 4 letter word', () => {
        const target = "test"

        it('shows spaces between the unknowns', () => {
            const result = FillInGaps(target, [])
            expect(result).to.equal('_ _ _ _')
        })

        describe('when given one correct guess', () => {
            const guesses = ['t']

            it('returns the guesses filled in', () => {
                const result = FillInGaps(target, guesses)
                expect(result).to.equal("t_ _t")
            })
        })

        describe('when given two correct guesses', () => {
            const guesses = ['e', 's']

            it('returns the guesses filled in', () => {
                const result = FillInGaps(target, guesses)
                expect(result).to.equal("_es_")
            })
        })

        describe('when given an incorrect guess', () => {
            const guesses = ['q']

            it('returns the guesses filled in', () => {
                const result = FillInGaps(target, guesses)
                expect(result).to.equal("_ _ _ _")
            })
        })

        describe('when given all correct guesses', () => {
            const guesses = ['t', 'e', 's']

            it('returns the guesses filled in', () => {
                const result = FillInGaps(target, guesses)
                expect(result).to.equal("test")
            })
        })

        describe('when given duplicate guesses', () => {
            const guesses = ['e', 'e']

            it('returns the normal output', () => {
                const result = FillInGaps(target, guesses)
                expect(result).to.equal("_e_ _")
            })
        })
    })
})

describe('with Hangman', () => {
    describe('when a word is set', () => {
        var saveState: HangmanState
        var reportOutput: HangmanOutput
        var subject: IHangman

        beforeEach(() => {
            subject = Hangman({ word: "test", mistakes: 0, guesses: [] })
        })

        describe('when saving after the user guesses a wrong letter', () => {
            beforeEach(() => {
                subject.play("a").save((state) => saveState = state)
            })

            it('should update the number of mistakes', () => {
                expect(saveState.mistakes).to.equal(1)
            })

            it('should remember the word', () => {
                expect(saveState.word).to.equal('test')
            })

            it('should update the list of letters used', () => {
                expect(saveState.guesses).to.contain('a')
            })
        })

        describe('when saving after the user guesses a duplicate wrong letter', () => {
            beforeEach(() => {
                subject.play("a").play("a").save((state) => saveState = state)
            })

            it('should update the number of mistakes', () => {
                expect(saveState.mistakes).to.equal(1)
            })

            it('should remember the word', () => {
                expect(saveState.word).to.equal('test')
            })

            it('should not add the duplicate guess', () => {
                expect(saveState.guesses.length).to.equal(1)
            })
        })

        describe('when saving after the user guesses a correct letter', () => {
            beforeEach(() => {
                subject.play("t").save((state) => saveState = state)
            })

            it('should keep the original number of mistakes', () => {
                expect(saveState.mistakes).to.equal(0)
            })

            it('should remember the word', () => {
                expect(saveState.word).to.equal('test')
            })

            it('should update the list of letters used', () => {
                expect(saveState.guesses).to.contain('t')
            })
        })

        describe('when saving after the user guesses a duplicate correct letter', () => {
            beforeEach(() => {
                subject.play("t").play('t').save((state) => saveState = state)
            })

            it('should keep the original number of mistakes', () => {
                expect(saveState.mistakes).to.equal(0)
            })

            it('should remember the word', () => {
                expect(saveState.word).to.equal('test')
            })

            it('should not add the duplicate guess', () => {
                expect(saveState.guesses.length).to.equal(1)
            })
        })

        describe('when reporting after the user guesses a wrong letter', () => {
            beforeEach(() => {
                subject.play('q').report((output) => reportOutput = output)
            })

            it('displays the expected output', () => {
                expect(reportOutput.progress).to.equal('_ _ _ _')
            })

            it('reports the correct number of mistakes', () => {
                expect(reportOutput.mistakes).to.equal(1)
            })

            it('reports the guesses so far', () => {
                expect(reportOutput.guesses).to.include('q')
            })

            it('reports the target word', () => {
                expect(reportOutput.target).to.equal('test')
            })
        })

        describe('when user guesses more than one letter', () => {
            it('throws an exception', () => {
                expect(() => subject.play('some letters')).to.throw('You cannot guess more than one letter at a time')
            })
        })

        describe('when user guesses no letters', () => {
            it('throws an exception', () => {
                expect(() => subject.play('')).to.throw('You must guess a letter')
            })
        })

        describe('when the user has guessed all letters', () => {
            beforeEach(() => {
                subject.play('t').play('e').play('s').report((output) => reportOutput = output)
            })

            it('reports the game as won', () => {
                expect(reportOutput.won).to.be.true
            })
        })
    })
})
