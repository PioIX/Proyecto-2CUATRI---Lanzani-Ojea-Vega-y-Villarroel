function iniciarSesion(){
  nombre = document.getElementById("nombreUsuario").value;
  contraseña = document.getElementById("contraseñaUsuario").value;
  $.ajax({
    url:"/verificarInicioSesion",
    type:"POST",
    data: {"nombre":nombre, "contraseña":contraseña},
    success: function(response){
      resultado = JSON.parse(response);
      if (resultado == true){
        document.getElementById("formularioLogin").submit();
      }
      else{
        modalUsuarioOContraseñaIncorrectos = $('#modalUsuarioOContraseñaIncorrectos').modal('toggle');
      }
    },
    error: function(error){
      console.log(error);
    },
  });
}

function coincidirContraseñas(){
  nombreUsuarioRegistro = document.getElementById("nombreUsuarioRegistro").value;
  contraseñaUsuarioRegistro = document.getElementById("contraseñaUsuarioRegistro").value;
  confirmarContraseñaUsuarioRegistro = document.getElementById("confirmarContraseñaUsuarioRegistro").value;
  if (nombreUsuarioRegistro == "" || contraseñaUsuarioRegistro == "" || confirmarContraseñaUsuarioRegistro == ""){
    modalRegistroCamposNoCompletados = $('#modalRegistroCamposNoCompletados').modal('toggle');
  }
  else{
    if (contraseñaUsuarioRegistro == confirmarContraseñaUsuarioRegistro){
      document.getElementById("formularioRegistro").submit();
    }
    else{
      modalRegistroContraseñasNoCoinciden = $('#modalRegistroContraseñasNoCoinciden').modal('toggle');
      document.getElementById("contraseñaUsuario").value = "";
      document.getElementById("confirmarContraseñaUsuario").value = "";
      document.getElementById("contraseñaUsuario").focus();
    }
  }
}

function obtenerNoticias(){
  $.ajax({
    url:"/ajaxObtenerNoticias",
    type:"GET",
    success: function(response){
      noticias = JSON.parse(response);
      for (let i = 0; i < noticias[1]; i ++){
        if (noticias[2] == 'null' || noticias[2] == ""){
          document.getElementById("sectionNoticias").innerHTML += `
            <abbr title="Iniciá sesión para leer la noticia completa" style="text-decoration:transparent">
              <a class="nav-link" href="" data-bs-toggle="modal" data-bs-target="#exampleModal">
                <section class="noticia">
                  <div class="divTituloNoticias">
                    <h4 class="tituloNoticias" >${noticias[0][i][1]}</h4>
                  </div>
                  <div class="divContenidoNoticias">
                    <p class="contenidoNoticias">${noticias[0][i][2]}</p>
                  </div>
                  <div class="divAutoresNoticias">
                    <p class="autoresNoticias">${noticias[0][i][6]}</p>
                  </div>
                </section>
              </a>
            </abbr>
          `;
        }
        else{
          document.getElementById("sectionNoticias").innerHTML += `
            <abbr class="etiquetaLeerNoticia" title="Leer noticia completa" style="text-decoration:transparent">
              <a id="${noticias[0][i][0]}" class="botonDeNoticias" href="noticia/${noticias[0][i][0]}">
                <section class="noticia">
                  <div class="divTituloNoticias">
                    <h4 class="tituloNoticias">${noticias[0][i][1]}</h4>
                  </div>
                  <div class="divContenidoNoticias">
                    <p class="contenidoNoticias">${noticias[0][i][2]}</p>
                  </div>
                  <div class="divAutoresNoticias">
                    <p class="autoresNoticias">${noticias[0][i][6]}</p>
                  </div>
                </section>
              </a>
            </abbr>
          `;
        }
      }
    },
    error: function(error){
      console.log(error);
    },
  });
}

