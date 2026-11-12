const fotos = [

    {
        src: "../images/kingreyjr.jpg",
        title: "KingreyJr",
        puntosMaster: 70,
        puntosTorneo: 0,
        puntosDesempate: 300,
        puntosTotales: 1170,
        puntosBase: 1170,
        id: 0,
        hueco: null
    },
    {
        src: "../images/hafiz.jpg",
        title: "Hafiz Tanveer",
        puntosMaster: 120,
        puntosTorneo: 0,
        puntosDesempate: 400,
        puntosTotales: 1130,
        puntosBase: 1130,
        id: 1,
        hueco: null
    },
    {
        src: "../images/Meo-IL.jpg",
        title: "Meo-IL",
        puntosMaster: 90,
        puntosTorneo: 0,
        puntosDesempate: 220,
        puntosTotales: 1130,
        puntosBase: 1130,
        id: 2,
        hueco: null
    },
    {
        src: "../images/AK.jpg",
        title: "AK",
        puntosMaster: 30,
        puntosTorneo: 0,
        puntosDesempate: 300,
        puntosTotales: 1110,
        puntosBase: 1110,
        id: 3,
        hueco: null
    },
    {
        src: "../images/Rest.jpg",
        title: "REST",
        puntosMaster: 70,
        puntosTorneo: 0,
        puntosDesempate: 300,
        puntosTotales: 990,
        puntosBase: 990,
        id: 4,
        hueco: null
    },
    {
        src: "../images/Crescent.png",
        title: "Crescent",
        puntosMaster: 120,
        puntosTorneo: 0,
        puntosDesempate: 180,
        puntosTotales: 840,
        puntosBase: 840,
        id: 5,
        hueco: null
    },
    {
        src: "../images/Dawood.jpg",
        title: "Dawood Sikandar",
        puntosMaster: 70,
        puntosTorneo: 0,
        puntosDesempate: 300,
        puntosTotales: 800,
        puntosBase: 800,
        id: 6,
        hueco: null
    },
    {
        src: "../images/AO.jpeg",
        title: "AO",
        puntosMaster: 70,
        puntosTorneo: 0,
        puntosDesempate: 180,
        puntosTotales: 780,
        puntosBase: 780,
        id: 7,
        hueco: null
    }
];



const puntuaciones = [560, 400, 300, 220, 180, 180, 150, 150, 120, 120, 120, 120, 90, 90, 90, 90]

function generarGaleria() {

    const galeria = document.getElementById("galeria");

    fotos.forEach(foto => {

        const img = document.createElement("img");

        img.src = foto.src;
        img.title = foto.title;
        img.alt = foto.title;
        img.id = foto.id;
        img.draggable = true;

        img.addEventListener("dragstart", (event) => {

            event.dataTransfer.setData(
                "text/plain",
                foto.id
            );

        });

        galeria.appendChild(img);

    })
};


function generarHuecos() {
    const contenedor = document.getElementById("huecos");
    contenedor.innerHTML = "";

    const grupos = {};

    puntuaciones.forEach((puntuacion, index) => {
        if (!grupos[puntuacion]) {
            grupos[puntuacion] = [];
        }

        grupos[puntuacion].push(index);
    });

    Object.entries(grupos)
        .sort((a, b) => Number(b[0]) - Number(a[0]))
        .forEach(([puntuacion, indices]) => {

            const fila = document.createElement("div");
            fila.classList.add("fila-huecos");

            // Índice del primer hueco de la fila
            const indice = document.createElement("div");
            indice.classList.add("indice-fila");
            indice.textContent = indices[0] + 1;

            fila.appendChild(indice);

            indices.forEach(index => {
                const hueco = document.createElement("div");

                hueco.classList.add("hueco");
                hueco.dataset.id = index;
                hueco.dataset.puntos = puntuacion;

                hueco.textContent =
                    `(${puntuacion} puntos)`;

                hueco.addEventListener("dragover", permitirSoltar);
                hueco.addEventListener("drop", soltar);

                fila.appendChild(hueco);
            });

            contenedor.appendChild(fila);
        });
}




// Permitir que se pueda soltar en un hueco
function permitirSoltar(event) {
    event.preventDefault();
}


function soltar(event) {

    event.preventDefault();

    const idFoto = Number(
        event.dataTransfer.getData("text/plain")
    );

    const foto = fotos.find(f => f.id === idFoto);

    if (!foto) return;

    const huecoDestino = event.currentTarget;

    const idHueco = Number(huecoDestino.dataset.id);
    const puntosHueco = Number(huecoDestino.dataset.puntos);

    // Guardar una referencia al elemento HTML
    const imagen = document.getElementById(String(foto.id));

    // Si se suelta en el mismo hueco, no hacer nada
    if (foto.hueco === idHueco) return;

    // Buscar si existe otra fotografía en el destino
    const fotoOcupante = fotos.find(
        f => f.hueco === idHueco
    );

    // Si está ocupado, devolver la fotografía a la galería
    if (fotoOcupante) {
        devolverGaleria(fotoOcupante);
    }

    // Liberar el hueco anterior de la fotografía arrastrada
    if (foto.hueco !== null) {

        const huecoAnterior = document.querySelector(
            `.hueco[data-id="${foto.hueco}"]`
        );

        if (huecoAnterior) {
            huecoAnterior.textContent =
                `Hueco ${Number(huecoAnterior.dataset.id) + 1} (${huecoAnterior.dataset.puntos})`;
        }
    }

    // Actualizar la posición
    foto.hueco = idHueco;
    foto.puntosTorneo = 0;

    foto.puntosTorneo = puntosHueco;

    // Calcular los nuevos puntos
    const puntos = puntosHueco - foto.puntosMaster;

    foto.puntosTotales =
        foto.puntosBase + Math.max(0, puntos);

    // Limpiar el destino y colocar la imagen
    huecoDestino.textContent = "";
    huecoDestino.appendChild(imagen);

    // Actualizar el ranking
    mostrarRanking();
}


function devolverGaleria(foto) {

    // Recuperar el hueco que ocupaba
    const hueco = document.querySelector(
        `.hueco[data-id="${foto.hueco}"]`
    );

    // Recuperar la galería
    const galeria = document.getElementById("galeria");

    // Devolver la imagen a la galería
    galeria.appendChild(
        document.getElementById(String(foto.id))
    );

    // Liberar su posición
    foto.hueco = null;

    // Recuperar su puntuación original
    foto.puntosTotales = foto.puntosBase;
    foto.puntosTorneo = foto.puntosMaster;

    // Dejar el hueco vacío
    if (hueco) {
        hueco.textContent =
            `Hueco ${Number(hueco.dataset.id) + 1} (${hueco.dataset.puntos})`;
    }
}


function mostrarRanking() {

    // Ordenar fotografías de mayor a menor puntuación
    const ordenadas = [...fotos].sort((a, b) => {
        if (b.puntosTotales !== a.puntosTotales) {
            return b.puntosTotales - a.puntosTotales;
        }
        return Math.max(b.puntosTorneo,b.puntosDesempate) - Math.max(a.puntosTorneo,a.puntosDesempate);
    });

    const ranking = document.getElementById("ranking");

    // Limpiar tabla
    ranking.innerHTML = "";

    // Recorrer fotografías ordenadas
    ordenadas.forEach((foto, index) => {

        const fila = document.createElement("tr");

        fila.innerHTML = `
            
            <td>${index + 1}</td>
            <td>${foto.title}</td>
            <td>${foto.puntosTotales}</td>
        `;

        ranking.appendChild(fila);
    });
}

generarGaleria();
generarHuecos();
mostrarRanking();

