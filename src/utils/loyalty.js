export const LOYALTY_GOAL = 10

export function hasRewardFor(done) {
    return done > 0 && done % LOYALTY_GOAL === 0
}