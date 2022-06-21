import randomWord from 'random-word'
import Hangman, { HangmanState, IHangman } from "./Hangman";

export interface IStorage<T> {
    Load(acct: string): Promise<T>;
}

interface HangmanStateStore {
    [key: string]: HangmanState;
}

export class HangmanMemoryStorage implements IStorage<HangmanState>{
    private states: HangmanStateStore = { }

    async Load(acct: string): Promise<HangmanState> {
        const state = this.states[acct]
        if (state === null) {
            return { mistakes: 0, word: randomWord(), guesses: [] }
        }

        return state
    }
}

export class HangmanFactory {
    private readonly storage: IStorage<HangmanState>;

    constructor(storage: IStorage<HangmanState>) {
        this.storage = storage
    }

    public async LoadGame(acct: string): Promise<IHangman> {
        var state = await this.storage.Load(acct)
        return Hangman(state)
    }
}