function agregarNuevaNoticia(){
  categoria = document.getElementById("categoria").value;
  titulo = document.getElementById("titulo").textContent;
  contenido = document.getElementById("contenido").textContent;
  autor = document.getElementById("autor").value;
  $.ajax({
    url:"/agregarNuevaNoticia",
    type:"POST",
    data: {"categoria":categoria, "titulo":titulo, "contenido":contenido, "autor":autor},
    success: function(response){
      resultado = JSON.parse(response);
      if (resultado == true){
        document.getElementById("formNuevaNoticia").submit();
      }
    },
    error: function(error){
      console.log(error);
    },
  });
}

function seleccionarFuncionEliminar(){
  htmlDivHome = document.getElementById("navBase").innerHTML;
  document.getElementById("navBase").innerHTML = "";
  htmlHomeSinModificar = document.getElementById("divHome").innerHTML;
  document.getElementById("botonNuevaNoticia").outerHTML = "";
  document.getElementById("botonEditarNoticia").outerHTML = "";
  document.getElementById("botonEliminarNoticia").outerHTML = `
    <a id="botonEliminarNoticia" onclick="cancelarEliminarNoticia()">Cancelar</a>
  `;
  document.getElementById("tituloAdmin").outerHTML = `
    <h3 id="alertaEliminarNoticia">Seleccioná la noticia que quieras eliminar</h3>
  `;
  for (let x = 0; x < document.getElementsByClassName("botonDeNoticias").length; x ++){
    document.getElementsByClassName("etiquetaLeerNoticia")[x].setAttribute('title', 'Hacé click para eliminar esta noticia')
    document.getElementsByClassName("botonDeNoticias")[x].removeAttribute('href');
    document.getElementsByClassName("botonDeNoticias")[x].setAttribute('onclick', `confirmarEliminarNoticia(${document.getElementsByClassName("botonDeNoticias")[x].getAttribute("id")})`);
    document.getElementById("alertaEliminarNoticia").setAttribute('style', 'border: 2px solid red; color: red;');
  }
  document.getElementById("etiquetaStyleHome").innerHTML = `
    .noticia:hover h4, .noticia:hover h6, .noticia:hover p{
      color: red;
    }
    .noticia:hover{
      border: 2px solid red;
    }
  `;
}

function cancelarEliminarNoticia(){
  document.getElementById("navBase").innerHTML = htmlDivHome;
  document.getElementById("divHome").innerHTML = htmlHomeSinModificar;
  document.getElementById("etiquetaStyleHome").innerHTML = "";
}

function confirmarEliminarNoticia(idPregunta){
  myModal = $('#myModal').modal('toggle');
  document.getElementById("confirmacionEliminarNoticia").setAttribute('onclick', `eliminarNoticia(${idPregunta})`);
}
  
function eliminarNoticia(idPregunta){
  $.ajax({ 
    url:"/eliminarNoticia", 
    type:"DELETE", 
    data: {"idPregunta":idPregunta},
    success: function(response){
      datos = JSON.parse(response);
      location.reload();
    },
    error: function(error){ 
      console.log(error);
    }, 
  });
}

function mostrarComentarios(idUsuario, idNoticia){
  if (document.getElementById("comentarios").innerHTML == ""){ 
    document.getElementById("comentarios").innerHTML = `
      <h4 style="margin: 0px 2%;">Comentarios:</h4>
      <br>
      <span style="color:#FFFFFF; margin-bottom:12px;" id="spanComentario" class="input" role="textbox" name="titulo" contenteditable></span>
      <br>
      <a id="botonCancelarComentario" onclick="cancelarComentario()" style="margin-left:2%;">Cancelar</a>
      <a id="botonAgregarComentario" onclick="agregarComentario(${idUsuario}, ${idNoticia})">Comentar</a>
      <br>
      <div id="comentariosPrevios"></div>
    `;
    cargarComentariosPrevios(idNoticia, idUsuario);
  }
  else{
    document.getElementById("comentarios").innerHTML = "";
  }
}

