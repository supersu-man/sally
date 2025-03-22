export interface Sally {
    id: string
    name: string
    members: Member[]
}

export interface Member {
    id: string
    name: string
    expenses: Expense[]
    sally_id: string
}

export interface Expense {
    id: string
    amount: number
    name: string
    member_id: string,
    excluded: Excluded[]
}

export interface Excluded {
    id: string,
    expense_id: string,
    member_id: string
}

export interface Token {
    accessToken: string,
    random: string,
    expiresAt: number
}

export interface NewExpense {
    amount: number,
    name: string,
    member_id: string
}