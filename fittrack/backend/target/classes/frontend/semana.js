function showContent(sectionId) {
  document.querySelectorAll(".content-section").forEach(function (section) {
    section.classList.remove("active");
  });
  document.getElementById(sectionId).classList.add("active");
}

const semana = document.getElementById("diaSemana");
const dias = [];
const ejercicio = [];
const fechaActual = new Date();
const nombreDiaActual = new Intl.DateTimeFormat("es-ES", { weekday: "long" })
  .format(fechaActual)
  .toLowerCase();

const tiemposPorEjercicio = {};

Promise.all([
  fetch("http://localhost:8080/ejercicio/listar").then((response) =>
    response.json()
  ),
  fetch("http://localhost:8080/diaSemana/listar").then((response) =>
    response.json()
  ),
])
  .then(([ejerciciosData, diasData]) => {
    ejercicio.push(...ejerciciosData);
    dias.push(...diasData);

    let startTime;
    let timer;

    function startTimer(timerDisplay, ejercicioId) {
      startTime = Date.now();
      let elapsedTime = 0;

      return setInterval(function () {
        const currentTime = Date.now();
        elapsedTime += currentTime - startTime;
        startTime = currentTime;

        const totalSeconds = Math.floor(elapsedTime / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        const formattedTime = `${minutes < 10 ? "0" + minutes : minutes}:${
          seconds < 10 ? "0" + seconds : seconds
        }`;

        timerDisplay.textContent = `Tiempo: ${formattedTime}`;

        tiemposPorEjercicio[ejercicioId] = formattedTime;
      }, 1000);
    }

    dias.forEach((dia) => {
      const ejerciciosDia = ejercicio.filter((e) => e.idDiaSemana === dia.id);
      const card = document.createElement("div");
      card.classList.add("card", "diaSemana");

      if (dia.nombre.toLowerCase() === nombreDiaActual) {
        card.classList.add("hoy");
        card.classList.remove("diaSemana");

        const cardTitle = document.createElement("h5");
        cardTitle.innerHTML = `
        <div class="hoy-title">
        <div>
        <h5 class="card-title">${dia.nombre}</h5>
        <h6 class="card-subtitle mb-2 text-muted">Hoy</h6>
        </div>
        <button class="btn btn-success rounded-circle" id="agregarEjercicio" data-id="${dia.id}">+</button>
        </div>
        `;
        card.appendChild(cardTitle);

        semana.appendChild(card);

        ejerciciosDia.forEach((ejer) => {
          const exerciseDiv = document.createElement("div");
          exerciseDiv.classList.add("exercise");

          exerciseDiv.innerHTML = `
          <div style="display: flex; align-items: center;">
            <i class="fas fa-trash-alt btn-danger btn" id="borrarEjercicio" data-id="${ejer.id}"></i>
            <p class="card-text ml-4">${ejer.nombre}</p>
          </div>
            <div class="timer-controls">
              <span class="timer" style="display: none;">Tiempo: 00:00</span>
              <button class="play-btn btn btn-success"><i class="fas fa-play"></i></button>
              <button class="stop-btn btn btn-danger" style="display: none;"><i class="fas fa-stop"></i></button>
            </div>
          `;

          const exerciseName = exerciseDiv.querySelector(".card-text");
          const exerciseModal = document.getElementById("exerciseModal");
          const exerciseModalLabel =
            document.getElementById("exerciseModalLabel");
          const exerciseModalDetails = document.getElementById(
            "exerciseModalDetails"
          );

          exerciseName.addEventListener("click", function () {
            exerciseModalLabel.textContent = ejer.nombre;
            exerciseModalDetails.textContent = `Detalles del ejercicio: ${ejer.descripcion}`;
            $("#exerciseModal").modal("show");
          });
          card.appendChild(exerciseDiv);

          const playButton = exerciseDiv.querySelector(".play-btn");
          const stopButton = exerciseDiv.querySelector(".stop-btn");
          const timerDisplay = exerciseDiv.querySelector(".timer");
          const ejercicioId = ejer.id;

          playButton.addEventListener("click", function () {
            playButton.style.display = "none";
            stopButton.style.display = "inline-block";
            timer = startTimer(timerDisplay, ejercicioId);
            timerDisplay.style.display = "block";
          });

          stopButton.addEventListener("click", function () {
            clearInterval(timer);
            const tiempoTranscurrido = tiemposPorEjercicio[ejercicioId];

            const data = {
              idEjercicio: ejercicioId,
              estado: "Completado",
              idDiaSemana: dia.id,
              fecha: new Date(),
              tiempoTotal: tiempoTranscurrido.toString(),
            };

            fetch("http://localhost:8080/actividad/crear", {
              method: "POST",
              body: JSON.stringify(data),
              headers: {
                "Content-Type": "application/json",
              },
            })
              .then((response) => response.json())
              .then((data) => {
                console.log("Datos enviados al servidor:", data);
              })
              .catch((error) =>
                console.error(
                  "Hubo un error al enviar los datos al servidor:",
                  error
                )
              );
          });
        });
      } else {
        card.innerHTML = `
        <div class="hoy-title">
        <div>
        <h5 class="card-title">${dia.nombre}</h5>
        </div>
        <button class="btn btn-success rounded-circle" data-id="${
          dia.id
        }" id="agregarEjercicio" >+</button>
        </div>
          ${ejerciciosDia
            .map(
              (ejer) => `
              <div style="display: flex; align-items: center;">
              <i class="fas fa-trash-alt btn-danger btn" id="borrarEjercicio" data-id="${ejer.id}"></i>
              <p class="card-text ml-4">${ejer.nombre}</p>
            </div>
              `
            )
            .join("")}
        `;
        semana.appendChild(card);
      }
      const botonBorrar = document.querySelectorAll("#borrarEjercicio");

      botonBorrar.forEach((boton) => {
        boton.addEventListener("click", function () {
          const idEjercicio = boton.getAttribute("data-id");
          fetch(
            `http://localhost:8080/ejercicio/actualizarDia/${idEjercicio}/0`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
            .then((data) => {
              window.location.reload();
              console.log("Ejercicio eliminado:", data);
            })
            .catch((error) => {
              console.error("Error al eliminar el ejercicio:", error);
            });
        });
      });

      const agregarEjercicio = card.querySelector("#agregarEjercicio");

      agregarEjercicio.addEventListener("click", function () {
        const diaId = agregarEjercicio.getAttribute("data-id");
        const exerciseModalBody = document.querySelector(".modal-body");

        exerciseModalBody.innerHTML = "";

        ejercicio.forEach((ejer) => {
          const exerciseCheckbox = document.createElement("input");
          exerciseCheckbox.type = "checkbox";
          exerciseCheckbox.value = ejer.id;
          exerciseCheckbox.id = `exercise-${ejer.id}`;

          const exerciseLabel = document.createElement("label");
          exerciseLabel.htmlFor = `exercise-${ejer.id}`;
          exerciseLabel.textContent = ejer.nombre;

          const exerciseListItem = document.createElement("div");
          exerciseListItem.appendChild(exerciseCheckbox);
          exerciseListItem.appendChild(exerciseLabel);

          exerciseModalBody.appendChild(exerciseListItem);
        });

        const saveButton = document.createElement("button");
        saveButton.textContent = "Guardar";
        saveButton.classList.add("btn", "btn-primary", "save-exercises-btn");

        exerciseModalBody.appendChild(saveButton);

        $("#editarDia").modal("show");

        const saveExercisesButton = document.querySelector(
          ".save-exercises-btn"
        );

        saveExercisesButton.addEventListener("click", function () {
          const selectedExercises = [];
          const exerciseCheckboxes = document.querySelectorAll(
            ".modal-body input[type='checkbox']"
          );

          exerciseCheckboxes.forEach((checkbox) => {
            if (checkbox.checked) {
              selectedExercises.push(checkbox.value);
            }
          });

          selectedExercises.forEach((exerciseId) => {
            fetch(
              `http://localhost:8080/ejercicio/actualizarDia/${exerciseId}/${diaId}`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            ).then((data) => {
              console.log(data);
              window.location.reload();
            });
          });

          $("#editarDia").modal("hide");
        });
      });
    });
  })
  .catch((error) => {
    console.error("Hubo un problema con la solicitud fetch:", error);
  });
