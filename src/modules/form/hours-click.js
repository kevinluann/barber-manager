export function hoursClick() {
    const hours = document.querySelectorAll('.hour-available')

    function selectHour(target) {
        hours.forEach((hour) => hour.classList.remove('hour-selected'))

        target.classList.add('hour-selected')
    }

    hours.forEach((available) => {
        available.addEventListener('click', (event) => selectHour(event.currentTarget))

        available.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                
                selectHour(event.currentTarget)
            }
        })
    })
}