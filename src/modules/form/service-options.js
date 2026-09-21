import { SERVICES } from "../../data/service-catalog.js"

export function buildServiceOptions() {
    const select = document.querySelector("#service")
    if (!select || select.dataset.built) return

    select.replaceChildren()

    const servicesAvailable = SERVICES.filter((service) => {
        return service.active !== false
    })

    servicesAvailable.forEach((service) => {
        const option = document.createElement("option")

        option.value = service.value
        option.dataset.icon = service.icon
        option.dataset.duration = String(service.duration)
        option.dataset.price = String(service.price)
        option.textContent = `${service.label} - R$${service.price}`

        select.appendChild(option)
    })

    select.dataset.built = "true"
}