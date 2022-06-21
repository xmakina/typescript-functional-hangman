import Hangman, { HangmanState, IHangman } from "./Hangman";

export interface IStorage<T> {
    Load(acct: string): Promise<T>;
}

interface HangmanStateStore {
    [key: string]: HangmanState;
}

export class HangmanMemoryStorage implements IStorage<HangmanState>{
    private states: HangmanStateStore = { "xmakina@mastodon.technology": { mistakes: 1, word: "something", guesses: ['z'] } }

    async Load(acct: string): Promise<HangmanState> {
        console.log({ acct })
        const state = this.states[acct]
        if (state === null) {
            return { mistakes: 0, word: 'new word', guesses: [] }
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
