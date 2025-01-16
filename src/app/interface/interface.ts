export interface Sally {
    id: string
    name: string
    members: Member[]
}

export interface Member {
    id: string
    name: string
    expenses: Expense[]
}

export interface Expense {
    id: string
    amount: number
    name: string
}