export class HangmanState {
    word: string
    mistakes: number
    guesses: string[];
}

export interface IHangman {
    save: (SaveFunction: (state: HangmanState) => any) => IHangman;
    report: (OutputFunction: (message: HangmanOutput) => any) => IHangman
    play: (content: string) => IHangman
}

export class HangmanOutput {
    target: string
    progress: string
    guesses: string[]
    mistakes: number
    won: boolean
}

export function FillInGaps(target: string, guesses: string[]): string {
    var output = target.split('').map((l) => guesses.indexOf(l) > -1 ? l : '_').join('');
    var newOutput = output.replace(/__/g, '_ _')

    while (newOutput != output) {
        output = newOutput
        newOutput = output.replace(/__/g, '_ _')
    }

    return newOutput
}

export default function Hangman(state: HangmanState): IHangman {
    function report() {
        return function (outputFunc: (message: HangmanOutput) => any): IHangman {
            var progress = FillInGaps(state.word, state.guesses);
            
            outputFunc({
                progress: progress,
                guesses: state.guesses,
                mistakes: state.mistakes,
                won: progress === state.word,
                target: state.word
            })

            return Hangman(state);
        }
    }

    function play() {
        return function play(content: string): IHangman {
            if (content.length > 1) {
                throw new Error('You cannot guess more than one letter at a time')
            }

            if(content.length == 0){
                throw new Error('You must guess a letter')
            }

            if (state.guesses.indexOf(content) === -1) {
                state.guesses.push(content)
            } else {
                return this
            }

            if (state.word.indexOf(content) === -1) {
                state.mistakes++
            }

            return Hangman(state);
        }
    }

    function save() {
        return function save(saveFunc: (state: HangmanState) => any): IHangman {
            saveFunc(state)
            return Hangman(state);
        }
    }

    return {
        report: report(),
        play: play(),
        save: save()
    }
}
