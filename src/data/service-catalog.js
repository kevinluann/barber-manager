export const SERVICES = [
    { value: "corte", label: "Corte", icon: "./assets/cut.svg", duration: 30, price: 50, active: true },
    { value: "barba", label: "Barba", icon: "./assets/beard.svg", duration: 20, price: 30, active: true },
    { value: "combo", label: "Combo", icon: "./assets/combo.svg", duration: 50, price: 80, active: true },
]

export function getService(value) {
    return SERVICES.find((service) => {
        return service.value === value
    })
}