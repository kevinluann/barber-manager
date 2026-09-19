export const LOYALTY_GOAL = 10
export const ABSENT_DAYS = 30

export function hasRewardFor(done) {
    return done > 0 && done % LOYALTY_GOAL === 0
}

export function isAbsentFor(days) {
    return days >= ABSENT_DAYS
}
