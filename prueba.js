class person {
  constructor(numero) {
    this.numero = numero;
    this.dias = 0;
    this.oportunidades = 0;
    this.ultimoDia = 7; // Define el último día de la semana
    this.totalOportunidades = 10; // Total de oportunidades en la semana
  }
  cambiar_oportunidades() {
    console.log(`dia: ${this.dias}`);
    if ([1,3,5,7].includes(this.dias)) {
        // Si el día es impar
        this.dias == this.ultimoDia
        ? (this.oportunidades += 4)
        : (this.oportunidades += 2);
        console.log(this.oportunidades);
    } else if (this.dias > this.ultimoDia) {
        console.log("verga");
        this.dias = 0;
        this.oportunidades = 0;
        console.log(this.oportunidades);
    }
    this.dias <= this.ultimoDia ? this.dias++ : this.dias = 0;
  }

}

// Ejemplo de uso:
const persona = new person(123);
for (let i = 1; i <= 5; i++) {
  persona.cambiar_oportunidades();
  console.log(`Día ${["lunes","martes","miercoles","jueves","viernes","sabado","domingo"][persona.dias-1]}: Oportunidades: ${persona.oportunidades}`);
}