function cargarComentariosPrevios(idNoticia, idUsuario){
  idNoticia = idNoticia;
  idUsuario = idUsuario;
  $.ajax({
    url:"/obtenerComentariosNoticia",
    type:"POST",
    data: {"idNoticia":idNoticia},
    success: function(response){
      data = JSON.parse(response);
      for (let i = 0; i < data[0].length; i ++){
        if (idUsuario == data[0][i][4]){
          paddingOpcional = `padding-bottom: 5%;`;
          agregado = `
              <a class="botonEliminarComentario" onclick="confirmarEliminarComentario(${data[0][i][0]})">Eliminar</a>
            </div>
            <br>
          `;
        }
        else{
          paddingOpcional = `padding-bottom: 1%;`;
          agregado = `
            </div>
            <br>
          `;
        }
        document.getElementById("etiquetaStyleComentarios").innerHTML = `
          .botonEliminarComentario{
            position: absolute;
            right: 0;
            margin-right: 2%;
            background-color: transparent;
            border: 2px solid white;
            color: white;
            border-radius: 7px;
            padding: 2px 8px;
          }
          .botonEliminarComentario:hover{
            background-color: white;
            color: black;
          }
        `;
        switch (data[1][data[0][i][4]-1][3]){
          case 'Info':
            color = '#15e538';
            break;
          case 'Comu':
            color = '#ff0f33';
            break;
          case 'Tecnica':
            color = '#2458f5';
            break;
        }
        document.getElementById("comentariosPrevios").innerHTML += `
          <br>
          <div class="comentario" style="margin: 0px; margin-right: -25px; width: 65vw; padding: 2%; ${paddingOpcional} float: right; background-color: rgba(0, 0, 0, .4);">
            <p style="text-align: right; color: ${color};">${data[1][data[0][i][4]-1][1]}</p>
            <h5 style="text-align: right;">${data[0][i][2]}</h5>
          ${agregado}
        `;
      }
    },
    error: function(error){
      console.log(error);
    },
  });
}

function cancelarComentario(){
  document.getElementById("spanComentario").textContent = "";
}

function agregarComentario(idUsuario, idNoticia, texto){
  idUsuario = idUsuario;
  idNoticia = idNoticia;
  texto = document.getElementById("spanComentario").textContent;
  if (texto != ""){
    $.ajax({
      url:"/agregarComentario",
      type:"POST",
      data: {"idUsuario":idUsuario, "idNoticia":idNoticia, "texto":texto},
      success: function(response){
        resultado = JSON.parse(response);
      },
      error: function(error){
        console.log(error);
      },
    });
    document.getElementById("spanComentario").textContent = "";
    location.reload();
  }
}

function confirmarEliminarComentario(idComentario){
  modalConfirmarEliminarComentario = $('#modalConfirmarEliminarComentario').modal('toggle');
  document.getElementById("confirmacionEliminarComentario").setAttribute('onclick', `eliminarComentario(${idComentario})`);
}

function eliminarComentario(idComentario){
  idComentario = idComentario;
  $.ajax({ 
    url:"/eliminarComentario", 
    type:"DELETE", 
    data: {"idComentario":idComentario},
    success: function(response){
      datos = JSON.parse(response);
      location.reload();
    },
    error: function(error){ 
      console.log(error);
    }, 
  });
}

function darLike(idNoticia, idUsuario){
  document.getElementById("boxIconCorazoncito").setAttribute('type', 'solid');
  document.getElementById("boxIconCorazoncito").setAttribute('color', 'red');
  document.getElementById("labelLikes").innerHTML = parseInt(document.getElementById("labelLikes").innerHTML) + 1;
  gestionLikes(parseInt(document.getElementById("labelLikes").innerHTML), idNoticia, idUsuario);
  document.getElementById("corazoncito").setAttribute('onclick', `sacarLike(${idNoticia}, ${idUsuario})`);
}

