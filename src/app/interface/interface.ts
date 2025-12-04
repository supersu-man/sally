export interface Group {
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
    description: string
    excluded: string[]
}