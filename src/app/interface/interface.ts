export interface MyUser {
    id: string
    email: string
    name: string
}

export interface Sally {
    id: string
    name: string
    members: string[]
    user_id: string
    private: boolean
    expenses: Expense[]
}

export interface Expense {
    id: string
    member: string
    amount: number
    desc: string
    created_at: Date
    sally_id: string
}

export interface Stat {
    member: string
    amount: number
}