function sacarLike(idNoticia, idUsuario){
  document.getElementById("boxIconCorazoncito").setAttribute('type', 'regular');
  document.getElementById("boxIconCorazoncito").setAttribute('color', 'white');
  document.getElementById("labelLikes").innerHTML = parseInt(document.getElementById("labelLikes").innerHTML) - 1;
  gestionLikes(parseInt(document.getElementById("labelLikes").innerHTML), idNoticia, idUsuario)
  document.getElementById("corazoncito").setAttribute('onclick', `darLike(${idNoticia}, ${idUsuario})`);
}

function gestionLikes(cantidadLikes, idNoticia, idUsuario){
  cantidadLikes = cantidadLikes;
  idNoticia = idNoticia;
  idUsuario = idUsuario;
  $.ajax({ 
    url:"/ajaxGestionLikes", 
    type:"PUT", 
    data: {"cantidadLikes":cantidadLikes, "idNoticia":idNoticia},
    success: function(response){
      datos = JSON.parse(response);
    },
    error: function(error){ 
      console.log(error);
    }, 
  });
  $.ajax({ 
    url:"/ajaxGestionLikes", 
    type:"POST",
    data: {"idNoticia":idNoticia, "idUsuario":idUsuario},
    success: function(response){
      datos = JSON.parse(response);
    },
    error: function(error){ 
      console.log(error);
    }, 
  });
}

function verificarNoticiaLikeada(idUsuario, idNoticia){
  idUsuario = parseInt(idUsuario);
  idNoticia = parseInt(idNoticia);
  $.ajax({ 
    url:"/verificarNoticiaLikeada", 
    type:"POST",
    data: {"idUsuario":idUsuario, "idNoticia":idNoticia},
    success: function(response){
      datos = JSON.parse(response);
      if (datos == true){
        document.getElementById("boxIconCorazoncito").setAttribute('type', 'solid');
        document.getElementById("boxIconCorazoncito").setAttribute('color', 'red');
        document.getElementById("corazoncito").setAttribute('onclick', `sacarLike(${idNoticia}, ${idUsuario})`);
      }
      else{
        document.getElementById("boxIconCorazoncito").setAttribute('type', 'regular');
        document.getElementById("boxIconCorazoncito").setAttribute('color', 'white');
        document.getElementById("corazoncito").setAttribute('onclick', `darLike(${idNoticia}, ${idUsuario})`);
      }
    },
    error: function(error){ 
      console.log(error);
    }, 
  }); 
}

function seleccionarFuncionEditar(){
  htmlDivHome = document.getElementById("navBase").innerHTML;
  document.getElementById("navBase").innerHTML = "";
  htmlHomeSinModificar = document.getElementById("divHome").innerHTML;
  document.getElementById("botonNuevaNoticia").outerHTML = "";
  document.getElementById("botonEditarNoticia").outerHTML = "";
  document.getElementById("botonEliminarNoticia").outerHTML = `
    <a id="botonEliminarNoticia" onclick="cancelarEditarNoticia()">Cancelar</a>
  `;
  document.getElementById("tituloAdmin").outerHTML = `
    <h3 id="alertaEliminarNoticia">Seleccioná la noticia que quieras editar</h3>
  `;
  for (let x = 0; x < document.getElementsByClassName("botonDeNoticias").length; x ++){
    document.getElementsByClassName("etiquetaLeerNoticia")[x].setAttribute('title', 'Hacé click para editar esta noticia')
    document.getElementsByClassName("botonDeNoticias")[x].setAttribute('href', `editorDeNoticias/${document.getElementsByClassName("botonDeNoticias")[x].getAttribute("id")}`);
    document.getElementById("alertaEliminarNoticia").setAttribute('style', 'border: 2px solid #15e538; color: #15e538;');
  }
  document.getElementById("etiquetaStyleHome").innerHTML = `
    .noticia:hover h4, .noticia:hover h6, .noticia:hover p{
      color: #15e538;
    }
    .noticia:hover{
      border: 2px solid #15e538;
    }
  `;
}

function cancelarEditarNoticia(){
  document.getElementById("navBase").innerHTML = htmlDivHome;
  document.getElementById("divHome").innerHTML = htmlHomeSinModificar;
  document.getElementById("etiquetaStyleHome").innerHTML = "";
}

function prepararDatosParaEditar(idNoticia){
  idNoticia = idNoticia;
  $.ajax({
    url:"/ajaxPrepararDatosParaEditar",
    type:"POST",
    data: {"idNoticia":idNoticia},
    success: function(response){
      noticia = JSON.parse(response);
      document.getElementById("categoria").value = noticia[0][5];
      document.getElementById("titulo").textContent = noticia[0][1];
      document.getElementById("contenido").textContent = noticia[0][2];
      document.getElementById("autor").value = noticia[0][6];
    },
    error: function(error){
      console.log(error);
    },
  });
}

function guardarNoticiaEditada(idNoticia){
  idNoticia = idNoticia;
  categoria = document.getElementById("categoria").value;
  titulo = document.getElementById("titulo").textContent;
  contenido = document.getElementById("contenido").textContent;
  autor = document.getElementById("autor").value;
  $.ajax({
    url:"/guardarNoticiaEditada",
    type:"POST",
    data: {"idNoticia":idNoticia, "categoria":categoria, "titulo":titulo, "contenido":contenido, "autor":autor},
    success: function(response){
      resultado = JSON.parse(response);
      if (resultado == true){
        document.getElementById("formEditarNoticia").submit();
      }
    },
    error: function(error){
      console.log(error);
    },
  });
}

function buscarNoticias(){
  textoBuscar = document.getElementById("searchterm").value;
  $.ajax({
    url:"/buscarNoticias",
    type:"POST",
    data: {"textoBuscar":textoBuscar},
    success: function(response){
      noticiasEncontradas = JSON.parse(response);
      document.getElementById("sectionNoticiasEncontradas").innerHTML = "";
      for (let i = 0; i < noticiasEncontradas[1]; i ++){
        if (noticiasEncontradas[2] == 'null' || noticiasEncontradas[2] == ""){
          document.getElementById("sectionNoticiasEncontradas").innerHTML += `
            <abbr title="Iniciá sesión para leer la noticia completa" style="text-decoration:transparent">
              <section class="noticia">
                <div class="divTituloNoticias">
                  <h4 class="tituloNoticias" >${noticiasEncontradas[0][i][1]}</h4>
                </div>
                <div class="divContenidoNoticias">
                  <p class="contenidoNoticias">${noticiasEncontradas[0][i][2]}</p>
                </div>
                <div class="divAutoresNoticias">
                  <p class="autoresNoticias">${noticiasEncontradas[0][i][6]}</p>
                </div>
              </section>
            </abbr>
          `;
        }
        else{
          document.getElementById("sectionNoticiasEncontradas").innerHTML += `
            <abbr class="etiquetaLeerNoticia" title="Leer noticia completa" style="text-decoration:transparent">
              <a id="${noticiasEncontradas[0][i][0]}" class="botonDeNoticias" href="noticia/${noticiasEncontradas[0][i][0]}">
                <section class="noticia">
                  <div class="divTituloNoticias">
                    <h4 class="tituloNoticias">${noticiasEncontradas[0][i][1]}</h4>
                  </div>
                  <div class="divContenidoNoticias">
                    <p class="contenidoNoticias">${noticiasEncontradas[0][i][2]}</p>
                  </div>
                  <div class="divAutoresNoticias">
                    <p class="autoresNoticias">${noticiasEncontradas[0][i][6]}</p>
                  </div>
                </section>
              </a>
            </abbr>
          `;
        }
      }
    },
    error: function(error){
      console.log(error);
    },
  });
}

function mensajeNombreUsuarioYaUsado(mensaje){
  if (mensaje == 1){
    modalRegistroNombreYaTomado = $('#modalRegistroNombreYaTomado').modal('toggle');
  }
}